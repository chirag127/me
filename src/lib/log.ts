/**
 * Tiny logger that no-ops in production.
 *
 * Per AGENTS.md, production code must not call `console.log` (or its
 * variants) directly. Use the methods on this module instead — in
 * production builds (`import.meta.env.PROD`) they are no-ops, so dropped
 * `log.debug` calls cost nothing.
 *
 * In development the calls forward to the matching `console` method,
 * which keeps DevTools' source-map-aware "logged from" links working.
 *
 * Migration is intentionally lazy — see docs/QUESTIONS.md Q3. Replace
 * `console.*` with `log.*` when touching a file for unrelated reasons.
 */

// `import.meta.env.PROD` is provided by Vite/Astro at build time and
// statically replaced with `true`/`false`, so the `if` is dead-code-
// eliminated in the production bundle.
const IS_PROD = import.meta.env?.PROD ?? false;

type LogFn = (...args: readonly unknown[]) => void;

const noop: LogFn = () => {};

export const log = {
  debug: IS_PROD ? noop : (console.debug.bind(console) as LogFn),
  info: IS_PROD ? noop : (console.info.bind(console) as LogFn),
  warn: IS_PROD ? noop : (console.warn.bind(console) as LogFn),
  // Errors stay on in production — they're the one thing we want
  // surfaced in real-user telemetry / Sentry hookups.
  error: console.error.bind(console) as LogFn,
} as const;

export default log;
