import { fetchJson } from './fetcher';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function getOptions(): RequestInit {
  return {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      accept: 'application/json',
    },
  };
}

// Memory cache to avoid hitting TMDB for the same movie twice during the build
const posterCache = new Map<number, string | null>();

export async function fetchPosterForMovie(tmdbId: number | null): Promise<string | null> {
  if (!tmdbId) return null;
  if (posterCache.has(tmdbId)) return posterCache.get(tmdbId) || null;

  // Wait a tiny bit to respect rate limits if we do many at once
  await new Promise(resolve => setTimeout(resolve, 50));

  const data = await fetchJson<any>(
    `${TMDB_API_URL}/movie/${tmdbId}?language=en-US`,
    getOptions(),
    'TMDB'
  );

  const posterPath = data?.poster_path;
  const url = posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null;
  
  posterCache.set(tmdbId, url);
  return url;
}

export async function fetchPosterForShow(tmdbId: number | null): Promise<string | null> {
  if (!tmdbId) return null;
  if (posterCache.has(tmdbId)) return posterCache.get(tmdbId) || null;
  
  await new Promise(resolve => setTimeout(resolve, 50));

  const data = await fetchJson<any>(
    `${TMDB_API_URL}/tv/${tmdbId}?language=en-US`,
    getOptions(),
    'TMDB'
  );

  const posterPath = data?.poster_path;
  const url = posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null;
  
  posterCache.set(tmdbId, url);
  return url;
}
