import { fetchJson } from './fetcher';

const SO_API = 'https://api.stackexchange.com/2.3';

export async function fetchStackOverflowUser(userId: string) {
  const data = await fetchJson<any>(
    `${SO_API}/users/${userId}?site=stackoverflow`,
    undefined,
    'StackOverflow'
  );

  if (!data?.items?.[0]) return null;

  const user = data.items[0];

  return {
    userId: user.user_id,
    displayName: user.display_name,
    reputation: user.reputation,
    profileImage: user.profile_image,
    link: user.link,
    location: user.location || null,
    websiteUrl: user.website_url || null,
    accountId: user.account_id,
    creationDate: user.creation_date,
    lastAccessDate: user.last_access_date,
    reputationChangeYear: user.reputation_change_year,
    reputationChangeQuarter: user.reputation_change_quarter,
    reputationChangeMonth: user.reputation_change_month,
    reputationChangeWeek: user.reputation_change_week,
    reputationChangeDay: user.reputation_change_day,
    badgeCounts: {
      gold: user.badge_counts?.gold || 0,
      silver: user.badge_counts?.silver || 0,
      bronze: user.badge_counts?.bronze || 0,
    },
    isEmployee: user.is_employee,
    acceptRate: user.accept_rate || null,
  };
}

export async function fetchStackOverflowTags(userId: string, limit = 30) {
  const data = await fetchJson<any>(
    `${SO_API}/users/${userId}/tags?order=desc&sort=popular&site=stackoverflow&pagesize=${limit}`,
    undefined,
    'StackOverflow'
  );

  if (!data?.items) return [];

  return data.items.map((tag: any) => ({
    name: tag.name,
    count: tag.count,
  }));
}

export async function fetchStackOverflowQuestions(userId: string, limit = 20) {
  const data = await fetchJson<any>(
    `${SO_API}/users/${userId}/questions?order=desc&sort=votes&site=stackoverflow&pagesize=${limit}`,
    undefined,
    'StackOverflow'
  );

  if (!data?.items) return [];

  return data.items.map((q: any) => ({
    id: q.question_id,
    title: q.title,
    score: q.score,
    viewCount: q.view_count,
    answerCount: q.answer_count,
    isAnswered: q.is_answered,
    link: q.link,
    tags: q.tags,
    creationDate: q.creation_date,
  }));
}

export async function fetchStackOverflowAnswers(userId: string, limit = 20) {
  const data = await fetchJson<any>(
    `${SO_API}/users/${userId}/answers?order=desc&sort=votes&site=stackoverflow&pagesize=${limit}`,
    undefined,
    'StackOverflow'
  );

  if (!data?.items) return [];

  return data.items.map((a: any) => ({
    id: a.answer_id,
    questionId: a.question_id,
    score: a.score,
    isAccepted: a.is_accepted,
    link: `https://stackoverflow.com/a/${a.answer_id}`,
    creationDate: a.creation_date,
  }));
}
