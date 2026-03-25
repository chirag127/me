/**
 * Advanced Tool Registry — LangGraph-style tool orchestration
 * 
 * Each tool is a typed, self-describing function with:
 * - Name, description (used as LLM tool schema)
 * - Input validation via Zod
 * - Execution function that queries Firestore or static data
 * - Category mapping for intent-based selection
 */

import type { QueryIntent } from '../types';
import { getMediaData } from '../store';
import { resumeContext, skillsContext, projectsContext, codebaseContext } from '../knowledge';

// ─── Tool Definition Schema ──────────────────────────────────────────────────
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: { name: string; type: string; description: string; required: boolean }[];
  category: QueryIntent[];
  execute: (args?: Record<string, string>) => Promise<ToolExecutionResult>;
}

export interface ToolExecutionResult {
  tool: string;
  success: boolean;
  data: string;
  truncated: boolean;
  source: string;
}

// ─── Media Tools ─────────────────────────────────────────────────────────────

const getMovies: ToolDefinition = {
  name: 'getMovies',
  description: 'Get Chirag\'s watched movies, watchlist, ratings, and movie stats from Trakt/TMDB.',
  parameters: [
    { name: 'filter', type: 'string', description: 'Filter: watched, watchlist, ratings, stats, recent', required: false },
  ],
  category: ['movies'],
  execute: async (args) => {
    const data = await getMediaData('movies');
    if (!data) return { tool: 'getMovies', success: false, data: 'No movie data available.', truncated: false, source: 'firestore' };
    const filter = args?.filter || 'all';
    let result = JSON.stringify(data, null, 2);
    if (filter === 'stats' && data.stats) result = JSON.stringify(data.stats, null, 2);
    if (filter === 'watched' && data.watched) result = JSON.stringify(data.watched, null, 2);
    if (filter === 'watchlist' && data.watchlist) result = JSON.stringify(data.watchlist, null, 2);
    if (filter === 'ratings' && data.ratings) result = JSON.stringify(data.ratings, null, 2);
    if (filter === 'recent' && data.recent) result = JSON.stringify(data.recent, null, 2);
    const truncated = result.length > 3000;
    if (truncated) result = result.slice(0, 3000) + '\n... (truncated)';
    return { tool: 'getMovies', success: true, data: result, truncated, source: 'firestore:media/movies' };
  },
};

const getBooks: ToolDefinition = {
  name: 'getBooks',
  description: 'Get Chirag\'s reading log, currently reading, want-to-read list, and book stats from OpenLibrary.',
  parameters: [
    { name: 'filter', type: 'string', description: 'Filter: reading, read, want-to-read, stats', required: false },
  ],
  category: ['books'],
  execute: async (args) => {
    const data = await getMediaData('books');
    if (!data) return { tool: 'getBooks', success: false, data: 'No book data available.', truncated: false, source: 'firestore' };
    const filter = args?.filter || 'all';
    let result = JSON.stringify(data, null, 2);
    if (filter === 'reading' && data.currentlyReading) result = JSON.stringify(data.currentlyReading, null, 2);
    if (filter === 'read' && data.read) result = JSON.stringify(data.read, null, 2);
    if (filter === 'want-to-read' && data.wantToRead) result = JSON.stringify(data.wantToRead, null, 2);
    if (filter === 'stats' && data.stats) result = JSON.stringify(data.stats, null, 2);
    const truncated = result.length > 3000;
    if (truncated) result = result.slice(0, 3000) + '\n... (truncated)';
    return { tool: 'getBooks', success: true, data: result, truncated, source: 'firestore:media/books' };
  },
};

const getMusic: ToolDefinition = {
  name: 'getMusic',
  description: 'Get Chirag\'s top artists, tracks, albums, scrobble count, and listening stats from Last.fm/Spotify.',
  parameters: [
    { name: 'filter', type: 'string', description: 'Filter: artists, tracks, albums, stats, recent', required: false },
  ],
  category: ['music'],
  execute: async (args) => {
    const data = await getMediaData('music');
    if (!data) return { tool: 'getMusic', success: false, data: 'No music data available.', truncated: false, source: 'firestore' };
    const filter = args?.filter || 'all';
    let result = JSON.stringify(data, null, 2);
    if (filter === 'artists' && data.topArtists) result = JSON.stringify(data.topArtists, null, 2);
    if (filter === 'tracks' && data.topTracks) result = JSON.stringify(data.topTracks, null, 2);
    if (filter === 'albums' && data.topAlbums) result = JSON.stringify(data.topAlbums, null, 2);
    if (filter === 'stats' && data.stats) result = JSON.stringify(data.stats, null, 2);
    if (filter === 'recent' && data.recentTracks) result = JSON.stringify(data.recentTracks, null, 2);
    const truncated = result.length > 3000;
    if (truncated) result = result.slice(0, 3000) + '\n... (truncated)';
    return { tool: 'getMusic', success: true, data: result, truncated, source: 'firestore:media/music' };
  },
};

