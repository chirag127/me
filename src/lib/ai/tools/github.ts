import { z } from 'zod';
import { queryClient } from './client';

const RepoSchema = z.object({
  name: z.string(),
  description: z.string().nullable().default('No description'),
  stargazers_count: z.number(),
  language: z.string().nullable().default('Unknown'),
  html_url: z.string(),
});
const GithubResponseSchema = z.array(RepoSchema);

export async function getGitHubData(username: string): Promise<string> {
  try {
    const data = await queryClient.fetchQuery({
      queryKey: ['github', username],
      queryFn: async () => {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        if (!res.ok) throw new Error('Failed to fetch Github');
        const json = await res.json();
        // Strict Zod validation
        return GithubResponseSchema.parse(json);
      },
      staleTime: 1000 * 60 * 60, // 1 hour
    });

    const summary = data.map(repo => `- ${repo.name} (${repo.language}): ${repo.stargazers_count} stars. ${repo.description}`).join('\n');
    return `Recent GitHub Projects:\n${summary}`;
  } catch (error) {
    console.error('GitHub Tool Error:', error);
    return 'Unable to fetch GitHub data at this time.';
  }
}
