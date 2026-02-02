/**
 * Project Me - Reactive State Store
 * Signal-based reactivity pattern with localStorage persistence
 */

type Listener<T> = (value: T) => void;

export class Signal<T> {
  private value: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.notify();
    }
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.value));
  }
}

export class Computed<T> {
  private cachedValue: T | undefined;
  private dependencies: Signal<any>[];
  private compute: () => T;
  private dirty = true;

  constructor(compute: () => T, dependencies: Signal<any>[]) {
    this.compute = compute;
    this.dependencies = dependencies;

    dependencies.forEach(dep => {
      dep.subscribe(() => {
        this.dirty = true;
      });
    });
  }

  get(): T {
    if (this.dirty) {
      this.cachedValue = this.compute();
      this.dirty = false;
    }
    return this.cachedValue as T;
  }
}

// Persisted Signal that saves to localStorage
export class PersistedSignal<T> extends Signal<T> {
  private key: string;

  constructor(key: string, defaultValue: T) {
    const stored = localStorage.getItem(key);
    const initialValue = stored ? JSON.parse(stored) : defaultValue;
    super(initialValue);
    this.key = key;
  }

  set(newValue: T): void {
    super.set(newValue);
    localStorage.setItem(this.key, JSON.stringify(newValue));
  }
}

// Theme types
export type Theme = 'dark' | 'light' | 'auto';

// App state interface
export interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  currentRoute: string;
  searchOpen: boolean;
  aiChatOpen: boolean;
  notifications: Notification[];
  visitCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

// Create the global store
class Store {
  // Persisted state
  theme = new PersistedSignal<Theme>('pm-theme', 'dark');
  visitCount = new PersistedSignal<number>('pm-visits', 0);

  // Session state
  sidebarOpen = new Signal<boolean>(false);
  currentRoute = new Signal<string>('/me/index');
  searchOpen = new Signal<boolean>(false);
  aiChatOpen = new Signal<boolean>(false);
  notifications = new Signal<Notification[]>([]);
  isLoading = new Signal<boolean>(true);

  // Computed
  isDarkMode: Computed<boolean>;

  constructor() {
    // Increment visit count on load
    this.visitCount.set(this.visitCount.get() + 1);

    // Computed dark mode
    this.isDarkMode = new Computed(
      () => {
        const theme = this.theme.get();
        if (theme === 'auto') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return theme === 'dark';
      },
      [this.theme]
    );

    // Apply theme on change
    this.theme.subscribe(this.applyTheme.bind(this));
    this.applyTheme(this.theme.get());
  }

  private applyTheme(theme: Theme): void {
    const isDark = theme === 'dark' ||
      (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const currentTheme = this.theme.get();
    const themes: Theme[] = ['dark', 'light', 'auto'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    this.theme.set(nextTheme);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };
    this.notifications.set([...this.notifications.get(), newNotification]);
  }

  markNotificationRead(id: string): void {
    const notifications = this.notifications.get().map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications.set(notifications);
  }

  clearNotifications(): void {
    this.notifications.set([]);
  }
}

// Export singleton instance
export const store = new Store();

export default store;
