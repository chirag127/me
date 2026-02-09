/**
 * Social Links - Generated URLs for all social profiles
 */

import { IDENTITY } from './identity';

export interface SocialLink {
    name: string;
    icon: string;
    url: string;
    username: string;
    category: 'coding' | 'social' | 'media' | 'gaming' | 'professional';
}

export interface SocialLinks {
    [key: string]: SocialLink;
}

// Generate social links from identity usernames
export const SOCIAL: SocialLinks = {
    // Coding
    github: {
        name: 'GitHub',
        icon: '🐙',
        url: `https://github.com/${IDENTITY.usernames.github}`,
        username: IDENTITY.usernames.github,
        category: 'coding',
    },
    gitlab: {
        name: 'GitLab',
        icon: '🦊',
        url: `https://gitlab.com/${IDENTITY.usernames.gitlab}`,
        username: IDENTITY.usernames.gitlab,
        category: 'coding',
    },
    leetcode: {
        name: 'LeetCode',
        icon: '🧩',
        url: `https://leetcode.com/${IDENTITY.usernames.leetcode}`,
        username: IDENTITY.usernames.leetcode,
        category: 'coding',
    },
    codewars: {
        name: 'Codewars',
        icon: '⚔️',
        url: `https://www.codewars.com/users/${IDENTITY.usernames.codewars}`,
        username: IDENTITY.usernames.codewars,
        category: 'coding',
    },
    npm: {
        name: 'NPM',
        icon: '📦',
        url: `https://www.npmjs.com/~${IDENTITY.usernames.npm}`,
        username: IDENTITY.usernames.npm,
        category: 'coding',
    },
    holopin: {
        name: 'Holopin',
        icon: '🏅',
        url: `https://holopin.io/@${IDENTITY.usernames.holopin}`,
        username: IDENTITY.usernames.holopin,
        category: 'coding',
    },

    // Social
    mastodon: {
        name: 'Mastodon',
        icon: '🐘',
        url: `https://${IDENTITY.usernames.mastodon.server}/@${IDENTITY.usernames.mastodon.handle}`,
        username: `@${IDENTITY.usernames.mastodon.handle}@${IDENTITY.usernames.mastodon.server}`,
        category: 'social',
    },
    bluesky: {
        name: 'Bluesky',
        icon: '🦋',
        url: `https://bsky.app/profile/${IDENTITY.usernames.bluesky}`,
        username: IDENTITY.usernames.bluesky,
        category: 'social',
    },
    devto: {
        name: 'Dev.to',
        icon: '📝',
        url: `https://dev.to/${IDENTITY.usernames.devto}`,
        username: IDENTITY.usernames.devto,
        category: 'social',
    },
    medium: {
        name: 'Medium',
        icon: '✍️',
        url: `https://medium.com/@${IDENTITY.usernames.medium}`,
        username: IDENTITY.usernames.medium,
        category: 'social',
    },
    reddit: {
        name: 'Reddit',
        icon: '🔴',
        url: `https://reddit.com/user/${IDENTITY.usernames.reddit}`,
        username: IDENTITY.usernames.reddit,
        category: 'social',
    },
    hackernews: {
        name: 'Hacker News',
        icon: '🟠',
        url: `https://news.ycombinator.com/user?id=${IDENTITY.usernames.hackernews}`,
        username: IDENTITY.usernames.hackernews,
        category: 'social',
    },
    pixelfed: {
        name: 'Pixelfed',
        icon: '📸',
        url: `https://pixelfed.social/${IDENTITY.usernames.pixelfed}`,
        username: IDENTITY.usernames.pixelfed,
        category: 'social',
    },

    // Media
    lastfm: {
        name: 'Last.fm',
        icon: '🎵',
        url: `https://www.last.fm/user/${IDENTITY.usernames.lastfm}`,
        username: IDENTITY.usernames.lastfm,
        category: 'media',
    },
    trakt: {
        name: 'Trakt',
        icon: '🎬',
        url: `https://trakt.tv/users/${IDENTITY.usernames.trakt}`,
        username: IDENTITY.usernames.trakt,
        category: 'media',
    },
    letterboxd: {
        name: 'Letterboxd',
        icon: '🎞️',
        url: `https://letterboxd.com/${IDENTITY.usernames.letterboxd}`,
        username: IDENTITY.usernames.letterboxd,
        category: 'media',
    },
    anilist: {
        name: 'AniList',
        icon: '🎌',
        url: `https://anilist.co/user/${IDENTITY.usernames.anilist}`,
        username: IDENTITY.usernames.anilist,
        category: 'media',
    },
    openlibrary: {
        name: 'OpenLibrary',
        icon: '📚',
        url: `https://openlibrary.org/people/${IDENTITY.usernames.openlibrary}`,
        username: IDENTITY.usernames.openlibrary,
        category: 'media',
    },

    // Gaming
    lichess: {
        name: 'Lichess',
        icon: '♟️',
        url: `https://lichess.org/@/${IDENTITY.usernames.lichess}`,
        username: IDENTITY.usernames.lichess,
        category: 'gaming',
    },
    speedrun: {
        name: 'Speedrun.com',
        icon: '⏱️',
        url: `https://www.speedrun.com/user/${IDENTITY.usernames.speedrun}`,
        username: IDENTITY.usernames.speedrun,
        category: 'gaming',
    },

    // Professional
    linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        url: `https://linkedin.com/in/${IDENTITY.usernames.linkedin}`,
        username: IDENTITY.usernames.linkedin,
        category: 'professional',
    },
    unsplash: {
        name: 'Unsplash',
        icon: '📷',
        url: `https://unsplash.com/@${IDENTITY.usernames.unsplash}`,
        username: IDENTITY.usernames.unsplash,
        category: 'media',
    },
};

// Helper to get links by category
export function getLinksByCategory(category: SocialLink['category']): SocialLink[] {
    return Object.values(SOCIAL).filter(link => link.category === category);
}

export default SOCIAL;
