// ─── Core Types ──────────────────────────────────────────────────────
// Lightweight types for the AI chat system. No framework abstractions.

export type QueryIntent =
  | 'career'
  | 'coding'
  | 'projects'
  | 'skills'
  | 'education'
  | 'movies'
  | 'music'
  | 'books'
  | 'anime'
  | 'gaming'
  | 'social'
  | 'contact'
  | 'navigation'
  | 'greeting'
  | 'meta'
  | 'unknown';

export type PersonalityMode = 'professional' | 'casual' | 'witty' | 'technical';

export interface ModelInfo {
  id: string;
  name: string;
  params: string;
  bestFor: string;
  speed: 'fast' | 'medium' | 'slow';
  reasoning: 'low' | 'medium' | 'high';
  isFree: boolean;
  paramSize?: number; // Numeric value for sorting (in billions)
}

export type ModelTier = 'fast' | 'reasoning' | 'agent';

// ─── Chat Messages ───────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// ─── Agent Result ────────────────────────────────────────────────────
export interface AgentResult {
  content: string;
  model: string;
  intent: QueryIntent;
  confidence: number;
  toolsUsed: string[];
  tier: ModelTier;
}

// ─── Tool Definition ─────────────────────────────────────────────────
export interface ToolResult {
  tool: string;
  data: string;
  success: boolean;
  truncated: boolean;
  source: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  category: QueryIntent[];
  execute: (args?: Record<string, string>) => Promise<ToolResult>;
}
