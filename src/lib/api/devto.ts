import { CONFIG } from '../config';
import { fetchJson } from './fetcher';
import type { DevToArticle } from './types';

const DEVTO_API = 'https://dev.to/api/articles';

export async function fetchDevToArticles(): Promise<DevToArticle[]> {
  const apiKey = process.env.DEVTO_API_KEY;
  const username = CONFIG.user.devto;

  const url = apiKey
    ? `${DEVTO_API}/me/published` // If key exists, get own published (higher limit, includes hidden potentially)
    : `${DEVTO_API}?username=${username}&per_page=30`; // Public fallback

  const options: RequestInit = apiKey ? { headers: { 'api-key': apiKey } } : {};

  const data = await fetchJson<any[]>(url, options, 'Dev.to');

  if (!data) return [];

  return data.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description,
    publishedAt: article.published_at,
    url: article.url,
    tags: article.tag_list || [],
    reactions: article.public_reactions_count,
    comments: article.comments_count,
    readingTime: article.reading_time_minutes,
    coverImage: article.cover_image || null,
  }));
}
