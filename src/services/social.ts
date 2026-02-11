/**
 * Project Me - Social Services
 * API integrations for Mastodon, Bluesky, Dev.to, Medium, Reddit, YouTube, Pixelfed
 */

import { CONFIG } from '../config';

// Types
export interface MastodonStatus {
  id: string;
  content: string;
  created_at: string;
  url: string;
  reblogs_count: number;
  favourites_count: number;
  replies_count: number;
  media_attachments: Array<{ url: string; type: string }>;
}

export interface MastodonAccount {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  header: string;
  note: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  created_at: string;
}

export interface BlueskyFeedPost {
  post: {
    uri: string;
    cid: string;
    author: { did: string; handle: string; displayName: string; avatar: string };
    record: { text: string; createdAt: string };
    likeCount: number;
    repostCount: number;
    replyCount: number;
  };
}

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  published_at: string;
  url: string;
  comments_count: number;
  public_reactions_count: number;
  reading_time_minutes: number;
  tag_list: string[];
  cover_image: string | null;
}

export interface RedditSubmission {
  title: string;
  url: string;
  score: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  permalink: string;
}

// YouTube Video (from RSS feed)
export interface YouTubeVideo {
  title: string;
  link: string;
  pubDate: string;
  author?: string;
  thumbnail?: string;
  description?: string;
}

// Pixelfed Photo
export interface PixelfedMedia {
  id: string;
  url: string;
  preview_url: string;
  description: string;
}

export interface PixelfedStatus {
  id: string;
  created_at: string;
  url: string;
  favourites_count: number;
  comments_count: number;
  media_attachments: PixelfedMedia[];
}

// Cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

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

// Mastodon API
export async function getMastodonAccount(): Promise<MastodonAccount> {
  const { server, id } = CONFIG.user.mastodon;
  return fetchWithCache<MastodonAccount>(`https://${server}/api/v1/accounts/${id}`);
}

export async function getMastodonStatuses(limit = 10): Promise<MastodonStatus[]> {
  const { server, id } = CONFIG.user.mastodon;
  return fetchWithCache<MastodonStatus[]>(
    `https://${server}/api/v1/accounts/${id}/statuses?limit=${limit}&exclude_replies=true&exclude_reblogs=true`
  );
}

// Bluesky API
export async function getBlueskyFeed(limit = 10): Promise<BlueskyFeedPost[]> {
  const url = `${CONFIG.api.bluesky}?actor=${CONFIG.user.bluesky}&limit=${limit}`;
  try {
    const data = await fetchWithCache<{ feed: BlueskyFeedPost[] }>(url);
    return data.feed;
  } catch {
    console.warn('Bluesky API fetch failed');
    return [];
  }
}

// Dev.to API
export async function getDevToArticles(limit = 10): Promise<DevToArticle[]> {
  return fetchWithCache<DevToArticle[]>(
    `${CONFIG.api.devto}?username=${CONFIG.user.devto}&per_page=${limit}`
  );
}

export async function getDevToStats(): Promise<{ totalArticles: number; totalReactions: number; totalComments: number }> {
  const articles = await getDevToArticles(100);
  return {
    totalArticles: articles.length,
    totalReactions: articles.reduce((sum, a) => sum + a.public_reactions_count, 0),
    totalComments: articles.reduce((sum, a) => sum + a.comments_count, 0),
  };
}

// Medium (via RSS2JSON)
export interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  thumbnail?: string;
  categories?: string[];
}

export async function getMediumArticles(limit = 10): Promise<MediumArticle[]> {
  const rssUrl = `${CONFIG.api.medium}/@${CONFIG.user.medium}`;
  const url = `${CONFIG.api.rss2json}${encodeURIComponent(rssUrl)}`;

  try {
    const data = await fetchWithCache<{ items: MediumArticle[] }>(url);
    return data.items.slice(0, limit);
  } catch {
    console.warn('Medium RSS fetch failed');
    return [];
  }
}

// Reddit (public JSON endpoint)
export async function getRedditSubmissions(limit = 10): Promise<RedditSubmission[]> {
  const url = `${CONFIG.api.reddit}/${CONFIG.user.reddit}/submitted.json?limit=${limit}`;

  try {
    const data = await fetchWithCache<{ data: { children: Array<{ data: RedditSubmission }> } }>(url);
    return data.data.children.map(c => c.data);
  } catch {
    console.warn('Reddit API fetch failed');
    return [];
  }
}

// Hacker News (via Firebase API)
export interface HNItem {
  id: number;
  title?: string;
  text?: string;
  url?: string;
  score?: number;
  time: number;
  type: string;
}

