import { useState, useEffect, useRef, useCallback } from 'react';

const SYSTEM_PROMPT = `You are Chirag Singhal's AI digital twin. Answer questions as Chirag would, in first person.

BACKGROUND:
- Software Engineer at Tata Consultancy Services (Jun 2025 – Present)
- Previously: Full Stack Developer at QRsay.com (Jul 2023 – May 2025)
- Education: B.Tech CSE, AKTU, CGPA 8.81, Rank #1 in batch (2025)
- JEE Advanced: AIR 11870, Top 1%

KEY ACHIEVEMENTS:
- Optimized Python pricing engines — 60% latency reduction at TCS
- 40% API response time improvement at QRsay via DB tuning + Kafka
- Built 192+ open source tools at oriz.in
- AWS Certified Developer – Associate (2025)
- Meta Backend Developer Professional Certificate (2024)

TECH STACK:
- Languages: Python (expert), JavaScript/TypeScript (expert), Go, SQL
- Backend: FastAPI, Node.js, Django, REST APIs, GraphQL, gRPC
- AI/ML: LangChain, LangGraph, HuggingFace, ONNX, OpenAI API
- Infra: AWS, Docker, Kubernetes, Cloudflare, GitHub Actions
- Databases: PostgreSQL, MongoDB, Redis, DynamoDB
- Messaging: Kafka, RabbitMQ, Celery

TOP PROJECTS:
1. Oriz (oriz.in) — 192+ tools & apps platform
2. NexusAI — Multi-agent RAG with LangGraph + Kubernetes, 10 LLM providers
3. TubeDigest — YouTube AI summarization (T5 + ONNX)
4. Olivia — Local AI voice assistant (Llama-3 + Whisper)
5. Crawl4AI — Distributed web crawler (Redis + Playwright)

PERSONALITY & PHILOSOPHY:
- Ship fast, iterate. Measure, don't guess. Build in public. Free tiers only.

CONTACT: hi@chirag127.in | github.com/chirag127 | linkedin.com/in/chirag127

Keep answers concise — 2-4 sentences max. Be direct, speak as Chirag.`;

const STARTERS = [
  "What's your tech stack?",
  'Tell me about your projects',
  'Are you available for hire?',
  "What's your biggest achievement?",
];

type Message = { role: 'user' | 'assistant'; content: string };

declare global {
  interface Window {
    g4fClient?: any;
  }
}

async function callG4F(messages: Message[]): Promise<string> {
  // Use g4f.dev official JS client loaded via script tag
  const g4f = window.g4fClient;
  if (g4f) {
    try {
      const result = await g4f.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      });
      return result?.choices?.[0]?.message?.content ?? 'No response.';
    } catch (e) {
      // fall through to fetch
    }
  }

  // Fallback: try multiple free endpoints
  const endpoints = [
    'https://api.g4f.dev/v1/chat/completions',
    'https://g4f.dev/api/openai/v1/chat/completions',
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return reply;
    } catch {
      continue;
    }
  }
  throw new Error('All AI endpoints unavailable. Try again in a moment.');
}

function TypingDot({ delay }: { delay: number }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: '50%', background: '#6d828f',
      display: 'inline-block',
      animation: 'twinBounce 1.2s infinite',
      animationDelay: `${delay}ms`,
    }} />
  );
}

