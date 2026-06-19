/**
 * validate-content.ts — validates every JSON file in
 *   src/content/authored/
 * against its matching schema in
 *   src/content/schemas/<name>.schema.json
 *
 * Exits 0 on success, 1 on any validation failure.
 *
 * Hooks:
 *   - pnpm run validate-content    — local manual check
 *   - .github/workflows/...         — runs in CI before build (when wired)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTHORED_DIR = path.resolve(__dirname, '../src/content/authored');
const SCHEMAS_DIR = path.resolve(__dirname, '../src/content/schemas');

interface ValidationFailure {
  file: string;
  errors: { path: string; message: string }[];
}

async function readJson(p: string): Promise<unknown> {
  const raw = await fs.readFile(p, 'utf-8');
  return JSON.parse(raw);
}

async function main(): Promise<void> {
  // Ajv2020 supports JSON Schema draft 2020-12, which is what our schemas
  // declare ($schema: "https://json-schema.org/draft/2020-12/schema").
  const AjvCtor = (Ajv2020 as unknown as { default?: typeof Ajv2020 }).default
    ?? (Ajv2020 as unknown as new (...args: unknown[]) => unknown);
  const ajv = new (AjvCtor as new (opts: object) => {
    compile: (s: object) => { (data: unknown): boolean; errors?: unknown[] };
  })({
    allErrors: true,
    strict: false,
    allowUnionTypes: true,
  });
  // ajv-formats has both ESM-default and CJS-named exports; handle both.
  const af = (addFormats as unknown as { default?: (a: unknown) => void }).default
    ?? (addFormats as unknown as (a: unknown) => void);
  af(ajv);

  const failures: ValidationFailure[] = [];
  let validatedCount = 0;
  let skippedCount = 0;

  let entries: string[];
  try {
    entries = await fs.readdir(AUTHORED_DIR);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[validate] ${AUTHORED_DIR} unreadable: ${msg}`);
    process.exit(1);
  }

  for (const name of entries) {
    if (!name.endsWith('.json')) continue;
    const stem = name.replace(/\.json$/, '');
    const schemaPath = path.join(SCHEMAS_DIR, `${stem}.schema.json`);

    let schema: unknown;
    try {
      schema = await readJson(schemaPath);
    } catch {
      console.warn(
        `[validate] No schema for ${name} — skipping (${stem}.schema.json not found)`,
      );
      skippedCount++;
      continue;
    }

    const data = await readJson(path.join(AUTHORED_DIR, name));
    const validate = ajv.compile(schema as object);
    const ok = validate(data);
    validatedCount++;

    if (!ok) {
      failures.push({
        file: name,
        errors: (validate.errors as Array<{
          instancePath?: string;
          message?: string;
          params?: unknown;
        }> | undefined ?? []).map((e) => ({
          path: e.instancePath || '(root)',
          message: `${e.message ?? 'invalid'}${e.params ? ' — ' + JSON.stringify(e.params) : ''}`,
        })),
      });
    }
  }

  if (failures.length === 0) {
    console.log(
      `[validate] ✓ ${validatedCount} authored file(s) valid (${skippedCount} skipped — no schema)`,
    );
    return;
  }

  console.error('[validate] ✗ Schema validation failed:');
  for (const f of failures) {
    console.error(`\n  ${f.file}`);
    for (const e of f.errors) {
      console.error(`    ${e.path}: ${e.message}`);
    }
  }
  process.exit(1);
}

main().catch((err) => {
  console.error('[validate] Fatal:', err);
  process.exit(1);
});
