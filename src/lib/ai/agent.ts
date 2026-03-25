import { callLLM } from './engine';
import { buildSystemPrompt, classifyIntent } from './context';
import { sendUnknownQueryAlert } from '../../services/email';
import { extractAndStorePreferences } from './preferences';

export async function executeAgent(userQuery: string, onStream?: (text: string) => void) {
  try {
    const intent = classifyIntent(userQuery);
    const systemPrompt = buildSystemPrompt();
    
    // Create prompt
    const prompt = `${systemPrompt}\n\nUSER: ${userQuery}\n\nASSISTANT:`;
    
    // Choose model based on intent
    const isReasoning = intent === 'coding' || intent === 'projects';
    const modelComplexity = isReasoning ? 'reasoning' : 'simple';
    
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
      isUnknown
    };
  } catch (error) {
    console.error('[Agent.ts] Agent Execution Failed:', error);
    throw error;
  }
}
