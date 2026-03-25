import Dexie, { type Table } from 'dexie';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  intent?: string;
  confidence?: number;
}

export class ChatDatabase extends Dexie {
  messages!: Table<ChatMessage, string>;

  constructor() {
    super('ChiragSinghal_ChatDB');
    this.version(1).stores({
      messages: 'id, timestamp, role',
    });
  }
}

export const db = new ChatDatabase();
