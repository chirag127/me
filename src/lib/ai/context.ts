import { resumeContext, skillsContext, projectsContext } from './knowledge';
import type { AgentContext } from './types';

// Build context from all available data sources
export function buildSystemPrompt(additionalContext?: Partial<AgentContext>): string {
  let prompt = `You are Chirag Singhal's AI assistant on his personal website. You answer questions about Chirag based on the information below. Be helpful, concise, and friendly. If you don't know something, say so honestly.

## About Chirag Singhal
${resumeContext}

## Technical Skills
${skillsContext}

## Projects
${projectsContext}
`;

  if (additionalContext?.github) {
    prompt += `\n## GitHub Data\n${additionalContext.github}\n`;
  }
  if (additionalContext?.leetcode) {
    prompt += `\n## LeetCode Stats\n${additionalContext.leetcode}\n`;
  }
  if (additionalContext?.movies) {
    prompt += `\n## Movies & Shows\n${additionalContext.movies}\n`;
  }
  if (additionalContext?.music) {
    prompt += `\n## Music\n${additionalContext.music}\n`;
  }
  if (additionalContext?.books) {
    prompt += `\n## Books\n${additionalContext.books}\n`;
  }
  if (additionalContext?.anime) {
    prompt += `\n## Anime\n${additionalContext.anime}\n`;
  }
  if (additionalContext?.chatHistory) {
    prompt += `\n## Recent Conversation\n${additionalContext.chatHistory}\n`;
  }

  prompt += `\n## Instructions
- Answer questions about Chirag based on the data above
- If asked about something not covered, say "I don't have that information about Chirag"
- Be conversational and friendly
- Keep responses concise (2-3 sentences max unless asked for detail)
- Use markdown formatting for readability`;

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
