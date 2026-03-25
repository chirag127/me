import { callLLM, type PuterChatResponse } from './engine';
import { z } from 'zod';

const IntentSchema = z.enum(['career', 'projects', 'coding', 'movies', 'music', 'books', 'personal', 'unknown']);
export type QueryIntent = z.infer<typeof IntentSchema>;

/**
 * Uses the fast 'simple' model to classify intent perfectly.
 */
export async function classifyQuery(query: string): Promise<QueryIntent> {
  const prompt = `Classify this query about Chirag into EXACTLY ONE of the following precise categories:
career, projects, coding, movies, music, books, personal, unknown.
Respond with ONLY the exact category string in lowercase. Do not add quotes, markdown, or extra words.

Query: "${query}"`;
  
  try {
    const response = await callLLM(prompt, 'simple') as PuterChatResponse;
    const raw = response.message?.content || response.text || '';
    
    const cleaned = raw.trim().toLowerCase().replace(/[^a-z]/g, '');
    
    // Strict Zod validation
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
