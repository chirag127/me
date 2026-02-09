/**
 * API Configuration - All API endpoints and keys
 * Centralized API configuration
 */

export interface ApiEndpoints {
    // Coding
    github: string;
    leetcode: string;
    stackoverflow: string;
    codewars: string;
    gitlab: string;
    npm: string;
    holopin: string;

    // Media
    lastfm: string;
    listenbrainz: string;
    trakt: string;
    anilist: string;
    openlibrary: string;
    letterboxd: string;

    // Social
    mastodon: string;
    bluesky: string;
    devto: string;
    hackernews: string;
    reddit: string;
    youtube: string;

    // Gaming
    lichess: string;
    speedrun: string;

    // Utility
    lanyard: string;
    openMeteo: string;
    rss2json: string;
    fmdb: string;
}

export interface ApiKeys {
    lastfmApiKey: string;
    traktClientId: string;
    youTubeChannelId: string;
    openLibraryListId: string;
}

export interface LocationConfig {
    name: string;
    latitude: number;
    longitude: number;
}

export const API_ENDPOINTS: ApiEndpoints = {
    // Coding
    github: 'https://api.github.com/users',
    leetcode: 'https://leetcode-stats-api.herokuapp.com',
    stackoverflow: 'https://api.stackexchange.com/2.2/users',
    codewars: 'https://www.codewars.com/api/v1/users',
    gitlab: 'https://gitlab.com/api/v4/users',
    npm: 'https://api.npmjs.org/downloads/point/last-month',
    holopin: 'https://holopin.io/api/user',

    // Media
    lastfm: 'https://ws.audioscrobbler.com/2.0',
    listenbrainz: 'https://api.listenbrainz.org/1/user',
    trakt: 'https://api.trakt.tv',
    anilist: 'https://graphql.anilist.co',
    openlibrary: 'https://openlibrary.org/people',
    letterboxd: 'https://letterboxd.com',

    // Social
    mastodon: 'https://mastodon.social/api/v1/accounts',
    bluesky: 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed',
    devto: 'https://dev.to/api/articles',
    hackernews: 'https://hacker-news.firebaseio.com/v0/user',
    reddit: 'https://www.reddit.com/user',
    youtube: 'https://www.youtube.com/feeds/videos.xml?channel_id=',

    // Gaming
    lichess: 'https://lichess.org/api/user',
    speedrun: 'https://www.speedrun.com/api/v1/users',

    // Utility
    lanyard: 'https://api.lanyard.rest/v1/users',
    openMeteo: 'https://api.open-meteo.com/v1/forecast',
    rss2json: 'https://api.rss2json.com/v1/api.json?rss_url=',
    fmdb: 'https://imdb.iamidiotareyoutoo.com/search',
};

export const API_KEYS: ApiKeys = {
    lastfmApiKey: 'e15969debb132e5e0ed031b1a618fe53',
    traktClientId: 'dee5f20516bf476e67998b42aef045ff29a5bd5bee24f9a3e162a235fa5cc969',
    youTubeChannelId: '',
    openLibraryListId: '',
};

export const LOCATION: LocationConfig = {
    name: 'Bhubaneswar',
    latitude: 20.2961,
    longitude: 85.8245,
};

export default { API_ENDPOINTS, API_KEYS, LOCATION };
