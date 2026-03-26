import { fetchJson } from './fetcher';
import type { WakaTimeStats } from './types';

const WAKATIME_API_URL = 'https://wakatime.com/api/v1';

export async function fetchWakaTimeStats(): Promise<WakaTimeStats | null> {
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    // Fall back to embed JSON URL if no API key
    const embedUrl = process.env.WAKATIME_EMBED_JSON_URL;
    if (embedUrl) {
      // Convert SVG share URL to JSON endpoint
      const jsonUrl = embedUrl.replace(/\.svg(\?.*)?$/, '.json');
      const data = await fetchJson<any>(jsonUrl, undefined, 'WakaTime');
      if (data?.data) {
        return parseWakaTimeData(data.data);
      }
    }
    console.warn('[WakaTime] No API key or valid embed URL provided');
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

  return parseWakaTimeData(data.data);
}

function parseWakaTimeData(stats: any): WakaTimeStats {
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
