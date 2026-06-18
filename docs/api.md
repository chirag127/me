# External API catalog

> Stub — endpoints are currently centralized in [`src/lib/config.ts`](../src/lib/config.ts) under `CONFIG.api`. AGENTS.md lists this file as a mandatory first read; this stub points at the truth until per-service notes are written.

For each external API used by `personal-os`, document:

- **Endpoint** — base URL (matches `CONFIG.api.<key>`)
- **Auth** — public, key, OAuth, none
- **Rate limit** — relevant numbers
- **Used by** — which `src/lib/api/*.ts` module wraps it
- **Failure mode** — what the UI shows when the call fails (cached fallback, hidden, error toast)

Until that table lands, the canonical list is whatever `CONFIG.api` and `CONFIG.keys` expose in `src/lib/config.ts`. New integrations must add an entry there first and a fetcher in `src/lib/api/`.
