/**
 * Shared HTTP utility for build-time API calls.
 * Handles retries, rate-limiting, and error logging.
 */

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

/**
 * Fetch JSON from a URL with retry logic.
 * Returns null on failure instead of throwing.
 */
export async function fetchJson<T>(
  url: string,
  options?: RequestInit,
  label?: string,
): Promise<T | null> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          Accept: 'application/json',
          ...options?.headers,
        },
      });

      if (res.status === 429) {
        // Rate limited — wait and retry
        const wait =
          RETRY_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `[${label ?? 'API'}] Rate limited, ` +
            `retrying in ${wait}ms...`,
        );
        await sleep(wait);
        continue;
      }

      if (!res.ok) {
        console.warn(
          `[${label ?? 'API'}] ${res.status} ` +
            `${res.statusText} for ${url}`,
        );
        return null;
      }

      return (await res.json()) as T;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        console.error(
          `[${label ?? 'API'}] Failed after ` +
            `${MAX_RETRIES + 1} attempts: ${url}`,
          err,
        );
        return null;
      }
      await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }
  return null;
}

/**
 * Fetch raw text (for RSS feeds, non-JSON).
 */
export async function fetchText(
  url: string,
  label?: string,
): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(
        `[${label ?? 'API'}] ${res.status} for ${url}`,
      );
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(
      `[${label ?? 'API'}] Text fetch failed:`,
      err,
    );
    return null;
  }
}

/** GraphQL helper — POST with query + variables. */
export async function fetchGraphQL<T>(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>,
  label?: string,
): Promise<T | null> {
  const data = await fetchJson<{
    data: T;
    errors?: unknown[];
  }>(
    endpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    },
    label,
  );
  if (data?.errors) {
    console.warn(
      `[${label ?? 'GraphQL'}] Errors:`,
      data.errors,
    );
  }
  return data?.data ?? null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
