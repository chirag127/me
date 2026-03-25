import { create } from 'zustand';

interface AIChatState {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

export const useAIChatStore = create<AIChatState>((set) => ({
  isOpen: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}));
