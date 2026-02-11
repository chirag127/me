export interface Purchase {
    id: string;
    name: string;
    category: 'electronics' | 'clothing' | 'food' | 'accessories' | 'home' | 'books' | 'other';
    price: number;
    deliveryFee?: number;
    color?: string;
    size?: string;
    status: 'delivered' | 'refunded' | 'cancelled' | 'exchanged' | 'replaced';
    date: string; // YYYY-MM-DD
    platform: 'flipkart' | 'amazon' | 'deodap' | 'other';
    refundReason?: string;
    qty?: number;
}
