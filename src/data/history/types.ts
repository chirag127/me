/**
 * History Types - Interfaces for historical data tracking
 */

export interface HistoryEntry<T> {
    id: string;
    timestamp: number;
    date: string; // YYYY-MM-DD
    data: T;
    source: 'api' | 'manual' | 'snapshot';
}

export interface HistoryMetadata {
    key: string;
    totalEntries: number;
    firstEntry: string;
    lastEntry: string;
    lastUpdated: number;
}

// Specific history types
export interface MusicHistoryEntry extends HistoryEntry<{
    topArtists: string[];
    topTracks: string[];
    scrobbles: number;
}> { }

export interface WatchHistoryEntry extends HistoryEntry<{
    recentMovies: string[];
    recentShows: string[];
    totalWatched: number;
}> { }

export interface CodingHistoryEntry extends HistoryEntry<{
    commits: number;
    repos: number;
    languages: Record<string, number>;
}> { }

export interface ReadingHistoryEntry extends HistoryEntry<{
    currentlyReading: string[];
    booksRead: number;
}> { }

// History store keys
export type HistoryKey =
    | 'music'
    | 'watch'
    | 'coding'
    | 'reading'
    | 'gaming'
    | 'social';
