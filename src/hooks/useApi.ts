/**
 * useApi — Generic data fetching hook with caching
 * SWR-like pattern: returns { data, loading, error, refetch }
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

/* Simple in-memory cache */
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; /* 5 minutes */

export function useApi<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: { enabled?: boolean; ttl?: number }
): UseApiResult<T> {
    const { enabled = true, ttl = CACHE_TTL } = options ?? {};
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const doFetch = useCallback(async () => {
        /* Check cache */
        const cached = cache.get(key);
        if (cached && Date.now() - cached.ts < ttl) {
            setData(cached.data as T);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await fetcherRef.current();
            cache.set(key, { data: result, ts: Date.now() });
            setData(result);
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)));
        } finally {
            setLoading(false);
        }
    }, [key, ttl]);

    useEffect(() => {
        if (enabled) doFetch();
    }, [enabled, doFetch]);

    return { data, loading, error, refetch: doFetch };
}
