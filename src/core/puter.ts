/**
 * Project Me - Puter.js Wrapper
 * Typed wrapper for Puter.js AI/KV capabilities
 */

// Puter.js types
export interface PuterAI {
  chat: (prompt: string | ChatMessage[], options?: ChatOptions) => Promise<ChatResponse>;
  txt2img: (prompt: string, testMode?: boolean) => Promise<HTMLImageElement>;
  img2txt: (image: string) => Promise<string>;
  txt2speech: (text: string, options?: TTSOptions) => Promise<HTMLAudioElement>;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  message?: {
    content: string;
    role: string;
  };
  text?: string;
}

export interface TTSOptions {
  voice?: string;
  engine?: string;
  language?: string;
}

export interface PuterKV {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  del: (key: string) => Promise<void>;
  list: () => Promise<string[]>;
}

export interface PuterFS {
  write: (path: string, content: string | Blob) => Promise<{ path: string }>;
  read: (path: string) => Promise<Blob>;
  delete: (path: string) => Promise<void>;
  mkdir: (path: string) => Promise<void>;
  readdir: (path: string) => Promise<string[]>;
}

export interface PuterAuth {
  isSignedIn: () => boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<{ username: string; email?: string }>;
}

export interface Puter {
  ai: PuterAI;
  kv: PuterKV;
  fs: PuterFS;
  auth: PuterAuth;
  print: (message: string) => void;
  randName: () => string;
}

// Declare global puter object
declare global {
  interface Window {
    puter: Puter;
  }
  const puter: Puter;
}

// AI Chat helpers
export async function askAI(
  prompt: string,
  context?: string,
  model: string = 'gpt-5-nano'
): Promise<string> {
  if (typeof puter === 'undefined' || !puter.ai) {
    throw new Error('Puter.js AI is not available');
  }

  const fullPrompt = context ? `${context}\n\nQuestion: ${prompt}` : prompt;

  const response = await puter.ai.chat(fullPrompt, { model });

  if (typeof response === 'string') {
    return response;
  }

  return response.message?.content || response.text || '';
}

// Multi-turn conversation
export async function chatWithHistory(
  messages: ChatMessage[],
  model: string = 'gpt-5-nano'
): Promise<string> {
  if (typeof puter === 'undefined' || !puter.ai) {
    throw new Error('Puter.js AI is not available');
  }

  const response = await puter.ai.chat(messages, { model });

  if (typeof response === 'string') {
    return response;
  }

  return response.message?.content || response.text || '';
}

// KV Store helpers
export async function getValue<T>(key: string, defaultValue: T): Promise<T> {
  if (typeof puter === 'undefined' || !puter.kv) {
    console.warn('Puter.js KV is not available, using default');
    return defaultValue;
  }

  try {
    const value = await puter.kv.get(key);
    if (value === null) {
      return defaultValue;
    }
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

export async function setValue<T>(key: string, value: T): Promise<void> {
  if (typeof puter === 'undefined' || !puter.kv) {
    console.warn('Puter.js KV is not available');
    return;
  }

  await puter.kv.set(key, JSON.stringify(value));
}

export async function deleteValue(key: string): Promise<void> {
  if (typeof puter === 'undefined' || !puter.kv) {
    console.warn('Puter.js KV is not available');
    return;
  }

  await puter.kv.del(key);
}

// Check if Puter.js is available
export function isPuterAvailable(): boolean {
  return typeof puter !== 'undefined';
}

export function isPuterAIAvailable(): boolean {
  return isPuterAvailable() && !!puter.ai;
}

export function isPuterKVAvailable(): boolean {
  return isPuterAvailable() && !!puter.kv;
}

// Resume context for AI
import { RESUME } from '../data/resume';

export function getResumeContext(): string {
  return `
You are Chirag Singhal's AI assistant on his portfolio website. Answer questions about him based on this information:

PERSONAL INFO:
- Name: ${RESUME.personal.name}
- Position: ${RESUME.personal.position} - ${RESUME.personal.tagline}
- Location: ${RESUME.personal.location}
- Email: ${RESUME.personal.email}
- Quote: "${RESUME.personal.quote}"

SUMMARY:
${RESUME.summary}

SKILLS:
${RESUME.skills.map(cat => `${cat.category}: ${cat.skills.join(', ')}`).join('\n')}

EXPERIENCE:
${RESUME.experience.map(exp => `
${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})
${exp.highlights.map(h => `- ${h}`).join('\n')}
`).join('\n')}

KEY PROJECTS:
${RESUME.projects.map(proj => `
${proj.name} [${proj.techStack.join(', ')}]
${proj.highlights.map(h => `- ${h}`).join('\n')}
`).join('\n')}

EDUCATION:
${RESUME.education.map(edu => `
${edu.degree} - ${edu.institution} (${edu.year})
${edu.details.join(', ')}
`).join('\n')}

HONORS:
${RESUME.honors.map(h => `- ${h.title}: ${h.description} (${h.year})`).join('\n')}

Keep responses concise, friendly, and professional. If asked something not covered here, politely say you don't have that information.
`;
}

export default {
  askAI,
  chatWithHistory,
  getValue,
  setValue,
  deleteValue,
  isPuterAvailable,
  isPuterAIAvailable,
  isPuterKVAvailable,
  getResumeContext,
};
