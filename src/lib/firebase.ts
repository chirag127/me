import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, type Firestore } from 'firebase/firestore'

const cfg = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
}

let db: Firestore | null = null

export function firestore(): Firestore | null {
  if (!cfg.apiKey || !cfg.projectId) return null
  if (!db) {
    const app: FirebaseApp = getApps()[0] ?? initializeApp(cfg)
    db = getFirestore(app)
  }
  return db
}

// Small per-user data, keyed by Clerk user id. Firestore only (Clerk owns auth).
export async function getUserDoc<T = Record<string, unknown>>(uid: string): Promise<T | null> {
  const d = firestore()
  if (!d) return null
  const snap = await getDoc(doc(d, 'me_users', uid))
  return snap.exists() ? (snap.data() as T) : null
}

export async function setUserDoc(uid: string, data: Record<string, unknown>): Promise<boolean> {
  const d = firestore()
  if (!d) return false
  await setDoc(doc(d, 'me_users', uid), data, { merge: true })
  return true
}
