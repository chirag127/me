import { callLLM } from './engine';
import { buildSystemPrompt, classifyIntent } from './context';
import { sendUnknownQueryAlert } from '../../services/email';
import { extractAndStorePreferences } from './preferences';

import { callLLM } from './engine';
import { buildSystemPrompt } from './context';
import { classifyQuery } from './classifier';
import { sendUnknownQueryAlert } from '../../services/email';
import { extractAndStorePreferences } from './preferences';
import { toolRegistry } from './tools/registry';

export async function executeAgent(
  userQuery: string, 
  personality: string = 'professional',
  onStream?: (text: string) => void
) {
  try {
    // 1. Identify Intent Fast
    const intent = await classifyQuery(userQuery);
    
    // 2. Execute Data Tool dynamically if required by Intent
    let toolDataOutput = '';
    const toolFunction = toolRegistry[intent];
    if (toolFunction) {
      toolDataOutput = await toolFunction();
    }

    // 3. Build Full System Prompt with extracted LIVE data
    const systemPrompt = buildSystemPrompt(toolDataOutput, personality);
    
    // 4. Create LLM Conversation Prompt
    const prompt = `${systemPrompt}\n\nUSER: ${userQuery}\n\nASSISTANT:`;
    
    // 5. Choose model based on intent complexity
    const isReasoning = intent === 'coding' || intent === 'projects';
    const isAgentic = toolFunction ? true : false;
    
    let modelComplexity: 'simple' | 'reasoning' | 'agent' = 'simple';
    if (isAgentic) modelComplexity = 'agent';
    else if (isReasoning) modelComplexity = 'reasoning';
    
    // 6. Generate Answer
    const response = await callLLM(prompt, modelComplexity, { stream: false }) as any;
    const rawContent = response.message?.content || response.text || 'I encountered a system error generating a response.';
    const textOutput = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent);

    // Simple confidence check
    const contentLower = textOutput.toLowerCase();
    const isUnknown = contentLower.includes("i don't know") || contentLower.includes("i don't have that information") || intent === 'unknown';
    const confidence = isUnknown ? 0.2 : 0.9;

    // Intelligence Side effects triggered post-Generation
    if (isUnknown || confidence < 0.5) {
      await sendUnknownQueryAlert({
        query: userQuery,
        reason: 'Low confidence or explicitly stated unknown knowledge',
        context: textOutput,
        timestamp: new Date().toISOString()
      }).catch(console.error);
    } else {
      await extractAndStorePreferences(userQuery, intent).catch(console.error);
    }
    
    if (onStream) {
      onStream(textOutput);
    }

    return {
      content: textOutput,
      intent,
      confidence,
      isUnknown,
      toolsUsed: toolFunction ? [intent] : []
    };
  } catch (error) {
    console.error('[Agent.ts] Agent Execution Failed:', error);
    throw error;
  }
}
