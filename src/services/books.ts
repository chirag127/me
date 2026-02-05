/**
 * Project Me - Books Services
 * API integrations for OpenLibrary, Hardcover (if public)
 */

import { CONFIG } from '../config';

// Types
export interface OpenLibraryBook {
  title: string;
  key: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  isbn?: string[];
  subject?: string[];
  number_of_pages_median?: number;
}

export interface OpenLibraryReadingLog {
  reading_log_entries: Array<{
    work: {
      title: string;
      key: string;
      author_names?: string[];
      cover_id?: number;
      first_publish_year?: number;
    };
    logged_date: string;
    logged_edition?: string;
  }>;
  page: number;
  total_results: number;
}

export interface OpenLibraryUser {
  displayname: string;
  key: string;
  created: { value: string };
  reading_log_counts?: {
    want_to_read: number;
    currently_reading: number;
    already_read: number;
  };
}

// Cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for books

const TIMEOUT = 10000; // 10 seconds timeout

async function fetchWithCache<T>(url: string, options?: RequestInit): Promise<T> {
  const cacheKey = url;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return data as T;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// OpenLibrary API (100% public, no auth)
export async function getOpenLibraryUser(): Promise<OpenLibraryUser | null> {
  try {
    const url = `${CONFIG.api.openlibrary}/${CONFIG.user.openlibrary}.json`;
    return fetchWithCache<OpenLibraryUser>(url);
  } catch (error) {
    console.warn('OpenLibrary user fetch failed:', error);
    return null;
  }
}

export async function getReadingLog(shelf: 'want-to-read' | 'currently-reading' | 'already-read' = 'already-read', limit = 20): Promise<OpenLibraryReadingLog> {
  const url = `${CONFIG.api.openlibrary}/${CONFIG.user.openlibrary}/books/${shelf}.json?limit=${limit}`;
  try {
    return fetchWithCache<OpenLibraryReadingLog>(url);
  } catch {
    return { reading_log_entries: [], page: 1, total_results: 0 };
  }
}

export async function getBooksRead(limit = 20): Promise<OpenLibraryReadingLog> {
  return getReadingLog('already-read', limit);
}

export async function getBooksReading(limit = 10): Promise<OpenLibraryReadingLog> {
  return getReadingLog('currently-reading', limit);
}

export async function getBooksToRead(limit = 20): Promise<OpenLibraryReadingLog> {
  return getReadingLog('want-to-read', limit);
}

export function getBookCoverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string {
  if (!coverId) return '';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getBookUrl(workKey: string): string {
  return `https://openlibrary.org${workKey}`;
}

// Search OpenLibrary
export async function searchBooks(query: string, limit = 10): Promise<OpenLibraryBook[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
  try {
    const data = await fetchWithCache<{ docs: OpenLibraryBook[] }>(url);
    return data.docs;
  } catch {
    return [];
  }
}

// Aggregate book stats
export interface BookStats {
  read: number;
  reading: number;
  toRead: number;
  total: number;
  recentlyRead: Array<{
    title: string;
    author: string;
    coverUrl: string;
    key: string;
  }>;
}

export async function getBookStats(): Promise<BookStats> {
  try {
    const [user, read, reading, toRead] = await Promise.all([
      getOpenLibraryUser().catch(() => null),
      getBooksRead(5).catch(() => ({ reading_log_entries: [], total_results: 0 })),
      getBooksReading(5).catch(() => ({ reading_log_entries: [], total_results: 0 })),
      getBooksToRead(1).catch(() => ({ reading_log_entries: [], total_results: 0 })),
    ]);

    const recentlyRead = read.reading_log_entries.slice(0, 5).map(entry => ({
      title: entry.work.title,
      author: entry.work.author_names?.[0] || 'Unknown',
      coverUrl: getBookCoverUrl(entry.work.cover_id, 'M'),
      key: entry.work.key,
    }));

    return {
      read: user?.reading_log_counts?.already_read || read.total_results,
      reading: user?.reading_log_counts?.currently_reading || reading.total_results,
      toRead: user?.reading_log_counts?.want_to_read || toRead.total_results,
      total: (user?.reading_log_counts?.already_read || 0) +
             (user?.reading_log_counts?.currently_reading || 0) +
             (user?.reading_log_counts?.want_to_read || 0),
      recentlyRead,
    };
  } catch (error) {
    console.error('Failed to fetch book stats:', error);
    return { read: 0, reading: 0, toRead: 0, total: 0, recentlyRead: [] };
  }
}

export default {
  getOpenLibraryUser,
  getReadingLog,
  getBooksRead,
  getBooksReading,
  getBooksToRead,
  getBookCoverUrl,
  getBookUrl,
  searchBooks,
  getBookStats,
};
