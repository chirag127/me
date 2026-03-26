import { CONFIG } from '../config';
import { fetchJson } from './fetcher';

const HN_API = 'https://hacker-news.firebaseio.com/v0';

export async function fetchHackerNewsStats() {
  const username = CONFIG.user.hackernews;
  const data = await fetchJson<any>(
    `${HN_API}/user/${username}.json`,
    undefined,
    'HackerNews',
  );

  if (!data) return null;

  return {
    karma: data.karma || 0,
    submittedCount: data.submitted?.length || 0,
  };
}
