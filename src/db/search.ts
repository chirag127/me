import MiniSearch from 'minisearch';
import { db } from './idb'; 

export const searchEngine = new MiniSearch({
  fields: ['content', 'intent'],
  storeFields: ['id', 'role', 'content', 'timestamp', 'intent']
});

/**
 * Initializes the MiniSearch index from the current Dexie short-term memory.
 */
export async function indexChatHistory() {
  const messages = await db.messages.toArray();
  searchEngine.removeAll();
  searchEngine.addAll(messages);
}

/**
 * Perform a fast client-side search over past chat memory.
 */
export async function searchChatHistory(query: string) {
  return searchEngine.search(query, { prefix: true, fuzzy: 0.2 });
}
