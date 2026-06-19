# Resume — RenderCV variants

This folder holds the [RenderCV](https://docs.rendercv.com) YAML sources for Chirag Singhal's resume. PDFs are **not** stored here; they are built by CI on every push to `main` that touches this folder, and published as assets on a tagged GitHub Release.

## Variants

| File | Audience | Notes |
|---|---|---|
| `full.yaml` | Kitchen-sink resume — every job, every project, every skill category, every honor. Use when length doesn't matter and recruiter wants to see the full surface area. |
| `backend.yaml` | Backend / cloud / infra roles. Trimmed to projects with Python, FastAPI, Node, Kafka, Redis, AWS, Cloudflare, Postgres, microservices, and distributed-systems content. Skills sections are filtered to backend / databases / DevOps / security / core-competencies. |
| `ai.yaml` | AI Engineer / Agent / ML-platform roles. Trimmed to projects exercising LangChain, LangGraph, AutoGen, CrewAI, RAG, GPT, Llama, and edge-AI. Skills foreground AI agents, AI/data engineering, vector DBs, and (still) backend fundamentals. |

All three share the same education, honors, and certifications — those are immutable.

## Source of truth

The homepage's `/resume` route reads from `src/site-data/authored/resume.json` (one level up). **Don't sync these YAML files to that JSON automatically** — the JSON is the homepage source of truth, and these YAML files are deliberately curated, role-specific subsets. When new experience or projects land in `resume.json`, propagate them by hand into the relevant variant(s).

## Building locally

```bash
# RenderCV is a Python package — install it with pipx or uv (no pnpm/yarn).
pipx install rendercv     # or: uv tool install rendercv
rendercv render src/site-data/authored/resume/full.yaml --output-folder-name dist-resume/full
```

The output lands in `dist-resume/<variant>/Chirag_Singhal_CV.pdf` plus a `.tex`, `.html`, and `.md` rendering. Only the PDF is published to Releases.

## CI — `.github/workflows/build-resume.yml`

The workflow runs on every push to `main` that changes a file under this folder, builds all three variants, copies the PDFs to stable filenames (`chirag-singhal-resume-{full,backend,ai}.pdf`), and publishes them as a GitHub Release tagged `resume-<short-sha>`. It also runs on manual dispatch from the Actions tab.

The latest published PDFs are always available at:

```
https://github.com/chirag127/chirag127.github.io/releases/latest/download/chirag-singhal-resume-full.pdf
https://github.com/chirag127/chirag127.github.io/releases/latest/download/chirag-singhal-resume-backend.pdf
https://github.com/chirag127/chirag127.github.io/releases/latest/download/chirag-singhal-resume-ai.pdf
```

(GitHub redirects `/releases/latest/download/<asset>` to the most recent release containing that asset name.)

## Adding a 4th variant

1. Copy `full.yaml` to `src/site-data/authored/resume/<role>.yaml` and trim to taste — keep the top-level `cv:` and `design:` keys, the same `name`/`email`/`location`/`social_networks` block, and only the sections you want.
2. Add three new steps to `.github/workflows/build-resume.yml`:
   - a `Build <role> variant` step that calls `rendercv render src/site-data/authored/resume/<role>.yaml --output-folder-name dist-resume/<role>`
   - a `cp` line in the `Stage PDFs with stable names` step that maps `dist-resume/<role>/Chirag_Singhal_CV.pdf` to `dist-resume/release/chirag-singhal-resume-<role>.pdf`
3. Push to `main` — the workflow's `paths:` filter will pick up the new YAML automatically.

## Hard rules

- No phone number or street address in any variant — RenderCV would render them on the PDF, and these files are public.
- Don't edit `src/site-data/authored/resume.json` from these files — that's the homepage source.
- Don't commit built PDFs into the repo — they belong in Releases.
- These files are 100% Python-tooled. Don't add `rendercv` to `package.json` or run `pnpm install rendercv` — the tool is `pip install rendercv` only.
