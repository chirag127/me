import type { initializeApp } from 'firebase/app';
import type { getAuth, User } from 'firebase/auth';
import type { getFirestore, Timestamp } from 'firebase/firestore';

// Admin email
export const ADMIN_EMAIL = 'whyiswhen@gmail.com';

// Multiple admin emails support
export const ADMIN_EMAILS = ['whyiswhen@gmail.com', 'chirag127.in@gmail.com'];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Chat message types
export interface ChatMessage {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  message: string;
  timestamp: Timestamp | null;
  pageContext?: string;
}

// Journal entry type
export interface JournalEntry {
  id?: string;
  userId: string;
  userEmail: string;
  text: string;
  createdAt: string;
}

// Lazy Firebase initialization - only on client side
let _app: ReturnType<typeof initializeApp> | null = null;
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBBEidXiLDhLumocfQuZAormy1_dFwL9EY',
  authDomain: 'chirag-127.firebaseapp.com',
  projectId: 'chirag-127',
  storageBucket: 'chirag-127.firebasestorage.app',
  messagingSenderId: '308014403143',
  appId: '1:308014403143:web:eb46f53b0943ece31f6b62',
  measurementId: 'G-JW4RXZGMZ9',
};

async function getFirebaseApp() {
  if (_app) return _app;
  if (typeof window === 'undefined')
    throw new Error('Firebase can only be used on the client side');

  const {
    initializeApp: firebaseInitializeApp,
    getApps: firebaseGetApps,
    getApp: firebaseGetApp,
  } = await import('firebase/app');
  _app =
    firebaseGetApps().length === 0
      ? firebaseInitializeApp(FIREBASE_CONFIG)
      : firebaseGetApp();
  return _app;
}

export async function getFirebaseAuth() {
  if (_auth) return _auth;
  const app = await getFirebaseApp();
  const { getAuth: firebaseGetAuth } = await import('firebase/auth');
  _auth = firebaseGetAuth(app);
  return _auth;
}

export async function getFirebaseDb() {
  if (_db) return _db;
  const app = await getFirebaseApp();
  const { getFirestore: firebaseGetFirestore } = await import(
    'firebase/firestore'
  );
  _db = firebaseGetFirestore(app);
  return _db;
}

// Phone auth
let _recaptchaVerifier: any = null;

export async function initRecaptchaVerifier(
  containerOrButtonId: string,
  size: 'invisible' | 'normal' = 'invisible',
): Promise<any> {
  const { RecaptchaVerifier } = await import('firebase/auth');
  const auth = await getFirebaseAuth();
  if (_recaptchaVerifier) {
    _recaptchaVerifier.clear();
    _recaptchaVerifier = null;
  }
  _recaptchaVerifier = new RecaptchaVerifier(auth, containerOrButtonId, {
    size,
    callback: () => {},
    'expired-callback': () => {
      _recaptchaVerifier = null;
    },
  });
  return _recaptchaVerifier;
}

export async function signInWithPhone(
  phoneNumber: string,
  appVerifier: any,
): Promise<{ confirm: (code: string) => Promise<User | null> } | null> {
  const { signInWithPhoneNumber: firebaseSignInWithPhoneNumber } = await import(
    'firebase/auth'
  );
  const auth = await getFirebaseAuth();
  const confirmationResult = await firebaseSignInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier,
  );
  return {
    confirm: async (code: string) => {
      const result = await confirmationResult.confirm(code);
      return result.user;
    },
  };
}

export async function clearRecaptcha(): Promise<void> {
  if (_recaptchaVerifier) {
    _recaptchaVerifier.clear();
    _recaptchaVerifier = null;
  }
}

// Auth functions
export async function signInWithGoogle(): Promise<User | null> {
  const { GoogleAuthProvider, getRedirectResult, signInWithRedirect } =
    await import('firebase/auth');
  const auth = await getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');

  // Check if we're returning from a redirect first
  try {
    const result = await getRedirectResult(auth);
    if (result) return result.user;
  } catch (e: any) {
    console.error('Redirect result error:', e?.code, e?.message);
  }

  // Use redirect — avoids COOP/popup-blocked issues entirely
  try {
    await signInWithRedirect(auth, provider);
  } catch (e: any) {
    console.error('Redirect sign-in error:', e?.code, e?.message);
  }
  // Page will reload after redirect; return null here
  return null;
}

export async function handleGoogleRedirect(): Promise<User | null> {
  const { getRedirectResult } = await import('firebase/auth');
  const auth = await getFirebaseAuth();
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  const { signOut: firebaseSignOut } = await import('firebase/auth');
  const auth = await getFirebaseAuth();
  await firebaseSignOut(auth);
}

export function isAdmin(user: User | null): boolean {
  return isAdminEmail(user?.email);
}

export async function saveChatMessage(
  userId: string,
  userEmail: string,
  userName: string,
  message: string,
  pageContext?: string,
): Promise<string> {
  const { collection, addDoc, serverTimestamp } = await import(
    'firebase/firestore'
  );
  const db = await getFirebaseDb();
  const docRef = await addDoc(collection(db, 'chatMessages'), {
    userId,
    userEmail,
    userName,
    message,
    pageContext: pageContext || '/',
    timestamp: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserChatSessions(userId: string): Promise<any[]> {
  const { collection, query, orderBy, limit, where, getDocs } = await import(
    'firebase/firestore'
  );
  const db = await getFirebaseDb();
  const q = query(
    collection(db, 'chatSessions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function saveChatSession(
  userId: string,
  title: string,
  messages: any[],
): Promise<string> {
  const { collection, addDoc, serverTimestamp } = await import(
    'firebase/firestore'
  );
  const db = await getFirebaseDb();
  const docRef = await addDoc(collection(db, 'chatSessions'), {
    userId,
    title,
    messages,
    createdAt: new Date().toISOString(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOnAuthStateChanged() {
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged;
}

export async function getAuthInstance() {
  return getFirebaseAuth();
}

export async function subscribeToChatMessages(
  callback: (messages: ChatMessage[]) => void,
  messageLimit: number = 100,
) {
  const {
    collection,
    query,
    orderBy,
    limit: firestoreLimit,
    onSnapshot,
  } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  const q = query(
    collection(db, 'chatMessages'),
    orderBy('timestamp', 'desc'),
    firestoreLimit(messageLimit),
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];
    callback(messages);
  });
}

export async function saveJournalEntry(
  userId: string,
  userEmail: string,
  text: string,
): Promise<string> {
  const { collection, addDoc } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  const docRef = await addDoc(collection(db, 'journalEntries'), {
    userId,
    userEmail,
    text,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { doc, deleteDoc } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  await deleteDoc(doc(db, 'journalEntries', id));
}

export async function subscribeToJournalEntries(
  userId: string,
  callback: (entries: JournalEntry[]) => void,
) {
  const { collection, query, where, orderBy, onSnapshot } = await import(
    'firebase/firestore'
  );
  const db = await getFirebaseDb();
  const q = query(
    collection(db, 'journalEntries'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as JournalEntry[];
    callback(entries);
  });
}

export type { User };
