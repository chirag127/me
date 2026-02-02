/**
 * Project Me - Coding Services
 * API integrations for GitHub, LeetCode, StackOverflow, CodeWars, NPM, GitLab
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
    overall: { rank: number; name: string; color: string; score: number };
    languages: Record<string, { rank: number; name: string; color: string; score: number }>;
  };
  codeChallenges: { totalAuthored: number; totalCompleted: number };
}

export interface NPMDownloads {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

// StackOverflow Types
export interface StackOverflowUser {
  user_id: number;
  display_name: string;
  reputation: number;
  badge_counts: { gold: number; silver: number; bronze: number };
  profile_image: string;
  link: string;
  accept_rate?: number;
  question_count?: number;
  answer_count?: number;
}

export interface StackOverflowTag {
  tag_name: string;
  answer_count: number;
  answer_score: number;
  question_count: number;
  question_score: number;
}

// GitLab Types
export interface GitLabUser {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
  web_url: string;
  bio: string;
  public_repos?: number;
}

export interface GitLabProject {
  id: number;
  name: string;
  description: string;
  web_url: string;
  star_count: number;
  forks_count: number;
  last_activity_at: string;
  topics: string[];
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

// NPM Downloads
export async function getNPMDownloads(packageName: string): Promise<NPMDownloads> {
  return fetchWithCache<NPMDownloads>(`${CONFIG.api.npm}/${packageName}`);
}

// StackOverflow API (Public, no auth required)
export async function getStackOverflowUser(userId: number = 0): Promise<StackOverflowUser | null> {
  if (!userId) {
    console.warn('StackOverflow user ID not configured');
    return null;
  }
  try {
    const url = `${CONFIG.api.stackoverflow}/${userId}?site=stackoverflow&filter=!BTeL*NH.A5lSPP`;
    const data = await fetchWithCache<{ items: StackOverflowUser[] }>(url);
    return data.items[0] || null;
  } catch (error) {
    console.warn('StackOverflow API failed:', error);
    return null;
  }
}

export async function getStackOverflowTopTags(userId: number = 0, limit = 5): Promise<StackOverflowTag[]> {
  if (!userId) return [];
  try {
    const url = `${CONFIG.api.stackoverflow}/${userId}/top-tags?site=stackoverflow&pagesize=${limit}`;
    const data = await fetchWithCache<{ items: StackOverflowTag[] }>(url);
    return data.items || [];
  } catch {
    return [];
  }
}

// GitLab API (Public, no auth for public projects)
export async function getGitLabUser(): Promise<GitLabUser | null> {
  try {
    const url = `${CONFIG.api.gitlab}?username=${CONFIG.user.github}`;
    const data = await fetchWithCache<GitLabUser[]>(url);
    return data[0] || null;
  } catch (error) {
    console.warn('GitLab API failed:', error);
    return null;
  }
}

export async function getGitLabProjects(userId?: number, limit = 10): Promise<GitLabProject[]> {
  if (!userId) {
    const user = await getGitLabUser();
    if (!user) return [];
    userId = user.id;
  }
  try {
    const url = `${CONFIG.api.gitlab}/${userId}/projects?visibility=public&per_page=${limit}&order_by=last_activity_at`;
    return fetchWithCache<GitLabProject[]>(url);
  } catch {
    return [];
  }
}

// Holopin badges
export function getHolopinBoardUrl(): string {
  return `https://holopin.io/@${CONFIG.user.holopin}`;
}

// Aggregate coding stats
export interface CodingStats {
  github: { repos: number; followers: number; stars: number };
  leetcode: { solved: number; ranking: number };
  codewars: { honor: number; completed: number };
  stackoverflow: { reputation: number; badges: { gold: number; silver: number; bronze: number } };
  gitlab: { projects: number };
}

export async function getAggregateCodingStats(): Promise<CodingStats> {
  try {
    const [githubUser, githubRepos, leetcode, codewars, gitlab] = await Promise.all([
      getGitHubUser().catch(() => null),
      getGitHubRepos('stars', 100).catch(() => []),
      getLeetCodeStats().catch(() => null),
      getCodeWarsUser().catch(() => null),
      getGitLabProjects().catch(() => []),
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
      stackoverflow: {
        reputation: 0, // Needs userId configured
        badges: { gold: 0, silver: 0, bronze: 0 },
      },
      gitlab: {
        projects: gitlab.length,
      },
    };
  } catch (error) {
    console.error('Failed to fetch coding stats:', error);
    return {
      github: { repos: 0, followers: 0, stars: 0 },
      leetcode: { solved: 0, ranking: 0 },
      codewars: { honor: 0, completed: 0 },
      stackoverflow: { reputation: 0, badges: { gold: 0, silver: 0, bronze: 0 } },
      gitlab: { projects: 0 },
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
  getStackOverflowUser,
  getStackOverflowTopTags,
  getGitLabUser,
  getGitLabProjects,
  getHolopinBoardUrl,
  getAggregateCodingStats,
};
