import { describe, it, expect } from 'vitest';
import { formatNumber } from './utility';

describe('Utility Services', () => {
    describe('formatNumber', () => {
        it('should format millions correctly', () => {
            expect(formatNumber(1500000)).toBe('1.5M');
            expect(formatNumber(1000000)).toBe('1.0M');
        });

        it('should format thousands correctly', () => {
            expect(formatNumber(1500)).toBe('1.5K');
            expect(formatNumber(999999)).toBe('1000.0K');
        });

        it('should format small numbers properly', () => {
            expect(formatNumber(500)).toBe('500');
            expect(formatNumber(0)).toBe('0');
            expect(formatNumber(50.25)).toBe('50.25');
        });

        it('should format negative numbers correctly', () => {
            expect(formatNumber(-1500000)).toBe('-1.5M');
            expect(formatNumber(-1500)).toBe('-1.5K');
            expect(formatNumber(-500)).toBe('-500');
            expect(formatNumber(-50.25)).toBe('-50.25');
        });
    });
});
