/**
 * Project Me — React Router Configuration
 * All routes with React.lazy() code-splitting,
 * grouped by drive
 */

import { lazy, type ComponentType } from 'react';

/* ===== Route Type ===== */
export interface RouteConfig {
    path: string;
    name: string;
    icon: string;
    Component: React.LazyExoticComponent<ComponentType>;
    drive: string;
    breadcrumb: string[];
    category?: string;
}

/* ===== Helper ===== */
const p = (
    importFn: () => Promise<{ default: ComponentType }>
) => lazy(importFn);

/* ===== All Routes ===== */
export const routes: RouteConfig[] = [
    /* ── ME Drive ──────────────────────── */
    {
        path: '/me', name: 'Dashboard', icon: '🏠',
        Component: p(
            () => import('@pages/me/Dashboard')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Dashboard'],
        category: 'Home',
    },
    {
        path: '/me/story', name: 'Story', icon: '📖',
        Component: p(
            () => import('@pages/me/Story')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Story'],
        category: 'About',
    },
    {
        path: '/me/philosophy', name: 'Philosophy',
        icon: '🧠',
        Component: p(
            () => import('@pages/me/Philosophy')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Philosophy'],
        category: 'About',
    },
    {
        path: '/me/journal', name: 'Write', icon: '✍️',
        Component: p(
            () => import('@pages/me/Journal')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Journal', 'Write'],
        category: 'Journal',
    },
    {
        path: '/me/journal-feed', name: 'Feed',
        icon: '📰',
        Component: p(
            () => import('@pages/me/JournalFeed')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Journal', 'Feed'],
        category: 'Journal',
    },
    {
        path: '/me/journal-charts', name: 'Analytics',
        icon: '📊',
        Component: p(
            () => import('@pages/me/JournalCharts')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Journal', 'Analytics'],
        category: 'Journal',
    },
    {
        path: '/me/interests', name: 'Interests',
        icon: '💡',
        Component: p(
            () => import('@pages/me/Interests')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Interests'],
        category: 'Interests',
    },
    {
        path: '/me/passions', name: 'Passions',
        icon: '❤️',
        Component: p(
            () => import('@pages/me/Passions')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Passions'],
        category: 'Interests',
    },
    {
        path: '/me/hobbies', name: 'Hobbies',
        icon: '🎯',
        Component: p(
            () => import('@pages/me/Hobbies')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Hobbies'],
        category: 'Interests',
    },
    {
        path: '/me/gear', name: 'Gear', icon: '⚙️',
        Component: p(
            () => import('@pages/me/Gear')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Gear'],
        category: 'Setup',
    },
    {
        path: '/me/travel', name: 'Travel',
        icon: '✈️',
        Component: p(
            () => import('@pages/me/Travel')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Travel'],
        category: 'Setup',
    },
    {
        path: '/me/purchases', name: 'Purchases',
        icon: '🛒',
        Component: p(
            () => import('@pages/me/Purchases')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Purchases'],
        category: 'Setup',
    },
    {
        path: '/me/purchase-analytics',
        name: 'Purchase Analytics', icon: '📊',
        Component: p(
            () => import('@pages/me/PurchaseAnalytics')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Purchases', 'Analytics'],
        category: 'Setup',
    },
    {
        path: '/me/finance', name: 'Finance',
        icon: '💰',
        Component: p(
            () => import('@pages/me/FinancialAnalytics')
        ),
        drive: 'ME',
        breadcrumb: ['Me', 'Finance'],
        category: 'Setup',
    },

    /* ── WORK Drive ────────────────────── */
    {
        path: '/work', name: 'Summary', icon: '💼',
        Component: p(
            () => import('@pages/work/Summary')
        ),
        drive: 'WORK',
        breadcrumb: ['Work', 'Summary'],
        category: 'Resume',
    },
    {
        path: '/work/history', name: 'Experience',
        icon: '📋',
        Component: p(
            () => import('@pages/work/Experience')
        ),
        drive: 'WORK',
        breadcrumb: ['Work', 'Experience'],
        category: 'Career',
    },
    {
        path: '/work/tcs', name: 'TCS', icon: '🏢',
        Component: p(
            () => import('@pages/work/TCS')
        ),
        drive: 'WORK',
        breadcrumb: ['Work', 'TCS'],
        category: 'Career',
    },
    {
        path: '/work/skills', name: 'Skills',
        icon: '🎯',
        Component: p(
            () => import('@pages/work/Skills')
        ),
        drive: 'WORK',
        breadcrumb: ['Work', 'Skills'],
        category: 'Capabilities',
    },
    {
        path: '/work/projects', name: 'Projects',
        icon: '🚀',
        Component: p(
            () => import('@pages/work/Projects')
        ),
        drive: 'WORK',
        breadcrumb: ['Work', 'Projects'],
        category: 'Capabilities',
    },
    {
        path: '/work/services', name: 'Services',
        icon: '🛠️',
        Component: p(
            () => import('@pages/work/Services')
        ),
        drive: 'WORK',
        breadcrumb: ['Work', 'Services'],
        category: 'Capabilities',
    },
    {
        path: '/work/education', name: 'Education',
        icon: '🎓',
        Component: p(
            () => import('@pages/work/Education')
        ),
        drive: 'WORK',
        breadcrumb: ['Work', 'Education'],
        category: 'Credentials',
    },
    {
        path: '/work/certs', name: 'Certifications',
        icon: '🏆',
        Component: p(
            () => import('@pages/work/Certs')
        ),
        drive: 'WORK',
        breadcrumb: ['Work', 'Certifications'],
        category: 'Credentials',
    },

    /* ── CODE Drive ────────────────────── */
    {
        path: '/code', name: 'Stats', icon: '📊',
        Component: p(
            () => import('@pages/code/Stats')
        ),
        drive: 'CODE',
        breadcrumb: ['Code', 'Stats'],
        category: 'Analytics',
    },
    {
        path: '/code/leetcode', name: 'LeetCode',
        icon: '🧩',
        Component: p(
            () => import('@pages/code/LeetCode')
        ),
        drive: 'CODE',
        breadcrumb: ['Code', 'LeetCode'],
        category: 'Analytics',
    },
    {
        path: '/code/stack', name: 'Reputation',
        icon: '🏅',
        Component: p(
            () => import('@pages/code/Reputation')
        ),
        drive: 'CODE',
        breadcrumb: ['Code', 'Reputation'],
        category: 'Analytics',
    },
    {
        path: '/code/repos', name: 'Repos',
        icon: '📁',
        Component: p(
            () => import('@pages/code/Repos')
        ),
        drive: 'CODE',
        breadcrumb: ['Code', 'Repos'],
        category: 'Portfolio',
    },
    {
        path: '/code/npm', name: 'NPM', icon: '📦',
        Component: p(
            () => import('@pages/code/NPM')
        ),
        drive: 'CODE',
        breadcrumb: ['Code', 'NPM'],
        category: 'Portfolio',
    },
    {
        path: '/code/json', name: 'Resume JSON',
        icon: '📄',
        Component: p(
            () => import('@pages/code/ResumeJSON')
        ),
        drive: 'CODE',
        breadcrumb: ['Code', 'Resume JSON'],
        category: 'Portfolio',
    },

    /* ── LIBRARY Drive ─────────────────── */
    {
        path: '/library', name: 'Hub', icon: '📚',
        Component: p(
            () => import('@pages/library/Hub')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Hub'],
        category: 'Overview',
    },
    {
        path: '/library/watch',
        name: 'Watch Hub', icon: '🎬',
        Component: p(
            () => import('@pages/library/WatchHub')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Watch'],
        category: 'Movies & TV',
    },
    {
        path: '/library/music', name: 'Music Hub',
        icon: '🎵',
        Component: p(
            () => import('@pages/library/MusicHub')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Music'],
        category: 'Music',
    },
    {
        path: '/library/books', name: 'Books',
        icon: '📕',
        Component: p(
            () => import('@pages/library/Books')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Books'],
        category: 'Books',
    },
    {
        path: '/library/books-charts',
        name: 'Reading Charts', icon: '📊',
        Component: p(
            () => import('@pages/library/ReadingCharts')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Books', 'Charts'],
        category: 'Books',
    },
    {
        path: '/library/books-notes',
        name: 'Book Notes', icon: '📖',
        Component: p(
            () => import('@pages/library/BookNotes')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Books', 'Notes'],
        category: 'Books',
    },
    {
        path: '/library/anime', name: 'Anime',
        icon: '🎌',
        Component: p(
            () => import('@pages/library/Anime')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Anime'],
        category: 'Anime & Manga',
    },
    {
        path: '/library/manga', name: 'Manga',
        icon: '📰',
        Component: p(
            () => import('@pages/library/Manga')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Manga'],
        category: 'Anime & Manga',
    },
    {
        path: '/library/browse-history',
        name: 'Browse History', icon: '🌐',
        Component: p(
            () => import('@pages/library/BrowseHistory')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Browse History'],
        category: 'Web',
    },
    {
        path: '/library/videos', name: 'Videos',
        icon: '📹',
        Component: p(
            () => import('@pages/library/Videos')
        ),
        drive: 'LIBRARY',
        breadcrumb: ['Library', 'Videos'],
        category: 'Web',
    },

    /* ── GAMING Drive ──────────────────── */
    {
        path: '/gaming', name: 'Hub', icon: '🎮',
        Component: p(
            () => import('@pages/gaming/GamingHub')
        ),
        drive: 'GAMING',
        breadcrumb: ['Gaming', 'Hub'],
    },
    {
        path: '/gaming/shelf', name: 'Game Shelf',
        icon: '📀',
        Component: p(
            () => import('@pages/gaming/GameShelf')
        ),
        drive: 'GAMING',
        breadcrumb: ['Gaming', 'Shelf'],
    },
    {
        path: '/gaming/chess', name: 'Chess',
        icon: '♟️',
        Component: p(
            () => import('@pages/gaming/Chess')
        ),
        drive: 'GAMING',
        breadcrumb: ['Gaming', 'Chess'],
    },
    {
        path: '/gaming/speed', name: 'Speedrun',
        icon: '⏱️',
        Component: p(
            () => import('@pages/gaming/Speedrun')
        ),
        drive: 'GAMING',
        breadcrumb: ['Gaming', 'Speedrun'],
    },

    /* ── CONNECT Drive ─────────────────── */
    {
        path: '/connect', name: 'Profiles',
        icon: '🌐',
        Component: p(
            () => import('@pages/connect/Profiles')
        ),
        drive: 'CONNECT',
        breadcrumb: ['Connect', 'Profiles'],
    },
    {
        path: '/connect/contact', name: 'Contact',
        icon: '✉️',
        Component: p(
            () => import('@pages/connect/Contact')
        ),
        drive: 'CONNECT',
        breadcrumb: ['Connect', 'Contact'],
    },
    {
        path: '/connect/guestbook',
        name: 'Guestbook', icon: '📝',
        Component: p(
            () => import('@pages/connect/Guestbook')
        ),
        drive: 'CONNECT',
        breadcrumb: ['Connect', 'Guestbook'],
    },
    {
        path: '/connect/newsletter',
        name: 'Newsletter', icon: '📬',
        Component: p(
            () => import('@pages/connect/Newsletter')
        ),
        drive: 'CONNECT',
        breadcrumb: ['Connect', 'Newsletter'],
    },
    {
        path: '/connect/share', name: 'Share',
        icon: '🔗',
        Component: p(
            () => import('@pages/connect/ShareLinks')
        ),
        drive: 'CONNECT',
        breadcrumb: ['Connect', 'Share'],
    },
    {
        path: '/connect/widgets', name: 'Widgets',
        icon: '🧩',
        Component: p(
            () => import('@pages/connect/Widgets')
        ),
        drive: 'CONNECT',
        breadcrumb: ['Connect', 'Widgets'],
    },

    /* ── SYSTEM Drive ──────────────────── */
    {
        path: '/system/settings', name: 'Settings',
        icon: '⚙️',
        Component: p(
            () => import('@pages/system/Settings')
        ),
        drive: 'SYSTEM',
        breadcrumb: ['System', 'Settings'],
    },
    {
        path: '/system/theme', name: 'Theme',
        icon: '🎨',
        Component: p(
            () => import('@pages/system/Theme')
        ),
        drive: 'SYSTEM',
        breadcrumb: ['System', 'Theme'],
    },
    {
        path: '/system/about', name: 'About',
        icon: 'ℹ️',
        Component: p(
            () => import('@pages/system/About')
        ),
        drive: 'SYSTEM',
        breadcrumb: ['System', 'About'],
    },
    {
        path: '/system/changelog', name: 'Changelog',
        icon: '📋',
        Component: p(
            () => import('@pages/system/Changelog')
        ),
        drive: 'SYSTEM',
        breadcrumb: ['System', 'Changelog'],
    },
    {
        path: '/system/debug', name: 'Debug',
        icon: '🐛',
        Component: p(
            () => import('@pages/system/Debug')
        ),
        drive: 'SYSTEM',
        breadcrumb: ['System', 'Debug'],
    },
];

/* ===== Utility Getters ===== */
export const getRoutesByDrive = (
    drive: string
): RouteConfig[] =>
    routes.filter((r) => r.drive === drive);

export const getDrives = (): string[] =>
    [...new Set(routes.map((r) => r.drive))];

export const driveConfig = [
    {
        id: 'WORK', name: 'Work',
        icon: '💼', color: '#5856D6'
    },
    {
        id: 'CODE', name: 'Code',
        icon: '💻', color: '#34C759'
    },
    {
        id: 'ME', name: 'Me',
        icon: '👤', color: '#007AFF'
    },
    {
        id: 'LIBRARY', name: 'Library',
        icon: '📚', color: '#FF9500'
    },
    {
        id: 'GAMING', name: 'Gaming',
        icon: '🎮', color: '#FF2D55'
    },
    {
        id: 'CONNECT', name: 'Connect',
        icon: '🌐', color: '#00C7BE'
    },
    {
        id: 'SYSTEM', name: 'System',
        icon: '⚙️', color: '#8E8E93'
    },
] as const;
