/**
 * API Service - Centralized API fetching for all library pages
 */

import { CONFIG } from '../config';

// Last.fm API
export const LastFmAPI = {
  async getRecentTracks(limit = 50): Promise<LastFmTrack[]> {
    const url = `${CONFIG.api.lastfm}?method=user.getrecenttracks&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.recenttracks?.track || [];
  },

  async getNowPlaying(): Promise<LastFmTrack | null> {
    const tracks = await this.getRecentTracks(1);
    if (tracks.length > 0 && tracks[0]['@attr']?.nowplaying === 'true') {
      return tracks[0];
    }
    return null;
  },

  async getTopTracks(period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' = 'overall', limit = 50): Promise<LastFmTrack[]> {
    const url = `${CONFIG.api.lastfm}?method=user.gettoptracks&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&period=${period}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.toptracks?.track || [];
  },

  async getTopArtists(period = 'overall', limit = 20): Promise<LastFmArtist[]> {
    const url = `${CONFIG.api.lastfm}?method=user.gettopartists&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&period=${period}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.topartists?.artist || [];
  },

  async getTopAlbums(period = 'overall', limit = 20): Promise<LastFmAlbum[]> {
    const url = `${CONFIG.api.lastfm}?method=user.gettopalbums&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&period=${period}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.topalbums?.album || [];
  },

  async getUserInfo(): Promise<LastFmUser | null> {
    const url = `${CONFIG.api.lastfm}?method=user.getinfo&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.user || null;
  },

  async getLovedTracks(limit = 50): Promise<LastFmLovedTrack[]> {
    const url = `${CONFIG.api.lastfm}?method=user.getlovedtracks&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.lovedtracks?.track || [];
  },

  async getFriends(limit = 50): Promise<LastFmFriend[]> {
    const url = `${CONFIG.api.lastfm}?method=user.getfriends&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&limit=${limit}&recenttracks=1`;
    const res = await fetch(url);
    const data = await res.json();
    return data.friends?.user || [];
  },

  async getTopTags(limit = 50): Promise<LastFmTag[]> {
    const url = `${CONFIG.api.lastfm}?method=user.gettoptags&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.toptags?.tag || [];
  },

  async getWeeklyChartList(): Promise<LastFmChartWeek[]> {
    const url = `${CONFIG.api.lastfm}?method=user.getweeklychartlist&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.weeklychartlist?.chart || [];
  },

  async getWeeklyTrackChart(from?: number, to?: number): Promise<LastFmWeeklyTrack[]> {
    let url = `${CONFIG.api.lastfm}?method=user.getweeklytrackchart&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json`;
    if (from && to) url += `&from=${from}&to=${to}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.weeklytrackchart?.track || [];
  },

  async getWeeklyArtistChart(from?: number, to?: number): Promise<LastFmWeeklyArtist[]> {
    let url = `${CONFIG.api.lastfm}?method=user.getweeklyartistchart&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json`;
    if (from && to) url += `&from=${from}&to=${to}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.weeklyartistchart?.artist || [];
  },

  async getWeeklyAlbumChart(from?: number, to?: number): Promise<LastFmWeeklyAlbum[]> {
    let url = `${CONFIG.api.lastfm}?method=user.getweeklyalbumchart&user=${CONFIG.user.lastfm}&api_key=${CONFIG.keys.lastfmApiKey}&format=json`;
    if (from && to) url += `&from=${from}&to=${to}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.weeklyalbumchart?.album || [];
  }
};

// Trakt API
export const TraktAPI = {
  headers: {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': CONFIG.keys.traktClientId
  },

  async getWatchedMovies(): Promise<TraktMovie[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/watched/movies`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getWatchedShows(): Promise<TraktShow[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/watched/shows`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getHistory(type: 'movies' | 'shows' = 'movies', limit = 50): Promise<TraktHistoryItem[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/history/${type}?limit=${limit}`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getWatchlist(type: 'movies' | 'shows' = 'movies'): Promise<TraktWatchlistItem[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/watchlist/${type}`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getStats(): Promise<TraktStats | null> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/stats`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getRatings(type: 'movies' | 'shows' | 'all' = 'all'): Promise<TraktRatingItem[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/ratings/${type}`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getCollection(type: 'movies' | 'shows' = 'movies'): Promise<TraktCollectionItem[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/collection/${type}`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getLists(): Promise<TraktList[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/lists`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getListItems(listId: string): Promise<TraktListItem[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/lists/${listId}/items`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getProfile(): Promise<TraktProfile> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getFollowers(): Promise<TraktFollower[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/followers`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getFollowing(): Promise<TraktFollower[]> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/following`;
    const res = await fetch(url, { headers: this.headers });
    return res.json();
  },

  async getWatching(): Promise<TraktWatchingItem | null> {
    const url = `${CONFIG.api.trakt}/users/${CONFIG.user.trakt}/watching`;
    const res = await fetch(url, { headers: this.headers });
    if (res.status === 204) return null;
    return res.json();
  }
};

// AniList GraphQL API
export const AniListAPI = {
  async query(query: string, variables: Record<string, unknown> = {}): Promise<unknown> {
    const res = await fetch(CONFIG.api.anilist, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });
    const data = await res.json();
    return data.data;
  },

  async getAnimeList(): Promise<AniListMedia[]> {
    const query = `
      query ($userName: String) {
        MediaListCollection(userName: $userName, type: ANIME) {
          lists {
            name
            entries {
              media {
                id
                title { romaji english native }
                coverImage { large medium }
                episodes
                status
                averageScore
                genres
                format
              }
              status
              score
              progress
            }
          }
        }
      }
    `;
    const data = await this.query(query, { userName: CONFIG.user.anilist }) as { MediaListCollection: AniListCollection };
    return data?.MediaListCollection?.lists?.flatMap(l => l.entries.map(e => ({ ...e.media, userStatus: e.status, userScore: e.score, userProgress: e.progress }))) || [];
  },

  async getMangaList(): Promise<AniListMedia[]> {
    const query = `
      query ($userName: String) {
        MediaListCollection(userName: $userName, type: MANGA) {
          lists {
            name
            entries {
              media {
                id
                title { romaji english native }
                coverImage { large medium }
                chapters
                volumes
                status
                averageScore
                genres
                format
              }
              status
              score
              progress
            }
          }
        }
      }
    `;
    const data = await this.query(query, { userName: CONFIG.user.anilist }) as { MediaListCollection: AniListCollection };
    return data?.MediaListCollection?.lists?.flatMap(l => l.entries.map(e => ({ ...e.media, userStatus: e.status, userScore: e.score, userProgress: e.progress }))) || [];
  }
};

// OpenLibrary API
export const OpenLibraryAPI = {
  async getReadBooks(): Promise<OpenLibraryBook[]> {
    const url = `${CONFIG.api.openlibrary}/${CONFIG.user.openlibrary}/books/already-read.json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.reading_log_entries || [];
  },

  async getWantToRead(): Promise<OpenLibraryBook[]> {
    const url = `${CONFIG.api.openlibrary}/${CONFIG.user.openlibrary}/books/want-to-read.json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.reading_log_entries || [];
  },

  async getCurrentlyReading(): Promise<OpenLibraryBook[]> {
    const url = `${CONFIG.api.openlibrary}/${CONFIG.user.openlibrary}/books/currently-reading.json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.reading_log_entries || [];
  },

  getBookCover(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }
};

// LifeLogger API (Google Sheets Apps Script)
export const LifeLoggerAPI = {
  baseUrl: '', // Set from chrome-extension config or localStorage

  setBaseUrl(url: string) {
    this.baseUrl = url;
  },

  async getStats(): Promise<LifeLoggerStats> {
    const url = `${this.baseUrl}?action=stats`;
    const res = await fetch(url);
    return res.json();
  },

  async getBrowseHistory(limit = 100, offset = 0): Promise<LifeLoggerHistoryResponse> {
    const url = `${this.baseUrl}?action=browse&limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    return res.json();
  },

  async getSearchHistory(limit = 100, offset = 0): Promise<LifeLoggerHistoryResponse> {
    const url = `${this.baseUrl}?action=search&limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    return res.json();
  },

  async getVideoHistory(limit = 100, offset = 0): Promise<LifeLoggerHistoryResponse> {
    const url = `${this.baseUrl}?action=video&limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    return res.json();
  }
};

// Type definitions
export interface LastFmTrack {
  name: string;
  artist: { '#text': string; mbid?: string };
  album: { '#text': string; mbid?: string };
  image: { '#text': string; size: string }[];
  url: string;
  date?: { uts: string; '#text': string };
  '@attr'?: { nowplaying: string };
  playcount?: string;
}

export interface LastFmArtist {
  name: string;
  playcount: string;
  url: string;
  image: { '#text': string; size: string }[];
}

export interface LastFmAlbum {
  name: string;
  artist: { name: string };
  playcount: string;
  url: string;
  image: { '#text': string; size: string }[];
}

export interface LastFmUser {
  name: string;
  playcount: string;
  artist_count: string;
  album_count: string;
  track_count: string;
  registered: { unixtime: string };
  image: { '#text': string; size: string }[];
}

export interface LastFmLovedTrack {
  name: string;
  artist: { name: string; url: string };
  date: { uts: string; '#text': string };
  url: string;
  image: { '#text': string; size: string }[];
}

export interface LastFmFriend {
  name: string;
  realname: string;
  url: string;
  country: string;
  registered: { unixtime: string };
  image: { '#text': string; size: string }[];
  recenttrack?: { name: string; artist: { '#text': string } };
}

export interface LastFmTag {
  name: string;
  count: string;
  url: string;
}

export interface LastFmChartWeek {
  from: string;
  to: string;
}

export interface LastFmWeeklyTrack {
  name: string;
  artist: { '#text': string };
  playcount: string;
  url: string;
  image?: { '#text': string; size: string }[];
}

export interface LastFmWeeklyArtist {
  name: string;
  playcount: string;
  url: string;
  mbid?: string;
}

export interface LastFmWeeklyAlbum {
  name: string;
  artist: { '#text': string };
  playcount: string;
  url: string;
  mbid?: string;
}

export interface TraktMovie {
  plays: number;
  last_watched_at: string;
  last_updated_at: string;
  movie: {
    title: string;
    year: number;
    ids: { trakt: number; slug: string; imdb: string; tmdb: number };
  };
}

export interface TraktShow {
  plays: number;
  last_watched_at: string;
  last_updated_at: string;
  show: {
    title: string;
    year: number;
    ids: { trakt: number; slug: string; imdb: string; tmdb: number };
  };
}

export interface TraktHistoryItem {
  id: number;
  watched_at: string;
  action: string;
  type: string;
  movie?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  show?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  episode?: { season: number; number: number; title: string };
}

export interface TraktWatchlistItem {
  rank: number;
  listed_at: string;
  movie?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  show?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
}

export interface TraktStats {
  movies: { plays: number; watched: number; minutes: number };
  shows: { watched: number; collected: number };
  episodes: { plays: number; watched: number; minutes: number };
}

export interface TraktRatingItem {
  rated_at: string;
  rating: number;
  type: 'movie' | 'show' | 'episode';
  movie?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  show?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  episode?: { season: number; number: number; title: string; ids: { tmdb: number; imdb: string } };
}

export interface TraktCollectionItem {
  collected_at: string;
  updated_at: string;
  movie?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  show?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  seasons?: { number: number; episodes: { number: number; collected_at: string }[] }[];
}

export interface TraktList {
  name: string;
  description: string;
  privacy: string;
  display_numbers: boolean;
  allow_comments: boolean;
  sort_by: string;
  sort_how: string;
  created_at: string;
  updated_at: string;
  item_count: number;
  comment_count: number;
  likes: number;
  ids: { trakt: number; slug: string };
}

export interface TraktListItem {
  rank: number;
  listed_at: string;
  type: 'movie' | 'show';
  movie?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  show?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
}

export interface TraktProfile {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vip_ep: boolean;
  ids: { slug: string };
  joined_at: string;
  location?: string;
  about?: string;
  gender?: string;
  age?: number;
  images?: { avatar: { full: string } };
}

export interface TraktFollower {
  followed_at: string;
  user: {
    username: string;
    private: boolean;
    name: string;
    vip: boolean;
    ids: { slug: string };
    images?: { avatar: { full: string } };
  };
}

export interface TraktWatchingItem {
  expires_at: string;
  started_at: string;
  action: string;
  type: 'movie' | 'episode';
  movie?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  show?: { title: string; year: number; ids: { tmdb: number; imdb: string } };
  episode?: { season: number; number: number; title: string };
}

export interface AniListMedia {
  id: number;
  title: { romaji: string; english: string | null; native: string };
  coverImage: { large: string; medium: string };
  episodes?: number;
  chapters?: number;
  volumes?: number;
  status: string;
  averageScore: number;
  genres: string[];
  format: string;
  userStatus?: string;
  userScore?: number;
  userProgress?: number;
}

export interface AniListCollection {
  lists: {
    name: string;
    entries: {
      media: AniListMedia;
      status: string;
      score: number;
      progress: number;
    }[];
  }[];
}

export interface OpenLibraryBook {
  work: {
    title: string;
    key: string;
    author_keys: string[];
    author_names: string[];
    cover_id?: number;
    first_publish_year?: number;
  };
  logged_edition?: string;
  logged_date?: string;
}

export interface LifeLoggerStats {
  totalPages: number;
  totalSearches: number;
  totalVideos: number;
  topDomains: { name: string; count: number }[];
  lastUpdated: string;
}

export interface LifeLoggerHistoryResponse {
  data: LifeLoggerEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface LifeLoggerEntry {
  id: string;
  url: string;
  title: string;
  timestamp: string;
  type?: string;
  query?: string;
  engine?: string;
  platform?: string;
  duration?: number;
  screenshot_url?: string;
}
