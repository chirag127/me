import { CONFIG } from '../config';
import { fetchJson } from './fetcher';
import type { LichessStats, SteamGame } from './types';

const STEAM_API_URL = 'https://api.steampowered.com';

function getAppIconUrl(appId: number, iconHash: string) {
  return `http://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${iconHash}.jpg`;
}

export async function fetchSteamGames(): Promise<SteamGame[]> {
  const apiKey = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_USER_ID;

  if (!apiKey || !steamId) return [];

  const data = await fetchJson<any>(
    `${STEAM_API_URL}/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`,
    undefined,
    'Steam',
  );

  if (!data?.response?.games) return [];

  return data.response.games
    .map((g: any) => ({
      appId: g.appid,
      name: g.name,
      playtimeMinutes: g.playtime_forever,
      playtimeHours: Math.round((g.playtime_forever / 60) * 10) / 10,
      iconUrl: g.img_icon_url ? getAppIconUrl(g.appid, g.img_icon_url) : null,
      logoUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${g.appid}/header.jpg`,
      lastPlayed: g.rtime_last_played,
    }))
    .sort(
      (a: SteamGame, b: SteamGame) => b.playtimeMinutes - a.playtimeMinutes,
    );
}

export async function fetchSteamRecentGames(): Promise<SteamGame[]> {
  const apiKey = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_USER_ID;

  if (!apiKey || !steamId) return [];

  const data = await fetchJson<any>(
    `${STEAM_API_URL}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`,
    undefined,
    'Steam',
  );

  if (!data?.response?.games) return [];

  return data.response.games.map((g: any) => ({
    appId: g.appid,
    name: g.name,
    playtimeMinutes: g.playtime_forever,
    playtimeHours: Math.round((g.playtime_forever / 60) * 10) / 10,
    iconUrl: g.img_icon_url ? getAppIconUrl(g.appid, g.img_icon_url) : null,
    logoUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${g.appid}/header.jpg`,
    lastPlayed: 0,
  }));
}

export async function fetchLichessStats(): Promise<LichessStats | null> {
  const username = CONFIG.user.lichess;
  const data = await fetchJson<any>(
    `https://lichess.org/api/user/${username}`,
    undefined,
    'Lichess',
  );

  if (!data) return null;

  return {
    username,
    ratings: {
      bullet: {
        rating: data.perfs?.bullet?.rating || 0,
        games: data.perfs?.bullet?.games || 0,
      },
      blitz: {
        rating: data.perfs?.blitz?.rating || 0,
        games: data.perfs?.blitz?.games || 0,
      },
      rapid: {
        rating: data.perfs?.rapid?.rating || 0,
        games: data.perfs?.rapid?.games || 0,
      },
      classical: {
        rating: data.perfs?.classical?.rating || 0,
        games: data.perfs?.classical?.games || 0,
      },
    },
    totalGames: data.count?.all || 0,
    wins: data.count?.win || 0,
    draws: data.count?.draw || 0,
    losses: data.count?.loss || 0,
  };
}
