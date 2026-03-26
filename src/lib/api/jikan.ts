import { CONFIG } from '../config';
import { fetchJson } from './fetcher';

const JIKAN_API_URL = 'https://api.jikan.moe/v4';

export async function fetchJikanStats() {
  const username = CONFIG.user.myanimelist;
  const data = await fetchJson<any>(
    `${JIKAN_API_URL}/users/${username}/statistics`,
    undefined,
    'Jikan',
  );

  if (!data?.data) {
    console.warn(
      `[Jikan] No stats found for user "${username}". Check that the MAL account exists.`,
    );
    return null;
  }

  return data.data;
}
