import { CONFIG } from '../config';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

// Custom graphql helper since leetcode requires different headers
async function fetchLeetcode<T>(
  query: string,
  variables: Record<string, any>,
): Promise<T | null> {
  try {
    const res = await fetch(LEETCODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json.data;
  } catch (e) {
    console.error('[LeetCode] fetch failed', e);
    return null;
  }
}

const query = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
    }
  }
`;

export async function fetchLeetCodeStats() {
  const data = await fetchLeetcode<any>(query, {
    username: CONFIG.user.leetcode,
  });

  if (!data?.matchedUser) return null;

  const stats = data.matchedUser.submitStats.acSubmissionNum;
  const allInfo = stats.find((s: any) => s.difficulty === 'All');
  const easyInfo = stats.find((s: any) => s.difficulty === 'Easy');
  const mediumInfo = stats.find((s: any) => s.difficulty === 'Medium');
  const hardInfo = stats.find((s: any) => s.difficulty === 'Hard');

  return {
    totalSolved: allInfo?.count || 0,
    easy: easyInfo?.count || 0,
    medium: mediumInfo?.count || 0,
    hard: hardInfo?.count || 0,
    ranking: data.userContestRanking?.globalRanking || Number.MAX_SAFE_INTEGER,
    acceptanceRate: Math.round(
      ((allInfo?.count || 0) / Math.max(allInfo?.submissions || 1, 1)) * 100,
    ),
  };
}
