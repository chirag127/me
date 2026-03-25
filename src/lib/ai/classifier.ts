/**
 * Agentic Intent Classifier
 * Uses a small LLM (LFM-2.5 1.2B) to understand user intent with high accuracy.
 * No regex, fully agentic.
 */

import type { QueryIntent } from './types';

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
 * Agentic classifier: uses a small LLM for high accuracy.
 */
export async function classifyIntent(query: string): Promise<ClassificationResult> {
  const ai = getPuter();
  if (!ai) {
    return { intent: 'unknown', confidence: 0.5, method: 'llm' };
  }

  try {
    const response = await ai.chat([
      { role: 'system', content: INTENT_PROMPT },
      { role: 'user', content: query }
    ], { 
      model: 'liquid/lfm-2.5-1.2b-instruct:free',
      stream: false 
    });

    const intent = (response.content || response.message?.content || 'unknown').trim().toLowerCase() as QueryIntent;
    
    // Validate intent
    const validIntents: QueryIntent[] = [
      'career', 'coding', 'projects', 'skills', 'education',
      'movies', 'music', 'books', 'anime', 'gaming',
      'social', 'contact', 'navigation', 'greeting', 'meta', 'unknown'
    ];

    return {
      intent: validIntents.includes(intent) ? intent : 'unknown',
      confidence: 0.9,
      method: 'llm',
    };
  } catch (err) {
    console.error('Classification error:', err);
    return { intent: 'unknown', confidence: 0.5, method: 'llm' };
  }
}

/**
 * Multi-intent detection: for agentic tool selection.
 */
export async function detectMultipleIntents(query: string): Promise<QueryIntent[]> {
  const ai = getPuter();
  if (!ai) return ['unknown'];

  try {
    const response = await ai.chat([
      { 
        role: 'system', 
        content: 'List all relevant intents from the list provided previously for this query. Separate with commas. Respond ONLY with the list.' 
      },
      { role: 'user', content: query }
    ], { 
      model: 'liquid/lfm-2.5-1.2b-instruct:free',
      stream: false 
    });

    const content = (response.content || response.message?.content || 'unknown').toLowerCase();
    const intents = content.split(',').map((s: string) => s.trim()) as QueryIntent[];
    
    const validIntents: QueryIntent[] = [
      'career', 'coding', 'projects', 'skills', 'education',
      'movies', 'music', 'books', 'anime', 'gaming',
      'social', 'contact', 'navigation', 'greeting', 'meta', 'unknown'
    ];

    return intents.filter(i => validIntents.includes(i));
  } catch {
    return ['unknown'];
  }
}

/**
 * Query complexity analysis.
 */
export async function analyzeQueryComplexity(query: string): Promise<'low' | 'medium' | 'high'> {
  const ai = getPuter();
  if (!ai) return 'medium';

  try {
    const response = await ai.chat([
      { 
        role: 'system', 
        content: 'Analyze the complexity of this user query for an AI assistant. Respond with ONLY "low", "medium", or "high".' 
      },
      { role: 'user', content: query }
    ], { 
      model: 'liquid/lfm-2.5-1.2b-instruct:free',
      stream: false 
    });

    const complexity = (response.content || response.message?.content || 'medium').trim().toLowerCase();
    if (['low', 'medium', 'high'].includes(complexity)) {
      return complexity as 'low' | 'medium' | 'high';
    }
    return 'medium';
  } catch {
    return 'medium';
  }
}
