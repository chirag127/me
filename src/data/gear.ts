/**
 * Gear - Current and historical tech stack/setup
 */

export interface GearItem {
    name: string;
    category: 'hardware' | 'software' | 'service' | 'accessory';
    brand?: string;
    model?: string;
    specs?: string;
    acquiredDate?: string;
    retiredDate?: string;
    current: boolean;
    icon: string;
    link?: string;
}

export interface GearCategory {
    name: string;
    icon: string;
    items: GearItem[];
}

export const GEAR: GearCategory[] = [
    {
        name: 'Computer',
        icon: '💻',
        items: [
            {
                name: 'Primary Laptop',
                category: 'hardware',
                brand: 'Dell',
                model: 'Inspiron 15',
                specs: 'Intel i7, 16GB RAM, 512GB SSD',
                acquiredDate: '2023-01',
                current: true,
                icon: '💻',
            },
        ],
    },
    {
        name: 'Peripherals',
        icon: '🖱️',
        items: [
            {
                name: 'Keyboard',
                category: 'accessory',
                brand: 'Logitech',
                model: 'K380',
                acquiredDate: '2023-06',
                current: true,
                icon: '⌨️',
            },
            {
                name: 'Mouse',
                category: 'accessory',
                brand: 'Logitech',
                model: 'M585',
                acquiredDate: '2023-06',
                current: true,
                icon: '🖱️',
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

export default GEAR;
