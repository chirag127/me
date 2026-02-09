/**
 * Purchases - Shopping history and order tracking
 * Data from Flipkart and other e-commerce platforms
 */

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
    platform: 'flipkart' | 'amazon' | 'other';
    refundReason?: string;
}

export const PURCHASES: Purchase[] = [
    // 2026
    { id: 'fk-2026-01', name: 'Hambler Men EXTRA SOFT slippers', category: 'clothing', price: 90, deliveryFee: 6, color: 'Green', size: '10', status: 'delivered', date: '2026-01-14', platform: 'flipkart' },
    { id: 'fk-2026-02', name: 'Hambler Men EXTRA SOFT slippers', category: 'clothing', price: 91, deliveryFee: 6, color: 'Green', size: '10', status: 'delivered', date: '2026-01-14', platform: 'flipkart' },

    // 2025 - Electronics
    { id: 'fk-2025-poco', name: 'POCO F7 5G (512 GB)', category: 'electronics', price: 32241, color: 'Cyber Silver Edition', status: 'delivered', date: '2025-09-30', platform: 'flipkart' },
    { id: 'fk-2025-poco-refund', name: 'POCO F7 5G (512 GB)', category: 'electronics', price: 32241, color: 'Cyber Silver Edition', status: 'refunded', date: '2025-09-29', platform: 'flipkart' },
    { id: 'fk-2025-infinix', name: 'Infinix Zero Book Ultra AI PC Intel Core Ultra 5', category: 'electronics', price: 57403, color: 'Silver', status: 'delivered', date: '2025-09-24', platform: 'flipkart' },
    { id: 'fk-2025-laptop-protection', name: 'Complete Laptop Protection', category: 'electronics', price: 1952, status: 'delivered', date: '2025-09-24', platform: 'flipkart' },
    { id: 'fk-2025-cmf-charger', name: 'CMF by Nothing 100W Power GaN 5A 3 Port Charger', category: 'electronics', price: 2993, deliveryFee: 6, color: 'Orange', status: 'delivered', date: '2025-09-26', platform: 'flipkart' },
    { id: 'fk-2025-philips', name: 'PHILIPS Wired Earphones with C-Type Audio', category: 'electronics', price: 198, deliveryFee: 5, color: 'Gold', status: 'delivered', date: '2025-11-26', platform: 'flipkart' },

    // 2025 - Power & Accessories
    { id: 'fk-2025-power-plate-7', name: 'Portronics Power Plate 7 2500W 6+ Socket', category: 'electronics', price: 591, color: 'Black', status: 'delivered', date: '2025-09-30', platform: 'flipkart' },
    { id: 'fk-2025-power-plate-10', name: 'Portronics Power Plate 10 Multi Plug 1500W', category: 'electronics', price: 302, color: 'Black', status: 'delivered', date: '2025-06-14', platform: 'flipkart' },
    { id: 'fk-2025-led-bulb', name: 'Flipkart SmartBuy 9W LED Bulb', category: 'home', price: 252, deliveryFee: 7, status: 'delivered', date: '2025-09-12', platform: 'flipkart' },

    // 2025 - Clothing
    { id: 'fk-2025-trousers-black', name: 'COMBRAIDED Slim Fit Men Black Trousers', category: 'clothing', price: 231, deliveryFee: 14, color: 'Black', size: '36', status: 'delivered', date: '2025-09-28', platform: 'flipkart' },
    { id: 'fk-2025-trousers-indiclub', name: 'INDICLUB Slim Fit Men Black Trousers', category: 'clothing', price: 256, color: 'Black', size: '36', status: 'delivered', date: '2025-05-31', platform: 'flipkart' },
    { id: 'fk-2025-trousers-blue', name: 'COMBRAIDED Slim Fit Men Blue Trousers', category: 'clothing', price: 240, color: 'Blue', size: '36', status: 'delivered', date: '2025-05-31', platform: 'flipkart' },
    { id: 'fk-2025-polo', name: 'MOD YOUNG Solid Men Polo Neck Multicolor', category: 'clothing', price: 433, color: 'Multicolor', size: '3XL', status: 'delivered', date: '2025-05-31', platform: 'flipkart' },
    { id: 'fk-2025-kurta', name: 'DSK STUDIO Women Floral Print Straight Kurta', category: 'clothing', price: 106, color: 'Blue', size: 'XL', status: 'delivered', date: '2025-09-27', platform: 'flipkart' },
    { id: 'fk-2025-bata-shoes', name: 'Bata Casual Shoes for Men', category: 'clothing', price: 306, color: 'Black', size: '10', status: 'delivered', date: '2025-09-28', platform: 'flipkart' },
    { id: 'fk-2025-aadi-shoes', name: 'aadi Synthetic Leather For Men', category: 'clothing', price: 395, color: 'Black', size: '10', status: 'delivered', date: '2025-06-10', platform: 'flipkart' },
    { id: 'fk-2025-shirt-white', name: 'RUDHAARI Men Solid Formal White Shirt', category: 'clothing', price: 272, color: 'White', size: '3XL', status: 'delivered', date: '2025-06-01', platform: 'flipkart' },
    { id: 'fk-2025-shirt-blue', name: 'VTEXX Men Solid Formal Light Blue Shirt', category: 'clothing', price: 373, color: 'Light Blue', size: '4XL', status: 'delivered', date: '2025-06-01', platform: 'flipkart' },

    // 2025 - Travel
    { id: 'fk-2025-luggage', name: 'ARISTOCRAT 3P Set (Cabin+Medium+Large)', category: 'accessories', price: 6049, color: 'Blue', status: 'delivered', date: '2025-05-30', platform: 'flipkart' },

    // 2025 - Food
    { id: 'fk-2025-horlicks-1', name: 'HORLICKS Chocolate Delight Flavor', category: 'food', price: 210, deliveryFee: 12, status: 'delivered', date: '2025-09-30', platform: 'flipkart' },
    { id: 'fk-2025-horlicks-2', name: 'HORLICKS Chocolate Delight Flavor', category: 'food', price: 229, status: 'delivered', date: '2025-09-25', platform: 'flipkart' },
    { id: 'fk-2025-peanut-butter', name: 'Saffola Peanut Butter with Jaggery, Crunchy', category: 'food', price: 178, deliveryFee: 11, status: 'delivered', date: '2025-09-30', platform: 'flipkart' },
    { id: 'fk-2025-choco-flakes', name: 'Kwality Choco Flakes, Whole Wheat', category: 'food', price: 188, deliveryFee: 11, status: 'delivered', date: '2025-10-09', platform: 'flipkart' },
    { id: 'fk-2025-muesli', name: 'Kwality Crunchy Muesli Almonds, Raisins', category: 'food', price: 213, deliveryFee: 13, status: 'delivered', date: '2025-10-06', platform: 'flipkart' },

    // 2025 - Home
    { id: 'fk-2025-lota', name: 'Finetouch Stainless Steel Lota', category: 'home', price: 149, deliveryFee: 8, color: 'Steel', status: 'delivered', date: '2025-10-10', platform: 'flipkart' },
    { id: 'fk-2025-pillow', name: 'Flipkart SmartBuy Polyester Fibre Solid Pillow', category: 'home', price: 165, color: 'White', status: 'delivered', date: '2025-09-24', platform: 'flipkart' },
    { id: 'fk-2025-coffee-set', name: 'SPEACK Coffee Lovers Preferable Choice', category: 'home', price: 216, color: 'Multicolor', status: 'delivered', date: '2025-06-15', platform: 'flipkart' },

    // 2025 - Accessories
    { id: 'fk-2025-headphone-case', name: 'StealODeal Polyester Zipper Headphone Case', category: 'accessories', price: 372, color: 'Black', status: 'delivered', date: '2025-09-23', platform: 'flipkart' },
    { id: 'fk-2025-uber-1', name: 'Uber Digital Gift Card', category: 'other', price: 100, status: 'delivered', date: '2025-09-25', platform: 'flipkart' },
    { id: 'fk-2025-uber-2', name: 'Uber Digital Gift Card', category: 'other', price: 100, status: 'delivered', date: '2025-09-25', platform: 'flipkart' },

    // 2024
    { id: 'fk-2024-samsung-sd', name: 'SAMSUNG EVO Plus 512GB MicroSDXC', category: 'electronics', price: 3512, color: 'White', status: 'delivered', date: '2024-11-03', platform: 'flipkart' },
    { id: 'fk-2024-tshirt', name: 'TRIPR Solid Men V Neck Multicolor T-Shirt', category: 'clothing', price: 252, color: 'Black,White,Grey', size: 'XXL', status: 'delivered', date: '2024-12-08', platform: 'flipkart' },
    { id: 'fk-2024-led-bulb', name: 'Wipro 10W Standard B22 LED Bulb', category: 'home', price: 400, deliveryFee: 16, status: 'delivered', date: '2024-09-29', platform: 'flipkart' },
    { id: 'fk-2024-jeans', name: 'METRONAUT Skinny Men Blue Jeans', category: 'clothing', price: 421, deliveryFee: 15, color: 'Blue', size: '32', status: 'delivered', date: '2024-04-15', platform: 'flipkart' },

    // 2023
    { id: 'fk-2023-polo', name: 'METRONAUT Solid Men Polo Neck Dark Blue', category: 'clothing', price: 275, deliveryFee: 9, color: 'Dark Blue', size: 'L', status: 'delivered', date: '2023-10-15', platform: 'flipkart' },
    { id: 'fk-2023-truke-buds', name: 'truke Buds A1 with 30dB ANC', category: 'electronics', price: 899, color: 'Blue', status: 'delivered', date: '2023-10-19', platform: 'flipkart' },
    { id: 'fk-2023-led-syska-1', name: 'Syska 9W Standard B22 LED Bulb', category: 'home', price: 440, deliveryFee: 10, status: 'delivered', date: '2023-10-14', platform: 'flipkart' },
    { id: 'fk-2023-led-syska-2', name: 'Syska 9W Standard B22 LED Bulb', category: 'home', price: 382, color: 'white', status: 'delivered', date: '2023-06-12', platform: 'flipkart' },
    { id: 'fk-2023-jeans', name: 'Marsh-X Slim Men Dark Blue Jeans', category: 'clothing', price: 379, color: 'Dark Blue', size: '32', status: 'delivered', date: '2023-06-01', platform: 'flipkart' },
    { id: 'fk-2023-boult', name: 'Boult Audio Curve ANC Headphones', category: 'electronics', price: 1299, color: 'Black', status: 'delivered', date: '2023-04-03', platform: 'flipkart' },
    { id: 'fk-2023-trousers', name: 'METRONAUT Slim Fit Men Polycotton Black', category: 'clothing', price: 429, color: 'Black', size: '34', status: 'delivered', date: '2023-02-28', platform: 'flipkart' },

    // 2022
    { id: 'fk-2022-infinix', name: 'Infinix Note 12 Pro 5G (128GB)', category: 'electronics', price: 15028, color: 'Snowfall', status: 'delivered', date: '2022-09-24', platform: 'flipkart' },
    { id: 'fk-2022-shirt', name: 'METRONAUT Men Checkered Casual Shirt', category: 'clothing', price: 259, color: 'Multicolor', size: 'L', status: 'delivered', date: '2022-10-02', platform: 'flipkart' },
    { id: 'fk-2022-mouse', name: 'ZEBRONICS Zeb-Power Wired Optical Mouse', category: 'electronics', price: 128, color: 'Black', status: 'delivered', date: '2022-10-01', platform: 'flipkart' },
    { id: 'fk-2022-router', name: 'Mi 4A Wireless MU-MIMO Gigabit Router 1200 Mbps', category: 'electronics', price: 1232, color: 'White', status: 'delivered', date: '2022-10-02', platform: 'flipkart' },
    { id: 'fk-2022-usb-hub', name: 'QHMPL QUANTUM QHM6660 USB Hub', category: 'electronics', price: 189, color: 'Black', status: 'delivered', date: '2022-10-02', platform: 'flipkart' },
    { id: 'fk-2022-keyboard', name: 'Flipkart SmartBuy Wireless Keyboard & Mouse', category: 'electronics', price: 762, deliveryFee: 40, color: 'Black', status: 'delivered', date: '2022-07-07', platform: 'flipkart' },
    { id: 'fk-2022-hoppup', name: 'HOPPUP GRAND With Power Bank Function', category: 'electronics', price: 499, color: 'Black', status: 'delivered', date: '2022-09-28', platform: 'flipkart' },

    // 2021
    { id: 'fk-2021-washing', name: 'realme TechLife 8kg 5 Star Garment Steamer Washing Machine', category: 'home', price: 15990, color: 'Grey', status: 'delivered', date: '2021-10-21', platform: 'flipkart' },
    { id: 'fk-2021-trimmer', name: 'realme RMH2016 Beard Trimmer (120 min Runtime)', category: 'electronics', price: 898, color: 'Black', status: 'delivered', date: '2021-10-19', platform: 'flipkart' },
    { id: 'fk-2021-polo', name: 'M7 By Metronaut Striped Men Polo Neck', category: 'clothing', price: 307, deliveryFee: 17, color: 'Multicolor', size: 'L', status: 'delivered', date: '2021-10-23', platform: 'flipkart' },
    { id: 'fk-2021-usb-cable', name: 'Flipkart SmartBuy USB Type C Cable (1m)', category: 'electronics', price: 74, deliveryFee: 5, color: 'Black', status: 'delivered', date: '2021-10-19', platform: 'flipkart' },
    { id: 'fk-2021-pendrive', name: 'SanDisk Cruzer Blade USB 2.0 32GB Flash Drive', category: 'electronics', price: 286, color: 'Red,Black', status: 'delivered', date: '2021-10-22', platform: 'flipkart' },
    { id: 'fk-2021-micro-cable', name: 'Portronics Konnect Core 1M Micro USB Cable', category: 'electronics', price: 65, color: 'Black', status: 'delivered', date: '2021-10-19', platform: 'flipkart' },
    { id: 'fk-2021-tv', name: 'realme 80cm (32 inch) HD Ready LED Smart TV', category: 'electronics', price: 12999, color: 'Black', status: 'delivered', date: '2021-10-06', platform: 'flipkart' },
    { id: 'fk-2021-boat', name: 'boAt Rockerz 255F Pro+ Bluetooth Headset', category: 'electronics', price: 899, color: 'Black', status: 'delivered', date: '2021-10-12', platform: 'flipkart' },
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

export default PURCHASES;
