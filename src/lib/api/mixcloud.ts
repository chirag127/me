import { fetchJson } from './fetcher';
import { CONFIG } from '../config';

const MIXCLOUD_API = 'https://api.mixcloud.com';

export async function fetchMixcloudUser() {
  const username = CONFIG.user.mixcloud;

  const data = await fetchJson<any>(
    `${MIXCLOUD_API}/${username}/`,
    undefined,
    'Mixcloud'
  );

  if (!data) return null;

  return {
    username: data.username,
    name: data.name,
    bio: data.biog,
    url: data.url,
    pictures: {
      medium: data.pictures?.medium,
      large: data.pictures?.large,
      thumbnail: data.pictures?.thumbnail,
    },
    followerCount: data.follower_count || 0,
    followingCount: data.following_count || 0,
    cloudcastCount: data.cloudcast_count || 0,
    favoriteCount: data.favorite_count || 0,
    listenCount: data.listen_count || 0,
  };
}

export async function fetchMixcloudCloudcasts(limit = 20) {
  const username = CONFIG.user.mixcloud;

  const data = await fetchJson<any>(
    `${MIXCLOUD_API}/${username}/cloudcasts/?limit=${limit}`,
    undefined,
    'Mixcloud'
  );

  if (!data?.data) return [];

  return data.data.map((cast: any) => ({
    name: cast.name,
    url: cast.url,
    slug: cast.slug,
    description: (cast.description || '').substring(0, 300),
    createdTime: cast.created_time,
    updatedTime: cast.updated_time,
    duration: cast.audio_length,
    playCount: cast.play_count || 0,
    favoriteCount: cast.favorite_count || 0,
    listenerCount: cast.listener_count || 0,
    repostCount: cast.repost_count || 0,
    pictures: {
      medium: cast.pictures?.medium,
      large: cast.pictures?.large,
    },
    tags: (cast.tags || []).map((t: any) => t.name),
    user: {
      name: cast.user?.name,
      username: cast.user?.username,
    },
    embedUrl: `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(cast.url)}&hide_cover=1&mini=1&light=1`,
  }));
}
