import { CONFIG } from '../config';
import { fetchJson } from './fetcher';
import type { OpenLibraryBook } from './types';

const OL_API_URL = 'https://openlibrary.org';

// OpenLibrary reading log exposes "want-to-read", "currently-reading", and "already-read"

export async function fetchOpenLibraryBooks(
  status: 'want-to-read' | 'currently-reading' | 'already-read',
): Promise<OpenLibraryBook[]> {
  const username = CONFIG.user.openlibrary;
  const res = await fetchJson<any>(
    `${OL_API_URL}/people/${username}/books/${status}.json`,
    undefined,
    'OpenLibrary',
  );

  if (!res?.reading_log_entries) return [];

  return res.reading_log_entries.map((entry: any) => {
    const work = entry.work;

    // Fallback URL generation if cover ID is present
    const coverUrl = work.cover_id
      ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
      : null;

    let category: 'want-to-read' | 'reading' | 'read' = 'read';
    if (status === 'want-to-read') category = 'want-to-read';
    if (status === 'currently-reading') category = 'reading';

    return {
      title: work.title,
      authors: work.author_names || [],
      coverId: work.cover_id || null,
      coverUrl,
      key: work.key,
      firstPublishYear: work.first_publish_year || null,
      subjects: [], // Extracted metadata
      category,
    };
  });
}

// Fetch details to get subjects/genres
export async function fetchBookDetails(key: string): Promise<string[]> {
  // Wait slightly to respect rate limit
  await new Promise((r) => setTimeout(r, 100));
  const data = await fetchJson<any>(
    `${OL_API_URL}${key}.json`,
    undefined,
    'OpenLibrary',
  );
  return data?.subjects || [];
}
