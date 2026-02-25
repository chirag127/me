/**
 * usePageMeta — Sets document title + meta tags per page
 */

import { useEffect } from 'react';

interface PageMeta {
    title: string;
    description?: string;
}

export function usePageMeta({ title, description }: PageMeta) {
    useEffect(() => {
        document.title = `${title} — Chirag Singhal`;

        if (description) {
            const meta = document.querySelector(
                'meta[name="description"]'
            );
            if (meta) meta.setAttribute('content', description);
        }
    }, [title, description]);
}
