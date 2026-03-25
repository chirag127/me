import { fetchJson, fetchText } from './fetcher';
import type { SpotifyTrack, LastFmArtist } from './types';

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('[Spotify] Missing environment variables.');
    return null;
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  try {
    const res = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      console.warn('[Spotify] Failed to get access token:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error('[Spotify] Token fetch error:', err);
    return null;
  }
}

export async function fetchSpotifyTopTracks(limit = 10): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();
  if (!token) return [];

  const data = await fetchJson<any>(
    `${SPOTIFY_API_BASE}/me/top/tracks?time_range=short_term&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } },
    'Spotify'
  );

  if (!data?.items) return [];

  return data.items.map((track: any) => ({
    name: track.name,
    artist: track.artists.map((a: any) => a.name).join(', '),
    album: track.album.name,
    imageUrl: track.album.images?.[0]?.url || null,
    previewUrl: track.preview_url,
    externalUrl: track.external_urls?.spotify || '',
  }));
}

export async function fetchSpotifyTopArtists(limit = 10): Promise<LastFmArtist[]> {
  const token = await getAccessToken();
  if (!token) return [];

  const data = await fetchJson<any>(
    `${SPOTIFY_API_BASE}/me/top/artists?time_range=short_term&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } },
    'Spotify'
  );

  if (!data?.items) return [];

  return data.items.map((artist: any) => ({
    name: artist.name,
    playcount: 0, // Spotify doesn't expose raw playcount here
    url: artist.external_urls?.spotify || '',
    imageUrl: artist.images?.[0]?.url || null,
  }));
}
