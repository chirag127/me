import { fetchJson } from './fetcher';
import { CONFIG } from '../config';

const HOLOPIN_API = 'https://holopin.io/api';

export async function fetchHolopinBadges() {
  const username = CONFIG.user.holopin;

  const data = await fetchJson<any>(
    `${HOLOPIN_API}/user/${username}`,
    undefined,
    'Holopin'
  );

  if (!data) return null;

  return {
    username: data.username || username,
    badges: (data.badges || []).map((b: any) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      imageUrl: b.imageUrl || b.image,
      alt: b.alt,
      link: b.link,
      createdAt: b.createdAt,
    })),
  };
}
