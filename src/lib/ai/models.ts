/**
 * Model Catalog — 6 free Puter.js models
 * Used by the dropdown selector and the agent's failover chain.
 */

import type { ModelTier, QueryIntent } from './types';

export type { ModelTier } from './types';

export type AIModel =
  | 'arcee-ai/trinity-large-preview:free'
  | 'liquid/lfm-2.5-1.2b-instruct:free'
  | 'liquid/lfm-2.5-1.2b-thinking:free'
  | 'google/gemma-3n-e2b-it:free'
  | 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free'
  | 'qwen/qwen3-4b:free';

export interface ModelInfo {
  id: AIModel;
  name: string;
  params: string;
  bestFor: string;
  speed: 'fast' | 'medium' | 'slow';
  reasoning: 'low' | 'medium' | 'high';
}

// ─── Full catalog for the dropdown ───────────────────────────────────
export const MODEL_CATALOG: ModelInfo[] = [
  {
    id: 'arcee-ai/trinity-large-preview:free',
    name: 'Trinity Large',
    params: '400B (13B active)',
    bestFor: 'Creative writing, tool use, agentic coding',
    speed: 'slow',
    reasoning: 'high',
  },
  {
    id: 'liquid/lfm-2.5-1.2b-instruct:free',
    name: 'LFM 2.5 Instruct',
    params: '1.2B',
    bestFor: 'Instruction following, RAG, data extraction',
    speed: 'fast',
    reasoning: 'medium',
  },
  {
    id: 'liquid/lfm-2.5-1.2b-thinking:free',
    name: 'LFM 2.5 Thinking',
    params: '1.2B',
    bestFor: 'Chain-of-thought reasoning',
    speed: 'medium',
    reasoning: 'high',
  },
  {
    id: 'google/gemma-3n-e2b-it:free',
    name: 'Gemma 3n 2B',
    params: '2B',
    bestFor: 'General instruction following, fast responses',
    speed: 'fast',
    reasoning: 'low',
  },
  {
    id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    name: 'Venice Uncensored',
    params: '24B',
    bestFor: 'Uncensored, creative tasks',
    speed: 'slow',
    reasoning: 'high',
  },
  {
    id: 'qwen/qwen3-4b:free',
    name: 'Qwen3 4B',
    params: '4B',
    bestFor: 'General chat, multilingual, balanced',
    speed: 'fast',
    reasoning: 'medium',
  },
];

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

// All models as final fallback
const ALL_MODELS: AIModel[] = MODEL_CATALOG.map((m) => m.id);

// ─── Public API ──────────────────────────────────────────────────────

/** Get the failover chain for a given tier */
export function getModelChain(tier: ModelTier): AIModel[] {
  return TIER_CHAINS[tier] || ALL_MODELS;
}

/** Get all model IDs for the dropdown */
export function getAllModelIds(): AIModel[] {
  return ALL_MODELS;
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
