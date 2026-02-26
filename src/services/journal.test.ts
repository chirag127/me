/**
 * Journal Service Tests
 * Unit tests for validation, stats, constants
 */

import { describe, it, expect } from 'vitest';
import {
    validateEntry,
    computeStats,
    MOOD_MAP,
    FIELD_LABELS,
    DAYS,
    NEXT_ACTION_OPTIONS,
    TIME_ESTIMATE_OPTIONS,
    type JournalEntry,
} from './journal';
import { Timestamp } from 'firebase/firestore';

// ========================================
// validateEntry
// ========================================
describe('validateEntry', () => {
    it('should reject empty entry', () => {
        expect(validateEntry({})).toBe(
            'At least one field must be filled.',
        );
    });

    it('should reject whitespace-only', () => {
        expect(
            validateEntry({ t: '   ', d: '  ' }),
        ).toBe(
            'At least one field must be filled.',
        );
    });

    it('should accept title only', () => {
        expect(
            validateEntry({ t: 'Test' }),
        ).toBeNull();
    });

    it('should accept description only', () => {
        expect(
            validateEntry({ d: 'Some text' }),
        ).toBeNull();
    });

    it('should accept mood only', () => {
        expect(
            validateEntry({ m: 3 }),
        ).toBeNull();
    });

    it('should accept willDo only', () => {
        expect(
            validateEntry({ w: 'Planning' }),
        ).toBeNull();
    });

    it('should accept doing only', () => {
        expect(
            validateEntry({ g: 'Working' }),
        ).toBeNull();
    });

    it('should accept done only', () => {
        expect(
            validateEntry({ h: 'Finished' }),
        ).toBeNull();
    });

    it('should accept nextAction only', () => {
        expect(
            validateEntry({ n: 'Today' }),
        ).toBeNull();
    });

    it('should accept timeEstimate only', () => {
        expect(
            validateEntry({ e: 30 }),
        ).toBeNull();
    });

    it('should reject invalid mood (<0)', () => {
        expect(validateEntry({ m: -1 })).toBe(
            'Invalid mood value.',
        );
    });

    it('should reject invalid mood (>5)', () => {
        expect(validateEntry({ m: 6 })).toBe(
            'Invalid mood value.',
        );
    });

    it('should accept all fields filled', () => {
        expect(
            validateEntry({
                t: 'A',
                d: 'B',
                w: 'C',
                g: 'D',
                h: 'E',
                m: 2,
                n: 'Today',
                e: 60,
            }),
        ).toBeNull();
    });
});

// ========================================
// computeStats
// ========================================
describe('computeStats', () => {
    it('should return zeros for empty', () => {
        const stats = computeStats([]);
        expect(stats.totalEntries).toBe(0);
        expect(stats.streaks.current).toBe(0);
        expect(stats.streaks.longest).toBe(0);
        expect(stats.wordCounts).toEqual([]);
    });

    it('should count entries correctly', () => {
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

    it('should calc word counts', () => {
        const entries: JournalEntry[] = [
            createEntry('1', {
                t: 'Hello world',
                d: 'This is a test',
            }),
            createEntry('2', {
                w: 'One two three',
            }),
        ];
        const stats = computeStats(entries);
        expect(stats.wordCounts.length).toBe(2);
        expect(stats.wordCounts[0]).toBe(6);
        expect(stats.wordCounts[1]).toBe(3);
    });

    it('should include n field in word count', () => {
        const entries: JournalEntry[] = [
            createEntry('1', { n: 'Do this tomorrow' }),
        ];
        const stats = computeStats(entries);
        expect(stats.wordCounts[0]).toBe(3);
    });

    it('should track entries by date', () => {
        const today = new Date();
        const dateKey = fmtDate(today);
        const entries: JournalEntry[] = [
            createEntry('1', {}, today),
            createEntry('2', {}, today),
        ];
        const stats = computeStats(entries);
        expect(stats.entriesByDate[dateKey]).toBe(2);
    });

    it('should track by day of week', () => {
        const today = new Date();
        const dow = today.getDay();
        const entries: JournalEntry[] = [
            createEntry('1', {}, today),
        ];
        const stats = computeStats(entries);
        expect(
            stats.entriesByDayOfWeek[dow],
        ).toBe(1);
    });

    it('should skip mood stats if absent', () => {
        const entries: JournalEntry[] = [
            createEntry('1', { t: 'No mood' }),
        ];
        const stats = computeStats(entries);
        expect(
            Object.keys(stats.moodCounts).length,
        ).toBe(0);
        expect(stats.moodByDate.length).toBe(0);
    });
});

// ========================================
// Constants
// ========================================
describe('Constants', () => {
    it('MOOD_MAP has 6 moods (0-5)', () => {
        expect(
            Object.keys(MOOD_MAP).length,
        ).toBe(6);
        for (let i = 0; i <= 5; i++) {
            expect(MOOD_MAP[i]).toBeDefined();
            expect(MOOD_MAP[i].emoji).toBeTruthy();
            expect(MOOD_MAP[i].label).toBeTruthy();
            expect(MOOD_MAP[i].color).toBeTruthy();
        }
    });

    it('FIELD_LABELS has 8 fields', () => {
        expect(
            Object.keys(FIELD_LABELS).length,
        ).toBe(8);
        expect(FIELD_LABELS.t).toBe('Title');
        expect(FIELD_LABELS.m).toBe('Mood');
        expect(FIELD_LABELS.n).toBe('Next Action');
        expect(FIELD_LABELS.e).toBe('Time Estimate');
    });

    it('DAYS has 7 entries', () => {
        expect(DAYS.length).toBe(7);
        expect(DAYS[0]).toBe('Sun');
        expect(DAYS[6]).toBe('Sat');
    });

    it('NEXT_ACTION_OPTIONS has 6 options', () => {
        expect(
            NEXT_ACTION_OPTIONS.length,
        ).toBe(6);
        expect(NEXT_ACTION_OPTIONS[0]).toBe('Today');
        expect(
            NEXT_ACTION_OPTIONS[5],
        ).toBe('Someday');
    });

    it('TIME_ESTIMATE_OPTIONS has 6 options', () => {
        expect(
            TIME_ESTIMATE_OPTIONS.length,
        ).toBe(6);
        expect(
            TIME_ESTIMATE_OPTIONS[0].value,
        ).toBe(15);
        expect(
            TIME_ESTIMATE_OPTIONS[5].label,
        ).toBe('Full Day');
    });
});

// ========================================
// HELPERS
// ========================================
function fmtDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1)
        .padStart(2, '0');
    const day = String(d.getDate())
        .padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function createEntry(
    id: string,
    overrides: Partial<
        Omit<JournalEntry, 'id' | 'ts'>
    > = {},
    date: Date = new Date(),
): JournalEntry {
    return {
        id,
        ts: Timestamp.fromDate(date),
        ...overrides,
    };
}

function createEntries(
    count: number,
): JournalEntry[] {
    return Array.from(
        { length: count },
        (_, i) =>
            createEntry(String(i), {
                t: `Entry ${i}`,
            }),
    );
}