const getAnime: ToolDefinition = {
  name: 'getAnime',
  description: 'Get Chirag\'s anime/manga lists, scores, favorites, and stats from AniList.',
  parameters: [
    { name: 'filter', type: 'string', description: 'Filter: watching, completed, plan-to-watch, dropped, manga, stats', required: false },
  ],
  category: ['anime'],
  execute: async (args) => {
    const data = await getMediaData('anime');
    if (!data) return { tool: 'getAnime', success: false, data: 'No anime data available.', truncated: false, source: 'firestore' };
    const filter = args?.filter || 'all';
    let result = JSON.stringify(data, null, 2);
    if (filter === 'watching' && data.currentlyWatching) result = JSON.stringify(data.currentlyWatching, null, 2);
    if (filter === 'completed' && data.completed) result = JSON.stringify(data.completed, null, 2);
    if (filter === 'plan-to-watch' && data.planToWatch) result = JSON.stringify(data.planToWatch, null, 2);
    if (filter === 'stats' && data.stats) result = JSON.stringify(data.stats, null, 2);
    if (filter === 'manga' && data.manga) result = JSON.stringify(data.manga, null, 2);
    const truncated = result.length > 3000;
    if (truncated) result = result.slice(0, 3000) + '\n... (truncated)';
    return { tool: 'getAnime', success: true, data: result, truncated, source: 'firestore:media/anime' };
  },
};

const getGaming: ToolDefinition = {
  name: 'getGaming',
  description: 'Get Chirag\'s Steam games, playtime, achievements, and Lichess chess stats.',
  parameters: [
    { name: 'filter', type: 'string', description: 'Filter: steam, lichess, recent, stats, achievements', required: false },
  ],
  category: ['gaming'],
  execute: async (args) => {
    const data = await getMediaData('gaming');
    if (!data) return { tool: 'getGaming', success: false, data: 'No gaming data available.', truncated: false, source: 'firestore' };
    const filter = args?.filter || 'all';
    let result = JSON.stringify(data, null, 2);
    if (filter === 'steam' && data.steam) result = JSON.stringify(data.steam, null, 2);
    if (filter === 'lichess' && data.lichess) result = JSON.stringify(data.lichess, null, 2);
    if (filter === 'recent' && data.recentGames) result = JSON.stringify(data.recentGames, null, 2);
    if (filter === 'stats' && data.stats) result = JSON.stringify(data.stats, null, 2);
    if (filter === 'achievements' && data.achievements) result = JSON.stringify(data.achievements, null, 2);
    const truncated = result.length > 3000;
    if (truncated) result = result.slice(0, 3000) + '\n... (truncated)';
    return { tool: 'getGaming', success: true, data: result, truncated, source: 'firestore:media/gaming' };
  },
};

const getCoding: ToolDefinition = {
  name: 'getCoding',
  description: 'Get Chirag\'s GitHub repos, LeetCode stats, Codewars rank, WakaTime coding time, and Dev.to articles.',
  parameters: [
    { name: 'filter', type: 'string', description: 'Filter: github, leetcode, codewars, wakatime, devto, stats', required: false },
  ],
  category: ['coding', 'skills'],
  execute: async (args) => {
    const data = await getMediaData('coding');
    if (!data) return { tool: 'getCoding', success: false, data: 'No coding data available.', truncated: false, source: 'firestore' };
    const filter = args?.filter || 'all';
    let result = JSON.stringify(data, null, 2);
    if (filter === 'github' && data.github) result = JSON.stringify(data.github, null, 2);
    if (filter === 'leetcode' && data.leetcode) result = JSON.stringify(data.leetcode, null, 2);
    if (filter === 'codewars' && data.codewars) result = JSON.stringify(data.codewars, null, 2);
    if (filter === 'wakatime' && data.wakatime) result = JSON.stringify(data.wakatime, null, 2);
    if (filter === 'devto' && data.devto) result = JSON.stringify(data.devto, null, 2);
    if (filter === 'stats' && data.stats) result = JSON.stringify(data.stats, null, 2);
    const truncated = result.length > 3000;
    if (truncated) result = result.slice(0, 3000) + '\n... (truncated)';
    return { tool: 'getCoding', success: true, data: result, truncated, source: 'firestore:media/coding' };
  },
};

const getSocial: ToolDefinition = {
  name: 'getSocial',
  description: 'Get Chirag\'s Bluesky posts, YouTube videos, HackerNews activity, and social media stats.',
  parameters: [
    { name: 'filter', type: 'string', description: 'Filter: bluesky, youtube, hackernews, stats', required: false },
  ],
  category: ['social'],
  execute: async (args) => {
    const data = await getMediaData('social');
    if (!data) return { tool: 'getSocial', success: false, data: 'No social data available.', truncated: false, source: 'firestore' };
    const filter = args?.filter || 'all';
    let result = JSON.stringify(data, null, 2);
    if (filter === 'bluesky' && data.bluesky) result = JSON.stringify(data.bluesky, null, 2);
    if (filter === 'youtube' && data.youtube) result = JSON.stringify(data.youtube, null, 2);
    if (filter === 'hackernews' && data.hackernews) result = JSON.stringify(data.hackernews, null, 2);
    if (filter === 'stats' && data.stats) result = JSON.stringify(data.stats, null, 2);
    const truncated = result.length > 3000;
    if (truncated) result = result.slice(0, 3000) + '\n... (truncated)';
    return { tool: 'getSocial', success: true, data: result, truncated, source: 'firestore:media/social' };
  },
};

