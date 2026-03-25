import type { User } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

// Admin email
export const ADMIN_EMAIL = 'whyiswhen@gmail.com';

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
let _app: ReturnType<typeof import('firebase/app').initializeApp> | null = null;
let _auth: ReturnType<typeof import('firebase/auth').getAuth> | null = null;
let _db: ReturnType<typeof import('firebase/firestore').getFirestore> | null = null;

async function getFirebaseApp() {
  if (_app) return _app;
  if (typeof window === 'undefined') throw new Error('Firebase can only be used on the client side');

  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return _app;
}

export async function getFirebaseAuth() {
  if (_auth) return _auth;
  const app = await getFirebaseApp();
  const { getAuth } = await import('firebase/auth');
  _auth = getAuth(app);
  return _auth;
}

export async function getFirebaseDb() {
  if (_db) return _db;
  const app = await getFirebaseApp();
  const { getFirestore } = await import('firebase/firestore');
  _db = getFirestore(app);
  return _db;
}

// Auth functions
export async function signInWithGoogle(): Promise<User | null> {
  const { GoogleAuthProvider, signInWithPopup, getRedirectResult } = await import('firebase/auth');
  const auth = await getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  
  // Check if we're returning from a redirect (legacy support)
  try {
    const result = await getRedirectResult(auth);
    if (result) return result.user;
  } catch (e: any) {
    console.error('Redirect result error:', e?.code, e?.message);
  }
  
  // Use popup for better UX and reliability
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (e: any) {
    console.error('Popup sign-in error:', e?.code, e?.message);
    // Fallback to redirect if popup is blocked or fails
    const { signInWithRedirect } = await import('firebase/auth');
    await signInWithRedirect(auth, provider);
  }
  return null;
}

export async function handleGoogleRedirect(): Promise<User | null> {
  const { getRedirectResult } = await import('firebase/auth');
  const auth = await getFirebaseAuth();
  try {
    const result = await getRedirectResult(auth);
    if (result) return result.user;
  } catch (e: any) {
    console.error('Redirect error:', e?.code, e?.message);
  }
  return null;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const auth = await getFirebaseAuth();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  const auth = await getFirebaseAuth();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signOut(): Promise<void> {
  const { signOut: firebaseSignOut } = await import('firebase/auth');
  const auth = await getFirebaseAuth();
  await firebaseSignOut(auth);
}

export function isAdmin(user: User | null): boolean {
  return user?.email === ADMIN_EMAIL;
}

// Save chat message to Firestore
export async function saveChatMessage(
  userId: string,
  userEmail: string,
  userName: string,
  message: string,
  pageContext?: string
): Promise<string> {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
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

// Get all chat messages (admin only)
export async function getAllChatMessages(messageLimit: number = 100): Promise<ChatMessage[]> {
  const { collection, query, orderBy, limit: firestoreLimit, getDocs } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  const q = query(
    collection(db, 'chatMessages'),
    orderBy('timestamp', 'desc'),
    firestoreLimit(messageLimit)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];
}

// Get chat messages for a specific user
export async function getUserChatMessages(userId: string, messageLimit: number = 50): Promise<ChatMessage[]> {
  const { collection, query, orderBy, limit: firestoreLimit, where, getDocs } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  const q = query(
    collection(db, 'chatMessages'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    firestoreLimit(messageLimit)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];
}

// Subscribe to chat messages in real-time
export async function subscribeToChatMessages(
  callback: (messages: ChatMessage[]) => void,
  messageLimit: number = 100
) {
  const { collection, query, orderBy, limit: firestoreLimit, onSnapshot } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  const q = query(
    collection(db, 'chatMessages'),
    orderBy('timestamp', 'desc'),
    firestoreLimit(messageLimit)
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];
    callback(messages);
  });
}

// Save journal entry
export async function saveJournalEntry(
  userId: string,
  userEmail: string,
  text: string
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

// Delete journal entry
export async function deleteJournalEntry(id: string): Promise<void> {
  const { doc, deleteDoc } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  await deleteDoc(doc(db, 'journalEntries', id));
}

// Subscribe to journal entries
export async function subscribeToJournalEntries(
  userId: string,
  callback: (entries: JournalEntry[]) => void
) {
  const { collection, query, where, orderBy, onSnapshot } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  const q = query(
    collection(db, 'journalEntries'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as JournalEntry[];
    callback(entries);
  });
}

// Re-export onAuthStateChanged for React components
export async function getOnAuthStateChanged() {
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged;
}

export async function getAuthInstance() {
  return getFirebaseAuth();
}

// Get chat sessions for a user
export async function getUserChatSessions(userId: string): Promise<Array<{ id: string; title: string; messages: any[]; createdAt: string }>> {
  const { collection, query, orderBy, limit: firestoreLimit, where, getDocs } = await import('firebase/firestore');
  const db = await getFirebaseDb();
  const q = query(
    collection(db, 'chatSessions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    firestoreLimit(50)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Array<{ id: string; title: string; messages: any[]; createdAt: string }>;
}

// Save chat session
export async function saveChatSession(
  userId: string,
  title: string,
  messages: any[]
): Promise<string> {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
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

export type { User };
