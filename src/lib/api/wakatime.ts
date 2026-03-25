import { fetchJson } from './fetcher';
import type { WakaTimeStats } from './types';

const WAKATIME_API_URL = 'https://wakatime.com/api/v1';

export async function fetchWakaTimeStats(): Promise<WakaTimeStats | null> {
  // If user uses the API key (requires base64 basic auth)
  const apiKey = process.env.WAKATIME_API_KEY;
  const embedUrl = process.env.WAKATIME_EMBED_JSON_URL;

  // We'll try the Embed URL first if provided (public JSON), as it skips auth hurdles
  if (embedUrl) {
    const data = await fetchJson<any>(embedUrl, undefined, 'WakaTime');
    if (data?.data?.[0]) {
      // It's a bit limited, but works for languages
      // Better to use the actual API below if apiKey is set
    }
  }

  if (!apiKey) {
    console.warn('[WakaTime] No API key provided');
    return null;
  }

  const basicAuth = Buffer.from(apiKey).toString('base64');
  
  const data = await fetchJson<any>(
    `${WAKATIME_API_URL}/users/current/stats/last_30_days`,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`
      }
    },
    'WakaTime'
  );

  if (!data?.data) {
    console.warn('[WakaTime] No data object returned:', data);
    return null;
  }

  const stats = data.data;

  return {
    totalSeconds: stats.total_seconds || 0,
    totalText: stats.human_readable_total || '0 hrs',
    dailyAverage: stats.daily_average || 0,
    dailyAverageText: stats.human_readable_daily_average || '0 hrs',
    languages: (stats.languages || []).map((l: any) => ({
      name: l.name,
      totalSeconds: l.total_seconds,
      percent: l.percent,
      text: l.text,
    })),
    editors: (stats.editors || []).map((e: any) => ({
      name: e.name,
      percent: e.percent,
    })),
    projects: (stats.projects || []).map((p: any) => ({
      name: p.name,
      totalSeconds: p.total_seconds,
    })),
    bestDay: stats.best_day ? {
      date: stats.best_day.date,
      totalSeconds: stats.best_day.total_seconds,
      text: stats.best_day.text,
    } : null,
  };
}
