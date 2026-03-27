/**
 * Agentic Intent Classifier
 * Uses a small LLM (LFM-2.5 1.2B) to understand user intent with high accuracy.
 * Includes automatic failover if the primary model is busy/unavailable.
 */

import { getModelChain } from './models';
import type { QueryIntent } from './types';

// Helper to get Puter AI
function getPuter() {
  if (typeof window === 'undefined') return null;
  return (window as any).puter?.ai ?? null;
}

const INTENT_PROMPT = `
You are an intent classifier for Chirag Singhal's personal portfolio assistant at chirag127.in.
Analyze the user's query and respond with EXACTLY two lines:
Line 1: The intent name (lowercase, one word)
Line 2: A confidence score between 0.0 and 1.0

Valid intents:
- 'career': Work experience, jobs, companies (TCS, QRsay), resume, hiring.
- 'coding': GitHub repos, programming languages, LeetCode, Codewars, NPM packages, StackOverflow.
- 'projects': Specific projects built (Oriz, NexusAI, TubeDigest, Olivia, Crawl4AI, etc.), portfolio items, project details.
- 'skills': Technical stack, frameworks, tools (React, Astro, Python, FastAPI, Docker, etc.), what he knows.
- 'education': University (AKTU), college, B.Tech, degrees, CGPA (8.81), JEE Advanced, certifications, CBSE.
- 'movies': Watched movies, Letterboxd ratings, cinema, film preferences, TV shows, Trakt.
- 'music': Listening history, Last.fm scrobbles, Spotify, artists, tracks, albums, Mixcloud.
- 'books': Reading list, Open Library, Hardcover, authors, novels, what he reads.
- 'anime': AniList anime, manga, watched episodes, anime scores, plan to watch.
- 'gaming': Steam games, Lichess chess ratings, Speedrun.com, playtime, achievements, chess openings.
- 'social': Bluesky posts, Mastodon, Reddit, Dev.to articles, YouTube, Pixelfed, social media.
- 'contact': How to reach Chirag, email, social links, phone, hiring inquiries, collaboration.
- 'navigation': Requests to go to a page, open a section, or find something on the website.
- 'greeting': Hi, hello, how are you, good morning, what's up.
- 'meta': Questions about the AI assistant itself, its capabilities, how the site was built, Puter.js.
- 'unknown': Anything else that doesn't fit the above categories.

Examples:
User: "What movies has Chirag watched?"
movies
0.95

User: "Tell me about his projects"
projects
0.90

User: "hi there"
greeting
0.99

User: "What's his email?"
contact
0.85

User: "How does the AI work?"
meta
0.80

User: "Show me the gaming page"
navigation
0.92
`;

export interface ClassificationResult {
  intent: QueryIntent;
  confidence: number;
  method: 'llm';
}

/**
 * Helper to call Puter AI with failover
 */
async function callPuterAI(
  messages: Array<{ role: string; content: string }>,
  tier: 'fast' | 'reasoning' | 'agent' = 'fast',
): Promise<string> {
  const ai = getPuter();
  if (!ai) return '';

  const chain = getModelChain(tier);

  for (const model of chain) {
    try {
      const response = await ai.chat(messages, { model, stream: false });

      // Puter AI sometimes returns structures like { success: false, error: ... }
      if (response && (response as any).success === false) {
        console.warn(
          `[Classifier] Model ${model} failed:`,
          (response as any).error,
        );
        continue;
      }

      const content = response.content || response.message?.content || '';
      if (typeof content === 'string' && content.trim()) return content.trim();
    } catch (err) {
      console.warn(`[Classifier] Error with model ${model}:`, err);
      // Try next model in chain
    }
  }

  return '';
}

/**
 * Agentic classifier: uses a small LLM for high accuracy.
 * Returns intent + confidence score from the LLM itself.
 */
export async function classifyIntent(
  query: string,
): Promise<ClassificationResult> {
  const content = await callPuterAI(
    [
      { role: 'system', content: INTENT_PROMPT },
      { role: 'user', content: query },
    ],
    'fast',
  );

  const validIntents: QueryIntent[] = [
    'career',
    'coding',
    'projects',
    'skills',
    'education',
    'movies',
    'music',
    'books',
    'anime',
    'gaming',
    'social',
    'contact',
    'navigation',
    'greeting',
    'meta',
    'unknown',
  ];

  if (!content) {
    return { intent: 'unknown', confidence: 0.3, method: 'llm' };
  }

  // Parse the two-line response: intent on line 1, confidence on line 2
  const lines = content
    .trim()
    .split('\n')
    .map((l: string) => l.trim())
    .filter(Boolean);
  const rawIntent = (lines[0] || 'unknown')
    .toLowerCase()
    .replace(/['"]/g, '') as QueryIntent;
  const rawConfidence = parseFloat(lines[1] || '0.7');

  const isValid = validIntents.includes(rawIntent);
  const confidence = isNaN(rawConfidence)
    ? 0.7
    : Math.min(1, Math.max(0, rawConfidence));

  return {
    intent: isValid ? rawIntent : 'unknown',
    confidence: isValid ? confidence : 0.4,
    method: 'llm',
  };
}

/**
 * Multi-intent detection: for agentic tool selection.
 */
export async function detectMultipleIntents(
  query: string,
): Promise<QueryIntent[]> {
  const content = await callPuterAI(
    [
      {
        role: 'system',
        content:
          'List all relevant intents from the list provided previously for this query. Separate with commas. Respond ONLY with the list.',
      },
      { role: 'user', content: query },
    ],
    'fast',
  );

  if (!content) return ['unknown'];

  const intents = content
    .toLowerCase()
    .split(',')
    .map((s: string) => s.trim()) as QueryIntent[];

  const validIntents: QueryIntent[] = [
    'career',
    'coding',
    'projects',
    'skills',
    'education',
    'movies',
    'music',
    'books',
    'anime',
    'gaming',
    'social',
    'contact',
    'navigation',
    'greeting',
    'meta',
    'unknown',
  ];

  return intents.filter((i) => validIntents.includes(i));
}

/**
 * Query complexity analysis.
 */
export async function analyzeQueryComplexity(
  query: string,
): Promise<'low' | 'medium' | 'high'> {
  const content = await callPuterAI(
    [
      {
        role: 'system',
        content:
          'Analyze the complexity of this user query for an AI assistant. Respond with ONLY "low", "medium", or "high".',
      },
      { role: 'user', content: query },
    ],
    'fast',
  );

  const complexity = (content || 'medium').toLowerCase();
  if (complexity.includes('low')) return 'low';
  if (complexity.includes('medium')) return 'medium';
  if (complexity.includes('high')) return 'high';

  return 'medium';
}
