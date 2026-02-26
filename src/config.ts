/**
 * Project Me - Configuration
 * The massive CONFIG object containing all user data and API endpoints
 */

export interface Config {
  user: UserConfig;
  api: ApiConfig;
  keys: KeysConfig;
  location: LocationConfig;
}

export interface UserConfig {
  name: string;
  username: string;
  email: string;
  website: string;
  discordId: string;
  github: string;
  leetcode: string;
  codewars: string;
  holopin: string;
  mastodon: { server: string; id: string };
  pixelfed: string;
  devto: string;
  medium: string;
  reddit: string;
  hackernews: string;
  bluesky: string;
  anilist: string;
  letterboxd: string;
  trakt: string;
  openlibrary: string;
  hardcover: string;
  backloggd: string;
  lastfm: string;
  listenbrainz: string;
  soundcloud: string;
  mixcloud: string;
  lichess: string;
  speedrun: string;
}

export interface ApiConfig {
  rss2json: string;
  github: string;
  leetcode: string;
  stackoverflow: string;
  codewars: string;
  gitlab: string;
  npm: string;
  holopin: string;
  sourcerer: string;
  jsonresume: string;
  openlibrary: string;
  anilist: string;
  letterboxd: string;
  trakt: string;
  mangadex: string;
  hardcover: string;
  serializd: string;
  backloggd: string;
  lastfm: string;
  listenbrainz: string;
  soundcloud: string;
  mixcloud: string;
  lichess: string;
  speedrun: string;
  mastodon: string;
  pixelfed: string;
  youtube: string;
  devto: string;
  medium: string;
  hackernews: string;
  reddit: string;
  bluesky: string;
  lanyard: string;
  raindrop: string;
  openMeteo: string;
  metahub: string;
}

export interface KeysConfig {
  lastfmApiKey: string;
  traktClientId: string;
  youTubeChannelId: string;
  openLibraryListId: string;
  raindropCollectionId: string;
}

export interface LocationConfig {
  name: string;
  latitude: number;
  longitude: number;
}

export const CONFIG: Config = {
  user: {
    name: "Chirag Singhal",
    username: "chirag127",
    email: "hi@chirag127.in",
    website: "https://chirag127.in",
    discordId: "799956529847205898",
    github: "chirag127",
    leetcode: "chirag127",
    codewars: "chirag127",
    holopin: "chirag127",
    mastodon: { server: "mastodon.social", id: "115582869974132712" },
    pixelfed: "chirag127",
    devto: "chirag127",
    medium: "chirag127",
    reddit: "chirag127",
    hackernews: "chirag127",
    bluesky: "chirag127.bsky.social",
    anilist: "chirag127",
    letterboxd: "chirag127",
    trakt: "chirag127",
    openlibrary: "wilarchive",
    hardcover: "chirag127",
    backloggd: "chirag127",
    lastfm: "lastfmwhy",
    listenbrainz: "chirag127",
    soundcloud: "chirag127",
    mixcloud: "chirag127",
    lichess: "chirag127",
    speedrun: "chirag127",
  },
  api: {
    rss2json: "https://api.rss2json.com/v1/api.json?rss_url=",
    github: "https://api.github.com/users",
    leetcode: "https://leetcode-stats-api.herokuapp.com",
    stackoverflow: "https://api.stackexchange.com/2.2/users",
    codewars: "https://www.codewars.com/api/v1/users",
    gitlab: "https://gitlab.com/api/v4/users",
    npm: "https://api.npmjs.org/downloads/point/last-month",
    holopin: "https://holopin.io/api/user",
    sourcerer: "https://sourcerer.io/profile",
    jsonresume: "https://registry.jsonresume.org",
    openlibrary: "https://openlibrary.org/people",
    anilist: "https://graphql.anilist.co",
    letterboxd: "https://letterboxd.com",
    trakt: "https://api.trakt.tv",
    mangadex: "https://api.mangadex.org/user",
    hardcover: "https://hardcover.app/graphql",
    serializd: "https://serializd.com",
    backloggd: "https://backloggd.com/u",
    lastfm: "https://ws.audioscrobbler.com/2.0",
    listenbrainz: "https://api.listenbrainz.org/1/user",
    soundcloud: "https://soundcloud.com",
    mixcloud: "https://api.mixcloud.com",
    lichess: "https://lichess.org/api/user",
    speedrun: "https://www.speedrun.com/api/v1/users",
    mastodon: "https://mastodon.social/api/v1/accounts",
    pixelfed: "https://pixelfed.social/users",
    youtube: "https://www.youtube.com/feeds/videos.xml?channel_id=",
    devto: "https://dev.to/api/articles",
    medium: "https://medium.com/feed",
    hackernews: "https://hacker-news.firebaseio.com/v0/user",
    reddit: "https://www.reddit.com/user",
    bluesky: "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed",
    lanyard: "https://api.lanyard.rest/v1/users",
    raindrop: "https://api.raindrop.io/rest/v1/raindrops",
    openMeteo: "https://api.open-meteo.com/v1/forecast",
    metahub: "https://images.metahub.space",
  },
  keys: {
    lastfmApiKey: "e15969debb132e5e0ed031b1a618fe53",
    traktClientId: "dee5f20516bf476e67998b42aef045ff29a5bd5bee24f9a3e162a235fa5cc969",
    youTubeChannelId: "",
    openLibraryListId: "",
    raindropCollectionId: "",
  },
  location: {
    name: "Bhubaneswar",
    latitude: 20.2961,
    longitude: 85.8245,
  },
};

export default CONFIG;
