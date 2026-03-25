import { getMediaData } from '../store';
import { resumeContext, projectsContext } from '../knowledge';

// 1. Movie Data
export async function getMovies() {
  const data = await getMediaData('movies');
  if (!data) return 'No movie data available.';
  return JSON.stringify({
    stats: data.stats,
    watching: data.watching?.map((m: any) => m.title).slice(0, 3) || [],
    recent_watched: data.watched?.slice(0, 5).map((m: any) => `${m.title} (${m.rating}/10)`) || [],
    top_rated: data.watched?.filter((m: any) => m.rating >= 9).slice(0, 5).map((m: any) => m.title) || [],
  });
}

// 2. Book Data
export async function getBooks() {
  const data = await getMediaData('books');
  if (!data) return 'No book data available.';
  return JSON.stringify({
    stats: data.stats,
    reading: data.reading?.map((b: any) => b.title) || [],
    recently_read: data.read?.slice(0, 5).map((b: any) => b.title) || [],
    want_to_read: data.wantToRead?.slice(0, 5).map((b: any) => b.title) || [],
  });
}

// 3. Music Data
export async function getMusic() {
  const data = await getMediaData('music');
  if (!data) return 'No music data available.';
  return JSON.stringify({
    topArtists: data.topArtists?.slice(0, 5).map((a: any) => a.name) || [],
    topTracks: data.topTracks?.slice(0, 5).map((t: any) => `${t.name} by ${t.artist}`) || [],
    recentTracks: data.recentTracks?.slice(0, 3).map((t: any) => `${t.name} by ${t.artist}`) || [],
  });
}

// 4. Anime Data
export async function getAnime() {
  const data = await getMediaData('anime');
  if (!data) return 'No anime data available.';
  return JSON.stringify({
    watching: data.watching?.slice(0, 5).map((a: any) => a.title) || [],
    completed: data.completed?.slice(0, 5).map((a: any) => `${a.title} (${a.score}/10)`) || [],
    planToWatch: data.planning?.slice(0, 5).map((a: any) => a.title) || [],
  });
}

// 5. Gaming Data
export async function getGaming() {
  const data = await getMediaData('games');
  if (!data) return 'No gaming data available.';
  return JSON.stringify({
    steam_recent: data.steam?.recent?.slice(0, 3).map((g: any) => `${g.name} (${g.playtime_2weeks_hours} hrs)`) || [],
    steam_total: data.steam?.total?.slice(0, 5).map((g: any) => g.name) || [],
    lichess_bullet: data.lichess?.bullet,
    lichess_blitz: data.lichess?.blitz,
    lichess_rapid: data.lichess?.rapid,
  });
}

// 6. Coding Data
export async function getCoding() {
  const data = await getMediaData('coding');
  if (!data) return 'No coding data available.';
  return JSON.stringify({
    github_followers: data.github?.user?.followers,
    top_repos: data.github?.repos?.slice(0, 3).map((r: any) => r.name) || [],
    leetcode_solved: data.leetcode?.solved,
    wakatime_languages: data.wakatime?.languages?.slice(0, 5).map((l: any) => l.name) || [],
    wakatime_daily_avg: data.wakatime?.dailyAverageText,
    codewars_rank: data.codewars?.rank,
  });
}

// 7. Social Data
export async function getSocial() {
  const data = await getMediaData('social');
  if (!data) return 'No social data available.';
  return JSON.stringify({
    devto_articles: data.devto?.length || 0,
    bluesky_followers: data.bluesky?.followers,
    youtube_subs: data.youtube?.stats?.subscriberCount,
  });
}

// 8. Static Knowledge
export async function getResume() {
  return resumeContext;
}

export async function getProjects() {
  return projectsContext;
}

export async function getContactInfo() {
  return "Email: whyiswhen@gmail.com, Location: Pune, India. Roles: Developer, Designer.";
}

export async function navigateTo(destination: string) {
  return `Tell the user they can navigate to the page by using the sidebar, or link them to /${destination}`;
}

// Intent to Tool Map
export const toolRegistry: Record<string, () => Promise<string>> = {
  movies: getMovies,
  books: getBooks,
  music: getMusic,
  anime: getAnime,
  gaming: getGaming,
  coding: getCoding,
  stats: getCoding, // fallback
  career: getResume,
  projects: getProjects,
  contact: getContactInfo,
  social: getSocial,
};
