/**
 * generate-og-images.ts — renders one 1200x630 PNG per page route into
 *   public/og/<route>.png
 * for the <meta property="og:image" /> tag in Layout.astro.
 *
 * Strategy: enumerate every .astro page under src/pages/, derive a slug,
 * render an HTML/JSX card (gradient background, big title, brand mark,
 * URL footer) via @vercel/og, write PNG to public/og/.
 *
 * Runs as part of `prebuild` so deploys always carry fresh OG images.
 *
 * Requires: `pnpm add -D @vercel/og`. The import is dynamic so a missing
 * package warns and skips rather than failing tsc / build.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.resolve(__dirname, '../src/pages');
const OUT_DIR = path.resolve(__dirname, '../public/og');

interface RouteEntry {
  /** Route slug used as the PNG filename, e.g. "home", "work", "library-books". */
  slug: string;
  /** Heading rendered on the card. */
  title: string;
}

async function listRoutes(): Promise<RouteEntry[]> {
  const out: RouteEntry[] = [];
  // Recursive walk
  async function walk(dir: string, prefix: string[] = []): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full, [...prefix, e.name]);
        continue;
      }
      if (!e.name.endsWith('.astro')) continue;
      const stem = e.name === 'index.astro' ? '' : e.name.replace(/\.astro$/, '');
      const segments = [...prefix, stem].filter(Boolean);
      const slug = segments.length === 0 ? 'home' : segments.join('-');
      const title =
        segments.length === 0
          ? 'Chirag Singhal'
          : segments
              .map((s) =>
                s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              )
              .join(' · ');
      out.push({ slug, title });
    }
  }
  await walk(PAGES_DIR);
  return out;
}

function card(title: string): unknown {
  // @vercel/og's JSX runtime uses a small subset of CSS — keep it inline,
  // no Tailwind classes, no @import.
  return {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px',
        backgroundColor: '#030303',
        backgroundImage:
          'linear-gradient(135deg, rgba(20,184,166,0.18), rgba(139,92,246,0.12)), linear-gradient(180deg, #050507, #030303)',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      },
      children: [
        // Brand row
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '20px' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    height: '52px',
                    width: '52px',
                    borderRadius: '12px',
                    background:
                      'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#ffffff',
                  },
                  children: 'CS',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.7)',
                  },
                  children: 'Chirag Singhal',
                },
              },
            ],
          },
        },
        // Title
        {
          type: 'div',
          props: {
            style: {
              fontSize: '88px',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              maxWidth: '900px',
              display: 'flex',
            },
            children: title,
          },
        },
        // URL footer
        {
          type: 'div',
          props: {
            style: {
              fontSize: '22px',
              color: 'rgba(255,255,255,0.5)',
            },
            children: 'me.oriz.in',
          },
        },
      ],
    },
  };
}

async function main(): Promise<void> {
  // Dynamic import so a missing package doesn't fail tsc / build.
  let ImageResponse: typeof import('@vercel/og').ImageResponse;
  try {
    ({ ImageResponse } = await import('@vercel/og'));
  } catch {
    console.warn(
      '[OG] @vercel/og not installed — skipping OG generation. Run `pnpm add -D @vercel/og`.',
    );
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const routes = await listRoutes();
  console.log(`[OG] Generating ${routes.length} OG images...`);

  let generated = 0;
  for (const r of routes) {
    try {
      const img = new ImageResponse(card(r.title) as never, {
        width: 1200,
        height: 630,
      });
      const buf = Buffer.from(await img.arrayBuffer());
      await fs.writeFile(path.join(OUT_DIR, `${r.slug}.png`), buf);
      generated++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[OG] ${r.slug} failed: ${msg}`);
    }
  }
  console.log(`[OG] Wrote ${generated}/${routes.length} PNGs to public/og/`);
}

main().catch((err) => {
  console.error('[OG] Fatal:', err);
  process.exit(1);
});
