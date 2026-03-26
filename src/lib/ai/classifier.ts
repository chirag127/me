/**
 * Agentic Intent Classifier
 * Uses a small LLM (LFM-2.5 1.2B) to understand user intent with high accuracy.
 * Includes automatic failover if the primary model is busy/unavailable.
 */

import type { QueryIntent } from './types';
import { getModelChain } from './models';

// Helper to get Puter AI
function getPuter() {
  if (typeof window === 'undefined') return null;
  return (window as any).puter?.ai ?? null;
}

const INTENT_PROMPT = `
You are an intent classifier for Chirag's personal portfolio assistant.
Analyze the user's query and categorize it into EXACTLY ONE of these intents:

- 'career': Work experience, jobs, companies (TCS, etc.), resume.
- 'coding': GitHub, repos, programming languages, LeetCode, WakaTime.
- 'projects': Specific projects built (Oriz, Nexus, etc.), portfolio items.
- 'skills': Technical stack, frameworks, tools (React, Astro, etc.).
- 'education': University, college, degrees, CGPA, certifications.
- 'movies': Watched movies, Letterboxd, cinema, ratings.
- 'music': Listening history, Last.fm, Spotify, artists.
- 'books': Reading list, library, authors, novels.
- 'anime': AniList, manga, watched episodes.
- 'gaming': Steam, playtime, achievements, Lichess/Chess.
- 'social': Bluesky, Twitter, Dev.to, YouTube posts.
- 'contact': How to reach, email, social links, hiring.
- 'navigation': Requests to go to a page or open a section.
- 'greeting': Hi, hello, how are you.
- 'meta': Questions about the AI itself, its capabilities, or how the site was built.
- 'unknown': Anything else that doesn't fit.

Respond with ONLY the intent name in lowercase.
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

  const intent = (content || 'unknown').toLowerCase() as QueryIntent;

  // Validate intent
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

  const isValid = validIntents.includes(intent);
  return {
    intent: isValid ? intent : 'unknown',
    confidence: content && isValid ? 0.9 : 0.5,
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
