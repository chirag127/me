# `content/` — personal data lives here

> Stub. AGENTS.md mandates `content/` as the single source of truth, but the migration from `src/data/*.ts` is not yet done. See [`docs/QUESTIONS.md`](../docs/QUESTIONS.md) Q1 for the migration plan.

When this directory is built out, expect the layout from AGENTS.md:

```
content/
  identity.json              Name, email, role, location, taglines
  resume/base.yaml           RenderCV master data
  resume/variants/*.yaml     full / backend / ai
  career/*.mdx               One file per role
  projects/*.mdx             One file per featured project
  education/*.mdx
  certifications/*.json
  skills.json
  testimonials.json
  gear.json
  philosophy.mdx
  story.mdx
  now.mdx
  blog/*.mdx                 Blog posts (Sandpack code, mermaid, charts)
  journal/*.mdx              Public journal entries
```

## Editing rules

- The owner (the human) edits this directory; tooling reads but does not write (the resume PDF compiler is the only exception, writing to `public/resume/`).
- Every collection has a Zod schema in `src/lib/schemas/`. `pnpm validate-content` runs in pre-commit and CI.
- For day-to-day content edits, see [`docs/authoring.md`](../docs/authoring.md) (planned).
