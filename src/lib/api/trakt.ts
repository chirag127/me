import { CONFIG } from '../config';
import { fetchJson } from './fetcher';
import type { TraktMovie, TraktShow } from './types';

const TRAKT_API_URL = 'https://api.trakt.tv';

let cachedAccessToken: string | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const clientId = process.env.TRAKT_CLIENT_ID;
  const clientSecret = process.env.TRAKT_CLIENT_SECRET;
  const refreshToken = process.env.TRAKT_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('[Trakt] Missing credentials for token refresh.');
    return null;
  }

  try {
    const res = await fetch('https://api.trakt.tv/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
        grant_type: 'refresh_token',
      }),
    });

    if (!res.ok) {
      console.warn(
        '[Trakt] Token refresh failed:',
        res.status,
        await res.text(),
      );
      return null;
    }

    const data = await res.json();
    console.log('[Trakt] Token refreshed successfully.');
    return data.access_token;
  } catch (err) {
    console.error('[Trakt] Token refresh error:', err);
    return null;
  }
}

async function getHeaders(): Promise<RequestInit> {
  if (!cachedAccessToken) {
    cachedAccessToken = process.env.TRAKT_ACCESS_TOKEN || null;
  }

  const accessToken = cachedAccessToken;
  return {
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': process.env.TRAKT_CLIENT_ID || '',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    } as Record<string, string>,
  };
}

async function fetchTrakt<T>(url: string): Promise<T | null> {
  const headers = await getHeaders();
  for (let attempt = 0; attempt < 2; attempt++) {
    const data = await fetchJson<T>(url, headers, 'Trakt');
    if (data !== null) return data;

    // If we got a 403/401 and haven't refreshed yet, try refreshing
    if (attempt === 0) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        cachedAccessToken = refreshed;
        continue;
      }
    }
    break;
  }
  return null;
}

export async function fetchTraktWatchedMovies(): Promise<TraktMovie[]> {
  const data = await fetchTrakt<any[]>(
    `${TRAKT_API_URL}/users/${CONFIG.user.trakt}/watched/movies?extended=full`,
  );

  if (!data) return [];

  return data.map((item) => ({
    title: item.movie.title,
    year: item.movie.year,
    traktSlug: item.movie.ids.slug,
    tmdbId: item.movie.ids.tmdb,
    imdbId: item.movie.ids.imdb,
    rating: null,
    ratedAt: null,
    watchedAt: item.last_watched_at,
    posterUrl: null,
    genres: item.movie.genres || [],
    overview: item.movie.overview,
    runtime: item.movie.runtime,
    category: 'watched' as const,
  }));
}

export async function fetchTraktWatchlistMovies(): Promise<TraktMovie[]> {
  const data = await fetchTrakt<any[]>(
    `${TRAKT_API_URL}/users/${CONFIG.user.trakt}/watchlist/movies?extended=full`,
  );

  if (!data) return [];

  return data.map((item) => ({
    title: item.movie.title,
    year: item.movie.year,
    traktSlug: item.movie.ids.slug,
    tmdbId: item.movie.ids.tmdb,
    imdbId: item.movie.ids.imdb,
    rating: null,
    ratedAt: null,
    watchedAt: null,
    posterUrl: null,
    genres: item.movie.genres || [],
    overview: item.movie.overview,
    runtime: item.movie.runtime,
    category: 'watchlist' as const,
  }));
}

export async function fetchTraktRatings(): Promise<
  Record<string, { rating: number; ratedAt: string }>
> {
  const data = await fetchTrakt<any[]>(
    `${TRAKT_API_URL}/users/${CONFIG.user.trakt}/ratings/movies`,
  );

  if (!data) return {};

  const ratings: Record<string, { rating: number; ratedAt: string }> = {};
  data.forEach((item) => {
    ratings[item.movie.ids.slug] = {
      rating: item.rating,
      ratedAt: item.rated_at,
    };
  });

  return ratings;
}

export async function fetchTraktShows(): Promise<TraktShow[]> {
  const data = await fetchTrakt<any[]>(
    `${TRAKT_API_URL}/users/${CONFIG.user.trakt}/watched/shows?extended=full`,
  );

  if (!data) return [];

  return data.map((item) => ({
    title: item.show.title,
    year: item.show.year,
    traktSlug: item.show.ids.slug,
    tmdbId: item.show.ids.tmdb,
    rating: null,
    posterUrl: null,
    genres: item.show.genres || [],
    overview: item.show.overview,
    category: 'watched' as const,
    episodesWatched: item.plays,
  }));
}
