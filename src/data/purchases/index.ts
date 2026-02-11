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

export default PURCHASES;
