import { useChatStore } from '../../store/useChatStore';
import { getFirebaseDb } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function extractAndStorePreferences(userQuery: string, intent: string) {
  const store = useChatStore.getState();
  const currentPrefs = { ...store.preferences };
  let updated = false;

  // Simple heuristic preference extraction (Normally involves a fast LLM pass)
  const q = userQuery.toLowerCase();
  
  if (intent === 'movies' && q.includes('like') || q.includes('love')) {
    // Just a placeholder mock for extraction logic
    currentPrefs.movies.push(q);
    updated = true;
  }
  
  if (intent === 'coding' && (q.includes('react') || q.includes('python'))) {
    currentPrefs.coding.push(q);
    updated = true;
  }

  if (updated) {
    // Sync to Zustand
    useChatStore.setState({ preferences: currentPrefs });
    
    // Sync to long-term Firestore memory (assuming anonymous device ID)
    try {
      // In production, user ID should map to an Auth UID or LocalStorage UUID
      const db = await getFirebaseDb();
      await setDoc(doc(db, 'preferences', 'current_device_user'), currentPrefs, { merge: true });
    } catch (e) {
      console.error('[Preferences] Firestore sync failed', e);
    }
  }
}
