import type React from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * AgeGate — 18+ confirmation island.
 *
 * Wraps any age-gated page or section. Until the visitor confirms 18+,
 * children are NOT mounted into the DOM (the gate UI renders instead).
 * On accept, a long-lived cookie remembers the attestation for 365 days
 * and the children render.
 *
 * Policy: knowledge/decisions/age-gating-policy.md
 * Strategy: knowledge/decisions/100-year-strategy.md §6
 *
 * Key design choices:
 *
 * - Cookie, not localStorage — so the SSR layer could read it on a future
 *   server-rendered iteration without changing this contract.
 * - Cookie value is a literal `accepted-YYYY-MM-DD` string. The yearly
 *   freshness check looks at the date, not just presence, so visitors
 *   re-attest each year (matches the annual-review cadence in the policy).
 * - No date-of-birth collection. The button is a binary attestation; that
 *   is all the law requires for non-pornographic adult-content
 *   classification, and DOB collection would expand the compliance
 *   surface (children's data, consent ages, retention).
 */

export interface AgeGateProps {
  /** Required confirmation type — currently only 18. */
  minimumAge: 18;
  /** What's gated, for the gate copy. e.g. 'anime tracking' / 'film history'. */
  contentLabel: string;
  /** Children render only after acceptance. */
  children: React.ReactNode;
  /** Where to redirect on decline. Defaults to '/library/'. */
  declinePath?: string;
}

const COOKIE_NAME = 'oriz-me:age-gate-18';
const COOKIE_MAX_AGE_DAYS = 365;
const HEADING_ID = 'oriz-age-gate-heading';

/** Three render states: pre-hydration, gate visible, children visible. */
type GateState = 'checking' | 'prompt' | 'accepted';

export default function AgeGate({
  minimumAge,
  contentLabel,
  children,
  declinePath = '/library/',
}: AgeGateProps) {
  const [state, setState] = useState<GateState>('checking');
  const acceptBtnRef = useRef<HTMLButtonElement>(null);

  // Hydrate from cookie on mount. Render-server side returns 'checking'
  // which produces a tiny placeholder, never the gated body.
  useEffect(() => {
    const raw = getCookie(COOKIE_NAME);
    if (raw && isFreshAttestation(raw)) {
      setState('accepted');
    } else {
      setState('prompt');
    }
  }, []);

  // Focus the accept button when the prompt appears, for keyboard users.
  useEffect(() => {
    if (state === 'prompt') {
      acceptBtnRef.current?.focus();
    }
  }, [state]);

  if (state === 'checking') {
    // Avoid a flash of the prompt for already-attested visitors. Render
    // nothing until the cookie has been read.
    return null;
  }

  if (state === 'accepted') {
    return <>{children}</>;
  }

  const onAccept = () => {
    const today = new Date().toISOString().slice(0, 10);
    setCookie(COOKIE_NAME, `accepted-${today}`, COOKIE_MAX_AGE_DAYS);
    setState('accepted');
  };

  const onDecline = () => {
    if (typeof window !== 'undefined') {
      window.location.href = declinePath;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={HEADING_ID}
      data-oriz-age-gate="prompt"
      data-oriz-age-gate-min={String(minimumAge)}
      className="min-h-[60vh] flex items-center justify-center px-4 py-12"
    >
      <div
        data-oriz-age-gate-card
        className="w-full max-w-md rounded-2xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-8 shadow-2xl"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Age-restricted section
        </p>
        <h2
          id={HEADING_ID}
          className="mt-3 text-2xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display, var(--font-sans))' }}
        >
          {contentLabel} is gated for {minimumAge}+ visitors.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Some entries here carry adult-content metadata from their source
          platform. Confirm you are {minimumAge} or older to continue. We
          remember this choice in a cookie for one year — no date-of-birth is
          collected.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            ref={acceptBtnRef}
            type="button"
            onClick={onAccept}
            data-oriz-age-gate-accept
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
          >
            I am {minimumAge} or older — continue
          </button>
          <button
            type="button"
            onClick={onDecline}
            data-oriz-age-gate-decline
            className="w-full rounded-lg border border-[var(--border-default)] px-4 py-2 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
          >
            I am not {minimumAge} — take me back
          </button>
        </div>

        <p className="mt-5 text-[11px] leading-relaxed text-[var(--text-muted)]">
          Policy:{' '}
          <a
            href="/privacy#age-gate"
            className="underline decoration-dotted underline-offset-4 hover:text-[var(--text-secondary)]"
          >
            why some sections are gated
          </a>
          .
        </p>
      </div>
    </div>
  );
}

/* ─── Cookie helpers ────────────────────────────────────────────────── */

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const parts = document.cookie ? document.cookie.split('; ') : [];
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const maxAgeSeconds = Math.max(0, Math.floor(days * 24 * 60 * 60));
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  // Direct document.cookie write (not Cookie Store API) — Cookie Store has
  // uneven browser support and we already constrain every attribute ourselves.
  document.cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAgeSeconds}`,
    'Path=/',
    'SameSite=Lax',
    secure,
  ]
    .filter(Boolean)
    .join('; ');
}

/**
 * True if the cookie value is a well-formed `accepted-YYYY-MM-DD` and the
 * date is within the last 365 days. Anything malformed or stale fails closed.
 */
function isFreshAttestation(value: string): boolean {
  const match = /^accepted-(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, y, m, d] = match;
  const stamped = Date.UTC(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(stamped)) return false;
  const ageMs = Date.now() - stamped;
  if (ageMs < 0) return false;
  const yearMs = 365 * 24 * 60 * 60 * 1000;
  return ageMs <= yearMs;
}
