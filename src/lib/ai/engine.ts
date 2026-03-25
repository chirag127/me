import { puter } from '@heyputer/puter.js';

export type AIModel = 
  | 'arcee-ai/trinity-large-preview:free'
  | 'liquid/lfm-2.5-1.2b-instruct:free'
  | 'liquid/lfm-2.5-1.2b-thinking:free'
  | 'google/gemma-3n-e2b-it:free'
  | 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free'
  | 'qwen/qwen3-4b:free';

export type QueryComplexity = 'simple' | 'reasoning' | 'complex';

const MODEL_ROUTING: Record<QueryComplexity, AIModel[]> = {
  simple: ['qwen/qwen3-4b:free', 'google/gemma-3n-e2b-it:free', 'liquid/lfm-2.5-1.2b-instruct:free'],
  reasoning: ['liquid/lfm-2.5-1.2b-thinking:free', 'google/gemma-3n-e2b-it:free'],
  complex: ['cognitivecomputations/dolphin-mistral-24b-venice-edition:free', 'arcee-ai/trinity-large-preview:free', 'liquid/lfm-2.5-1.2b-thinking:free']
};

export interface PuterChatResponse {
  message?: {
    content: string;
    role?: string;
  };
  text?: string;
}

export interface PuterStreamChunk {
  text?: string;
}

export interface CallLLMOptions {
  stream?: boolean;
}

/**
 * Core LLM wrapper using Puter.js with built-in routing and failover.
 * Complies with strict TypeScript and ₹0 cost constraints.
 */
export async function callLLM(
  prompt: string, 
  model: AIModel | QueryComplexity = 'simple', 
  options: CallLLMOptions = {}
): Promise<PuterChatResponse | AsyncIterable<PuterStreamChunk>> {
  const isComplexity = (m: string): m is QueryComplexity => ['simple', 'reasoning', 'complex'].includes(m);
  
  const modelsToTry: AIModel[] = isComplexity(model) ? MODEL_ROUTING[model] : [model as AIModel];
  
  let lastError: unknown;
  
  for (const m of modelsToTry) {
    try {
      const response = await puter.ai.chat(prompt, { model: m, stream: options.stream });
      return response as PuterChatResponse | AsyncIterable<PuterStreamChunk>;
    } catch (e: unknown) {
      console.warn(`[AI Engine] Model ${m} failed. Trying next model if available...`);
      lastError = e;
    }
  }
  
  console.error('[AI Engine] All specified models failed.');
  throw lastError instanceof Error ? lastError : new Error('All models failed');
}

/**
 * Utility to process streaming response easily.
 */
export async function processStream(
  stream: AsyncIterable<PuterStreamChunk>, 
  onChunk: (fullText: string) => void
): Promise<string> {
  let fullText = '';
  try {
    for await (const part of stream) {
      if (part?.text) {
        fullText += part.text;
        onChunk(fullText);
      }
    }
  } catch (e: unknown) {
    console.error('[AI Engine] Stream processing failed:', e);
  }
  return fullText;
}
