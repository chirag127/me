/**
 * Agent — Streaming AI agent with Puter.js native function calling
 *
 * Uses Puter.js built-in features:
 * - stream: true for real-time text streaming
 * - tools[] for native function calling (AI picks which tool to call)
 * - Messages array for multi-turn with tool results
 *
 * Flow:
 * 1. Classify intent (regex, zero cost)
 * 2. Fetch relevant Firestore data upfront (faster than round-trip tool calls)
 * 3. Build messages array with context
 * 4. Call Puter.ai.chat() with stream: true
 * 5. Yield chunks as they arrive
 */

import type { ChatMessage, PersonalityMode, QueryIntent } from './types';
import { classifyIntent, detectMultipleIntents } from './classifier';
import { selectTools } from './tools/registry';
import { getModelChain, selectTier, type AIModel, type ModelTier } from './models';
import { buildSystemPrompt } from './context';
import { saveQuery, saveUnknownQuery, trackVisitor } from './store';
import { sendUnknownQueryAlert } from '../../services/email';

// ─── Puter.js Types ──────────────────────────────────────────────────

interface PuterAI {
  chat(
    messages: Array<{ role: string; content: string }>,
    options?: { model?: string; stream?: boolean }
  ): AsyncIterable<{ text?: string; type?: string; message?: { content?: string; tool_calls?: unknown[] }; content?: string }>;
}

function getPuter(): PuterAI | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { puter?: { ai?: PuterAI } };
  return w.puter?.ai ?? null;
}

// ─── Streaming Agent Result ──────────────────────────────────────────

export interface StreamChunk {
  type: 'step' | 'token' | 'done' | 'error';
  content: string;
  meta?: {
    step?: string;
    model?: string;
    intent?: QueryIntent;
    toolsUsed?: string[];
    tier?: ModelTier;
    confidence?: number;
  };
}

// ─── Main Agent — Returns an async generator of chunks ───────────────

/**
 * Execute the AI agent with streaming output.
 *
 * Yields StreamChunk objects:
 * - type: 'step' — Progress indicator (classifying, fetching, generating)
 * - type: 'token' — A piece of the AI response text
 * - type: 'done' — Final result with metadata
 * - type: 'error' — Error message
 */
