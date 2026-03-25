import { fetchJson } from './fetcher';
import { CONFIG } from '../config';

const JIKAN_API_URL = 'https://api.jikan.moe/v4';

export async function fetchJikanStats() {
  const data = await fetchJson<any>(
    `${JIKAN_API_URL}/users/${CONFIG.user.myanimelist}/statistics`,
    undefined,
    'Jikan'
  );

  return data?.data || null;
}
