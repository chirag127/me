import { useState, useRef, useCallback } from 'react'
import { complete } from '@chirag127/oz-ai'

const SYSTEM = `You answer questions about Chirag Singhal, a backend + AI systems engineer, from his portfolio. Speak concisely, third person, factual. If unknown, say so.

FACTS:
- Software Engineer at Tata Consultancy Services (Jun 2025–present); Python pricing engines, 60% latency cut.
- Full Stack Developer at QRsay.com (Jul 2023–May 2025); 40% API response improvement via DB tuning + Kafka.
- B.Tech CSE, AKTU, CGPA 8.81, batch rank #1 (2025). JEE Advanced AIR 11870.
- AWS Certified Developer – Associate (2025). Meta Backend Developer Professional Certificate (2024).
- 192+ open-source tools on oriz.in.
- Stack: Python, TypeScript/JavaScript, Go, SQL; FastAPI, Node, Django, REST/GraphQL/gRPC; LangChain/LangGraph, HuggingFace, ONNX; AWS, Docker, Kubernetes, Cloudflare; Postgres, MongoDB, Redis, DynamoDB; Kafka, RabbitMQ, Celery.
- Projects: Oriz (192+ tools), NexusAI (multi-agent RAG), TubeDigest (T5+ONNX YouTube summariser), Olivia (local voice assistant), Crawl4AI (distributed crawler).
- Contact: hi@chirag127.in, github.com/chirag127, linkedin.com/in/chirag127. Open to senior SWE roles.

Answer in 2–4 sentences. No markdown headings.`

const STARTERS = [
  'What is his tech stack?',
  'Is he open to hire?',
  'Biggest achievement?',
]

export default function AskPortfolio() {
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const [busy, setBusy] = useState(false)
  const [dead, setDead] = useState(false)
  const abort = useRef<AbortController | null>(null)

  const ask = useCallback(async (text: string) => {
    const query = text.trim()
    if (!query || busy) return
    abort.current?.abort()
    const ctrl = new AbortController()
    abort.current = ctrl
    setBusy(true)
    setA('')
    setQ(query)
    try {
      const res = await complete(query, { system: SYSTEM, signal: ctrl.signal })
      if (!ctrl.signal.aborted) setA(res.trim())
    } catch {
      setDead(true)
    } finally {
      if (!ctrl.signal.aborted) setBusy(false)
    }
  }, [busy])

  if (dead) return null

  return (
    <div className="ask-pf">
      <form
        className="ask-pf-bar"
        onSubmit={(e) => { e.preventDefault(); ask(q) }}
      >
        <span className="ask-pf-prompt" aria-hidden="true">?</span>
        <input
          className="ask-pf-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about Chirag — stack, work, availability…"
          aria-label="Ask about Chirag"
          disabled={busy}
        />
        <button className="ask-pf-send" type="submit" disabled={busy || !q.trim()}>
          {busy ? '…' : 'probe'}
        </button>
      </form>
      <div className="ask-pf-starters">
        {STARTERS.map((s) => (
          <button key={s} type="button" className="ask-pf-chip" onClick={() => ask(s)} disabled={busy}>
            {s}
          </button>
        ))}
      </div>
      {(busy || a) && (
        <output className="ask-pf-out">
          {busy ? <span className="ask-pf-scan">reading trace…</span> : a}
        </output>
      )}
    </div>
  )
}
