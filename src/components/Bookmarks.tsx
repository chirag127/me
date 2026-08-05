import { useEffect, useState } from 'react'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react'
import { getUserDoc, setUserDoc } from '~/lib/firebase'

const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

const PAGES = [
  { href: '/work/projects', label: 'Projects' },
  { href: '/me/wakatime', label: 'Coding activity' },
  { href: '/library/music', label: 'Music' },
  { href: '/me/now', label: 'Now' },
  { href: '/work/open-source', label: 'Open source' },
]

function Panel() {
  const { user } = useUser()
  const [pins, setPins] = useState<string[]>([])
  const [saved, setSaved] = useState<'idle' | 'saving' | 'ok' | 'off'>('idle')

  useEffect(() => {
    if (!user) return
    getUserDoc<{ pins?: string[] }>(user.id)
      .then((d) => setPins(d?.pins ?? []))
      .catch(() => {})
  }, [user])

  async function toggle(href: string) {
    if (!user) return
    const next = pins.includes(href) ? pins.filter((p) => p !== href) : [...pins, href]
    setPins(next)
    setSaved('saving')
    const ok = await setUserDoc(user.id, { pins: next }).catch(() => false)
    setSaved(ok ? 'ok' : 'off')
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {PAGES.map((p) => {
          const on = pins.includes(p.href)
          return (
            <label
              key={p.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                border: '1px solid var(--hair)', borderRadius: 6, cursor: 'pointer',
                background: on ? 'color-mix(in srgb, var(--phosphor) 8%, transparent)' : 'transparent',
              }}
            >
              <input type="checkbox" checked={on} onChange={() => toggle(p.href)} style={{ accentColor: '#35e0c0' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: on ? 'var(--phosphor)' : 'var(--ink-2)' }}>{p.label}</span>
            </label>
          )
        })}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', marginTop: 10, letterSpacing: '0.06em' }}>
        {saved === 'saving' && 'WRITING…'}
        {saved === 'ok' && 'SYNCED TO oriz.in'}
        {saved === 'off' && 'FIREBASE OFFLINE — set PUBLIC_FIREBASE_* to enable'}
        {saved === 'idle' && 'pins sync across *.oriz.in'}
      </p>
    </div>
  )
}

export default function Bookmarks() {
  if (!publishableKey) {
    return (
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>
        Sign-in configured at deploy. Public pages stay open to everyone.
      </p>
    )
  }
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn-ghost" type="button">Sign in to pin pages</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Panel />
      </SignedIn>
    </ClerkProvider>
  )
}
