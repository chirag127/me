// Model routing - maps complexity to appropriate free models
export const AI_MODELS = {
  // Simple factual queries - fast small model
  simple: 'liquid/lfm-2.5-1.2b-instruct:free',
  // Reasoning queries - thinking model
  reasoning: 'liquid/lfm-2.5-1.2b-thinking:free',
  // Complex queries - larger model
  complex: 'qwen/qwen3-4b:free',
  // General purpose fallback
  general: 'google/gemma-3n-e2b-it:free',
  creative: 'arcee-ai/trinity-large-preview:free',
} as const;

export type ModelKey = keyof typeof AI_MODELS;

export function selectModel(intent: string, complexity: 'low' | 'medium' | 'high'): string {
  if (complexity === 'low') return AI_MODELS.simple;
  if (complexity === 'high') return AI_MODELS.complex;
  if (intent === 'general') return AI_MODELS.general;
  return AI_MODELS.reasoning;
}

export function classifyComplexity(query: string): 'low' | 'medium' | 'high' {
  const words = query.split(/\s+/).length;
  if (words <= 5) return 'low';
  if (words <= 15) return 'medium';
  return 'high';
}
