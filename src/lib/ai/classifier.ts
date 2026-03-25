/**
 * Advanced Intent Classifier
 * Uses regex-first approach (zero LLM cost) with LLM fallback for ambiguous queries.
 * Follows LangGraph pattern: classifier is a graph node that enriches state.
 */

import type { QueryIntent } from './types';

// ─── Intent Pattern Registry ─────────────────────────────────────────────────
// Each pattern is a compiled regex for speed. Order matters — first match wins.
const INTENT_PATTERNS: Array<{ intent: QueryIntent; pattern: RegExp; priority: number }> = [
  // Media intents (high specificity first)
  { intent: 'movies', pattern: /\b(movie|film|show|watch(?:ed|list)?|trakt|letterboxd|cinema|tv\s*show|series|rating|imdb|netflix)\b/i, priority: 1 },
  { intent: 'music', pattern: /\b(music|song|listen(?:ing)?|last\.?fm|artist|scrobble|spotify|album|playlist|track|genre)\b/i, priority: 1 },
  { intent: 'books', pattern: /\b(book|read(?:ing)?|library|openlibrary|author|novel|literature|pages)\b/i, priority: 1 },
  { intent: 'anime', pattern: /\b(anime|manga|anilist|episode|otaku|waifu|shonen|seinen|myanimelist)\b/i, priority: 1 },
  { intent: 'gaming', pattern: /\b(game|gaming|steam|play(?:time)?|lichess|chess|achievement|esport|rank|level)\b/i, priority: 1 },

  // Professional intents
  { intent: 'career', pattern: /\b(career|job|work(?:ing)?|experience|resume|tcs|company|salary|interview|employ|position|role|hired|tata)\b/i, priority: 2 },
  { intent: 'coding', pattern: /\b(github|code|repo(?:s)?|program(?:ming)?|language|develop(?:er)?|commit|leetcode|codewars|wakatime|hackerrank|pull\s*request|bug|algorithm|dsa)\b/i, priority: 2 },
  { intent: 'projects', pattern: /\b(project|oriz|nexus|tube|olivia|crawl|cloud|stream|omni|portfolio|built|created|made|developed)\b/i, priority: 2 },
  { intent: 'skills', pattern: /\b(skill|tech|stack|framework|tool|know(?:ledge)?|react|astro|tailwind|typescript|python|aws|docker|kubernetes|firebase|fastapi|node|django)\b/i, priority: 2 },
  { intent: 'education', pattern: /\b(education|degree|university|college|school|cgpa|grade|score|certification|cert|course|aktu|cbse|jee|meta\s*backend|aws\s*cert)\b/i, priority: 2 },

  // Social intents
  { intent: 'social', pattern: /\b(bluesky|twitter|social|post|follower|dev\.to|youtube|channel|video|hacker\s*news|hn|karma)\b/i, priority: 3 },
  { intent: 'contact', pattern: /\b(contact|email|reach|message|connect|link|social\s*media|hire|freelance|collaborat)\b/i, priority: 3 },
  { intent: 'navigation', pattern: /\b(navigate|go\s*to|show\s*me|open|page|section|where|find|link\s*to|take\s*me)\b/i, priority: 3 },

  // Meta intents (lowest priority)
  { intent: 'greeting', pattern: /\b(hi|hello|hey|sup|yo|greetings|good\s*(?:morning|afternoon|evening)|howdy|what'?s\s*up)\b/i, priority: 4 },
  { intent: 'meta', pattern: /\b(who\s*are\s*you|what\s*can\s*you\s*do|help|about\s*you|your\s*name|capabilities|features|how\s*does\s*this\s*work)\b/i, priority: 4 },
];

// ─── Confidence scoring ──────────────────────────────────────────────────────
interface ClassificationResult {
  intent: QueryIntent;
  confidence: number;
  matchedPatterns: string[];
  method: 'regex' | 'llm-fallback';
}

/**
 * Primary classifier: regex-first for zero-cost intent detection.
 * Returns high confidence for clear matches, low for ambiguous.
 */
export function classifyIntent(query: string): ClassificationResult {
  const matches: Array<{ intent: QueryIntent; priority: number }> = [];

  for (const { intent, pattern, priority } of INTENT_PATTERNS) {
    if (pattern.test(query)) {
      matches.push({ intent, priority });
    }
  }

  if (matches.length === 0) {
    return {
      intent: 'unknown',
      confidence: 0.2,
      matchedPatterns: [],
      method: 'regex',
    };
  }

  // Sort by priority (lower = more specific), take first
  matches.sort((a, b) => a.priority - b.priority);
  const best = matches[0];

  // Confidence heuristic based on match count and specificity
  const confidence = matches.length === 1
    ? 0.95  // Single clear match
    : matches.filter(m => m.priority === best.priority).length === 1
      ? 0.85  // Unique in its priority tier
      : 0.65; // Multiple matches at same priority

  return {
    intent: best.intent,
    confidence,
    matchedPatterns: matches.map(m => m.intent),
    method: 'regex',
  };
}

/**
 * Multi-intent detection: a query can span multiple intents.
 * Used by the tool selector to decide which tools to invoke.
 */
export function detectMultipleIntents(query: string): QueryIntent[] {
  const intents = new Set<QueryIntent>();
  for (const { intent, pattern } of INTENT_PATTERNS) {
    if (pattern.test(query)) {
      intents.add(intent);
    }
  }
  return intents.size > 0 ? Array.from(intents) : ['unknown'];
}

/**
 * Query complexity analysis for model routing.
 * Goes beyond word count to analyze structural complexity.
 */
export function analyzeQueryComplexity(query: string): 'low' | 'medium' | 'high' {
  const words = query.split(/\s+/).length;
  const hasQuestion = /\?/.test(query);
  const hasComparison = /\b(vs|versus|compare|better|best|difference|between)\b/i.test(query);
  const hasMultiPart = /\b(and|also|plus|additionally|furthermore)\b/i.test(query);
  const hasCodeRef = /\b(code|function|class|api|endpoint|implement)\b/i.test(query);

  // Score-based complexity
  let score = 0;
  score += words > 5 ? 1 : 0;
  score += words > 15 ? 1 : 0;
  score += hasQuestion ? 1 : 0;
  score += hasComparison ? 2 : 0;
  score += hasMultiPart ? 2 : 0;
  score += hasCodeRef ? 2 : 0;

  if (score <= 2) return 'low';
  if (score <= 5) return 'medium';
  return 'high';
}
