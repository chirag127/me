/**
 * Journal Service
 * Firebase Firestore CRUD + Google Auth for admin-only writes
 * Storage-optimized: short field keys, omitted fields = zero bytes
 * @module services/journal
 */

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit as firestoreLimit,
    startAfter,
    serverTimestamp,
    type DocumentData,
    type QueryDocumentSnapshot,
    Timestamp,
} from 'firebase/firestore';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    type User,
} from 'firebase/auth';
import { getFirebaseDB, getFirebaseAuth } from './firebase';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Admin email — only this account can create journal entries */
const ADMIN_EMAIL = 'whyiswhen@gmail.com';

/** Firestore collection name */
const COLLECTION = 'journals';

/**
 * Mood enum — stored as number (1 byte) instead of string (saves ~10 bytes/entry)
 * Maps to emoji + label for display
 */
export const MOOD_MAP: Record<number, { emoji: string; label: string; color: string }> = {
    0: { emoji: '😊', label: 'Happy', color: '#34C759' },
    1: { emoji: '😌', label: 'Calm', color: '#5AC8FA' },
    2: { emoji: '😐', label: 'Neutral', color: '#8E8E93' },
    3: { emoji: '😔', label: 'Sad', color: '#5856D6' },
    4: { emoji: '😡', label: 'Angry', color: '#FF3B30' },
    5: { emoji: '🤔', label: 'Thoughtful', color: '#FF9500' },
};

/** Human-readable field labels for display */
export const FIELD_LABELS: Record<string, string> = {
    t: 'Title',
    d: 'Description',
    w: 'What I Will Do',
    g: 'What I Am Doing',
    h: 'What I Have Done Today',
    m: 'Mood',
};

// ============================================================================
// TYPES
// ============================================================================

/**
 * Raw Firestore document shape (short keys for storage optimization)
 * In Firestore NoSQL, omitted fields consume exactly 0 bytes.
 */
export interface JournalEntryDoc {
    /** Title */
    t?: string;
    /** Description */
    d?: string;
    /** What I will do */
    w?: string;
    /** What I am doing */
    g?: string;
    /** What I have done today */
    h?: string;
    /** Mood (0-5 enum) */
    m?: number;
    /** Created-at timestamp (server-generated) */
    ts: Timestamp;
}

/** Expanded entry with Firestore document ID for UI rendering */
export interface JournalEntry extends JournalEntryDoc {
    id: string;
}

/** Paginated result */
export interface JournalPage {
    entries: JournalEntry[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
}

/** Aggregated stats for charts */
export interface JournalStats {
    totalEntries: number;
    entriesByMonth: Record<string, number>;
    entriesByDayOfWeek: number[];
    entriesByHour: number[];
    moodCounts: Record<number, number>;
    moodByDate: { date: string; mood: number }[];
    streaks: { current: number; longest: number };
    wordCounts: number[];
    entriesByDate: Record<string, number>;
}

// ============================================================================
// AUTH
// ============================================================================

/** Current auth user (cached) */
let currentUser: User | null = null;
let authInitialized = false;
const authListeners: ((user: User | null) => void)[] = [];

/** Initialize auth state listener (call once on app start) */
export function initJournalAuth(): void {
    const auth = getFirebaseAuth();
    if (!auth) return;

    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        authInitialized = true;
        authListeners.forEach((cb) => cb(user));
    });
}

/** Subscribe to auth state changes */
export function onJournalAuthChange(cb: (user: User | null) => void): () => void {
    authListeners.push(cb);
    // Fire immediately if auth already initialized
    if (authInitialized) cb(currentUser);
    return () => {
        const idx = authListeners.indexOf(cb);
        if (idx !== -1) authListeners.splice(idx, 1);
    };
}

/** Check if current user is the admin */
export function isAdmin(): boolean {
    return currentUser?.email === ADMIN_EMAIL;
}

/** Get current user */
export function getCurrentUser(): User | null {
    return currentUser;
}

/** Sign in with Google popup */
export async function signInAdmin(): Promise<User | null> {
    const auth = getFirebaseAuth();
    if (!auth) {
        console.error('[Journal] Firebase Auth not initialized');
        return null;
    }

    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('[Journal] Sign-in failed:', error);
        return null;
    }
}

/** Sign out */
export async function signOutAdmin(): Promise<void> {
    const auth = getFirebaseAuth();
    if (!auth) return;

    try {
        await signOut(auth);
    } catch (error) {
        console.error('[Journal] Sign-out failed:', error);
    }
}

// ============================================================================
// CRUD
// ============================================================================

/**
 * Validate that at least one content field is filled.
 * Returns error message or null if valid.
 */
export function validateEntry(entry: Partial<JournalEntryDoc>): string | null {
    const hasTitle = entry.t && entry.t.trim().length > 0;
    const hasDesc = entry.d && entry.d.trim().length > 0;
    const hasWillDo = entry.w && entry.w.trim().length > 0;
    const hasDoing = entry.g && entry.g.trim().length > 0;
    const hasDone = entry.h && entry.h.trim().length > 0;
    const hasMood = entry.m !== undefined && entry.m !== null;

    if (!hasTitle && !hasDesc && !hasWillDo && !hasDoing && !hasDone && !hasMood) {
        return 'At least one field must be filled.';
    }
    if (hasMood && (entry.m! < 0 || entry.m! > 5)) {
        return 'Invalid mood value.';
    }
    return null;
}

/**
 * Add a new journal entry to Firestore.
 * Only non-empty fields are written (empty fields = 0 bytes in Firestore).
 */
