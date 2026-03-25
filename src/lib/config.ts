// Site Configuration - Single Source of Truth
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
  lichess: string;
  speedrun: string;
  myanimelist: string;
}

export interface ApiConfig {
  github: string;
  leetcode: string;
  codewars: string;
  anilist: string;
  lastfm: string;
  lichess: string;
  speedrun: string;
  devto: string;
  hackernews: string;
  bluesky: string;
}

export interface LocationConfig {
  name: string;
  latitude: number;
  longitude: number;
}

export const CONFIG = {
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
    lichess: "chirag127",
    speedrun: "chirag127",
    myanimelist: "chirag127",
  },
  api: {
    github: "https://api.github.com/users",
    leetcode: "https://leetcode-stats-api.herokuapp.com",
    codewars: "https://www.codewars.com/api/v1/users",
    anilist: "https://graphql.anilist.co",
    lastfm: "https://ws.audioscrobbler.com/2.0",
    lichess: "https://lichess.org/api/user",
    speedrun: "https://www.speedrun.com/api/v1/users",
    devto: "https://dev.to/api/articles",
    hackernews: "https://hacker-news.firebaseio.com/v0/user",
    bluesky: "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed",
  },
  location: {
    name: "Bhubaneswar",
    latitude: 20.2961,
    longitude: 85.8245,
  },
} as const;

export default CONFIG;
