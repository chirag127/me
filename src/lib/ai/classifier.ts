import { callLLM, type PuterChatResponse } from './engine';
import { z } from 'zod';

const INTENTS = [
  'career', 'coding', 'projects', 'skills', 'movies',
  'music', 'books', 'anime', 'gaming', 'stats',
  'social', 'contact', 'navigation', 'greeting',
  'meta', 'unknown'
] as const;

const IntentSchema = z.enum(INTENTS);
export type QueryIntent = z.infer<typeof IntentSchema>;

// Fast Regex Maps
const REGEX_MAP: Record<QueryIntent, RegExp> = {
  career: /\b(career|job|work|experience|resume|tcs|internship)\b/i,
  coding: /\b(github|code|repo|programming|language|develop|commit|wakatime|leetcode|codewars)\b/i,
  projects: /\b(project|oriz|nexus|tube|olivia|crawl|cloud|stream|omni|portfolio|app)\b/i,
  skills: /\b(skill|tech|stack|framework|tool|know|react|astro|tailwind|typescript)\b/i,
  movies: /\b(movie|film|show|watch|trakt|letterboxd|cinema|tv)\b/i,
  music: /\b(music|song|listen|last\.?fm|artist|scrobble|spotify|album|track)\b/i,
  books: /\b(book|read|library|openlibrary|author|novel|page)\b/i,
  anime: /\b(anime|manga|anilist|episode|jikan|myanimelist|mal)\b/i,
  gaming: /\b(game|play|steam|lichess|chess|speedrun|achievement)\b/i,
  stats: /\b(stat|statistic|metric|count|total|average)\b/i,
  social: /\b(social|bluesky|twitter|dev\.to|youtube|hackernews|post|article)\b/i,
  contact: /\b(contact|email|reach|hire|message|touch)\b/i,
  navigation: /\b(navigate|go to|where is|link|url|page|open)\b/i,
  greeting: /\b(hi|hello|hey|greetings|morning|afternoon|evening|wassup)\b/i,
  meta: /\b(who are you|what are you|ai|bot|how do you work|system|prompt)\b/i,
  unknown: /^$/
};

export async function classifyQuery(query: string): Promise<QueryIntent> {
  // 1. Fast Regex Pass
  for (const intent of INTENTS) {
    if (intent === 'unknown') continue;
    if (REGEX_MAP[intent].test(query)) {
      return intent;
    }
  }

  // 2. LLM Fallback (Reasoning / Ambiguous queries)
  const prompt = `Classify this query about Chirag into EXACTLY ONE of the following precise categories:
${INTENTS.join(', ')}.
Respond with ONLY the exact category string in lowercase. Do not add quotes, markdown, or extra words.

Query: "${query}"`;
  
  try {
    const response = await callLLM(prompt, 'simple') as PuterChatResponse;
    const raw = response.message?.content || response.text || '';
    
    const cleaned = raw.trim().toLowerCase().replace(/[^a-z]/g, '');
    
    const result = IntentSchema.safeParse(cleaned);
    if (result.success) {
      return result.data;
    }
    
    return 'unknown';
  } catch (e: unknown) {
    console.warn('[AI Classifier] Fast LLM classification failed, defaulting to unknown:', e);
    return 'unknown';
  }
}
