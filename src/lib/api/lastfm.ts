import { fetchJson } from './fetcher';
import type { LastFmArtist, LastFmTrack, LastFmAlbum } from './types';
import { CONFIG } from '../config';

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0';

function getBaseUrl() {
  return `${LASTFM_API_URL}/?user=${CONFIG.user.lastfm}&api_key=${process.env.LASTFM_API_KEY}&format=json`;
}

export async function fetchLastFmStats(): Promise<{ playcount: number; registered: string } | null> {
  const data = await fetchJson<any>(`${getBaseUrl()}&method=user.getinfo`, undefined, 'LastFM');
  if (!data?.user) return null;
  
  return {
    playcount: parseInt(data.user.playcount, 10),
    registered: data.user.registered.unixtime,
  };
}

export async function fetchLastFmTopArtists(limit = 10): Promise<LastFmArtist[]> {
  const data = await fetchJson<any>(
    `${getBaseUrl()}&method=user.gettopartists&limit=${limit}&period=7day`, 
    undefined, 
    'LastFM'
  );
  
  if (!data?.topartists?.artist) return [];
  
  return data.topartists.artist.map((a: any) => ({
    name: a.name,
    playcount: parseInt(a.playcount, 10),
    url: a.url,
    imageUrl: a.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || null,
  }));
}

export async function fetchLastFmTopTracks(limit = 10): Promise<LastFmTrack[]> {
  const data = await fetchJson<any>(
    `${getBaseUrl()}&method=user.gettoptracks&limit=${limit}&period=7day`, 
    undefined, 
    'LastFM'
  );
  
  if (!data?.toptracks?.track) return [];
  
  return data.toptracks.track.map((t: any) => ({
    name: t.name,
    artist: t.artist.name,
    playcount: parseInt(t.playcount, 10),
    url: t.url,
    imageUrl: t.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || null,
  }));
}

export async function fetchLastFmTopAlbums(limit = 10): Promise<LastFmAlbum[]> {
  const data = await fetchJson<any>(
    `${getBaseUrl()}&method=user.gettopalbums&limit=${limit}&period=7day`, 
    undefined, 
    'LastFM'
  );
  
  if (!data?.topalbums?.album) return [];
  
  return data.topalbums.album.map((a: any) => ({
    name: a.name,
    artist: a.artist.name,
    playcount: parseInt(a.playcount, 10),
    url: a.url,
    imageUrl: a.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || null,
  }));
}

export async function fetchLastFmRecentTracks(limit = 15): Promise<LastFmTrack[]> {
  const data = await fetchJson<any>(
    `${getBaseUrl()}&method=user.getrecenttracks&limit=${limit}`, 
    undefined, 
    'LastFM'
  );
  
  if (!data?.recenttracks?.track) return [];
  
  return data.recenttracks.track.map((t: any) => ({
    name: t.name,
    artist: t.artist['#text'],
    playcount: 1, // Recent track doesn't have individual playcount here
    url: t.url,
    imageUrl: t.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || null,
    nowPlaying: t['@attr']?.nowplaying === 'true',
  }));
}
