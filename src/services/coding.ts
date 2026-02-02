/**
 * Project Me - Coding Services
 * API integrations for WakaTime, GitHub, LeetCode, StackOverflow, CodeWars, NPM
 */

import { CONFIG } from '../config';

// Types
export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface LeetCodeStats {
  status: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
}

export interface CodeWarsUser {
  username: string;
  name: string;
  honor: number;
  clan: string;
  leaderboardPosition: number;
  skills: string[];
  ranks: {
    overall: {
      rank: number;
      name: string;
      color: string;
      score: number;
    };
    languages: Record<string, { rank: number; name: string; color: string; score: number }>;
  };
  codeChallenges: {
    totalAuthored: number;
    totalCompleted: number;
  };
}

export interface NPMDownloads {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(url: string, options?: RequestInit): Promise<T> {
  const cacheKey = url;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data as T;
}

// GitHub API
export async function getGitHubUser(): Promise<GitHubUser> {
  return fetchWithCache<GitHubUser>(`${CONFIG.api.github}/${CONFIG.user.github}`);
}

export async function getGitHubRepos(sort: 'updated' | 'stars' = 'updated', perPage = 10): Promise<GitHubRepo[]> {
  const sortParam = sort === 'stars' ? 'stargazers_count' : 'updated';
  return fetchWithCache<GitHubRepo[]>(
    `${CONFIG.api.github}/${CONFIG.user.github}/repos?sort=${sortParam}&per_page=${perPage}&direction=desc`
  );
}

export async function getPinnedRepos(): Promise<GitHubRepo[]> {
  // GitHub doesn't have a direct API for pinned repos, so we'll fetch top starred
  const repos = await getGitHubRepos('stars', 6);
  return repos;
}

// LeetCode API
export async function getLeetCodeStats(): Promise<LeetCodeStats> {
  return fetchWithCache<LeetCodeStats>(`${CONFIG.api.leetcode}/${CONFIG.user.leetcode}`);
}

// CodeWars API
export async function getCodeWarsUser(): Promise<CodeWarsUser> {
  return fetchWithCache<CodeWarsUser>(`${CONFIG.api.codewars}/${CONFIG.user.codewars}`);
}

// NPM Downloads (for specific packages)
export async function getNPMDownloads(packageName: string): Promise<NPMDownloads> {
  return fetchWithCache<NPMDownloads>(`${CONFIG.api.npm}/${packageName}`);
}

// WakaTime - Returns embed URLs (since the API requires authentication)
export function getWakaTimeEmbedUrl(type: 'languages' | 'editors' | 'os' | 'activity'): string {
  const guid = CONFIG.keys.wakatimeGuid;
  if (!guid) return '';

  const embedTypes: Record<string, string> = {
    languages: `${CONFIG.api.wakatime}/@${CONFIG.user.wakatime}/languages.svg`,
    editors: `${CONFIG.api.wakatime}/@${CONFIG.user.wakatime}/editors.svg`,
    os: `${CONFIG.api.wakatime}/@${CONFIG.user.wakatime}/operating_systems.svg`,
    activity: `${CONFIG.api.wakatime}/@${CONFIG.user.wakatime}/activity.svg`,
  };

  return embedTypes[type] || '';
}

// Holopin badges
export function getHolopinBoardUrl(): string {
  return `https://holopin.io/@${CONFIG.user.holopin}`;
}

// Aggregate coding stats
export interface CodingStats {
  github: {
    repos: number;
    followers: number;
    stars: number;
  };
  leetcode: {
    solved: number;
    ranking: number;
  };
  codewars: {
    honor: number;
    completed: number;
  };
}

export async function getAggregateCodingStats(): Promise<CodingStats> {
  try {
    const [githubUser, githubRepos, leetcode, codewars] = await Promise.all([
      getGitHubUser().catch(() => null),
      getGitHubRepos('stars', 100).catch(() => []),
      getLeetCodeStats().catch(() => null),
      getCodeWarsUser().catch(() => null),
    ]);

    const totalStars = githubRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    return {
      github: {
        repos: githubUser?.public_repos || 0,
        followers: githubUser?.followers || 0,
        stars: totalStars,
      },
      leetcode: {
        solved: leetcode?.totalSolved || 0,
        ranking: leetcode?.ranking || 0,
      },
      codewars: {
        honor: codewars?.honor || 0,
        completed: codewars?.codeChallenges?.totalCompleted || 0,
      },
    };
  } catch (error) {
    console.error('Failed to fetch coding stats:', error);
    return {
      github: { repos: 0, followers: 0, stars: 0 },
      leetcode: { solved: 0, ranking: 0 },
      codewars: { honor: 0, completed: 0 },
    };
  }
}

export default {
  getGitHubUser,
  getGitHubRepos,
  getPinnedRepos,
  getLeetCodeStats,
  getCodeWarsUser,
  getNPMDownloads,
  getWakaTimeEmbedUrl,
  getHolopinBoardUrl,
  getAggregateCodingStats,
};