// ─── Knowledge Tools ─────────────────────────────────────────────────────────

const getResume: ToolDefinition = {
  name: 'getResume',
  description: 'Get Chirag\'s resume: education, work experience, certifications, and academic achievements.',
  parameters: [],
  category: ['career', 'education'],
  execute: async () => ({
    tool: 'getResume',
    success: true,
    data: resumeContext,
    truncated: false,
    source: 'static:knowledge',
  }),
};

const getProjects: ToolDefinition = {
  name: 'getProjects',
  description: 'Get detailed descriptions of all of Chirag\'s projects including tech stack and features.',
  parameters: [],
  category: ['projects', 'skills', 'coding'],
  execute: async () => ({
    tool: 'getProjects',
    success: true,
    data: projectsContext,
    truncated: false,
    source: 'static:knowledge',
  }),
};

const getContactInfo: ToolDefinition = {
  name: 'getContactInfo',
  description: 'Get Chirag\'s contact information: email, social links, and ways to reach him.',
  parameters: [],
  category: ['contact', 'social', 'navigation'],
  execute: async () => ({
    tool: 'getContactInfo',
    success: true,
    data: `Contact Chirag Singhal:
- Website: https://chirag127.in
- GitHub: https://github.com/chirag127
- LinkedIn: https://linkedin.com/in/chirag127
- Email: Available on website contact form
- Bluesky: https://chirag127.bsky.social
- Dev.to: https://dev.to/chirag127`,
    truncated: false,
    source: 'static:config',
  }),
};

const navigateTo: ToolDefinition = {
  name: 'navigateTo',
  description: 'Get the URL for a specific page on Chirag\'s website. Useful for navigation requests.',
  parameters: [
    { name: 'page', type: 'string', description: 'Page name: home, movies, books, music, anime, gaming, code, projects, skills, career, connect, admin', required: true },
  ],
  category: ['navigation'],
  execute: async (args) => {
    const sitemap: Record<string, string> = {
      home: '/',
      movies: '/library/movies',
      books: '/library/books',
      music: '/library/music',
      anime: '/library/anime',
      gaming: '/gaming',
      code: '/code',
      projects: '/work/projects',
      skills: '/work/skills',
      career: '/work/career',
      education: '/work/education',
      connect: '/connect',
      admin: '/system/admin',
      story: '/me/story',
      philosophy: '/me/philosophy',
      journal: '/me/journal',
      interests: '/me/interests',
    };
    const page = (args?.page || '').toLowerCase();
    const url = sitemap[page];
    if (url) {
      return { tool: 'navigateTo', success: true, data: `Navigate to: ${url}`, truncated: false, source: 'static:sitemap' };
    }
    const available = Object.keys(sitemap).join(', ');
    return { tool: 'navigateTo', success: false, data: `Unknown page "${args?.page}". Available pages: ${available}`, truncated: false, source: 'static:sitemap' };
  },
};

// ─── Registry ────────────────────────────────────────────────────────────────

const getCodebaseInfo: ToolDefinition = {
  name: 'getCodebaseInfo',
  description: 'Get information about the website tech stack, architecture, and project structure.',
  parameters: [],
  category: ['coding', 'skills', 'meta'],
  execute: async () => ({
    tool: 'getCodebaseInfo',
    success: true,
    data: codebaseContext,
    truncated: false,
    source: 'static:knowledge',
  }),
};

export const TOOL_REGISTRY: ToolDefinition[] = [
  getMovies, getBooks, getMusic, getAnime, getGaming,
  getCoding, getSocial,
  getResume, getProjects, getContactInfo, navigateTo,
  getCodebaseInfo,
];

/**
 * Select tools based on classified intent(s).
 * Returns relevant tools for the ReAct agent to consider.
 */
export function selectTools(intents: QueryIntent[]): ToolDefinition[] {
  if (intents.includes('unknown') || intents.includes('greeting') || intents.includes('meta')) {
    return [getResume, getProjects, getContactInfo, navigateTo];
  }
  return TOOL_REGISTRY.filter(tool =>
    tool.category.some(cat => intents.includes(cat))
  );
}

/**
 * Get a tool by name (for the ReAct agent's action phase).
 */
export function getToolByName(name: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find(t => t.name === name);
}

/**
 * Format tool descriptions as a prompt section for the LLM.
 * This simulates LangGraph's tool binding where the LLM sees tool schemas.
 */
export function formatToolsForPrompt(tools: ToolDefinition[]): string {
  return tools.map(t => {
    const params = t.parameters.length > 0
      ? t.parameters.map(p => `  - ${p.name} (${p.type}${p.required ? ', required' : ''}): ${p.description}`).join('\n')
      : '  (no parameters)';
    return `### ${t.name}\n${t.description}\nParameters:\n${params}`;
  }).join('\n\n');
}
