import { fetchJson } from './fetcher';
import type { YouTubeVideo } from './types';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export async function fetchYouTubeStats() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) return null;

  const data = await fetchJson<any>(
    `${YOUTUBE_API_URL}/channels?part=statistics&id=${channelId}&key=${apiKey}`,
    undefined,
    'YouTube',
  );

  if (!data?.items?.[0]?.statistics) return null;
  const stats = data.items[0].statistics;

  return {
    subscribers: parseInt(stats.subscriberCount, 10),
    videoCount: parseInt(stats.videoCount, 10),
    viewCount: parseInt(stats.viewCount, 10),
  };
}

export async function fetchYouTubeVideos(limit = 5): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) return [];

  // 1. Get uploads playlist ID
  const channelData = await fetchJson<any>(
    `${YOUTUBE_API_URL}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
    undefined,
    'YouTube Uploads Playlist',
  );

  const playlistId =
    channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) return [];

  // 2. Fetch recent videos from playlist
  const playlistData = await fetchJson<any>(
    `${YOUTUBE_API_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${limit}&key=${apiKey}`,
    undefined,
    'YouTube Videos',
  );

  if (!playlistData?.items) return [];

  return playlistData.items.map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt,
    viewCount: 0, // Requires additional API call per video to /videos endpoint (skipping to save quota)
    likeCount: 0,
  }));
}
