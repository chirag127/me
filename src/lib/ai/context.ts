import { resumeContext, skillsContext, projectsContext } from './knowledge';
import type { AgentContext } from './types';

// Build context from all available data sources
export function buildSystemPrompt(toolData?: string, personality: string = 'professional'): string {
  let prompt = `You are Chirag Singhal's AI assistant on his personal website. You answer questions about Chirag based ONLY on the provided information below. Be helpful, concise, and friendly. If you don't know something, say so honestly.

## About Chirag Singhal
${resumeContext}

## Technical Skills
${skillsContext}

## Projects
${projectsContext}

`;

  if (toolData) {
    prompt += `## Relevant Live Data for the User's Query\n${toolData}\n\n`;
  }

  // Handle personality modes
  const personalityMap: Record<string, string> = {
    professional: "- Tone: Professional, concise, data-driven and formal.",
    casual: "- Tone: Friendly, conversational, warm, and uses appropriate emojis.",
    witty: "- Tone: Humorous, slightly playful, clever, and entertaining.",
    technical: "- Tone: Highly technical, code-heavy, developer-focused, explicit."
  };

  prompt += `## Instructions
- Answer questions about Chirag based ONLY on the data above. No hallucination.
- If asked about something not covered, say "I don't have that information about Chirag".
- Keep responses concise (2-3 sentences max unless asked for detail).
- Use markdown formatting for readability, including bolding for emphasis.
${personalityMap[personality] || personalityMap.professional}`;

  return prompt;
}

export function classifyIntent(query: string): string {
  const q = query.toLowerCase();
  if (/career|job|work|tcs|experience|resume|company/.test(q)) return 'career';
  if (/github|code|repo|programming|language|develop/.test(q)) return 'coding';
  if (/project|oriz|nexus|tube|olivia|crawl|cloud|stream|omni/.test(q)) return 'projects';
  if (/skill|tech|stack|framework|tool|know/.test(q)) return 'skills';
  if (/movie|film|show|watch|trakt|letterboxd/.test(q)) return 'movies';
  if (/music|song|listen|last\.fm|artist|scrobble/.test(q)) return 'music';
  if (/book|read|library|openlibrary/.test(q)) return 'books';
  if (/anime|manga|anilist/.test(q)) return 'anime';
  return 'general';
}
