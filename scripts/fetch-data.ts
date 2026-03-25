import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load env vars
dotenv.config();

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import API modules
import { fetchTraktWatchedMovies, fetchTraktWatchlistMovies, fetchTraktRatings, fetchTraktShows } from '../src/lib/api/trakt.js';
import { fetchLastFmTopArtists, fetchLastFmTopTracks, fetchLastFmTopAlbums, fetchLastFmRecentTracks, fetchLastFmStats } from '../src/lib/api/lastfm.js';
import { fetchSpotifyTopTracks, fetchSpotifyTopArtists } from '../src/lib/api/spotify.js';
import { fetchOpenLibraryBooks } from '../src/lib/api/openlibrary.js';
import { fetchAniListAnime, fetchAniListManga } from '../src/lib/api/anilist.js';
import { fetchSteamGames, fetchSteamRecentGames, fetchLichessStats } from '../src/lib/api/steam.js';
import { fetchWakaTimeStats } from '../src/lib/api/wakatime.js';
import { fetchGitHubUser, fetchGitHubRepos, extractTopLanguages } from '../src/lib/api/github-api.js';
import { fetchLeetCodeStats } from '../src/lib/api/leetcode.js';
import { fetchCodewarsStats } from '../src/lib/api/codewars.js';
import { fetchDevToArticles } from '../src/lib/api/devto.js';
import { fetchHackerNewsStats } from '../src/lib/api/hackernews.js';
import { fetchBlueskyPosts } from '../src/lib/api/bluesky.js';
import { fetchYouTubeStats, fetchYouTubeVideos } from '../src/lib/api/youtube.js';
import { fetchJikanStats } from '../src/lib/api/jikan.js';

// Setup directories
const GENERATED_DIR = path.resolve(__dirname, '../src/data/generated');

// Initialize Firebase Admin (Only if credentials exist - safe fallback for local dev)
let db: FirebaseFirestore.Firestore | null = null;
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const formattedKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      })
    });
    db = getFirestore();
    console.log('[Firestore] Admin SDK initialized.');
  } else {
    console.warn('[Firestore] Admin SDK missing credentials, skipping Firestore push.');
  }
} catch (e) {
  console.error('[Firestore] Initialization failed:', e);
}

async function ensureDir() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
}

async function writeJson(filename: string, data: any) {
  const filePath = path.join(GENERATED_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`[Cache] Wrote ${filename} (${JSON.stringify(data).length} bytes)`);
}

async function pushToFirestore(collection: string, doc: string, data: any) {
  if (!db) return;
  try {
    await db.collection(collection).doc(doc).set(data);
    console.log(`[Firestore] Updated ${collection}/${doc}`);
  } catch (error) {
    console.error(`[Firestore] Failed to update ${collection}/${doc}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting Data Fetcher Orchestrator...');
  await ensureDir();

  const timestamp = new Date().toISOString();

  // 1. Movies & Shows
  console.log('\n--- Fetching Movies & Shows ---');
  const [traktWatched, traktWatchlist, traktRatings, traktShows] = await Promise.all([
    fetchTraktWatchedMovies(),
    fetchTraktWatchlistMovies(),
    fetchTraktRatings(),
    fetchTraktShows()
  ]);
  
  // Merge ratings into movies
  const movies = {
    watched: traktWatched.map(m => ({ ...m, rating: traktRatings[m.traktSlug]?.rating || null, ratedAt: traktRatings[m.traktSlug]?.ratedAt || null })),
    watchlist: traktWatchlist.map(m => ({ ...m, rating: traktRatings[m.traktSlug]?.rating || null, ratedAt: traktRatings[m.traktSlug]?.ratedAt || null })),
    shows: traktShows,
    stats: {
      totalWatched: traktWatched.length,
      totalShows: traktShows.length,
    },
    lastUpdated: timestamp
  };
  await writeJson('movies.json', movies);
  await pushToFirestore('media', 'movies', movies);

  // 2. Books
  console.log('\n--- Fetching Books ---');
  const [read, reading, wantToRead] = await Promise.all([
    fetchOpenLibraryBooks('already-read'),
    fetchOpenLibraryBooks('currently-reading'),
    fetchOpenLibraryBooks('want-to-read')
  ]);
  
  const books = { read, reading, wantToRead, lastUpdated: timestamp };
  await writeJson('books.json', books);
  await pushToFirestore('media', 'books', books);

  // 3. Music
  console.log('\n--- Fetching Music ---');
  const [lastFmStats, topArtists, topTracks, topAlbums, recentTracks, spotTopTracks, spotTopArtists] = await Promise.all([
    fetchLastFmStats(),
    fetchLastFmTopArtists(),
    fetchLastFmTopTracks(),
    fetchLastFmTopAlbums(),
    fetchLastFmRecentTracks(),
    fetchSpotifyTopTracks(),
    fetchSpotifyTopArtists()
  ]);

  const music = {
    lastfm: { stats: lastFmStats, topArtists, topTracks, topAlbums, recentTracks },
    spotify: { topTracks: spotTopTracks, topArtists: spotTopArtists },
    lastUpdated: timestamp
  };
  await writeJson('music.json', music);
  await pushToFirestore('media', 'music', music);

  // 4. Anime & Manga
  console.log('\n--- Fetching Anime ---');
  const [anime, manga, jikanStats] = await Promise.all([
    fetchAniListAnime(),
    fetchAniListManga(),
    fetchJikanStats()
  ]);

  const animeData = { anime, manga, stats: jikanStats, lastUpdated: timestamp };
  await writeJson('anime.json', animeData);
  await pushToFirestore('media', 'anime', animeData);

  // 5. Gaming
  console.log('\n--- Fetching Gaming ---');
  const [steamGames, steamRecent, lichessStats] = await Promise.all([
    fetchSteamGames(),
    fetchSteamRecentGames(),
    fetchLichessStats()
  ]);

  const gaming = { steamGames, steamRecent, lichessStats, lastUpdated: timestamp };
  await writeJson('games.json', gaming);
  await pushToFirestore('media', 'gaming', gaming);

  // 6. Coding
  console.log('\n--- Fetching Coding ---');
  const [githubUser, githubRepos, wakatime, leetcode, codewars] = await Promise.all([
    fetchGitHubUser(),
    fetchGitHubRepos(),
    fetchWakaTimeStats(),
    fetchLeetCodeStats(),
    fetchCodewarsStats()
  ]);

  const topLangs = extractTopLanguages(githubRepos);
  
  const coding = {
    github: { user: githubUser, repos: githubRepos, topLanguages: topLangs },
    wakatime, leetcode, codewars,
    lastUpdated: timestamp
  };
  await writeJson('coding.json', coding);
  await pushToFirestore('media', 'coding', coding);

  // 7. Social & Content
  console.log('\n--- Fetching Social ---');
  const [devto, hackernews, bluesky, ytStats, ytVids] = await Promise.all([
    fetchDevToArticles(),
    fetchHackerNewsStats(),
    fetchBlueskyPosts(),
    fetchYouTubeStats(),
    fetchYouTubeVideos()
  ]);

  const social = {
    devto, hackernews, bluesky,
    youtube: { stats: ytStats, videos: ytVids },
    lastUpdated: timestamp
  };
  await writeJson('social.json', social);
  await pushToFirestore('media', 'social', social);

  console.log('\n✅ Data Fetching Complete!');
}

main().catch(error => {
  console.error('❌ Fatal Error in Data Fetcher:', error);
  process.exit(1);
});
