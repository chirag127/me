/**
 * ChatWrapper — Streaming AI chat with step indicators
 *
 * Features:
 * - Model selector dropdown (6 free Puter.js models)
 * - Mode selector dropdown (4 personality modes)
 * - Real-time step indicators (classifying, fetching, generating)
 * - Streaming text display (tokens appear as they arrive)
 * - Firebase + Puter.js dual auth
 * - Chat persistence to Firestore
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAIChatStore } from '../../store/useAIChatStore';
import { executeAgentStream } from '../../lib/ai/agent';
import type { ChatMessage, PersonalityMode } from '../../lib/ai/types';
import { MODEL_CATALOG } from '../../lib/ai/models';
import type { AIModel } from '../../lib/ai/models';

// ─── Draggable Button ──────────────────────────────────────────────
function DraggableButton({ onOpen }: { onOpen: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const moved = useRef(false);
  const onOpenRef = useRef(onOpen);

  useEffect(() => { onOpenRef.current = onOpen; }, [onOpen]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chat-btn-pos');
      if (saved) setPos(JSON.parse(saved));
    } catch { }
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    start.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
    setPos({ x: start.current.px + dx, y: start.current.py + dy });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    try { localStorage.setItem('chat-btn-pos', JSON.stringify(pos)); } catch { }
    if (!moved.current) onOpenRef.current();
  }, [pos]);

  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: pos.x === 0 && pos.y === 0 ? 32 : undefined,
    right: pos.x === 0 && pos.y === 0 ? 32 : undefined,
    left: pos.x !== 0 || pos.y !== 0 ? pos.x : undefined,
    top: pos.x !== 0 || pos.y !== 0 ? pos.y : undefined,
    zIndex: 40,
    touchAction: 'none',
    cursor: 'grab',
  };

  return (
    <div style={style} className="select-none group">
      <div className="absolute inset-0 bg-amber-500/20 blur-[24px] rounded-full animate-pulse pointer-events-none" />
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1a1a2e]/95 backdrop-blur-2xl text-white rounded-full font-bold shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-500/30 hover:bg-[#1a1a2e] hover:border-amber-500/50 transition-all overflow-hidden"
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <svg className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455-2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455-2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
        <span className="text-sm uppercase tracking-widest bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all hidden sm:inline">
          Ask Chirag
        </span>
      </div>
    </div>
  );
}

// ─── Markdown Renderer ──────────────────────────────────────────────
function renderMd(input: string): string {
  let h = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#0a0a14;padding:12px;border-radius:8px;overflow-x:auto;font-size:12px;margin:8px 0"><code>$2</code></pre>');
  h = h.replace(/`([^`]+)`/g, '<code style="background:#0a0a14;padding:2px 6px;border-radius:4px;font-size:12px">$1</code>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#f59e0b;text-decoration:underline">$1</a>');
  h = h.replace(/^[\-\*] (.+)$/gm, '<li style="margin-left:16px;list-style:disc">$1</li>');
  h = h.split(/\n{2,}/).map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<pre') || p.startsWith('<h') || p.startsWith('<li')) return p;
    return `<p style="margin:0 0 8px">${p}</p>`;
  }).filter(Boolean).join('');
  return h;
}

// ─── Dropdown Component ─────────────────────────────────────────────
function Dropdown({
  label, options, value, onChange, width = 'w-44',
}: {
  label: string;
  options: { value: string; label: string; sub?: string }[];
  value: string;
  onChange: (v: string) => void;
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/60 hover:text-white/80 hover:bg-white/5 border border-white/10 transition-all"
      >
        <span className="hidden sm:inline truncate max-w-[100px]">{selected?.label || label}</span>
        <svg className={`h-3 w-3 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 ${width} rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto`}>
          <div className="p-2 text-[10px] text-white/40 uppercase tracking-wider sticky top-0 bg-[#1a1a2e]">{label}</div>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full px-3 py-2 text-left hover:bg-white/5 transition-colors ${value === opt.value ? 'bg-amber-500/10' : ''
                }`}
            >
              <div className={`text-sm ${value === opt.value ? 'text-amber-400' : 'text-white/80'}`}>{opt.label}</div>
              {opt.sub && <div className="text-[10px] text-white/40 mt-0.5">{opt.sub}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step Indicator ──────────────────────────────────────────────────
function StepIndicator({ steps, streaming }: { steps: string[]; streaming: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      {steps.map((step, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 text-[11px] transition-all duration-300 ${i === steps.length - 1 && streaming ? 'text-amber-400 font-medium' : 'text-white/40'
            }`}
          style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
        >
          <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${i === steps.length - 1 && streaming
            ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]'
            : 'bg-emerald-500/50'
            }`} />
          <span className="truncate">{step}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Chat Panel ────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  intent?: string;
  confidence?: number;
  toolsUsed?: string[];
  tier?: string;
  steps?: string[];
  streaming?: boolean;
}

const SUGGESTED = [
  'What does Chirag work on?',
  'What are his skills?',
  'What movies has he watched?',
  'Show his GitHub stats',
];

const MODE_OPTIONS = [
  { value: 'professional', label: 'Professional', sub: 'Concise, formal, data-driven' },
  { value: 'casual', label: 'Casual', sub: 'Friendly, warm, conversational' },
  { value: 'witty', label: 'Witty', sub: 'Humorous, clever, entertaining' },
  { value: 'technical', label: 'Technical', sub: 'Detailed, code-heavy, precise' },
];

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  // ... rest of state ...
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedMode, setSelectedMode] = useState<PersonalityMode>('professional');
  const [puterReady, setPuterReady] = useState(false);
  const [puterUser, setPuterUser] = useState<{ username: string } | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [signingIn, setSigningIn] = useState(false);
  const [signInStep, setSignInStep] = useState<'none' | 'firebase' | 'puter' | 'done'>('none');
  const endRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Check Puter.js readiness
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const maxAttempts = 50; // Increased timeout for slower connections
      for (let i = 0; i < maxAttempts; i++) {
        if (cancelled) return;
        const w = window as any;
        if (w.puter?.ai) {
          setPuterReady(true);
          // Check for Puter auth
          try {
            if (w.puter.auth?.isSignedIn?.()) {
              const user = await w.puter.auth.getUser();
              if (user && mountedRef.current) {
                setPuterUser({ username: user.username });
                console.log('[ChatWrapper] Puter user:', user.username);
              }
            }
          } catch (err) {
            console.error('Puter auth check error:', err);
          }
          return;
        }
        await new Promise(r => setTimeout(r, 200));
      }
      console.warn('Puter.js failed to load within 10 seconds.');
    };
    check();
    return () => { cancelled = true; };
  }, []);

  // Check Firebase auth
  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const { getOnAuthStateChanged, getAuthInstance, handleGoogleRedirect } = await import('../../lib/firebase');

        // Handle redirect sign-in first
        const redirectUser = await handleGoogleRedirect();
        if (redirectUser) {
          console.log('[ChatWrapper] Redirect sign-in successful:', redirectUser.email);
        }

        const onAuth = await getOnAuthStateChanged();
        const auth = await getAuthInstance();

        unsub = onAuth(auth, async (u) => {
          if (u) {
            const firebaseUser = {
              uid: u.uid,
              email: u.email || 'anonymous',
              displayName: u.displayName || u.email?.split('@')[0] || 'Anonymous',
            };
            console.log('[ChatWrapper] Firebase auth state:', firebaseUser.email);
            setFirebaseUser(firebaseUser);
          } else {
            console.log('[ChatWrapper] Firebase user signed out');
            setFirebaseUser(null);
          }
        });
      } catch (err) {
        console.error('[ChatWrapper] Firebase init error:', err);
      }
    })();
    return () => { if (unsub) unsub(); };
  }, []);

  // Load chat history when user signs in
  useEffect(() => {
    if (!firebaseUser) {
      setChatHistory([]);
      return;
    }

    const loadHistory = async () => {
      try {
        const { getUserChatSessions } = await import('../../lib/firebase');
        const sessions = await getUserChatSessions(firebaseUser.uid);
        setChatHistory(sessions);
        console.log('[ChatWrapper] Loaded chat history:', sessions.length, 'sessions');
      } catch (err) {
        console.error('[ChatWrapper] Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, [firebaseUser?.uid]);

  // Model dropdown options
  const modelOptions = [
    { value: '', label: 'Auto (Smart)', sub: 'Picks best model for your query' },
    ...MODEL_CATALOG.map(m => ({
      value: m.id,
      label: m.name,
      sub: `${m.params} — ${m.bestFor}`,
    })),
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Add placeholder assistant message for streaming
    const assistantIdx = newMessages.length;
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      steps: [],
      streaming: true,
    }]);

    try {
      const chatHistory: ChatMessage[] = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }));

      const stream = executeAgentStream(
        text.trim(),
        firebaseUser?.uid || 'anonymous',
        firebaseUser?.email || 'anonymous',
        firebaseUser?.displayName || 'Anonymous',
        window.location.pathname,
        selectedMode,
        selectedModel,
        chatHistory
      );

      for await (const chunk of stream) {
        if (!mountedRef.current) break;
        if (chunk.type === 'step') {
          setMessages(prev => {
            if (!mountedRef.current) return prev;
            const updated = [...prev];
            const msg = { ...updated[assistantIdx] };
            msg.steps = [...(msg.steps || []), chunk.content];
            updated[assistantIdx] = msg;
            return updated;
          });
        } else if (chunk.type === 'token') {
          setMessages(prev => {
            if (!mountedRef.current) return prev;
            const updated = [...prev];
            const msg = { ...updated[assistantIdx] };
            msg.content += chunk.content;
            updated[assistantIdx] = msg;
            return updated;
          });
        } else if (chunk.type === 'done') {
          setMessages(prev => {
            if (!mountedRef.current) return prev;
            const updated = [...prev];
            const msg = { ...updated[assistantIdx] };
            msg.content = chunk.content || msg.content;
            msg.model = chunk.meta?.model;
            msg.intent = chunk.meta?.intent;
            msg.confidence = chunk.meta?.confidence;
            msg.toolsUsed = chunk.meta?.toolsUsed;
            msg.tier = chunk.meta?.tier;
            msg.streaming = false;
            updated[assistantIdx] = msg;
            return updated;
          });

          // Save to Firestore if signed in
          if (firebaseUser) {
            try {
              const { saveChatSession, getUserChatSessions } = await import('../../lib/firebase');

              // Save the complete chat session
              const chatSession = {
                id: Date.now().toString(),
                title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
                messages: [...messages, {
                  role: 'user',
                  content: text,
                  timestamp: new Date().toISOString(),
                }, {
                  role: 'assistant',
                  content: chunk.content,
                  timestamp: new Date().toISOString(),
                  model: chunk.meta?.model,
                  intent: chunk.meta?.intent,
                  confidence: chunk.meta?.confidence,
                  toolsUsed: chunk.meta?.toolsUsed,
                }],
                createdAt: new Date().toISOString(),
              };

              await saveChatSession(
                firebaseUser.uid,
                chatSession.title,
                chatSession.messages
              );
              console.log('[ChatWrapper] Chat session saved to Firestore');

              // Refresh chat history
              const sessions = await getUserChatSessions(firebaseUser.uid);
              setChatHistory(sessions);
            } catch (err) {
              console.error('[ChatWrapper] Failed to save chat session:', err);
            }
          }
        } else if (chunk.type === 'error') {
          if (mountedRef.current) setMessages(prev => {
            const updated = [...prev];
            const msg = { ...updated[assistantIdx] };
            msg.content = chunk.content;
            msg.model = 'error';
            msg.streaming = false;
            updated[assistantIdx] = msg;
            return updated;
          });
        }
      }
    } catch (e) {
      console.error('Agent error:', e);
      setMessages(prev => {
        const updated = [...prev];
        const msg = { ...updated[assistantIdx] };
        msg.content = 'Something went wrong. The AI models might be temporarily unavailable.';
        msg.model = 'error';
        msg.streaming = false;
        updated[assistantIdx] = msg;
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    setSignInStep('firebase');
    try {
      // 1. Firebase Sign In (Google Popup)
      const { signInWithGoogle } = await import('../../lib/firebase');
      const user = await signInWithGoogle();
      if (user && mountedRef.current) {
        setFirebaseUser({
          uid: user.uid,
          email: user.email || 'anonymous',
          displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        });
      }

      // 2. Puter.js Sign In
      setSignInStep('puter');
      const w = window as any;
      if (w.puter?.auth && !w.puter.auth.isSignedIn()) {
        await w.puter.auth.signIn();
        const pUser = await w.puter.auth.getUser();
        if (pUser && mountedRef.current) setPuterUser({ username: pUser.username });
      }
      setSignInStep('done');
    } catch (e) {
      console.error('Sign in error:', e);
      setSignInStep('none');
    } finally {
      if (mountedRef.current) setSigningIn(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSend(input); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#05050f]/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-4xl h-[85vh] min-h-[400px] max-h-[850px] rounded-2xl bg-[#12121e]/95 backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(245,158,11,0.12)] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-64 border-r border-white/10 bg-[#0d0d17]/90 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">Chat History</span>
              <button onClick={() => setShowHistory(false)} className="p-1 rounded text-white/40 hover:text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {!firebaseUser ? (
                <div className="p-4 text-center text-white/40 text-xs">
                  Sign in to view your chat history
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="p-4 text-center text-white/40 text-xs">
                  No chat history yet
                </div>
              ) : (
                chatHistory.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => { setMessages(session.messages); setShowHistory(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors truncate"
                  >
                    {session.title || 'New Chat'}
                  </button>
                ))
              )}
            </div>
            {firebaseUser && (
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={async () => {
                    const { signOut } = await import('../../lib/firebase');
                    await signOut();
                  }}
                  className="w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/5 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setShowHistory(!showHistory)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455-2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">Ask about Chirag</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[10px] text-white/40">
                    {!puterReady ? 'Loading AI...' : firebaseUser ? `${firebaseUser.displayName}` : 'Sign in to use all features'}
                  </p>
                  {puterReady && (
                    <div className={`h-1.5 w-1.5 rounded-full ${puterUser ? 'bg-emerald-500' : 'bg-amber-500'}`} title={puterUser ? 'Puter.js Connected' : 'Puter.js Not Signed In'} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Sign In Button (prominent when not signed in) */}
              {!firebaseUser && (
                <button
                  onClick={handleSignIn}
                  disabled={signingIn}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.08z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.84-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>{signingIn ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
              )}
              {firebaseUser && (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    {firebaseUser.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
              )}
              <div className="h-4 w-px bg-white/10 mx-1" />
              <Dropdown
                label="Model"
                options={modelOptions}
                value={selectedModel}
                onChange={setSelectedModel}
                width="w-56"
              />
              <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Prominent Sign-in Banner (when not signed in) */}
          {/* Integrated Sign-in & Maintenance Workflow */}
          {(!firebaseUser || !puterUser) && (
            <div className="px-5 py-4 bg-[#1a1a2e]/50 border-b border-white/5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-white/90">Dual Sign-in Needed</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Connect both <strong>Firebase</strong> (history) and <strong>Puter.js</strong> (AI engine) to start chatting.
                  </p>
                </div>
                <button
                  onClick={handleSignIn}
                  disabled={signingIn}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 min-w-[120px]"
                >
                  {signingIn ? (
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>{signInStep === 'firebase' ? 'Firebase...' : 'Puter.js...'}</span>
                    </div>
                  ) : 'Finish Setup'}
                </button>
              </div>
            </div>
          )}
          {/* Dual Sign-in Tip */}
          {(!firebaseUser || !puterUser) && (
            <div className="px-4 py-2 bg-amber-500/5 border-b border-amber-500/10 flex items-center justify-between flex-shrink-0 animate-in fade-in slide-in-from-top-1 duration-500">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] text-amber-200/60">
                  Tip: Sign in to sync your chat history and use advanced models.
                </span>
              </div>
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="text-[10px] font-medium text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
              >
                {signingIn ? 'Signing in...' : 'Sign in now →'}
              </button>
            </div>
          )}
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/20 flex items-center justify-center">
                  <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455-2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-medium text-white/80 mb-1">Ask me anything about Chirag</p>
                  <p className="text-sm text-white/40">Skills, projects, experience, movies, music, and more.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/5 text-white/50 hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[80%]">
                  {msg.role === 'user' ? (
                    <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-md">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Step indicators */}
                      {msg.steps && msg.steps.length > 0 && (
                        <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <StepIndicator steps={msg.steps} streaming={msg.streaming || false} />
                        </div>
                      )}

                      {/* Response content */}
                      {msg.content && (
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed bg-white/5 border border-white/5 text-white/80 rounded-bl-md ${msg.streaming ? 'border-amber-400/20' : ''}`}>
                          <div dangerouslySetInnerHTML={{ __html: renderMd(msg.content) }} />
                          {msg.streaming && (
                            <span className="inline-block w-2 h-4 bg-amber-400/60 animate-pulse ml-1 align-middle" />
                          )}
                        </div>
                      )}

                      {/* Metadata */}
                      {!msg.streaming && msg.model && msg.model !== 'error' && (
                        <div className="flex items-center gap-2 px-1 flex-wrap">
                          <span className="text-[10px] text-white/20">{msg.model}</span>
                          {msg.tier && <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/15">{msg.tier}</span>}
                          {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400/40">
                              {msg.toolsUsed.length} tool{msg.toolsUsed.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Chirag..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition-all"
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-amber-500/20 transition-all"
              >
                {loading ? (
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Root Export ────────────────────────────────────────────────────
export default function ChatWrapper() {
  const isOpen = useAIChatStore((s) => s.isOpen);
  const openChat = useAIChatStore((s) => s.openChat);
  const closeChat = useAIChatStore((s) => s.closeChat);

  if (isOpen) {
    return <ChatPanel onClose={closeChat} />;
  }
  return <DraggableButton onOpen={openChat} />;
}
