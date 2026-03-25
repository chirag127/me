import { useState, useEffect, useRef, useCallback } from 'react';
import { executeAgent } from '../../lib/ai/agent';
import { saveChatSession, saveQuery, saveUnknownQuery, trackVisitor } from '../../lib/ai/store';
import { classifyIntent } from '../../lib/ai/context';
import { getOnAuthStateChanged, getAuthInstance, saveChatMessage, type User } from '../../lib/firebase';
import { useAIChatStore } from '../../store/useAIChatStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  intent?: string;
  confidence?: number;
}

const SUGGESTED_PROMPTS = [
  'What does Chirag work on?',
  'What are his skills?',
  'What movies has he watched?',
  'Show his GitHub stats',
];

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-1">
      <span className="h-2 w-2 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="h-2 w-2 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="h-2 w-2 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

/** Lightweight markdown → HTML (no deps). */
function renderMarkdown(md: string): string {
  let html = md
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Code blocks (```...```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="chat-code-block"><code>$2</code></pre>',
  );
  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="chat-inline-code">$1</code>',
  );
  // Bold
  html = html.replace(
    /\*\*(.+?)\*\*/g, '<strong>$1</strong>',
  );
  // Italic
  html = html.replace(
    /\*(.+?)\*/g, '<em>$1</em>',
  );
  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener" '
    + 'class="text-amber-400 underline">$1</a>',
  );
  // Unordered list items
  html = html.replace(
    /^[\-\*] (.+)$/gm,
    '<li class="ml-4 list-disc">$1</li>',
  );
  // Headings (### → h4, ## → h3, # → h2)
  html = html.replace(
    /^### (.+)$/gm, '<h4 class="font-bold mt-2">$1</h4>',
  );
  html = html.replace(
    /^## (.+)$/gm, '<h3 class="font-bold mt-2 text-base">$1</h3>',
  );
  html = html.replace(
    /^# (.+)$/gm, '<h2 class="font-bold mt-2 text-lg">$1</h2>',
  );
  // Paragraphs — double newlines
  html = html
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (
        p.startsWith('<pre') || p.startsWith('<h')
        || p.startsWith('<li')
      ) return p;
      return `<p>${p}</p>`;
    })
    .join('');
  // Single newlines → <br> inside <p>
  html = html.replace(
    /([^>])\n([^<])/g, '$1<br/>$2',
  );
  return html;
}

export default function AIChat() {
  const [user, setUser] = useState<User | null>(null);
  const { isOpen, closeChat } = useAIChatStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [personality, setPersonality] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [notified, setNotified] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const onAuthStateChanged = await getOnAuthStateChanged();
      const auth = await getAuthInstance();
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          trackVisitor({
            userId: currentUser.uid,
            userEmail: currentUser.email || 'anonymous',
            userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            visitCount: 1,
            pagesVisited: [window.location.pathname],
            totalQueries: 0,
            isAnonymous: false,
          }).catch(() => {});
        }
      });
    })();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const persistToFirestore = useCallback(async (msgs: Message[]) => {
    if (!user) return;
    try {
      await saveChatSession({
        userId: user.uid,
        userEmail: user.email || 'anonymous',
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        pageContext: window.location.pathname,
        messages: msgs.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
          model: m.model,
          intent: m.intent,
          confidence: m.confidence,
        })),
        startedAt: msgs[0]?.timestamp || new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messageCount: msgs.length,
      });
    } catch (e) {
      console.error('Failed to save chat session:', e);
    }
  }, [user]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const now = new Date().toISOString();
    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: now };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setNotified(false);

    const userId = user?.uid || 'anonymous';
    const userEmail = user?.email || 'anonymous@visitor';
    const userName = user?.displayName || user?.email?.split('@')[0] || 'Anonymous Visitor';

    try {
      const response = await executeAgent(text.trim(), personality);
      const responseTimestamp = new Date().toISOString();
      const responseModel = 'puter-agent';
      const assistantMsg: Message = {
        role: 'assistant',
        content: response.content,
        timestamp: responseTimestamp,
        model: responseModel,
        intent: response.intent,
        confidence: response.confidence,
      };
      const allMessages = [...newMessages, assistantMsg];
      setMessages(allMessages);

      // Save individual query
      try {
        await saveQuery({
          userId,
          userEmail,
          userName,
          query: text.trim(),
          response: response.content,
          model: responseModel,
          intent: response.intent,
          confidence: response.confidence,
          toolsUsed: [],
          pageContext: window.location.pathname,
          timestamp: responseTimestamp,
          isUnknown: response.confidence < 0.5,
        });
      } catch (e) {
        console.error('Failed to save query:', e);
      }

      // Also save raw message via firebase helper
      try {
        await saveChatMessage(userId, userEmail, userName,
          `Q: ${text.trim()} | A: ${response.content}`,
          window.location.pathname
        );
      } catch (e) {
        console.error('Failed to save chat message:', e);
      }

      // Persist full session
      await persistToFirestore(allMessages);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      const errorAssistant: Message = {
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date().toISOString(),
        model: 'error',
        intent: 'unknown',
        confidence: 0,
      };
      const allMessages = [...newMessages, errorAssistant];
      setMessages(allMessages);
      await persistToFirestore(allMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleNotifyChirag = async () => {
    if (notified || !user) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    try {
      await saveUnknownQuery({
        userId: user.uid,
        userEmail: user.email || 'anonymous',
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        query: lastUserMsg.content,
        response: 'User requested Chirag to be notified about this unanswered query.',
        pageContext: window.location.pathname,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
      setNotified(true);
    } catch (e) {
      console.error('Failed to save unknown query:', e);
    }
  };

  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  const showNotifyButton = lastAssistant && (lastAssistant.confidence ?? 1) < 0.5 && !notified;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#05050f]/80 backdrop-blur-md animate-fade-in" onClick={closeChat}>
          <div 
            className="w-full max-w-3xl h-[85vh] min-h-[500px] max-h-[850px] rounded-2xl bg-[#1a1a2e]/90 backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(245,158,11,0.15)] flex flex-col overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/5 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <SparkleIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Ask about Chirag</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-amber-400/70">Powered by Puter.js</p>
                  <select 
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded text-[10px] text-white/70 px-1 py-0.5 outline-none focus:border-amber-500/50 cursor-pointer"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="witty">Witty</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/20 flex items-center justify-center">
                  <SparkleIcon className="h-7 w-7 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80 mb-1">Ask me anything about Chirag</p>
                  <p className="text-xs text-white/40">Skills, projects, experience, and more.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="px-2.5 py-1.5 text-[11px] rounded-lg bg-white/5 border border-white/5 text-white/50 hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%]">
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-md'
                        : 'bg-white/5 border border-white/5 text-white/80 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div
                        className="prose-chat"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(msg.content),
                        }}
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === 'assistant' && msg.model && msg.model !== 'none' && msg.model !== 'error' && (
                    <p className="text-[10px] text-white/20 mt-1 px-1">{msg.model}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {showNotifyButton && (
              <div className="flex justify-start">
                <button
                  onClick={handleNotifyChirag}
                  className="px-3 py-1.5 text-[11px] rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all"
                >
                  Want me to notify Chirag?
                </button>
              </div>
            )}

            {notified && (
              <div className="flex justify-start">
                <p className="px-3 py-1.5 text-[11px] text-emerald-400/80">Chirag has been notified!</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Chirag..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-amber-500/20 transition-all"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
        </div>
      )}
    </>
  );
}
