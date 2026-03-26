import { CONFIG } from '../config';

// Generic fetch with error handling
async function fetchJson<T>(
  url: string,
  options?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// GitHub API
export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
}

export async function fetchGitHubUser(): Promise<GitHubUser | null> {
  return fetchJson<GitHubUser>(`${CONFIG.api.github}/${CONFIG.user.github}`);
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const repos = await fetchJson<GitHubRepo[]>(
    `${CONFIG.api.github}/${CONFIG.user.github}/repos?per_page=100&sort=updated`,
  );
  return (repos || []).filter((r) => !r.fork);
}

// LeetCode API
export interface LeetCodeStats {
  totalSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  totalEasySolved: number;
  totalMediumSolved: number;
  totalHardSolved: number;
  acceptanceRate: number;
  ranking: number;
}

export async function fetchLeetCodeStats(): Promise<LeetCodeStats | null> {
  return fetchJson<LeetCodeStats>(
    `${CONFIG.api.leetcode}/${CONFIG.user.leetcode}`,
  );
}

// Codewars API
export interface CodewarsUser {
  username: string;
  name: string;
  honor: number;
  clan: string;
  leaderboardPosition: number;
  ranks: {
    overall: { rank: number; name: string; color: string; score: number };
    languages: Record<
      string,
      { rank: number; name: string; color: string; score: number }
    >;
  };
  codeChallenges: { totalAuthored: number; totalCompleted: number };
}

export async function fetchCodewarsUser(): Promise<CodewarsUser | null> {
  return fetchJson<CodewarsUser>(
    `${CONFIG.api.codewars}/${CONFIG.user.codewars}`,
  );
}

// Lichess API
export interface LichessUser {
  username: string;
  perfs: {
    bullet?: { rating: number; games: number };
    blitz?: { rating: number; games: number };
    rapid?: { rating: number; games: number };
    classical?: { rating: number; games: number };
  };
  count: { all: number; win: number; draw: number; loss: number };
  createdAt: number;
}

export async function fetchLichessUser(): Promise<LichessUser | null> {
  return fetchJson<LichessUser>(`${CONFIG.api.lichess}/${CONFIG.user.lichess}`);
}

// Dev.to API
export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  published_at: string;
  url: string;
  tag_list: string[];
  positive_reactions_count: number;
  comments_count: number;
  reading_time_minutes: number;
  cover_image: string | null;
}

export async function fetchDevToArticles(): Promise<DevToArticle[]> {
  const articles = await fetchJson<DevToArticle[]>(
    `${CONFIG.api.devto}?username=${CONFIG.user.devto}&per_page=50`,
  );
  return articles || [];
}

// HackerNews API
export interface HackerNewsUser {
  id: string;
  karma: number;
  created: number;
  about?: string;
  submitted?: number[];
}

export async function fetchHackerNewsUser(): Promise<HackerNewsUser | null> {
  return fetchJson<HackerNewsUser>(
    `${CONFIG.api.hackernews}/${CONFIG.user.hackernews}.json`,
  );
}

// Speedrun API
export interface SpeedRunUser {
  data: {
    id: string;
    names: { international: string };
    weblink: string;
    location?: { country: { names: { international: string } } };
  };
}

export async function fetchSpeedRunUser(): Promise<SpeedRunUser | null> {
  return fetchJson<SpeedRunUser>(
    `${CONFIG.api.speedrun}?lookup=${CONFIG.user.speedrun}`,
  );
}

// AniList GraphQL
export async function fetchAniListStats(
  username: string,
): Promise<Record<string, unknown> | null> {
  const query = `
    query ($username: String) {
      User(name: $username) {
        id
        name
        avatar { large }
        statistics {
          anime { count meanScore minutesWatched episodesWatched }
          manga { count meanScore chaptersRead volumesRead }
        }
        favourites {
          anime { nodes { title { romaji english } coverImage { large } } }
          manga { nodes { title { romaji english } coverImage { large } } }
        }
      }
    }
  `;
  try {
    const res = await fetch(CONFIG.api.anilist, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    });
    const data = await res.json();
    return data?.data?.User ?? null;
  } catch {
    return null;
  }
}

// Last.fm API
export interface LastFmUser {
  user: {
    name: string;
    playcount: string;
    registered: { unixtime: string };
  };
}

export interface LastFmRecentTracks {
  recenttracks: {
    track: Array<{
      name: string;
      artist: { '#text': string };
      album: { '#text': string };
      image: Array<{ '#text': string; size: string }>;
      '@attr'?: { nowplaying: string };
    }>;
  };
}

export async function fetchLastFmUser(
  apiKey: string,
): Promise<LastFmUser | null> {
  return fetchJson<LastFmUser>(
    `${CONFIG.api.lastfm}?method=user.getinfo&user=${CONFIG.user.lastfm}&api_key=${apiKey}&format=json`,
  );
}

export async function fetchLastFmRecentTracks(
  apiKey: string,
): Promise<LastFmRecentTracks | null> {
  return fetchJson<LastFmRecentTracks>(
    `${CONFIG.api.lastfm}?method=user.getrecenttracks&user=${CONFIG.user.lastfm}&api_key=${apiKey}&format=json&limit=10`,
  );
}

export * from './blog';
