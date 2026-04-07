import { CONFIG } from '../config';
import { fetchJson } from './fetcher';
import type { TraktMovie, TraktShow } from './types';

const TRAKT_API_URL = 'https://api.trakt.tv';

/**
 * Build headers for Trakt API requests.
 * Uses client ID only (public profile).
 */
function getHeaders(): RequestInit {
  const clientId =
    process.env.TRAKT_CLIENT_ID ||
    CONFIG.keys.traktClientId;

  return {
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': clientId,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36',
    } as Record<string, string>,
  };
}

async function fetchTrakt<T>(url: string): Promise<T | null> {
  const opts = getHeaders();
  const data = await fetchJson<T>(url, opts, 'Trakt');
  return data;
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
    posterUrl: item.movie.ids.imdb
      ? `https://imdb.iamidiotareyoutoo.com/photo/${item.movie.ids.imdb}?w=500&h=750`
      : null,
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
    posterUrl: item.movie.ids.imdb
      ? `https://imdb.iamidiotareyoutoo.com/photo/${item.movie.ids.imdb}?w=500&h=750`
      : null,
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
    imdbId: item.show.ids.imdb,
    rating: null,
    posterUrl: item.show.ids.imdb
      ? `https://imdb.iamidiotareyoutoo.com/photo/${item.show.ids.imdb}?w=500&h=750`
      : null,
    genres: item.show.genres || [],
    overview: item.show.overview,
    category: 'watched' as const,
    episodesWatched: item.plays,
  }));
}
