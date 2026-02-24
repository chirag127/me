/**
 * Journal Service Tests
 * Unit tests for validation, stats computation, and utility functions
 */

import { describe, it, expect } from 'vitest';
import { validateEntry, computeStats, MOOD_MAP, FIELD_LABELS, DAYS, type JournalEntry } from './journal';
import { Timestamp } from 'firebase/firestore';

// ============================================================================
// validateEntry
// ============================================================================
describe('validateEntry', () => {
    it('should reject empty entry', () => {
        expect(validateEntry({})).toBe('At least one field must be filled.');
    });

    it('should reject entry with only whitespace', () => {
        expect(validateEntry({ t: '   ', d: '  ' })).toBe('At least one field must be filled.');
    });

    it('should accept entry with title only', () => {
        expect(validateEntry({ t: 'Test' })).toBeNull();
    });

    it('should accept entry with description only', () => {
        expect(validateEntry({ d: 'Some text' })).toBeNull();
    });

    it('should accept entry with mood only', () => {
        expect(validateEntry({ m: 3 })).toBeNull();
    });

    it('should accept entry with willDo only', () => {
        expect(validateEntry({ w: 'Planning' })).toBeNull();
    });

    it('should accept entry with doing only', () => {
        expect(validateEntry({ g: 'Working' })).toBeNull();
    });

    it('should accept entry with done only', () => {
        expect(validateEntry({ h: 'Finished' })).toBeNull();
    });

    it('should reject invalid mood value (negative)', () => {
        expect(validateEntry({ m: -1 })).toBe('Invalid mood value.');
    });

    it('should reject invalid mood value (>5)', () => {
        expect(validateEntry({ m: 6 })).toBe('Invalid mood value.');
    });

    it('should accept all fields filled', () => {
        expect(validateEntry({ t: 'A', d: 'B', w: 'C', g: 'D', h: 'E', m: 2 })).toBeNull();
    });
});

// ============================================================================
// computeStats
// ============================================================================
describe('computeStats', () => {
    it('should return zeros for empty entries', () => {
        const stats = computeStats([]);
        expect(stats.totalEntries).toBe(0);
        expect(stats.streaks.current).toBe(0);
        expect(stats.streaks.longest).toBe(0);
        expect(stats.wordCounts).toEqual([]);
    });

    it('should count total entries correctly', () => {
        const entries = createEntries(5);
        const stats = computeStats(entries);
        expect(stats.totalEntries).toBe(5);
    });

    it('should count moods correctly', () => {
        const entries: JournalEntry[] = [
            createEntry('1', { m: 0 }),
            createEntry('2', { m: 0 }),
            createEntry('3', { m: 3 }),
        ];
        const stats = computeStats(entries);
        expect(stats.moodCounts[0]).toBe(2);
        expect(stats.moodCounts[3]).toBe(1);
    });

    it('should calculate word counts from text fields', () => {
        const entries: JournalEntry[] = [
            createEntry('1', { t: 'Hello world', d: 'This is a test' }),
            createEntry('2', { w: 'One two three' }),
        ];
        const stats = computeStats(entries);
        expect(stats.wordCounts.length).toBe(2);
        expect(stats.wordCounts[0]).toBe(6); // "Hello world This is a test"
        expect(stats.wordCounts[1]).toBe(3); // "One two three"
    });

    it('should track entries by date', () => {
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const entries: JournalEntry[] = [
            createEntry('1', {}, today),
            createEntry('2', {}, today),
        ];
        const stats = computeStats(entries);
        expect(stats.entriesByDate[dateKey]).toBe(2);
    });

    it('should track entries by day of week', () => {
        const today = new Date();
        const dow = today.getDay();
        const entries: JournalEntry[] = [createEntry('1', {}, today)];
        const stats = computeStats(entries);
        expect(stats.entriesByDayOfWeek[dow]).toBe(1);
    });

    it('should skip mood stats for entries without mood', () => {
        const entries: JournalEntry[] = [createEntry('1', { t: 'No mood here' })];
        const stats = computeStats(entries);
        expect(Object.keys(stats.moodCounts).length).toBe(0);
        expect(stats.moodByDate.length).toBe(0);
    });
});

// ============================================================================
// Constants
// ============================================================================
describe('Constants', () => {
    it('MOOD_MAP should have 6 moods (0-5)', () => {
        expect(Object.keys(MOOD_MAP).length).toBe(6);
        for (let i = 0; i <= 5; i++) {
            expect(MOOD_MAP[i]).toBeDefined();
            expect(MOOD_MAP[i].emoji).toBeTruthy();
            expect(MOOD_MAP[i].label).toBeTruthy();
            expect(MOOD_MAP[i].color).toBeTruthy();
        }
    });

    it('FIELD_LABELS should have 6 fields', () => {
        expect(Object.keys(FIELD_LABELS).length).toBe(6);
        expect(FIELD_LABELS.t).toBe('Title');
        expect(FIELD_LABELS.m).toBe('Mood');
    });

    it('DAYS should have 7 entries', () => {
        expect(DAYS.length).toBe(7);
        expect(DAYS[0]).toBe('Sun');
        expect(DAYS[6]).toBe('Sat');
    });
});

// ============================================================================
// HELPERS
// ============================================================================

function createEntry(
    id: string,
    overrides: Partial<Omit<JournalEntry, 'id' | 'ts'>> = {},
    date: Date = new Date(),
): JournalEntry {
    return {
        id,
        ts: Timestamp.fromDate(date),
        ...overrides,
    };
}

function createEntries(count: number): JournalEntry[] {
    return Array.from({ length: count }, (_, i) => createEntry(String(i), { t: `Entry ${i}` }));
}
