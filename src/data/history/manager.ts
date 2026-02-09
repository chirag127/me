/**
 * History Manager - Puter.js KV storage for historical data
 * Stores daily snapshots and provides "On This Day" lookups
 */

import type { HistoryEntry, HistoryMetadata, HistoryKey } from './types';

declare const puter: any;

const HISTORY_PREFIX = 'history_';
const METADATA_PREFIX = 'history_meta_';

class HistoryManager {
    private initialized = false;

    private async ensureInit(): Promise<boolean> {
        if (this.initialized) return true;

        // Check if Puter.js is available
        if (typeof puter !== 'undefined' && puter.kv) {
            this.initialized = true;
            return true;
        }

        // Fallback: use localStorage
        console.warn('Puter.js KV not available, using localStorage fallback');
        this.initialized = true;
        return true;
    }

    private getStorageKey(key: HistoryKey, date?: string): string {
        const dateStr = date || new Date().toISOString().split('T')[0];
        return `${HISTORY_PREFIX}${key}_${dateStr}`;
    }

    private getMetadataKey(key: HistoryKey): string {
        return `${METADATA_PREFIX}${key}`;
    }

    /**
     * Save a history entry for today
     */
    async saveEntry<T>(key: HistoryKey, data: T, source: HistoryEntry<T>['source'] = 'api'): Promise<void> {
        await this.ensureInit();

        const today = new Date().toISOString().split('T')[0];
        const entry: HistoryEntry<T> = {
            id: `${key}_${today}`,
            timestamp: Date.now(),
            date: today,
            data,
            source,
        };

        const storageKey = this.getStorageKey(key, today);

        try {
            if (typeof puter !== 'undefined' && puter.kv) {
                await puter.kv.set(storageKey, JSON.stringify(entry));
            } else {
                localStorage.setItem(storageKey, JSON.stringify(entry));
            }

            // Update metadata
            await this.updateMetadata(key, today);
        } catch (error) {
            console.error(`Failed to save history entry for ${key}:`, error);
        }
    }

    /**
     * Get history entry for a specific date
     */
    async getEntry<T>(key: HistoryKey, date: string): Promise<HistoryEntry<T> | null> {
        await this.ensureInit();

        const storageKey = this.getStorageKey(key, date);

        try {
            let data: string | null = null;

            if (typeof puter !== 'undefined' && puter.kv) {
                data = await puter.kv.get(storageKey);
            } else {
                data = localStorage.getItem(storageKey);
            }

            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Failed to get history entry for ${key} on ${date}:`, error);
            return null;
        }
    }

    /**
     * Get "On This Day" entries from previous years
     */
    async getOnThisDay<T>(key: HistoryKey): Promise<HistoryEntry<T>[]> {
        await this.ensureInit();

        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentYear = today.getFullYear();

        const entries: HistoryEntry<T>[] = [];

        // Check last 5 years
        for (let year = currentYear - 1; year >= currentYear - 5; year--) {
            const date = `${year}-${month}-${day}`;
            const entry = await this.getEntry<T>(key, date);
            if (entry) {
                entries.push(entry);
            }
        }

        return entries;
    }

    /**
     * Get recent history entries
     */
    async getRecentEntries<T>(key: HistoryKey, days: number = 7): Promise<HistoryEntry<T>[]> {
        await this.ensureInit();

        const entries: HistoryEntry<T>[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const entry = await this.getEntry<T>(key, dateStr);
            if (entry) {
                entries.push(entry);
            }
        }

        return entries;
    }

    /**
     * Update metadata for a history key
     */
    private async updateMetadata(key: HistoryKey, date: string): Promise<void> {
        const metaKey = this.getMetadataKey(key);

        try {
            let metadata: HistoryMetadata;
            let existingData: string | null = null;

            if (typeof puter !== 'undefined' && puter.kv) {
                existingData = await puter.kv.get(metaKey);
            } else {
                existingData = localStorage.getItem(metaKey);
            }

            if (existingData) {
                metadata = JSON.parse(existingData);
                metadata.totalEntries++;
                metadata.lastEntry = date;
                metadata.lastUpdated = Date.now();
            } else {
                metadata = {
                    key,
                    totalEntries: 1,
                    firstEntry: date,
                    lastEntry: date,
                    lastUpdated: Date.now(),
                };
            }

            if (typeof puter !== 'undefined' && puter.kv) {
                await puter.kv.set(metaKey, JSON.stringify(metadata));
            } else {
                localStorage.setItem(metaKey, JSON.stringify(metadata));
            }
        } catch (error) {
            console.error(`Failed to update metadata for ${key}:`, error);
        }
    }

    /**
     * Get metadata for a history key
     */
    async getMetadata(key: HistoryKey): Promise<HistoryMetadata | null> {
        await this.ensureInit();

        const metaKey = this.getMetadataKey(key);

        try {
            let data: string | null = null;

            if (typeof puter !== 'undefined' && puter.kv) {
                data = await puter.kv.get(metaKey);
            } else {
                data = localStorage.getItem(metaKey);
            }

            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Failed to get metadata for ${key}:`, error);
            return null;
        }
    }
}

// Singleton instance
export const historyManager = new HistoryManager();

export default historyManager;
