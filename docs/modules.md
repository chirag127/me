# Module ownership map

> Stub — to be filled in as `src/lib/api/<service>.ts` modules are reworked into the canonical layout. AGENTS.md lists this file as a mandatory first read; this stub satisfies that pointer until the real map lands.

| Module | Path | Owner | Notes |
| --- | --- | --- | --- |
| Site config | `src/lib/config.ts` | human only | Single source of truth for usernames + endpoints. Agents may not edit. |
| Logger | `src/lib/log.ts` | shared | No-op in production; replaces all `console.*` calls. |
| External API fetchers | `src/lib/api/<service>.ts` | shared | One file per service; pure typed fetchers. |
| Domain types | `src/lib/domain/` | shared | UI-friendly Movie/Book/Track shapes (planned). |
| Zod schemas | `src/lib/schemas/` | shared | Validates `content/` and `public/data/*.json` (planned). |
| Firebase client | `src/lib/firebase.ts` | shared | Auth + Firestore. |
| AI twin | `src/lib/ai/*` | shared | Puter.js wrapper, tool registry, system prompts. |
| Astro pages | `src/pages/**/*.astro` | shared | One file per route. |
| React islands | `src/components/**/*.tsx` | shared | Hydrate only where interactivity is needed. |

When a module's surface stabilizes, document its inputs / outputs / tests here and link to its API doc in `docs/api.md`.
