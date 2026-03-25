import { create } from 'zustand';
import { db, type ChatMessage } from '../db/idb';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  currentModel: string;
  preferences: {
    movies: string[];
    music: string[];
    coding: string[];
  };
  
  // Actions
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<string>;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  loadMessages: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  currentModel: 'liquid/lfm-2.5-1.2b-instruct:free',
  preferences: {
    movies: [],
    music: [],
    coding: []
  },

  addMessage: async (msg) => {
    const newMessage: ChatMessage = {
      ...msg,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    
    set((state) => ({ messages: [...state.messages, newMessage] }));
    await db.messages.add(newMessage);
    return newMessage.id;
  },

  updateMessage: async (id, updates) => {
    set((state) => ({
      messages: state.messages.map((m) => m.id === id ? { ...m, ...updates } : m)
    }));
    await db.messages.update(id, updates);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  loadMessages: async () => {
    try {
      const msgs = await db.messages.orderBy('timestamp').toArray();
      if (msgs.length > 0) {
        set({ messages: msgs });
      }
    } catch (error) {
      console.error('Failed to load chat history from Dexie:', error);
    }
  }
}));
