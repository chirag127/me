/**
 * Gear - Current and historical tech stack/setup
 * Based on actual Flipkart and Amazon purchase history
 */

export interface GearItem {
    name: string;
    category: 'hardware' | 'software' | 'service' | 'accessory';
    brand?: string;
    model?: string;
    specs?: string;
    price?: number;
    acquiredDate?: string;
    retiredDate?: string;
    current: boolean;
    icon: string;
    platform?: 'flipkart' | 'amazon' | 'other';
    link?: string;
}

export interface GearCategory {
    name: string;
    icon: string;
    items: GearItem[];
}

export const GEAR: GearCategory[] = [
    {
        name: 'Computers',
        icon: '💻',
        items: [
            {
                name: 'Primary Laptop',
                category: 'hardware',
                brand: 'Infinix',
                model: 'Zero Book Ultra AI PC',
                specs: 'Intel Core Ultra 5, 16GB RAM, 512GB SSD',
                price: 57403,
                acquiredDate: '2025-09-24',
                current: true,
                icon: '💻',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Mobile Devices',
        icon: '📱',
        items: [
            {
                name: 'Primary Phone',
                category: 'hardware',
                brand: 'POCO',
                model: 'F7 5G',
                specs: '512GB, Cyber Silver Edition',
                price: 32241,
                acquiredDate: '2025-09-30',
                current: true,
                icon: '📱',
                platform: 'flipkart',
            },
            {
                name: 'Previous Phone',
                category: 'hardware',
                brand: 'Infinix',
                model: 'Note 12 Pro 5G',
                specs: '128GB, Snowfall',
                price: 15028,
                acquiredDate: '2022-09-24',
                retiredDate: '2025-09-30',
                current: false,
                icon: '📱',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Audio',
        icon: '🎧',
        items: [
            {
                name: 'Wireless Earphones',
                category: 'accessory',
                brand: 'realme',
                model: 'Buds Wireless 5 ANC',
                specs: '50dB ANC, 38hrs Playback, IP55',
                price: 1599,
                acquiredDate: '2026-02-14',
                current: true,
                icon: '🎧',
                platform: 'amazon',
            },
            {
                name: 'Neckband',
                category: 'accessory',
                brand: 'boAt',
                model: 'Rockerz 150 Pro',
                specs: '150hrs Playback, Dual EQ Modes',
                price: 1399,
                acquiredDate: '2026-02-14',
                current: true,
                icon: '🎧',
                platform: 'amazon',
            },
            {
                name: 'Bluetooth Headset',
                category: 'accessory',
                brand: 'boAt',
                model: 'Rockerz 255F Pro+',
                specs: 'Bluetooth, Black',
                price: 899,
                acquiredDate: '2021-10-12',
                current: true,
                icon: '🎧',
                platform: 'flipkart',
            },
            {
                name: 'TWS Earbuds',
                category: 'accessory',
                brand: 'truke',
                model: 'Buds A1',
                specs: '30dB ANC, Quad Mic',
                price: 899,
                acquiredDate: '2023-10-19',
                current: true,
                icon: '🎧',
                platform: 'flipkart',
            },
            {
                name: 'ANC Headphones',
                category: 'accessory',
                brand: 'Boult Audio',
                model: 'Curve ANC',
                specs: 'Active Noise Cancellation',
                price: 1299,
                acquiredDate: '2023-04-03',
                current: true,
                icon: '🎧',
                platform: 'flipkart',
            },
            {
                name: 'Wired Earphones',
                category: 'accessory',
                brand: 'PHILIPS',
                model: 'C-Type Audio',
                specs: 'Gold, USB-C',
                price: 198,
                acquiredDate: '2025-11-26',
                current: true,
                icon: '🎧',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Peripherals',
        icon: '🖱️',
        items: [
            {
                name: 'Keyboard & Mouse Combo',
                category: 'accessory',
                brand: 'Flipkart SmartBuy',
                model: 'Wireless Combo',
                specs: 'Laptop-size, Black',
                price: 762,
                acquiredDate: '2022-07-07',
                current: true,
                icon: '⌨️',
                platform: 'flipkart',
            },
            {
                name: 'Mouse',
                category: 'accessory',
                brand: 'ZEBRONICS',
                model: 'Zeb-Power',
                specs: 'Wired Optical, Black',
                price: 128,
                acquiredDate: '2022-10-01',
                current: true,
                icon: '🖱️',
                platform: 'flipkart',
            },
            {
                name: 'USB Hub',
                category: 'accessory',
                brand: 'QHMPL',
                model: 'QHM6660',
                specs: '4-Port USB Hub',
                price: 189,
                acquiredDate: '2022-10-02',
                current: true,
                icon: '�',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Networking',
        icon: '📡',
        items: [
            {
                name: 'Wi-Fi Router',
                category: 'hardware',
                brand: 'Xiaomi',
                model: 'Mi 4A',
                specs: '1200 Mbps, MU-MIMO Gigabit',
                price: 1232,
                acquiredDate: '2022-10-02',
                current: true,
                icon: '�',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Storage',
        icon: '💾',
        items: [
            {
                name: 'MicroSD Card',
                category: 'accessory',
                brand: 'Samsung',
                model: 'EVO Plus',
                specs: '512GB, Class 10',
                price: 3512,
                acquiredDate: '2024-11-03',
                current: true,
                icon: '💾',
                platform: 'flipkart',
            },
            {
                name: 'USB Flash Drive',
                category: 'accessory',
                brand: 'SanDisk',
                model: 'Cruzer Blade',
                specs: '32GB, USB 2.0',
                price: 286,
                acquiredDate: '2021-10-22',
                current: true,
                icon: '💾',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Power & Charging',
        icon: '🔋',
        items: [
            {
                name: 'GaN Charger',
                category: 'accessory',
                brand: 'CMF by Nothing',
                model: '100W Power GaN',
                specs: '3 Port, Orange',
                price: 2993,
                acquiredDate: '2025-09-26',
                current: true,
                icon: '🔌',
                platform: 'flipkart',
            },
            {
                name: 'Mobile Charger',
                category: 'accessory',
                brand: 'Amazon Basics',
                model: '12W Dual Port',
                specs: 'Type-C Cable included',
                price: 229,
                acquiredDate: '2026-02-10',
                current: true,
                icon: '🔌',
                platform: 'amazon',
            },
            {
                name: 'Power Strip',
                category: 'accessory',
                brand: 'Portronics',
                model: 'Power Plate 7',
                specs: '2500W, 6 Socket, Black',
                price: 591,
                acquiredDate: '2025-09-30',
                current: true,
                icon: '🔌',
                platform: 'flipkart',
            },
            {
                name: 'Power Strip',
                category: 'accessory',
                brand: 'Portronics',
                model: 'Power Plate 10',
                specs: '1500W Multi Plug, Black',
                price: 302,
                acquiredDate: '2025-06-14',
                current: true,
                icon: '🔌',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Home Entertainment',
        icon: '📺',
        items: [
            {
                name: 'Smart TV',
                category: 'hardware',
                brand: 'realme',
                model: '32 inch HD Ready LED Smart TV',
                specs: '80cm, Black',
                price: 12999,
                acquiredDate: '2021-10-06',
                current: true,
                icon: '📺',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Home Appliances',
        icon: '🏠',
        items: [
            {
                name: 'Washing Machine',
                category: 'hardware',
                brand: 'realme TechLife',
                model: '8kg 5 Star',
                specs: 'Garment Steamer, Grey',
                price: 15990,
                acquiredDate: '2021-10-21',
                current: true,
                icon: '🧺',
                platform: 'flipkart',
            },
            {
                name: 'Pressure Cooker',
                category: 'hardware',
                brand: 'Pigeon',
                model: 'Favourite 3L',
                specs: 'Aluminium, Non-Induction',
                price: 608,
                acquiredDate: '2026-02-14',
                current: true,
                icon: '🍲',
                platform: 'amazon',
            },
            {
                name: 'Beard Trimmer',
                category: 'hardware',
                brand: 'realme',
                model: 'RMH2016',
                specs: '120 min Runtime, Black',
                price: 898,
                acquiredDate: '2021-10-19',
                current: true,
                icon: '✂️',
                platform: 'flipkart',
            },
        ],
    },
    {
        name: 'Development',
        icon: '🛠️',
        items: [
            {
                name: 'Primary IDE',
                category: 'software',
                brand: 'JetBrains',
                model: 'PyCharm Professional',
                current: true,
                icon: '🐍',
            },
            {
                name: 'Code Editor',
                category: 'software',
                brand: 'Microsoft',
                model: 'VS Code',
                current: true,
                icon: '📝',
            },
            {
                name: 'Terminal',
                category: 'software',
                model: 'Windows Terminal + PowerShell 7',
                current: true,
                icon: '💻',
            },
            {
                name: 'AI Assistant',
                category: 'software',
                brand: 'Google',
                model: 'Gemini / Augment',
                current: true,
                icon: '🤖',
            },
        ],
    },
    {
        name: 'Services',
        icon: '☁️',
        items: [
            {
                name: 'Cloud Provider',
                category: 'service',
                brand: 'Cloudflare',
                model: 'Pages + Workers',
                current: true,
                icon: '☁️',
            },
            {
                name: 'Version Control',
                category: 'service',
                brand: 'GitHub',
                current: true,
                icon: '🐙',
            },
            {
                name: 'Music Streaming',
                category: 'service',
                brand: 'Spotify',
                current: true,
                icon: '🎵',
            },
            {
                name: 'Video Streaming',
                category: 'service',
                brand: 'YouTube Premium',
                current: true,
                icon: '📺',
            },
        ],
    },
];

// Get current gear only
export function getCurrentGear(): GearItem[] {
    return GEAR.flatMap(cat => cat.items.filter(item => item.current));
}

// Get gear history (retired items)
export function getGearHistory(): GearItem[] {
    return GEAR.flatMap(cat => cat.items.filter(item => !item.current));
}

// Get gear by category name
export function getGearByCategory(categoryName: string): GearItem[] {
    const category = GEAR.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    return category ? category.items : [];
}

// Calculate total gear investment
export function getTotalGearValue(): number {
    return GEAR.flatMap(cat => cat.items)
        .filter(item => item.current && item.price)
        .reduce((sum, item) => sum + (item.price || 0), 0);
}

export default GEAR;
