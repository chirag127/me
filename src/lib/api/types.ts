/**
 * Shared types for all API integrations.
 * Used by build-time data fetcher and Astro pages.
 */

// ── Movies & TV ──────────────────────────────

export interface TraktMovie {
  title: string;
  year: number;
  traktSlug: string;
  tmdbId: number | null;
  imdbId: string | null;
  rating: number | null;
  ratedAt: string | null;
  watchedAt: string | null;
  /** poster URL from TMDB */
  posterUrl: string | null;
  genres: string[];
  overview: string | null;
  runtime: number | null;
  category: 'watched' | 'watching' | 'watchlist';
}

export interface TraktShow {
  title: string;
  year: number;
  traktSlug: string;
  tmdbId: number | null;
  imdbId: string | null;
  rating: number | null;
  posterUrl: string | null;
  genres: string[];
  overview: string | null;
  category: 'watched' | 'watching' | 'watchlist';
  episodesWatched: number;
}

export interface MoviesData {
  watched: TraktMovie[];
  watching: TraktMovie[];
  watchlist: TraktMovie[];
  shows: TraktShow[];
  stats: {
    totalWatched: number;
    totalWatchlist: number;
    avgRating: number;
    topGenres: string[];
    totalHours: number;
  };
  lastUpdated: string;
}

// ── Books ────────────────────────────────────

export interface OpenLibraryBook {
  title: string;
  authors: string[];
  coverId: number | null;
  coverUrl: string | null;
  key: string;
  firstPublishYear: number | null;
  subjects: string[];
  category: 'reading' | 'read' | 'want-to-read';
}

export interface BooksData {
  reading: OpenLibraryBook[];
  read: OpenLibraryBook[];
  wantToRead: OpenLibraryBook[];
  stats: {
    totalRead: number;
    totalReading: number;
    totalWantToRead: number;
    topSubjects: string[];
  };
  lastUpdated: string;
}

// ── Music ────────────────────────────────────

export interface LastFmArtist {
  name: string;
  playcount: number;
  url: string;
  imageUrl: string | null;
}

export interface LastFmTrack {
  name: string;
  artist: string;
  playcount: number;
  url: string;
  imageUrl: string | null;
}

export interface LastFmAlbum {
  name: string;
  artist: string;
  playcount: number;
  url: string;
  imageUrl: string | null;
}

export interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  imageUrl: string | null;
  previewUrl: string | null;
  externalUrl: string;
}

export interface MusicData {
  topArtists: LastFmArtist[];
  topTracks: LastFmTrack[];
  topAlbums: LastFmAlbum[];
  recentTracks: LastFmTrack[];
  spotifyTopTracks: SpotifyTrack[];
  spotifyTopArtists: LastFmArtist[];
  totalScrobbles: number;
  lovedTracks: number;
  lastUpdated: string;
}

// ── Anime & Manga ────────────────────────────

export interface AniListEntry {
  id: number;
  title: string;
  titleEnglish: string | null;
  coverUrl: string | null;
  bannerUrl: string | null;
  score: number | null;
  progress: number;
  episodes: number | null;
  chapters: number | null;
  status: 'WATCHING' | 'COMPLETED' | 'PAUSED' | 'DROPPED' | 'PLANNING';
  genres: string[];
  format: string | null;
  type: 'ANIME' | 'MANGA';
}

export interface AnimeData {
  watching: AniListEntry[];
  completed: AniListEntry[];
  paused: AniListEntry[];
  dropped: AniListEntry[];
  planning: AniListEntry[];
  manga: AniListEntry[];
  stats: {
    totalAnime: number;
    totalManga: number;
    meanScore: number;
    minutesWatched: number;
    episodesWatched: number;
    chaptersRead: number;
    topGenres: string[];
  };
  lastUpdated: string;
}

// ── Gaming ───────────────────────────────────

export interface SteamGame {
  appId: number;
  name: string;
  playtimeMinutes: number;
  playtimeHours: number;
  iconUrl: string | null;
  logoUrl: string | null;
  lastPlayed: number;
}

export interface LichessStats {
  username: string;
  ratings: Record<string, { rating: number; games: number }>;
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface GamingData {
  steamGames: SteamGame[];
  steamStats: {
    totalGames: number;
    totalPlaytimeHours: number;
    recentGames: SteamGame[];
  };
  lichess: LichessStats | null;
  lastUpdated: string;
}

// ── Coding ───────────────────────────────────

export interface WakaTimeLanguage {
  name: string;
  totalSeconds: number;
  percent: number;
  text: string;
}

export interface WakaTimeStats {
  totalSeconds: number;
  totalText: string;
  dailyAverage: number;
  dailyAverageText: string;
  languages: WakaTimeLanguage[];
  editors: { name: string; percent: number }[];
  projects: { name: string; totalSeconds: number }[];
  bestDay: {
    date: string;
    totalSeconds: number;
    text: string;
  } | null;
}

export interface CodingData {
  github: {
    user: {
      login: string;
      name: string;
      avatarUrl: string;
      bio: string;
      publicRepos: number;
      followers: number;
    } | null;
    repos: {
      name: string;
      description: string | null;
      language: string | null;
      stars: number;
      forks: number;
      url: string;
      topics: string[];
      updatedAt: string;
    }[];
    topLanguages: { name: string; count: number }[];
    totalStars: number;
  };
  leetcode: {
    totalSolved: number;
    easy: number;
    medium: number;
    hard: number;
    ranking: number;
    acceptanceRate: number;
  } | null;
  codewars: {
    honor: number;
    rank: string;
    totalCompleted: number;
    languages: Record<string, { rank: number }>;
  } | null;
  wakatime: WakaTimeStats | null;
  lastUpdated: string;
}

// ── Social ───────────────────────────────────

export interface BlueskyPost {
  text: string;
  createdAt: string;
  uri: string;
  likeCount: number;
  replyCount: number;
  repostCount: number;
}

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  tags: string[];
  reactions: number;
  comments: number;
  readingTime: number;
  coverImage: string | null;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
}

export interface SocialData {
  bluesky: {
    posts: BlueskyPost[];
    handle: string;
  };
  devto: DevToArticle[];
  youtube: {
    channelStats: {
      subscribers: number;
      videoCount: number;
      viewCount: number;
    } | null;
    videos: YouTubeVideo[];
  };
  hackernews: {
    karma: number;
    submittedCount: number;
  } | null;
  lastUpdated: string;
}

// ── Aggregated ───────────────────────────────

export interface AllData {
  movies: MoviesData;
  books: BooksData;
  music: MusicData;
  anime: AnimeData;
  gaming: GamingData;
  coding: CodingData;
  social: SocialData;
}
