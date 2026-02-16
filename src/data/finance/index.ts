import type { Transaction } from './types';
import { TRANSACTIONS as T_2023_04 } from './2023-04';
import { TRANSACTIONS as T_2023_05 } from './2023-05';
import { TRANSACTIONS as T_2023_06 } from './2023-06';
import { TRANSACTIONS as T_2023_07 } from './2023-07';
import { TRANSACTIONS as T_2023_08 } from './2023-08';
import { TRANSACTIONS as T_2023_09 } from './2023-09';
import { TRANSACTIONS as T_2023_10 } from './2023-10';
import { TRANSACTIONS as T_2023_11 } from './2023-11';
import { TRANSACTIONS as T_2023_12 } from './2023-12';
import { TRANSACTIONS as T_2024_01 } from './2024-01';
import { TRANSACTIONS as T_2024_02 } from './2024-02';
import { TRANSACTIONS as T_2024_03 } from './2024-03';
import { TRANSACTIONS as T_2024_04 } from './2024-04';
import { TRANSACTIONS as T_2024_05 } from './2024-05';
import { TRANSACTIONS as T_2024_06 } from './2024-06';
import { TRANSACTIONS as T_2024_07 } from './2024-07';
import { TRANSACTIONS as T_2024_08 } from './2024-08';
import { TRANSACTIONS as T_2024_09 } from './2024-09';
import { TRANSACTIONS as T_2024_10 } from './2024-10';
import { TRANSACTIONS as T_2024_11 } from './2024-11';
import { TRANSACTIONS as T_2024_12 } from './2024-12';
import { TRANSACTIONS as T_2025_01 } from './2025-01';
import { TRANSACTIONS as T_2025_02 } from './2025-02';
import { TRANSACTIONS as T_2025_03 } from './2025-03';
import { TRANSACTIONS as T_2025_04 } from './2025-04';
import { TRANSACTIONS as T_2025_05 } from './2025-05';
import { TRANSACTIONS as T_2025_06 } from './2025-06';
import { TRANSACTIONS as T_2025_07 } from './2025-07';
import { TRANSACTIONS as T_2025_08 } from './2025-08';
import { TRANSACTIONS as T_2025_09 } from './2025-09';
import { TRANSACTIONS as T_2025_10 } from './2025-10';
import { TRANSACTIONS as T_2025_11 } from './2025-11';
import { TRANSACTIONS as T_2025_12 } from './2025-12';
import { TRANSACTIONS as T_2026_01 } from './2026-01';
import { TRANSACTIONS as T_2026_02 } from './2026-02';

export const ALL_TRANSACTIONS: Transaction[] = [
    ...T_2023_04,
    ...T_2023_05,
    ...T_2023_06,
    ...T_2023_07,
    ...T_2023_08,
    ...T_2023_09,
    ...T_2023_10,
    ...T_2023_11,
    ...T_2023_12,
    ...T_2024_01,
    ...T_2024_02,
    ...T_2024_03,
    ...T_2024_04,
    ...T_2024_05,
    ...T_2024_06,
    ...T_2024_07,
    ...T_2024_08,
    ...T_2024_09,
    ...T_2024_10,
    ...T_2024_11,
    ...T_2024_12,
    ...T_2025_01,
    ...T_2025_02,
    ...T_2025_03,
    ...T_2025_04,
    ...T_2025_05,
    ...T_2025_06,
    ...T_2025_07,
    ...T_2025_08,
    ...T_2025_09,
    ...T_2025_10,
    ...T_2025_11,
    ...T_2025_12,
    ...T_2026_01,
    ...T_2026_02,
];

export function getAllTransactions(): Transaction[] {
    return ALL_TRANSACTIONS;
}

export function getTransactionsByMonth(year: number, month: number): Transaction[] {
    const y = year.toString();
    const m = month.toString().padStart(2, '0');
    // This is a dynamic lookup optimization could be done,
    // but for now we filter the big list or we could export a map.
    return ALL_TRANSACTIONS.filter(t => t.date.endsWith(year.toString()) && t.date.substring(3, 5) === m);
}

// --- Analytics Helpers ---

export function getMonthlyStats(year: number) {
    const stats = Array(12).fill(0).map(() => ({ income: 0, expense: 0, savings: 0 }));
    const yStr = year.toString();

    ALL_TRANSACTIONS.forEach(t => {
        if (t.date.endsWith(yStr)) {
            const monthIndex = parseInt(t.date.substring(3, 5)) - 1;
            if (monthIndex >= 0 && monthIndex < 12) {
                if (t.type === 'credit') {
                    stats[monthIndex].income += t.amount;
                } else {
                    stats[monthIndex].expense += t.amount;
                }
            }
        }
    });

    // Calculate savings
    stats.forEach(m => m.savings = m.income - m.expense);
    return stats;
}

export function getCategoryStats(year: number, type: 'credit' | 'debit') {
    const stats: Record<string, number> = {};
    const yStr = year.toString();

    ALL_TRANSACTIONS.forEach(t => {
        if (t.date.endsWith(yStr) && t.type === type) {
            const cat = t.category || 'Unknown';
            stats[cat] = (stats[cat] || 0) + t.amount;
        }
    });

    return stats;
}

export function getYearlyStats() {
    const stats: Record<number, { income: 0, expense: 0, savings: 0 }> = {};

    ALL_TRANSACTIONS.forEach(t => {
        const year = parseInt(t.date.substring(6, 10));
        if (!stats[year]) stats[year] = { income: 0, expense: 0, savings: 0 };

        if (t.type === 'credit') {
            stats[year].income += t.amount;
        } else {
            stats[year].expense += t.amount;
        }
    });

    Object.values(stats).forEach((s: any) => s.savings = s.income - s.expense);
    return stats;
}

export function getFinancialYears(): number[] {
    const years = new Set<number>();
    ALL_TRANSACTIONS.forEach(t => years.add(parseInt(t.date.substring(6, 10))));
    return Array.from(years).sort((a, b) => b - a);
}

