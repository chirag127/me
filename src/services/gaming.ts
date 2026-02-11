/**
 * Project Me - Gaming Services
 * API integrations for Lichess, Speedrun.com
 */

import { CONFIG } from '../config';

// Types
export interface LichessUser {
  id: string;
  username: string;
  online: boolean;
  perfs: {
    bullet?: LichessPerf;
    blitz?: LichessPerf;
    rapid?: LichessPerf;
    classical?: LichessPerf;
    puzzle?: LichessPerf;
  };
  count: {
    all: number;
    win: number;
    loss: number;
    draw: number;
  };
  playTime: { total: number; tv: number };
  createdAt: number;
}

export interface LichessPerf {
  games: number;
  rating: number;
  rd: number;
  prog: number;
}

export interface SpeedrunUser {
  data: {
    id: string;
    names: { international: string };
    weblink: string;
    signup: string;
  };
}

export interface SpeedrunPB {
  place: number;
  run: {
    id: string;
    game: string;
    category: string;
    times: { primary_t: number };
    weblink: string;
  };
}

// Cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

class LichessService {
  private baseUrl: string;
  private token?: string;

  constructor(token?: string) {
    this.baseUrl = CONFIG.api.lichess;
    this.token = token; // Allow auth token passing
  }

  private async fetchWithAuth<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const cacheKey = url;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Lichess API Error: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as T;
  }

  async getUser(username: string): Promise<LichessUser> {
    return this.fetchWithAuth<LichessUser>(username);
  }

  async getRatings(username: string): Promise<Record<string, number>> {
    const user = await this.getUser(username);
    const ratings: Record<string, number> = {};

    if (user.perfs.bullet) ratings.bullet = user.perfs.bullet.rating;
    if (user.perfs.blitz) ratings.blitz = user.perfs.blitz.rating;
    if (user.perfs.rapid) ratings.rapid = user.perfs.rapid.rating;
    if (user.perfs.classical) ratings.classical = user.perfs.classical.rating;
    if (user.perfs.puzzle) ratings.puzzle = user.perfs.puzzle.rating;

    return ratings;
  }
}

// Singleton instances
export const lichessService = new LichessService(); // Public instance

// Legacy exports for compatibility
export async function getLichessUser(): Promise<LichessUser> {
  return lichessService.getUser(CONFIG.user.lichess);
}

export async function getLichessRatings(): Promise<Record<string, number>> {
  return lichessService.getRatings(CONFIG.user.lichess);
}

// Speedrun.com API (remains simple as auth requirements are lower for public data)
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

export async function getSpeedrunUser(): Promise<SpeedrunUser> {
  return fetchWithCache<SpeedrunUser>(`${CONFIG.api.speedrun}/${CONFIG.user.speedrun}`);
}

export async function getSpeedrunPBs(): Promise<SpeedrunPB[]> {
  const user = await getSpeedrunUser();
  const url = `https://www.speedrun.com/api/v1/users/${user.data.id}/personal-bests`;
  const data = await fetchWithCache<{ data: SpeedrunPB[] }>(url);
  return data.data;
}

// Aggregate gaming stats
export interface GamingStats {
  chess: {
    ratings: Record<string, number>;
    totalGames: number;
  };
  speedrun: {
    pbs: number;
  };
}

export async function getAggregateGamingStats(): Promise<GamingStats> {
  try {
    const [lichess, speedrunPBs] = await Promise.all([
      getLichessUser().catch(() => null),
      getSpeedrunPBs().catch(() => []),
    ]);

    return {
      chess: {
        ratings: lichess ? {
          bullet: lichess.perfs.bullet?.rating || 0,
          blitz: lichess.perfs.blitz?.rating || 0,
          rapid: lichess.perfs.rapid?.rating || 0,
        } : {},
        totalGames: lichess?.count.all || 0,
      },
      speedrun: {
        pbs: speedrunPBs.length,
      },
    };
  } catch (error) {
    console.error('Failed to fetch gaming stats:', error);
    return {
      chess: { ratings: {}, totalGames: 0 },
      speedrun: { pbs: 0 },
    };
  }
}

export default {
  hessService: lichessService, // Export service instance
  getLichessUser,
  getLichessRatings,
  getSpeedrunUser,
  getSpeedrunPBs,
  getAggregateGamingStats,
};
