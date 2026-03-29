/**
 * Agentic Intent Classifier
 * Consolidated classifier: single LLM call returns
 * intent, confidence, and complexity.
 * Includes automatic failover if primary model is
 * busy/unavailable.
 */

import { getModelChain } from './models';
import type { QueryIntent } from './types';

// Helper to get Puter AI
function getPuter() {
  if (typeof window === 'undefined') return null;
  return (window as any).puter?.ai ?? null;
}

const VALID_INTENTS: QueryIntent[] = [
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
  'gear',
  'social',
  'contact',
  'navigation',
  'greeting',
  'meta',
  'unknown',
];

const UNIFIED_PROMPT = `
You are an intent classifier for Chirag Singhal's
personal portfolio assistant at me.oriz.in.
Analyze the user's query and respond with EXACTLY
three lines:
Line 1: The primary intent name (lowercase, one word)
Line 2: A confidence score between 0.0 and 1.0
Line 3: Query complexity: "low", "medium", or "high"

If the query touches multiple topics, still pick the
MOST relevant single intent for Line 1.

Valid intents:
- 'career': Work experience, jobs, companies
  (TCS, QRsay), resume, hiring.
- 'coding': GitHub repos, programming languages,
  LeetCode, Codewars, NPM, StackOverflow.
- 'projects': Specific projects built (Oriz, NexusAI,
  TubeDigest, Olivia, Crawl4AI, etc.), portfolio.
- 'skills': Technical stack, frameworks, tools
  (React, Astro, Python, FastAPI, Docker).
- 'education': University (AKTU), B.Tech, CGPA 8.81,
  JEE Advanced, certifications, CBSE.
- 'movies': Watched movies, Letterboxd, cinema,
  film preferences, TV shows, Trakt.
- 'music': Listening history, Last.fm scrobbles,
  Spotify, artists, tracks, Mixcloud.
- 'books': Reading list, Open Library, Hardcover,
  authors, novels.
- 'anime': AniList anime, manga, episodes, scores.
- 'gaming': Lichess chess, Speedrun.com, games.
- 'gear': Products bought, gadgets, peripherals,
  electronics, things Chirag owns.
- 'social': Bluesky posts, Mastodon, Reddit, Dev.to,
  YouTube, Pixelfed, social media.
- 'contact': How to reach Chirag, email, links.
- 'navigation': Go to a page, open a section.
- 'greeting': Hi, hello, how are you.
- 'meta': About the AI assistant, site tech stack.
- 'unknown': Doesn't fit above categories.

Examples:
User: "What movies has Chirag watched?"
movies
0.95
low

User: "Compare his education with his projects"
education
0.80
high

User: "hi"
greeting
0.99
low
`;

export interface ClassificationResult {
  intent: QueryIntent;
  confidence: number;
  complexity: 'low' | 'medium' | 'high';
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
      const response = await ai.chat(
        messages,
        { model, stream: false },
      );

      // Puter AI sometimes returns error structures
      if (
        response &&
        (response as any).success === false
      ) {
        console.warn(
          `[Classifier] Model ${model} failed:`,
          (response as any).error,
        );
        continue;
      }

      const content =
        response.content ||
        response.message?.content ||
        '';
      if (
        typeof content === 'string' &&
        content.trim()
      ) {
        return content.trim();
      }
    } catch (err) {
      console.warn(
        `[Classifier] Error with model ${model}:`,
        err,
      );
      // Try next model in chain
    }
  }

  return '';
}

/**
 * Unified classifier: single LLM call returns intent,
 * confidence, AND complexity.
 * Replaces the previous 3 separate API calls.
 */
export async function classifyIntent(
  query: string,
): Promise<ClassificationResult> {
  const content = await callPuterAI(
    [
      { role: 'system', content: UNIFIED_PROMPT },
      { role: 'user', content: query },
    ],
    'fast',
  );

  if (!content) {
    return {
      intent: 'unknown',
      confidence: 0.3,
      complexity: 'medium',
      method: 'llm',
    };
  }

  // Parse the three-line response
  const lines = content
    .trim()
    .split('\n')
    .map((l: string) => l.trim())
    .filter(Boolean);

  const rawIntent = (lines[0] || 'unknown')
    .toLowerCase()
    .replace(/['\"]/g, '') as QueryIntent;
  const rawConfidence = parseFloat(
    lines[1] || '0.7',
  );
  const rawComplexity = (
    lines[2] || 'medium'
  ).toLowerCase();

  const isValid = VALID_INTENTS.includes(rawIntent);
  const confidence = isNaN(rawConfidence)
    ? 0.7
    : Math.min(1, Math.max(0, rawConfidence));

  let complexity: 'low' | 'medium' | 'high' =
    'medium';
  if (rawComplexity.includes('low')) {
    complexity = 'low';
  }
  if (rawComplexity.includes('high')) {
    complexity = 'high';
  }

  return {
    intent: isValid ? rawIntent : 'unknown',
    confidence: isValid ? confidence : 0.4,
    complexity,
    method: 'llm',
  };
}

/**
 * Multi-intent detection: for agentic tool selection.
 * Fixed: includes the full valid intents list in
 * the prompt (was previously missing).
 */
export async function detectMultipleIntents(
  query: string,
): Promise<QueryIntent[]> {
  const intentList = VALID_INTENTS.join(', ');
  const content = await callPuterAI(
    [
      {
        role: 'system',
        content: `List all relevant intents for this query. Valid intents: ${intentList}. Separate with commas. Respond ONLY with the comma-separated list.`,
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

  return intents.filter((i) =>
    VALID_INTENTS.includes(i),
  );
}

/**
 * Query complexity analysis.
 * @deprecated Use classifyIntent() which now returns
 * complexity in a single call.
 */
export async function analyzeQueryComplexity(
  _query: string,
): Promise<'low' | 'medium' | 'high'> {
  // No longer makes a separate API call.
  // Kept for backward compatibility; callers should
  // use classifyIntent().complexity instead.
  return 'medium';
}