export async function addJournalEntry(
    entry: Partial<Omit<JournalEntryDoc, 'ts'>>,
): Promise<string | null> {
    if (!isAdmin()) {
        console.error('[Journal] Only admin can add entries');
        return null;
    }

    const db = getFirebaseDB();
    if (!db) {
        console.error('[Journal] Firestore not initialized');
        return null;
    }

    const validationError = validateEntry(entry);
    if (validationError) {
        throw new Error(validationError);
    }

    // Build the document — only include non-empty fields
    const doc: Record<string, unknown> = { ts: serverTimestamp() };
    if (entry.t && entry.t.trim()) doc.t = entry.t.trim();
    if (entry.d && entry.d.trim()) doc.d = entry.d.trim();
    if (entry.w && entry.w.trim()) doc.w = entry.w.trim();
    if (entry.g && entry.g.trim()) doc.g = entry.g.trim();
    if (entry.h && entry.h.trim()) doc.h = entry.h.trim();
    if (entry.m !== undefined && entry.m !== null) doc.m = entry.m;

    try {
        const docRef = await addDoc(collection(db, COLLECTION), doc);
        console.log('[Journal] Entry added:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('[Journal] Failed to add entry:', error);
        throw error;
    }
}

/**
 * Fetch journal entries with pagination.
 * Public access — no auth required.
 */
export async function getJournalEntries(
    pageSize = 20,
    lastDocument?: QueryDocumentSnapshot<DocumentData> | null,
): Promise<JournalPage> {
    const db = getFirebaseDB();
    if (!db) {
        return { entries: [], lastDoc: null, hasMore: false };
    }

    try {
        const col = collection(db, COLLECTION);
        const q = lastDocument
            ? query(col, orderBy('ts', 'desc'), startAfter(lastDocument), firestoreLimit(pageSize + 1))
            : query(col, orderBy('ts', 'desc'), firestoreLimit(pageSize + 1));
        const snapshot = await getDocs(q);

        const entries: JournalEntry[] = [];
        let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
        const hasMore = snapshot.docs.length > pageSize;

        const docsToProcess = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;

        docsToProcess.forEach((doc) => {
            const data = doc.data() as JournalEntryDoc;
            entries.push({ ...data, id: doc.id });
            lastDoc = doc;
        });

        return { entries, lastDoc, hasMore };
    } catch (error) {
        console.error('[Journal] Failed to fetch entries:', error);
        return { entries: [], lastDoc: null, hasMore: false };
    }
}

/**
 * Fetch ALL journal entries (for charts/stats).
 * Use sparingly — loads entire collection.
 */
export async function getAllJournalEntries(): Promise<JournalEntry[]> {
    const db = getFirebaseDB();
    if (!db) return [];

    try {
        const q = query(collection(db, COLLECTION), orderBy('ts', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            ...(doc.data() as JournalEntryDoc),
            id: doc.id,
        }));
    } catch (error) {
        console.error('[Journal] Failed to fetch all entries:', error);
        return [];
    }
}

// ============================================================================
// STATS (for charts)
// ============================================================================

/** Days of week labels */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Compute aggregated stats from all journal entries.
 * Returns data structures ready for Chart.js consumption.
 */
export function computeStats(entries: JournalEntry[]): JournalStats {
    const stats: JournalStats = {
        totalEntries: entries.length,
        entriesByMonth: {},
        entriesByDayOfWeek: new Array(7).fill(0),
        entriesByHour: new Array(24).fill(0),
        moodCounts: {},
        moodByDate: [],
        streaks: { current: 0, longest: 0 },
        wordCounts: [],
        entriesByDate: {},
    };

    if (entries.length === 0) return stats;

    // Process each entry
    const dateSet = new Set<string>();

    for (const entry of entries) {
        const date = entry.ts instanceof Timestamp ? entry.ts.toDate() : new Date(entry.ts);

        const dateStr = formatDateKey(date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const dayOfWeek = date.getDay();
        const hourOfDay = date.getHours();

        // Entries by date (for heatmap)
        stats.entriesByDate[dateStr] = (stats.entriesByDate[dateStr] || 0) + 1;
        dateSet.add(dateStr);

        // Entries by month
        stats.entriesByMonth[monthKey] = (stats.entriesByMonth[monthKey] || 0) + 1;

        // Entries by day of week
        stats.entriesByDayOfWeek[dayOfWeek]++;

        // Entries by hour
        stats.entriesByHour[hourOfDay]++;

        // Mood counts
        if (entry.m !== undefined && entry.m !== null) {
            stats.moodCounts[entry.m] = (stats.moodCounts[entry.m] || 0) + 1;
            stats.moodByDate.push({ date: dateStr, mood: entry.m });
        }

        // Word count (combine all text fields)
        const text = [entry.t, entry.d, entry.w, entry.g, entry.h].filter(Boolean).join(' ');
        if (text.trim().length > 0) {
            stats.wordCounts.push(text.trim().split(/\s+/).length);
        }
    }

    // Calculate streaks
    stats.streaks = calculateStreaks(dateSet);

    return stats;
}

/** Format date to YYYY-MM-DD string */
function formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Calculate current and longest streaks from a set of date strings */
function calculateStreaks(dateSet: Set<string>): { current: number; longest: number } {
    if (dateSet.size === 0) return { current: 0, longest: 0 };

    const sortedDates = [...dateSet].sort();
    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.floor(
            (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
            tempStreak++;
        } else {
            tempStreak = 1;
        }

        longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Current streak: check from today backwards
    const today = formatDateKey(new Date());
    if (dateSet.has(today)) {
        currentStreak = 1;
        const d = new Date();
        while (true) {
            d.setDate(d.getDate() - 1);
            if (dateSet.has(formatDateKey(d))) {
                currentStreak++;
            } else {
                break;
            }
        }
    } else {
        currentStreak = 0;
    }

    return { current: currentStreak, longest: longestStreak };
}

/** Export day labels for chart consumption */
export { DAYS };
