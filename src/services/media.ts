/**
 * Project Me - Media Services
 * API integrations for Last.fm, Letterboxd, AniList, Trakt, ListenBrainz
 */

import { CONFIG } from '../config';

// Types
export interface LastFmTrack {
  name: string;
  artist: { '#text': string; mbid?: string };
  album: { '#text': string };
  image: Array<{ '#text': string; size: string }>;
  url: string;
  date?: { uts: string; '#text': string };
  '@attr'?: { nowplaying: string };
}

export interface LastFmTopArtist {
  name: string;
  playcount: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
}

export interface LastFmTopTrack {
  name: string;
  playcount: string;
  artist: { name: string; url: string };
  url: string;
  image: Array<{ '#text': string; size: string }>;
}

export interface LastFmTopAlbum {
  name: string;
  playcount: string;
  artist: { name: string; url: string };
  url: string;
  image: Array<{ '#text': string; size: string }>;
}

export interface LastFmUser {
  user: string;
  playcount: string;
  artist_count: string;
  track_count: string;
  album_count: string;
  registered: { unixtime: string };
  image: Array<{ '#text': string; size: string }>;
}

export interface AniListEntry {
  id: number;
  media: {
    id: number;
    title: { romaji: string; english: string; native: string };
    coverImage: { large: string; medium: string };
    type: 'ANIME' | 'MANGA';
    format: string;
    status: string;
    episodes?: number;
    chapters?: number;
    averageScore: number;
  };
  status: string;
  score: number;
  progress: number;
  completedAt?: { year: number; month: number; day: number };
}

export interface TraktShow {
  show: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tmdb: number;
    };
  };
  watched_at: string;
  action: string;
}

export interface TraktShowHistory {
  show: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tmdb: number;
    };
    status?: string;
    aired_episodes?: number;
    runtime?: number;
    genres?: string[];
    rating?: number;
  };
  plays: number;
  last_watched_at: string;
  last_updated_at: string;
  seasons?: Array<{
    number: number;
    episodes: Array<{ number: number }>;
  }>;
}

// Cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

const TIMEOUT = 10000; // 10 seconds timeout

