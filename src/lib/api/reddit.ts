import { fetchJson } from './fetcher';
import { CONFIG } from '../config';

const REDDIT_API = 'https://www.reddit.com';

export async function fetchRedditUser() {
  const username = CONFIG.user.reddit;

  const data = await fetchJson<any>(
    `${REDDIT_API}/user/${username}/about.json`,
    undefined,
    'Reddit'
  );

  if (!data?.data) return null;

  return {
    name: data.data.name,
    iconImg: data.data.icon_img || data.data.snoovatar_img,
    totalKarma: data.data.total_karma,
    linkKarma: data.data.link_karma,
    commentKarma: data.data.comment_karma,
    createdUtc: data.data.created_utc,
    isGold: data.data.is_gold,
    isMod: data.data.is_mod,
    hasVerifiedEmail: data.data.has_verified_email,
  };
}

export async function fetchRedditPosts(limit = 25) {
  const username = CONFIG.user.reddit;

  const data = await fetchJson<any>(
    `${REDDIT_API}/user/${username}/submitted.json?sort=new&limit=${limit}`,
    undefined,
    'Reddit'
  );

  if (!data?.data?.children) return [];

  return data.data.children.map((child: any) => ({
    id: child.data.id,
    title: child.data.title,
    subreddit: child.data.subreddit,
    score: child.data.score,
    numComments: child.data.num_comments,
    url: `https://reddit.com${child.data.permalink}`,
    externalUrl: child.data.url,
    createdAt: child.data.created_utc,
    selfText: (child.data.selftext || '').substring(0, 200),
    isVideo: child.data.is_video,
    thumbnail: child.data.thumbnail,
    flair: child.data.link_flair_text,
  }));
}

export async function fetchRedditComments(limit = 25) {
  const username = CONFIG.user.reddit;

  const data = await fetchJson<any>(
    `${REDDIT_API}/user/${username}/comments.json?sort=new&limit=${limit}`,
    undefined,
    'Reddit'
  );

  if (!data?.data?.children) return [];

  return data.data.children.map((child: any) => ({
    id: child.data.id,
    body: (child.data.body || '').substring(0, 300),
    subreddit: child.data.subreddit,
    score: child.data.score,
    url: `https://reddit.com${child.data.permalink}`,
    createdAt: child.data.created_utc,
    linkTitle: child.data.link_title,
    isSubmitter: child.data.is_submitter,
  }));
}
