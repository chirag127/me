import { AMAZON_PURCHASES } from './amazon';
import { FLIPKART_PURCHASES } from './flipkart';
import { DEODAP_PURCHASES } from './deodap';

import type { Purchase } from './types';
export type { Purchase } from './types';

export const PURCHASES: Purchase[] = [
    ...AMAZON_PURCHASES,
    ...FLIPKART_PURCHASES,
    ...DEODAP_PURCHASES,
];

// Helper functions
export function getPurchasesByCategory(category: Purchase['category']): Purchase[] {
    return PURCHASES.filter(p => p.category === category && p.status === 'delivered');
}

export function getPurchasesByYear(year: number): Purchase[] {
    return PURCHASES.filter(p => p.date.startsWith(String(year)));
}

export function getDeliveredPurchases(): Purchase[] {
    return PURCHASES.filter(p => p.status === 'delivered');
}

export function getTotalSpent(year?: number): number {
    const purchases = year ? getPurchasesByYear(year) : PURCHASES;
    return purchases
        .filter(p => p.status === 'delivered')
        .reduce((sum, p) => sum + p.price + (p.deliveryFee || 0), 0);
}

export function getSpendingByCategory(): Record<string, number> {
    const spending: Record<string, number> = {};
    PURCHASES.filter(p => p.status === 'delivered').forEach(p => {
        spending[p.category] = (spending[p.category] || 0) + p.price + (p.deliveryFee || 0);
    });
    return spending;
}

export function getRecentPurchases(count: number = 10): Purchase[] {
    return [...PURCHASES]
        .filter(p => p.status === 'delivered')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, count);
}

export function getSpendingByPlatform(): Record<string, number> {
    const spending: Record<string, number> = {};
    PURCHASES.filter(p => p.status === 'delivered').forEach(p => {
        spending[p.platform] = (spending[p.platform] || 0) + p.price + (p.deliveryFee || 0);
    });
    return spending;
}

export function getPurchasesByPlatform(platform: Purchase['platform']): Purchase[] {
    return PURCHASES.filter(p => p.platform === platform && p.status === 'delivered');
}

/** Monthly spending breakdown for a given year: { '01': 1234, '02': 5678, ... } */
export function getSpendingByMonth(year: number): Record<string, number> {
    const spending: Record<string, number> = {};
    for (let m = 1; m <= 12; m++) {
        spending[String(m).padStart(2, '0')] = 0;
    }
    PURCHASES.filter(p => p.status === 'delivered' && p.date.startsWith(String(year))).forEach(p => {
        const month = p.date.substring(5, 7);
        spending[month] = (spending[month] || 0) + p.price + (p.deliveryFee || 0);
    });
    return spending;
}

/** Yearly spending totals: { 2021: ..., 2022: ..., ... } */
export function getSpendingByYearMap(): Record<number, number> {
    const spending: Record<number, number> = {};
    PURCHASES.filter(p => p.status === 'delivered').forEach(p => {
        const year = parseInt(p.date.substring(0, 4));
        spending[year] = (spending[year] || 0) + p.price + (p.deliveryFee || 0);
    });
    return spending;
}

/** Count of purchases by status */
export function getPurchaseCountByStatus(): Record<string, number> {
    const counts: Record<string, number> = {};
    PURCHASES.forEach(p => {
        counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
}

/** Average order value for delivered purchases */
export function getAverageOrderValue(): number {
    const delivered = getDeliveredPurchases();
    if (delivered.length === 0) return 0;
    const total = delivered.reduce((sum, p) => sum + p.price + (p.deliveryFee || 0), 0);
    return Math.round(total / delivered.length);
}

/** Top N most expensive purchases */
export function getTopPurchases(count: number = 10): Purchase[] {
    return [...PURCHASES]
        .filter(p => p.status === 'delivered')
        .sort((a, b) => (b.price + (b.deliveryFee || 0)) - (a.price + (a.deliveryFee || 0)))
        .slice(0, count);
}

/** Get all unique years that have purchases */
export function getPurchaseYears(): number[] {
    const years = new Set<number>();
    PURCHASES.forEach(p => years.add(parseInt(p.date.substring(0, 4))));
    return [...years].sort((a, b) => b - a);
}

/** Count of items purchased per month for a given year */
export function getItemCountByMonth(year: number): Record<string, number> {
    const counts: Record<string, number> = {};
    for (let m = 1; m <= 12; m++) {
        counts[String(m).padStart(2, '0')] = 0;
    }
    PURCHASES.filter(p => p.status === 'delivered' && p.date.startsWith(String(year))).forEach(p => {
        const month = p.date.substring(5, 7);
        counts[month] = (counts[month] || 0) + 1;
    });
    return counts;
}

export default PURCHASES;