async function fetchWithCache<T>(url: string, options?: RequestInit): Promise<T> {
  const cacheKey = url;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return data as T;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Last.fm API
export async function getLastFmRecentTracks(limit = 10): Promise<LastFmTrack[]> {
  const url = `${CONFIG.api.lastfm}/?method=user.getrecenttracks&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&limit=${limit}`;
  const data = await fetchWithCache<{ recenttracks: { track: LastFmTrack[] } }>(url);
  return data.recenttracks.track;
}

export async function getLastFmTopArtists(period = '7day', limit = 10): Promise<LastFmTopArtist[]> {
  const url = `${CONFIG.api.lastfm}/?method=user.gettopartists&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&period=${period}&limit=${limit}`;
  const data = await fetchWithCache<{ topartists: { artist: LastFmTopArtist[] } }>(url);
  return data.topartists.artist;
}

export async function getLastFmTopTracks(period = '7day', limit = 10): Promise<LastFmTopTrack[]> {
  const url = `${CONFIG.api.lastfm}/?method=user.gettoptracks&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&period=${period}&limit=${limit}`;
  const data = await fetchWithCache<{ toptracks: { track: LastFmTopTrack[] } }>(url);
  return data.toptracks.track;
}

export async function getLastFmTopAlbums(period = '7day', limit = 10): Promise<LastFmTopAlbum[]> {
  const url = `${CONFIG.api.lastfm}/?method=user.gettopalbums&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&period=${period}&limit=${limit}`;
  const data = await fetchWithCache<{ topalbums: { album: LastFmTopAlbum[] } }>(url);
  return data.topalbums.album;
}

export async function getLastFmUserInfo(): Promise<LastFmUser> {
  const url = `${CONFIG.api.lastfm}/?method=user.getinfo&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json`;
  const data = await fetchWithCache<{ user: LastFmUser }>(url);
  return data.user;
}

export async function getNowPlaying(): Promise<LastFmTrack | null> {
  const tracks = await getLastFmRecentTracks(1);
  if (tracks.length > 0 && tracks[0]['@attr']?.nowplaying === 'true') {
    return tracks[0];
  }
  return null;
}

// AniList GraphQL API
const ANILIST_QUERY = `
query ($username: String, $type: MediaType) {
  MediaListCollection(userName: $username, type: $type) {
    lists {
      name
      status
      entries {
        id
        media {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          type
          format
          status
          episodes
          chapters
          averageScore
        }
        status
        score
        progress
        completedAt {
          year
          month
          day
        }
      }
    }
  }
}
`;

export async function getAniListMedia(type: 'ANIME' | 'MANGA'): Promise<AniListEntry[]> {
  const response = await fetch(CONFIG.api.anilist, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: ANILIST_QUERY,
      variables: { username: CONFIG.user.anilist, type },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch AniList data');
  }

  const data = await response.json();
  const lists = data.data?.MediaListCollection?.lists || [];

  return lists.flatMap((list: { entries: AniListEntry[] }) => list.entries);
}

export async function getAnimeList(): Promise<AniListEntry[]> {
  return getAniListMedia('ANIME');
}

export async function getMangaList(): Promise<AniListEntry[]> {
  return getAniListMedia('MANGA');
}

// Letterboxd (via RSS2JSON)
export interface LetterboxdFilm {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
}

export async function getLetterboxdFilms(limit = 10): Promise<LetterboxdFilm[]> {
  const rssUrl = `${CONFIG.api.letterboxd}/${CONFIG.user.letterboxd}/rss/`;
  const url = `${CONFIG.api.rss2json}${encodeURIComponent(rssUrl)}`;

  try {
    const data = await fetchWithCache<{ items: LetterboxdFilm[] }>(url);
    return data.items.slice(0, limit);
  } catch {
    console.warn('Letterboxd RSS fetch failed');
    return [];
  }
}

// Trakt API
export interface TraktMovie {
  movie: {
    title: string;
    year: number;
    ids: { trakt: number; slug: string; imdb: string; tmdb: number };
  };
  watched_at: string;
  action: string;
  type: 'movie';
}

export async function getTraktHistory(limit = 10): Promise<TraktShow[]> {
  const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/history?limit=${limit}`;

  try {
    const data = await fetchWithCache<TraktShow[]>(url, {
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': CONFIG.keys.traktClientId,
      },
    });
    return data;
  } catch {
    console.warn('Trakt API fetch failed');
    return [];
  }
}

export async function getTraktRecentMovies(
  limit = 12,
): Promise<TraktMovie[]> {
  const url =
    `${CONFIG.api.trakt}/users/` +
    `${CONFIG.user.trakt}/history/movies` +
    `?limit=${limit}&extended=full`;
  try {
    const data = await fetchWithCache<TraktMovie[]>(
      url,
      {
        headers: {
          'Content-Type': 'application/json',
          'trakt-api-version': '2',
          'trakt-api-key':
            CONFIG.keys.traktClientId,
        },
      },
    );
    return data;
  } catch {
    console.warn('Trakt movies fetch failed');
    return [];
  }
}

/** Fetch watched TV shows from Trakt */
export async function getTraktWatchedShows(
  limit = 20,
): Promise<TraktShowHistory[]> {
  const url =
    `${CONFIG.api.trakt}/users/` +
    `${CONFIG.user.trakt}/watched/shows` +
    `?extended=full&limit=${limit}`;
  try {
    const data = await fetchWithCache<
      TraktShowHistory[]
    >(url, {
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key':
          CONFIG.keys.traktClientId,
      },
    });
    return data;
  } catch {
    console.warn('Trakt shows fetch failed');
    return [];
  }
}

/**
 * Build poster URL from IMDB ID.
 * Uses metahub.space — free, no auth.
 */
export function getImdbPosterUrl(
  imdbId: string,
): string {
  return (
    `${CONFIG.api.metahub}` +
    `/poster/small/${imdbId}/img`
  );
}

// ListenBrainz API
export interface ListenBrainzListen {
  track_metadata: {
    track_name: string;
    artist_name: string;
    release_name?: string;
  };
  listened_at: number;
}

export async function getListenBrainzRecent(count = 10): Promise<ListenBrainzListen[]> {
  const url = `${CONFIG.api.listenbrainz}/${CONFIG.user.listenbrainz}/listens?count=${count}`;

  try {
    const data = await fetchWithCache<{ payload: { listens: ListenBrainzListen[] } }>(url);
    return data.payload.listens;
  } catch {
    console.warn('ListenBrainz API fetch failed');
    return [];
  }
}

// Aggregate media stats
export interface MediaStats {
  music: {
    totalScrobbles: number;
    recentTrack: LastFmTrack | null;
  };
  anime: {
    watching: number;
    completed: number;
  };
  manga: {
    reading: number;
    completed: number;
  };
}

export async function getAggregateMediaStats(): Promise<MediaStats> {
  try {
    const [lastfmUser, anime, manga, nowPlaying] = await Promise.all([
      getLastFmUserInfo().catch(() => null),
      getAnimeList().catch(() => []),
      getMangaList().catch(() => []),
      getNowPlaying().catch(() => null),
    ]);

    return {
      music: {
        totalScrobbles: parseInt(lastfmUser?.playcount || '0'),
        recentTrack: nowPlaying,
      },
      anime: {
        watching: anime.filter(e => e.status === 'CURRENT').length,
        completed: anime.filter(e => e.status === 'COMPLETED').length,
      },
      manga: {
        reading: manga.filter(e => e.status === 'CURRENT').length,
        completed: manga.filter(e => e.status === 'COMPLETED').length,
      },
    };
  } catch (error) {
    console.error('Failed to fetch media stats:', error);
    return {
      music: { totalScrobbles: 0, recentTrack: null },
      anime: { watching: 0, completed: 0 },
      manga: { reading: 0, completed: 0 },
    };
  }
}

export default {
  getLastFmRecentTracks,
  getLastFmTopArtists,
  getLastFmTopTracks,
  getLastFmTopAlbums,
  getLastFmUserInfo,
  getNowPlaying,
  getAnimeList,
  getMangaList,
  getLetterboxdFilms,
  getTraktHistory,
  getTraktRecentMovies,
  getTraktWatchedShows,
  getImdbPosterUrl,
  getListenBrainzRecent,
  getAggregateMediaStats,
};
