/**
 * Model Catalog — Puter.js models (Dynamic + Fallback)
 * Used by the dropdown selector and the agent's failover chain.
 */

import type { ModelInfo, ModelTier, QueryIntent } from './types';

export type { ModelInfo, ModelTier } from './types';

// Declare puter global for TypeScript
declare const puter: any;

export type AIModel = string;

// ─── Initial Fallback Catalog ────────────────────────────────────────
export const MODEL_CATALOG: ModelInfo[] = [
  {
    id: 'arcee-ai/trinity-large-preview:free',
    name: 'Trinity Large',
    params: '400B (13B active)',
    bestFor: 'Creative writing, tool use, agentic coding',
    speed: 'slow',
    reasoning: 'high',
    isFree: true,
    paramSize: 400,
  },
  {
    id: 'liquid/lfm-2.5-1.2b-instruct:free',
    name: 'LFM 2.5 Instruct',
    params: '1.2B',
    bestFor: 'Instruction following, RAG, data extraction',
    speed: 'fast',
    reasoning: 'medium',
    isFree: true,
    paramSize: 1.2,
  },
  {
    id: 'liquid/lfm-2.5-1.2b-thinking:free',
    name: 'LFM 2.5 Thinking',
    params: '1.2B',
    bestFor: 'Chain-of-thought reasoning',
    speed: 'medium',
    reasoning: 'high',
    isFree: true,
    paramSize: 1.2,
  },
  {
    id: 'google/gemma-3n-e2b-it:free',
    name: 'Gemma 3n 2B',
    params: '2B',
    bestFor: 'General instruction following, fast responses',
    speed: 'fast',
    reasoning: 'low',
    isFree: true,
    paramSize: 2,
  },
  {
    id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    name: 'Venice Uncensored',
    params: '24B',
    bestFor: 'Uncensored, creative tasks',
    speed: 'slow',
    reasoning: 'high',
    isFree: true,
    paramSize: 24,
  },
  {
    id: 'qwen/qwen3-4b:free',
    name: 'Qwen3 4B',
    params: '4B',
    bestFor: 'General chat, multilingual, balanced',
    speed: 'fast',
    reasoning: 'medium',
    isFree: true,
    paramSize: 4,
  },
];

/**
 * Parse parameter size from string (e.g., "400B", "2.5B", "7B")
 * returns value in Billions.
 */
function parseParamSize(str: string): number {
  const match = str.match(/(\d+(\.\d+)?)\s*[Bb]/);
  if (!match) return 0;
  return parseFloat(match[1]);
}

/**
 * Fetch latest models from Puter.js API
 */
export async function fetchAvailableModels(): Promise<ModelInfo[]> {
  if (typeof puter === 'undefined') return MODEL_CATALOG;

  try {
    const rawModels = await puter.ai.listModels();

    const dynamicModels: ModelInfo[] = rawModels.map((m: any) => {
      const isFree =
        m.id.includes(':free') || (m.cost?.input === 0 && m.cost?.output === 0);

      // Try to find in our hardcoded catalog for better meta
      const existing = MODEL_CATALOG.find((ext) => ext.id === m.id);
      if (existing) return { ...existing, isFree };

      // Infer params from name or ID
      const inferredParams = m.name?.includes('B')
        ? m.name.match(/\d+(\.\d+)?[Bb]/)?.[0] || 'Unknown'
        : 'Unknown';
      const paramSize = parseParamSize(inferredParams || m.id);

      return {
        id: m.id,
        name: m.name || m.id,
        params: inferredParams,
        bestFor: isFree ? 'Free Access' : 'Premium Tasks',
        speed: 'medium',
        reasoning: 'medium',
        isFree,
        paramSize,
      };
    });

    // Sorting:
    // 1. Free models first (Arcee AI Trinity Large Preview at very top)
    // 2. Paid models below, sorted alphabetically
    return dynamicModels.sort((a, b) => {
      // Arcee AI Trinity Large Preview free always first
      if (a.id === 'arcee-ai/trinity-large-preview:free') return -1;
      if (b.id === 'arcee-ai/trinity-large-preview:free') return 1;
      // Other free models next, sorted by paramSize (largest first)
      if (a.isFree && !b.isFree) return -1;
      if (!a.isFree && b.isFree) return 1;
      if (a.isFree && b.isFree) {
        return (b.paramSize || 0) - (a.paramSize || 0);
      }
      // Paid models sorted alphabetically
      return a.name.localeCompare(b.name);
    });
  } catch (err) {
    console.warn(
      '[Models] Failed to fetch dynamic models, using fallback:',
      err,
    );
    return MODEL_CATALOG;
  }
}

// ─── Tiered failover chains ──────────────────────────────────────────
const TIER_CHAINS: Record<ModelTier, AIModel[]> = {
  fast: [
    'arcee-ai/trinity-large-preview:free',
    'qwen/qwen3-4b:free',
    'google/gemma-3n-e2b-it:free',
    'liquid/lfm-2.5-1.2b-instruct:free',
  ],
  reasoning: [
    'arcee-ai/trinity-large-preview:free',
    'liquid/lfm-2.5-1.2b-thinking:free',
    'qwen/qwen3-4b:free',
  ],
  agent: [
    'arcee-ai/trinity-large-preview:free',
    'liquid/lfm-2.5-1.2b-thinking:free',
    'qwen/qwen3-4b:free',
  ],
};

/** Get the failover chain for a given tier */
export function getModelChain(tier: ModelTier): AIModel[] {
  return TIER_CHAINS[tier] || MODEL_CATALOG.map((m) => m.id);
}

/** Determine tier from intent */
export function selectTier(
  intent: QueryIntent,
  complexity: 'low' | 'medium' | 'high',
): ModelTier {
  const needsTools = ![
    'greeting',
    'meta',
    'navigation',
    'contact',
    'unknown',
  ].includes(intent);
  if (needsTools) return 'agent';
  if (['greeting', 'meta', 'navigation', 'contact'].includes(intent))
    return 'fast';
  if (
    complexity === 'high' ||
    ['career', 'coding', 'projects', 'skills', 'education'].includes(intent)
  )
    return 'reasoning';
  if (complexity === 'medium') return 'reasoning';
  return 'fast';
}