export async function getHNUserKarma(): Promise<number> {
  const url = `${CONFIG.api.hackernews}/${CONFIG.user.hackernews}.json`;
  try {
    const data = await fetchWithCache<{ karma: number }>(url);
    return data.karma;
  } catch {
    return 0;
  }
}

// YouTube (via Data API or RSS2JSON based on complex auth logic)
class YouTubeService {
  private channelId: string;
  private apiKey?: string; // Optional API key for v3 API
  private useV3: boolean = false;

  constructor(channelId: string, apiKey?: string) {
    this.channelId = channelId;
    this.apiKey = apiKey;
    this.useV3 = !!apiKey;
  }

  async getVideos(limit = 10): Promise<YouTubeVideo[]> {
    if (!this.channelId) {
      console.warn('YouTube Channel ID not configured');
      return [];
    }

    if (this.useV3 && this.apiKey) {
      return this.fetchFromV3(limit);
    } else {
      return this.fetchFromRSS(limit);
    }
  }

  private async fetchFromV3(limit: number): Promise<YouTubeVideo[]> {
    // Scaffold implementation for v3 API - to be fully implemented with API key
    // This allows seamless switching when key is provided
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${limit}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.items.map((item: any) => ({
        title: item.snippet.title,
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        pubDate: item.snippet.publishedAt,
        author: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        description: item.snippet.description
      }));
    } catch (e) {
      console.warn('YouTube V3 API fetch failed, falling back to RSS', e);
      return this.fetchFromRSS(limit);
    }
  }

  private async fetchFromRSS(limit: number): Promise<YouTubeVideo[]> {
    const rssUrl = `${CONFIG.api.youtube}${this.channelId}`;
    const url = `${CONFIG.api.rss2json}${encodeURIComponent(rssUrl)}`;

    try {
      const data = await fetchWithCache<{ items: YouTubeVideo[] }>(url);
      return data.items.slice(0, limit);
    } catch {
      console.warn('YouTube RSS fetch failed');
      return [];
    }
  }
}

export const youtubeService = new YouTubeService(CONFIG.keys.youTubeChannelId, ''); // Pass API key here if available

export async function getYouTubeVideos(limit = 10): Promise<YouTubeVideo[]> {
  return youtubeService.getVideos(limit);
}

// Pixelfed API (public, no auth for public accounts)
export async function getPixelfedPhotos(limit = 12): Promise<PixelfedStatus[]> {
  // Pixelfed uses Mastodon-compatible API
  const url = `https://pixelfed.social/api/v1/accounts/${CONFIG.user.pixelfed}/statuses?limit=${limit}&only_media=true`;

  try {
    return fetchWithCache<PixelfedStatus[]>(url);
  } catch {
    console.warn('Pixelfed API fetch failed');
    return [];
  }
}

// Aggregate social stats
export interface SocialStats {
  mastodon: { followers: number; posts: number };
  devto: { articles: number; reactions: number };
  bluesky: { posts: number };
  youtube: { videos: number };
  hackerNews: { karma: number };
}

export async function getAggregateSocialStats(): Promise<SocialStats> {
  try {
    const [mastodon, devtoStats, blueskyFeed, youtubeVideos, hnKarma] = await Promise.all([
      getMastodonAccount().catch(() => null),
      getDevToStats().catch(() => ({ totalArticles: 0, totalReactions: 0 })),
      getBlueskyFeed(50).catch(() => []),
      getYouTubeVideos(1).catch(() => []),
      getHNUserKarma().catch(() => 0),
    ]);

    return {
      mastodon: {
        followers: mastodon?.followers_count || 0,
        posts: mastodon?.statuses_count || 0,
      },
      devto: {
        articles: devtoStats.totalArticles,
        reactions: devtoStats.totalReactions,
      },
      bluesky: {
        posts: blueskyFeed.length,
      },
      youtube: {
        videos: youtubeVideos.length,
      },
      hackerNews: {
        karma: hnKarma,
      },
    };
  } catch (error) {
    console.error('Failed to fetch social stats:', error);
    return {
      mastodon: { followers: 0, posts: 0 },
      devto: { articles: 0, reactions: 0 },
      bluesky: { posts: 0 },
      youtube: { videos: 0 },
      hackerNews: { karma: 0 },
    };
  }
}

export default {
  getMastodonAccount,
  getMastodonStatuses,
  getBlueskyFeed,
  getDevToArticles,
  getDevToStats,
  getMediumArticles,
  getRedditSubmissions,
  getHNUserKarma,
  getYouTubeVideos,
  getPixelfedPhotos,
  getAggregateSocialStats,
};
