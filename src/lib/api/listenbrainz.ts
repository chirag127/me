import { fetchJson } from './fetcher';
import { CONFIG } from '../config';

const LB_API = 'https://api.listenbrainz.org/1';

export async function fetchListenBrainzStats() {
  const username = CONFIG.user.listenbrainz;
  const data = await fetchJson<any>(
    `${LB_API}/user/${username}/listening-activity`,
    undefined,
    'ListenBrainz'
  );

  if (!data?.payload) {
    console.warn(`[ListenBrainz] No stats found for user "${username}". Check that the account exists on listenbrainz.org.`);
    return null;
  }

  return {
    totalListenCount: data.payload.total_listen_count || 0,
    range: data.payload.range || 'all_time',
  };
}

export async function fetchListenBrainzTopArtists(limit = 25) {
  const username = CONFIG.user.listenbrainz;
  const data = await fetchJson<any>(
    `${LB_API}/user/${username}/artists?count=${limit}`,
    undefined,
    'ListenBrainz'
  );

  if (!data?.payload?.artists) return [];

  return data.payload.artists.map((a: any) => ({
    name: a.artist_name,
    listenCount: a.listen_count,
    mbid: a.artist_mbid || null,
  }));
}

export async function fetchListenBrainzTopTracks(limit = 25) {
  const username = CONFIG.user.listenbrainz;
  const data = await fetchJson<any>(
    `${LB_API}/user/${username}/recordings?count=${limit}`,
    undefined,
    'ListenBrainz'
  );

  if (!data?.payload?.recordings) return [];

  return data.payload.recordings.map((r: any) => ({
    name: r.track_name,
    artist: r.artist_name,
    listenCount: r.listen_count,
    mbid: r.recording_mbid || null,
  }));
}

export async function fetchListenBrainzRecentListens(limit = 15) {
  const username = CONFIG.user.listenbrainz;
  const data = await fetchJson<any>(
    `${LB_API}/user/${username}/listens?count=${limit}`,
    undefined,
    'ListenBrainz'
  );

  if (!data?.payload?.listens) return [];

  return data.payload.listens.map((l: any) => ({
    name: l.track_metadata?.track_name || 'Unknown',
    artist: l.track_metadata?.artist_name || 'Unknown',
    listenedAt: l.listened_at ? new Date(l.listened_at * 1000).toISOString() : null,
    releaseName: l.track_metadata?.release_name || null,
  }));
}
