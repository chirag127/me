import { fetchJson } from './fetcher';
import { CONFIG } from '../config';

const CODEWARS_API = 'https://www.codewars.com/api/v1/users';

export async function fetchCodewarsStats() {
  const data = await fetchJson<any>(
    `${CODEWARS_API}/${CONFIG.user.codewars}`,
    undefined,
    'Codewars'
  );

  if (!data) return null;

  const languages: Record<string, { rank: number }> = {};
  if (data.ranks?.languages) {
    Object.entries(data.ranks.languages).forEach(([lang, info]: [string, any]) => {
      languages[lang] = { rank: Math.abs(info.rank) }; // E.g., rank -6 means 6 kyu
    });
  }

  return {
    honor: data.honor,
    rank: data.ranks?.overall?.name || 'Unknown',
    totalCompleted: data.codeChallenges?.totalCompleted || 0,
    languages,
  };
}
