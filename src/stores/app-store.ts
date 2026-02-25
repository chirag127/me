/**
 * Project Me — Zustand App Store
 * Replaces the custom Signal-based store with Zustand
 * Persists theme and visit count to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'auto';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
}

interface AppState {
    /* Persisted */
    theme: Theme;
    visitCount: number;

    /* Session */
    sidebarOpen: boolean;
    searchOpen: boolean;
    aiChatOpen: boolean;
    notifications: Notification[];

    /* Actions */
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setSearchOpen: (open: boolean) => void;
    setAiChatOpen: (open: boolean) => void;
    addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markNotificationRead: (id: string) => void;
    clearNotifications: () => void;
}

const THEME_ORDER: Theme[] = ['dark', 'light', 'auto'];

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            /* Persisted state */
            theme: 'dark',
            visitCount: 0,

            /* Session state */
            sidebarOpen: true,
            searchOpen: false,
            aiChatOpen: false,
            notifications: [],

            /* Actions */
            toggleTheme: () => {
                const current = get().theme;
                const idx = THEME_ORDER.indexOf(current);
                const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
                set({ theme: next });
            },

            setTheme: (theme: Theme) => set({ theme }),

            toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

            setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

            setSearchOpen: (open: boolean) => set({ searchOpen: open }),

            setAiChatOpen: (open: boolean) => set({ aiChatOpen: open }),

            addNotification: (n) =>
                set((s) => ({
                    notifications: [
                        ...s.notifications,
                        { ...n, id: crypto.randomUUID(), timestamp: new Date(), read: false },
                    ],
                })),

            markNotificationRead: (id: string) =>
                set((s) => ({
                    notifications: s.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n,
                    ),
                })),

            clearNotifications: () => set({ notifications: [] }),
        }),
        {
            name: 'pm-store',
            partialize: (state) => ({
                theme: state.theme,
                visitCount: state.visitCount,
            }),
        },
    ),
);

/* Increment visit count on first import */
useAppStore.setState((s) => ({ visitCount: s.visitCount + 1 }));