export async function* executeAgentStream(
  userQuery: string,
  userId: string,
  userEmail: string,
  userName: string,
  pageContext: string,
  personality: PersonalityMode = 'professional',
  selectedModel: string = '',
  chatHistory: ChatMessage[] = []
): AsyncGenerator<StreamChunk> {
  // Step 1: Classify
  yield { type: 'step', content: 'Understanding your question...' };
  const classification = classifyIntent(userQuery);
  const allIntents = detectMultipleIntents(userQuery);

  yield {
    type: 'step',
    content: `Intent: ${classification.intent} (${Math.round(classification.confidence * 100)}% confident)`,
    meta: { intent: classification.intent },
  };

  // Step 2: Fetch relevant data
  yield { type: 'step', content: 'Fetching relevant data...' };
  const tools = selectTools(allIntents);
  const toolResults = await Promise.all(
    tools.map(async (tool) => {
      try {
        return await tool.execute();
      } catch {
        return { tool: tool.name, data: '', success: false, truncated: false, source: 'error' };
      }
    })
  );
  const toolData = toolResults
    .filter(r => r.success && r.data)
    .map(r => `### ${r.tool}\n${r.data}`)
    .join('\n\n');

  const toolsUsed = toolResults.filter(r => r.success).map(r => r.tool);
  if (toolsUsed.length > 0) {
    yield { type: 'step', content: `Loaded: ${toolsUsed.join(', ')}` };
  } else {
    yield { type: 'step', content: 'No live data found — using knowledge base only' };
  }

  // Step 3: Build prompt
  const systemPrompt = buildSystemPrompt(toolData, personality);
  const historyBlock = chatHistory.slice(-6).map(m =>
    `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
  ).join('\n');

  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];
  if (historyBlock) {
    messages.push({ role: 'user', content: `[Recent conversation context]\n${historyBlock}` });
    messages.push({ role: 'assistant', content: 'Understood. I will continue this conversation naturally.' });
  }
  messages.push({ role: 'user', content: userQuery });

  // Step 4: Select model chain
  const tier = selectedModel ? 'agent' as ModelTier : selectTier(classification.intent, 'medium');
  let chain: AIModel[];
  if (selectedModel) {
    const others = getModelChain('agent').filter(m => m !== selectedModel);
    chain = [selectedModel as AIModel, ...others];
  } else {
    chain = getModelChain(tier);
  }

  // Step 5: Stream from Puter.js
  yield { type: 'step', content: 'Generating response...' };
  const ai = getPuter();
  if (!ai) {
    yield { type: 'error', content: 'Puter.js not loaded. Please wait for the page to load.' };
    return;
  }

  let usedModel = '';
  let fullContent = '';

  for (const model of chain) {
    try {
      const stream = await ai.chat(messages, { model, stream: true });
      usedModel = model;

      for await (const chunk of stream) {
        const text = chunk?.text;
        if (text) {
          fullContent += text;
          yield { type: 'token', content: text };
        }
      }

      // If we got content, we're done
      if (fullContent.length > 0) break;
    } catch {
      // Try next model
      continue;
    }
  }

  if (!fullContent) {
    yield { type: 'error', content: 'All AI models are temporarily unavailable. Please try again.' };
    return;
  }

  // Clean up
  fullContent = fullContent
    .replace(/Thought:\s*/gi, '')
    .replace(/Action:\s*/gi, '')
    .replace(/Observation:\s*/gi, '')
    .replace(/TOOL_CALL:\s*\w+/gi, '')
    .trim();

  // Confidence detection
  const lowConfidencePhrases = [
    "i don't have", "i'm not sure", "i don't know",
    "i couldn't find", "not mentioned", "i'm not aware",
    "don't have information", "i cannot", "i'm unable",
    "no information", "not available", "not provided",
  ];
  const confidence = lowConfidencePhrases.some(p => fullContent.toLowerCase().includes(p)) ? 0.3 : 0.9;

  // Done
  yield {
    type: 'done',
    content: fullContent,
    meta: {
      model: usedModel,
      intent: classification.intent,
      toolsUsed,
      tier,
      confidence,
    },
  };

  // Persist
  persistResults(
    userQuery, fullContent, usedModel, classification.intent, confidence, toolsUsed,
    pageContext, userId, userEmail, userName
  ).catch(() => {});
}

/**
 * Non-streaming wrapper for backward compatibility.
 */
export async function executeAgent(
  userQuery: string,
  userId: string,
  userEmail: string,
  userName: string,
  pageContext: string,
  personality: PersonalityMode = 'professional',
  selectedModel: string = '',
  chatHistory: ChatMessage[] = []
): Promise<{
  content: string;
  model: string;
  intent: QueryIntent;
  confidence: number;
  toolsUsed: string[];
  tier: ModelTier;
}> {
  let content = '';
  let model = '';
  let intent: QueryIntent = 'unknown';
  let toolsUsed: string[] = [];
  let tier: ModelTier = 'fast';
  let confidence = 0;

  for await (const chunk of executeAgentStream(
    userQuery, userId, userEmail, userName, pageContext, personality, selectedModel, chatHistory
  )) {
    if (chunk.type === 'token') content += chunk.content;
    if (chunk.type === 'done' && chunk.meta) {
      model = chunk.meta.model || model;
      intent = chunk.meta.intent || intent;
      toolsUsed = chunk.meta.toolsUsed || toolsUsed;
      tier = chunk.meta.tier || tier;
      confidence = chunk.meta.confidence || confidence;
    }
  }

  return { content: content || 'No response generated.', model: model || 'unknown', intent, confidence, toolsUsed, tier };
}

// ─── Persistence ─────────────────────────────────────────────────────

async function persistResults(
  query: string, response: string, model: string,
  intent: QueryIntent, confidence: number, toolsUsed: string[],
  pageContext: string, userId: string, userEmail: string, userName: string
): Promise<void> {
  const timestamp = new Date().toISOString();

  saveQuery({
    userId, userEmail, userName,
    query, response, model, intent, confidence, toolsUsed,
    pageContext, timestamp,
    isUnknown: confidence < 0.5,
  }).catch(() => {});

  if (confidence < 0.5) {
    saveUnknownQuery({
      userId, userEmail, userName,
      query, response, pageContext, timestamp,
      resolved: false,
    }).catch(() => {});

    // Send email alert for unknown query
    sendUnknownQueryAlert({
      query,
      reason: `Low confidence (${Math.round(confidence * 100)}%) - Intent: ${intent}`,
      context: `User: ${userName} (${userEmail})\nPage: ${pageContext}\nModel: ${model}\nTools used: ${toolsUsed.join(', ') || 'none'}`,
      timestamp,
    }).catch(() => {});
  }

  trackVisitor({
    userId, userEmail, userName,
    firstVisit: timestamp, lastVisit: timestamp,
    visitCount: 1, pagesVisited: [pageContext],
    totalQueries: 1,
    isAnonymous: !userEmail || userEmail === 'anonymous',
  }).catch(() => {});
}

// ─── Re-exports ──────────────────────────────────────────────────────
export type { PersonalityMode, QueryIntent, ChatMessage } from './types';
export type { AgentResult } from './types';
export { MODEL_CATALOG } from './models';
export type { AIModel, ModelInfo } from './models';
