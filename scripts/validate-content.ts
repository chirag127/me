/**
 * Validate the `content/` collection against Zod schemas before commit.
 *
 * Per AGENTS.md, `content/` is the single source of truth for personal data.
 * This script is wired to `pnpm validate-content` but is currently a stub —
 * the `content/` directory and `src/lib/schemas/` haven't been built yet.
 * When they exist, replace the body below with the real validation pass.
 */

const CONTENT_DIR = 'content';

async function main(): Promise<void> {
  // TODO(personal-os/#schemas): implement real Zod validation against content/
  // when the content/ collection lands. For now, this is a no-op stub so
  // the script exists and the AGENTS.md-documented command resolves.
  process.stdout.write(
    `validate-content: stub — no schemas wired yet. Skipping ${CONTENT_DIR}/.\n`,
  );
}

main().catch((err) => {
  process.stderr.write(`validate-content failed: ${String(err)}\n`);
  process.exit(1);
});
