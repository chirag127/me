import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

// Instrument Bench — phosphor-on-slate console.
const appearance = {
  variables: {
    colorPrimary: '#35e0c0',
    colorText: '#e6eef2',
    colorTextSecondary: '#9fb2bd',
    colorBackground: '#111a22',
    colorInputBackground: '#0b1116',
    colorInputText: '#e6eef2',
    colorDanger: '#f2a65a',
    borderRadius: '6px',
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
  },
  elements: {
    card: { backgroundColor: '#111a22', border: '1px solid rgba(120,160,175,0.14)' },
    headerTitle: { fontFamily: "'Space Grotesk', system-ui, sans-serif", color: '#e6eef2' },
    formButtonPrimary: {
      backgroundColor: '#35e0c0',
      color: '#0b1116',
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: '600',
      textTransform: 'none' as const,
    },
    footerActionLink: { color: '#35e0c0' },
  },
} as const

export default function AuthButton() {
  if (!publishableKey) {
    return (
      <a href="https://oriz.in" className="link-pill" title="Sign-in enabled once configured">
        oriz SSO
      </a>
    )
  }
  return (
    <ClerkProvider publishableKey={publishableKey} appearance={appearance}>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="link-pill" type="button">Sign in</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </ClerkProvider>
  )
}
