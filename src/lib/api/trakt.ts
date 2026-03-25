import { fetchJson } from './fetcher';
import type { TraktMovie, TraktShow } from './types';
import { CONFIG } from '../config';

const TRAKT_API_URL = 'https://api.trakt.tv';

function getHeaders(): RequestInit {
  const accessToken = process.env.TRAKT_ACCESS_TOKEN;
  return {
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': process.env.TRAKT_CLIENT_ID || '',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    } as Record<string, string>,
  };
}

export async function fetchTraktWatchedMovies(): Promise<TraktMovie[]> {
  const data = await fetchJson<any[]>(
    `${TRAKT_API_URL}/users/${CONFIG.user.trakt}/watched/movies?extended=full`,
    getHeaders(),
    'Trakt'
  );
  
  if (!data) return [];
  
  return data.map((item) => ({
    title: item.movie.title,
    year: item.movie.year,
    traktSlug: item.movie.ids.slug,
    tmdbId: item.movie.ids.tmdb,
    imdbId: item.movie.ids.imdb,
    rating: null, // Fetched from ratings endpoint
    ratedAt: null,
    watchedAt: item.last_watched_at,
    posterUrl: null, // Fetched from TMDB
    genres: item.movie.genres || [],
    overview: item.movie.overview,
    runtime: item.movie.runtime,
    category: 'watched',
  }));
}

export async function fetchTraktWatchlistMovies(): Promise<TraktMovie[]> {
  const data = await fetchJson<any[]>(
    `${TRAKT_API_URL}/users/${CONFIG.user.trakt}/watchlist/movies?extended=full`,
    getHeaders(),
    'Trakt'
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
    category: 'watchlist',
  }));
}

export async function fetchTraktRatings(): Promise<Record<string, { rating: number; ratedAt: string }>> {
  const data = await fetchJson<any[]>(
    `${TRAKT_API_URL}/users/${CONFIG.user.trakt}/ratings/movies`,
    getHeaders(),
    'Trakt'
  );
  
  if (!data) return {};
  
  const ratings: Record<string, { rating: number; ratedAt: string }> = {};
  data.forEach(item => {
    ratings[item.movie.ids.slug] = {
      rating: item.rating,
      ratedAt: item.rated_at,
    };
  });
  
  return ratings;
}

export async function fetchTraktShows(): Promise<TraktShow[]> {
  const data = await fetchJson<any[]>(
    `${TRAKT_API_URL}/users/${CONFIG.user.trakt}/watched/shows?extended=full`,
    getHeaders(),
    'Trakt'
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
    category: 'watched',
    episodesWatched: item.plays,
  }));
}
