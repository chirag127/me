# Open questions

Per AGENTS.md, when a contributor isn't sure how to proceed they should record a numbered question here with a recommended default. The owner reviews; contributors should not block waiting if a sensible default is already noted.

## Format

```markdown
## Q<N>. <one-line question>

- **Context:** what made this come up
- **Recommended default:** what an agent should do if it can't wait
- **Status:** open / answered / superseded
```

## Q1. Should `src/data/*.ts` migrate to `content/`?

- **Context:** AGENTS.md mandates `content/` as the single source of truth, but data currently lives in `src/data/{social,resume,testimonials}.ts` and is hardcoded in dozens of `src/pages/*.astro` files.
- **Recommended default:** treat the next substantive content edit as the trigger — when a contributor needs to change personal data, migrate that one slice (career, resume, social) into `content/<slice>/` with a Zod schema, leaving the other slices for later.
- **Status:** open

## Q2. Are 217 `: any` annotations all flagged for cleanup?

- **Context:** AGENTS.md forbids `any` without `// TODO(<gh-issue>): drop any`. A grep finds 217 occurrences across 55 files; none are annotated.
- **Recommended default:** when touching a file for any other reason, replace `any` in the touched code with the right type or annotate with a TODO. No mass-rewrite commit.
- **Status:** open

## Q3. Should the existing 98 `console.*` calls be migrated?

- **Context:** A `src/lib/log.ts` no-op-in-prod logger now exists. Existing calls were not migrated in this pass to keep the diff narrow and behavior unchanged.
- **Recommended default:** migrate per file when that file is next touched for unrelated reasons; do not run a single sweeping rewrite.
- **Status:** open
