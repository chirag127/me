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

export async function fetchAvailableModels(): Promise<ModelInfo[]> {
  return MODEL_CATALOG;
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
    'gear',
  ].includes(intent);
  if (needsTools) return 'agent';
  if (['greeting', 'meta', 'navigation', 'contact', 'gear'].includes(intent))
    return 'fast';
  if (
    complexity === 'high' ||
    ['career', 'coding', 'projects', 'skills', 'education'].includes(intent)
  )
    return 'reasoning';
  if (complexity === 'medium') return 'reasoning';
  return 'fast';
}
