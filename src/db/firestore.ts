import { getFirebaseDb } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ChatSession {
  userQuery: string;
  aiResponse: string;
  intent: string;
  confidence: number;
  toolsUsed: string[];
  unknown: boolean;
}

export interface UnknownQuery {
  query: string;
  reason: string;
}

export async function saveChatRecord(chat: ChatSession) {
  try {
    const db = await getFirebaseDb();
    await addDoc(collection(db, 'chats'), {
      ...chat,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to save chat to Firestore:', error);
  }
}

export async function saveUnknownRecord(query: UnknownQuery) {
  try {
    const db = await getFirebaseDb();
    await addDoc(collection(db, 'unknown_queries'), {
      ...query,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to save unknown query to Firestore:', error);
  }
}
