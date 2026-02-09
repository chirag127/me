/**
 * Identity - Personal information and usernames
 * Single source of truth for all identity data
 */

export interface Identity {
    name: string;
    firstName: string;
    lastName: string;
    bio: string;
    tagline: string;
    location: string;
    email: string;
    website: string;
    discordId: string;
    usernames: Usernames;
}

export interface Usernames {
    // Primary
    default: string;
    email: string;

    // Coding
    github: string;
    gitlab: string;
    leetcode: string;
    codewars: string;
    stackoverflow: string;
    npm: string;
    holopin: string;

    // Social
    mastodon: { handle: string; server: string; id: string };
    bluesky: string;
    devto: string;
    medium: string;
    reddit: string;
    hackernews: string;
    pixelfed: string;
    youtube: string;

    // Media
    lastfm: string;
    listenbrainz: string;
    soundcloud: string;
    mixcloud: string;
    trakt: string;
    letterboxd: string;
    anilist: string;
    openlibrary: string;
    hardcover: string;
    backloggd: string;

    // Gaming
    lichess: string;
    speedrun: string;

    // Other
    linkedin: string;
    unsplash: string;
}

export const IDENTITY: Identity = {
    name: "Chirag Singhal",
    firstName: "Chirag",
    lastName: "Singhal",
    bio: "Software Engineer specializing in Backend & GenAI. Building scalable systems at the intersection of Enterprise Engineering and Generative AI.",
    tagline: "Backend & GenAI Specialist",
    location: "Bhubaneswar, Odisha, India",
    email: "hi@chirag127.in",
    website: "https://chirag127.in",
    discordId: "799956529847205898",

    usernames: {
        // Primary
        default: "chirag127",
        email: "hi@chirag127.in",

        // Coding
        github: "chirag127",
        gitlab: "chirag127",
        leetcode: "chirag127",
        codewars: "chirag127",
        stackoverflow: "chirag127",
        npm: "chirag127",
        holopin: "chirag127",

        // Social
        mastodon: { handle: "chirag127", server: "mastodon.social", id: "115582869974132712" },
        bluesky: "chirag127.bsky.social",
        devto: "chirag127",
        medium: "chirag127",
        reddit: "chirag127",
        hackernews: "chirag127",
        pixelfed: "chirag127",
        youtube: "chirag127",

        // Media
        lastfm: "lastfmwhy",
        listenbrainz: "chirag127",
        soundcloud: "chirag127",
        mixcloud: "chirag127",
        trakt: "chirag127",
        letterboxd: "chirag127",
        anilist: "chirag127",
        openlibrary: "wilarchive",
        hardcover: "chirag127",
        backloggd: "chirag127",

        // Gaming
        lichess: "chirag127",
        speedrun: "chirag127",

        // Other
        linkedin: "chirag127",
        unsplash: "chirag127",
    },
};

export default IDENTITY;
