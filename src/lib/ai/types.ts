export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  confidence: number;
  toolsUsed: string[];
  intent: QueryIntent;
  timestamp: string;
}

export type QueryIntent = 'career' | 'coding' | 'projects' | 'skills' | 'movies' | 'music' | 'books' | 'anime' | 'general' | 'unknown';

export interface ToolResult {
  tool: string;
  data: string;
  success: boolean;
}

export interface AgentContext {
  resume: string;
  skills: string;
  projects: string;
  github: string;
  leetcode: string;
  movies: string;
  music: string;
  books: string;
  anime: string;
  chatHistory: string;
}
