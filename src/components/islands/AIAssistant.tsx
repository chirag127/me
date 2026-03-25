import { useState, useEffect, useRef } from 'react';
import { saveChatMessage, getOnAuthStateChanged, getAuthInstance, type User } from '../../lib/firebase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PuterAI {
  chat: (prompt: string | Message[], options?: { model?: string }) => Promise<string>;
}

interface PuterGlobal {
  ai?: PuterAI;
}

const SYSTEM_PROMPT = `You are Chirag Singhal's AI assistant on his personal website. Answer questions about Chirag based on this information:

- Full Name: Chirag Singhal
- Role: Software Engineer at Tata Consultancy Services (TCS), Bhubaneswar
- Education: B.Tech CSE from AKTU (CGPA 8.81, College Rank 1), JEE Advanced AIR 11870
- Skills: Python, TypeScript, React, Astro, FastAPI, Node.js, Django, Kafka, Redis, AWS, Cloudflare Workers, Docker, Kubernetes, Terraform, LangChain, RAG Pipelines, Firebase, MongoDB, PostgreSQL
- Key Projects: Oriz (1000+ free tools, oriz.in), NexusAI (Multi-Agent RAG), TubeDigest (AI Sponsor Detection), Olivia (Edge AI Voice Assistant), Crawl4AI (Distributed Web Crawler), CloudLens (Serverless Pipeline), StreamGuard (Fraud Detection)
- Experience: TCS (Software Engineer, Jun 2025-Present), QRsay.com (Full Stack Dev, Jul 2023-May 2025)
- Location: Bhubaneswar, Odisha, India
- Email: hi@chirag127.in
- GitHub: github.com/chirag127
- Certifications: Meta Backend Developer (Coursera), AWS Certified Developer - Associate

Be helpful, concise, and friendly. If asked about something not in your knowledge, say so honestly.`;

const SUGGESTED_PROMPTS = [
  'What does Chirag work on?',
  'What are Chirag\'s skills?',
  'Tell me about Chirag\'s projects',
  'What is Chirag\'s experience?',
  'How can I contact Chirag?',
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

export default function AIAssistant() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const onAuthStateChanged = await getOnAuthStateChanged();
      const auth = await getAuthInstance();
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
    })();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const pageContext = window.location.pathname;

    try {
      const puter = (window as unknown as { puter?: PuterGlobal }).puter;
      if (!puter?.ai?.chat) {
        throw new Error('Puter.js is not loaded yet. Please try again in a moment.');
      }

      const conversation = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...messages,
        userMsg,
      ];

      const response = await puter.ai.chat(conversation);

      const reply = typeof response === 'string' ? response : 'I had trouble processing that. Could you rephrase?';
      const assistantMsg: Message = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, assistantMsg]);

      if (user) {
        try {
          await saveChatMessage(
            user.uid,
            user.email || 'anonymous@ai-assistant',
            user.displayName || user.email?.split('@')[0] || 'Anonymous',
            `[AI] Q: ${userMsg.content} | A: ${reply}`,
            pageContext
          );
        } catch (saveErr) {
          console.error('Failed to save AI chat to Firestore:', saveErr);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[520px] rounded-2xl bg-[#1a1a2e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-amber-500/10 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Ask About Chirag</p>
                <p className="text-[10px] text-amber-400/70">Powered by Puter.js</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
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
                  <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80 mb-1">Ask me anything about Chirag</p>
                  <p className="text-xs text-white/40">I can answer questions about his skills, projects, and experience.</p>
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
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-md'
                      : 'bg-white/5 border border-white/5 text-white/80 rounded-bl-md'
                  }`}
                >
                  {msg.content}
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
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
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
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-110 transition-all"
          title="Ask about Chirag"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </button>
      )}
    </div>
  );
}
