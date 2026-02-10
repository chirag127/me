/**
 * @file Utility functions for Omni-Trakt AI
 */

/**
 * Creates a debounced function that delays invoking `fn` until after `delay` ms
 * have elapsed since the last invocation.
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function with .cancel() method
 */
export function debounce(fn, delay) {
    let timerId = null;

    const debounced = (...args) => {
        if (timerId !== null) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    };

    debounced.cancel = () => {
        if (timerId !== null) {
            clearTimeout(timerId);
            timerId = null;
        }
    };

    return debounced;
}

/**
 * Generates a unique ID for tracking video elements
 * @returns {string} Unique identifier
 */
export function generateVideoId() {
    return `vid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Formats seconds into human-readable duration (e.g. "1h 23m 45s")
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
}

/**
 * Cleans a page title by removing common clutter words
 * @param {string} title - Raw page title
 * @returns {string} Cleaned title
 */
export function cleanTitle(title) {
    if (!title) return '';
    const clutterPatterns = [
        /watch\s+online/gi,
        /free\s*(online|streaming|download)?/gi,
        /\b(HD|1080p|720p|4K|UHD|BluRay|WEBRip|HDTV|DVDRip|BRRip)\b/gi,
        /\b(123movies|putlocker|gomovies|fmovies|solarmovie|primewire)\b/gi,
        /\|\s*.*$/g,
        /-\s*(watch|stream|download|online).*$/gi,
        /\s*\[.*?\]\s*/g,
        /\s*\(.*?(online|free|stream|watch).*?\)\s*/gi,
    ];

    let cleaned = title;
    for (const pattern of clutterPatterns) {
        cleaned = cleaned.replace(pattern, ' ');
    }
    return cleaned.replace(/\s+/g, ' ').trim();
}
