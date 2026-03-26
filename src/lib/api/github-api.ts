import { CONFIG } from '../config';
import { fetchJson } from './fetcher';

const GITHUB_API_URL = 'https://api.github.com';

function getOptions(): RequestInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(token && { Authorization: `token ${token}` }),
    },
  };
}

export async function fetchGitHubUser() {
  const data = await fetchJson<any>(
    `${GITHUB_API_URL}/users/${CONFIG.user.github}`,
    getOptions(),
    'GitHub',
  );

  if (!data) return null;

  return {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    publicRepos: data.public_repos,
    followers: data.followers,
  };
}

export async function fetchGitHubRepos() {
  const data = await fetchJson<any[]>(
    `${GITHUB_API_URL}/users/${CONFIG.user.github}/repos?per_page=100&sort=updated`,
    getOptions(),
    'GitHub',
  );

  if (!data) return [];

  // Filter forks and map
  return data
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
    }));
}

export function extractTopLanguages(
  repos: any[],
): { name: string; count: number }[] {
  const counts: Record<string, number> = {};

  repos.forEach((repo) => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}
