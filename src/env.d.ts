/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY?: string
  readonly PUBLIC_FIREBASE_API_KEY?: string
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN?: string
  readonly PUBLIC_FIREBASE_PROJECT_ID?: string
  readonly PUBLIC_FIREBASE_STORAGE_BUCKET?: string
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly PUBLIC_FIREBASE_APP_ID?: string
  readonly TRAKT_CLIENT_ID?: string
  readonly TRAKT_USERNAME?: string
  readonly MAL_CLIENT_ID?: string
  readonly MAL_USERNAME?: string
  readonly LASTFM_API_KEY?: string
  readonly LASTFM_USERNAME?: string
  readonly LISTENBRAINZ_USERNAME?: string
  readonly GOODREADS_USER_ID?: string
  readonly DISCORD_USER_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