function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setShowStarters(false);
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const reply = await callG4F(next);
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(m => [...m, { role: 'assistant', content: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  return (
    <div style={{
      position: 'fixed', bottom: 88, right: 20, zIndex: 10000,
      width: 360, height: 520,
      background: '#0b1116',
      borderRadius: 20,
      border: '1px solid rgba(53,224,192,0.18)',
      boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(53,224,192,0.15)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      animation: 'twinSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 10, background: '#111a22', flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,#1d8f7d,#35e0c0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 12, color: '#fff',
        }}>CS</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#e6eef2', fontWeight: 600, fontSize: 14 }}>Ask Chirag AI</div>
          <div style={{ color: '#35e0c0', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#35e0c0', display: 'inline-block' }} />
            Always online
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#6d828f', cursor: 'pointer',
          fontSize: 18, padding: '4px 6px', borderRadius: 6, lineHeight: 1,
        }}>×</button>
      </div>

      {/* Messages */}
      <div className="twin-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '16px 12px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.length === 0 && !loading && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', flex: 1, gap: 6, color: '#6d828f',
            fontSize: 13, textAlign: 'center', padding: '0 20px',
          }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>◈</div>
            <div style={{ color: '#e6eef2', fontWeight: 600, fontSize: 14 }}>Hey, I'm Chirag's AI twin</div>
            <div>Ask me about my experience, projects, or background.</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-end', gap: 6,
            flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: m.role === 'user' ? 'linear-gradient(135deg,#35e0c0,#8ff0dd)' : 'linear-gradient(135deg,#1d8f7d,#35e0c0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, fontWeight: 700, color: '#fff',
            }}>{m.role === 'user' ? 'You' : 'CS'}</div>
            <div style={{
              maxWidth: '78%', padding: '9px 13px', fontSize: 13, lineHeight: 1.55,
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? '#35e0c0' : '#16222c',
              color: m.role === 'user' ? '#0b1116' : '#e6eef2',
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg,#1d8f7d,#35e0c0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, fontWeight: 700, color: '#fff',
            }}>CS</div>
            <div style={{
              background: '#16222c', borderRadius: '16px 16px 16px 4px',
              padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center',
            }}>
              <TypingDot delay={0} /><TypingDot delay={200} /><TypingDot delay={400} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starter chips */}
      {showStarters && (
        <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 5, flexShrink: 0 }}>
          {STARTERS.map(q => (
            <button key={q} className="twin-chip" onClick={() => sendMessage(q)} disabled={loading} style={{
              background: 'rgba(53,224,192,0.12)', border: '1px solid rgba(53,224,192,0.3)',
              borderRadius: 20, padding: '4px 10px', fontSize: 11, color: '#9fb2bd',
              cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', gap: 8, background: '#111a22', alignItems: 'flex-end', flexShrink: 0,
      }}>
        <textarea
          className="twin-input"
          rows={1}
          style={{
            flex: 1, background: '#0b1116', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, color: '#e6eef2', fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontSize: 13, padding: '8px 12px', outline: 'none', resize: 'none',
            lineHeight: 1.5, transition: 'border-color 0.15s',
          }}
          placeholder="Ask me anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}}
          disabled={loading}
        />
        <button
          className="twin-send"
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? '#16222c' : '#35e0c0',
            border: 'none', borderRadius: 10, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            color: loading || !input.trim() ? '#465966' : '#fff',
            fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600, fontSize: 12,
            padding: '8px 14px', flexShrink: 0, transition: 'background 0.15s', height: 38,
          }}
        >Send</button>
      </div>
    </div>
  );
}

export default function TwinWidget() {
  const [open, setOpen] = useState(false);

  // Load g4f.dev JS client
  useEffect(() => {
    if (typeof window === 'undefined' || window.g4fClient) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import Client from 'https://g4f.dev/dist/js/client.js';
      window.g4fClient = new Client();
    `;
    document.head.appendChild(script);
  }, []);

  return (
    <>
      <style>{`
        @keyframes twinBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes twinSlideUp { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes twinPulse { 0%,100%{box-shadow:0 0 0 0 rgba(53,224,192,0.4)} 50%{box-shadow:0 0 0 8px rgba(53,224,192,0)} }
        .twin-fab:hover { background: linear-gradient(135deg,#35e0c0,#8ff0dd) !important; transform: scale(1.08) !important; }
        .twin-chip:hover { background: rgba(53,224,192,0.28) !important; color: #e6eef2 !important; }
        .twin-input:focus { border-color: rgba(53,224,192,0.55) !important; }
        .twin-send:hover:not(:disabled) { background: #35e0c0 !important; }
        .twin-scroll::-webkit-scrollbar{width:3px} .twin-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>

      {open && <ChatWindow onClose={() => setOpen(false)} />}

      {/* FAB */}
      <button
        className="twin-fab"
        onClick={() => setOpen(o => !o)}
        title="Ask Chirag AI"
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#1d8f7d,#35e0c0)',
          border: 'none', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(53,224,192,0.35)',
          transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          transform: 'scale(1)',
          animation: open ? 'none' : 'twinPulse 3s infinite',
          fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 15,
        }}
      >
        {open ? '×' : 'AI'}
      </button>
    </>
  );
}
