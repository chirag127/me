import { z } from 'zod';
import { queryClient } from './client';

const LeetCodeSchema = z.object({
  status: z.string(),
  totalSolved: z.number(),
  easySolved: z.number(),
  mediumSolved: z.number(),
  hardSolved: z.number(),
  ranking: z.number(),
});

export async function getLeetCodeStats(username: string): Promise<string> {
  try {
    const data = await queryClient.fetchQuery({
      queryKey: ['leetcode', username],
      queryFn: async () => {
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        if (!res.ok) throw new Error('Failed to fetch LeetCode');
        const json = await res.json();
        return LeetCodeSchema.parse(json);
      },
      staleTime: 1000 * 60 * 60, 
    });

    if (data.status !== 'success') return 'LeetCode profile not found.';

    return `LeetCode Stats for ${username}:
- Total Solved: ${data.totalSolved}
- Easy: ${data.easySolved}
- Medium: ${data.mediumSolved}
- Hard: ${data.hardSolved}
- Global Ranking: ${data.ranking}`;
  } catch (error) {
    console.error('LeetCode Tool Error:', error);
    return 'Unable to fetch LeetCode stats at this time.';
  }
}
