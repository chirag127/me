import { fetchJson } from './fetcher';
import type { BlueskyPost } from './types';

const BSKY_API_URL = 'https://bsky.social/xrpc';

async function getJwtSession() {
  const handle = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_APP_PASSWORD;

  if (!handle || !password) return null;

  const res = await fetchJson<any>(
    `${BSKY_API_URL}/com.atproto.server.createSession`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: handle, password }),
    },
    'Bluesky Auth'
  );

  return res?.accessJwt || null;
}

export async function fetchBlueskyPosts(limit = 10): Promise<{ posts: BlueskyPost[]; handle: string } | null> {
  const handle = process.env.BLUESKY_HANDLE;
  if (!handle) return null;

  // We can fetch public posts without auth in AT Protocol, but using auth is safer for rate limits
  const token = await getJwtSession();
  
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const data = await fetchJson<any>(
    `${BSKY_API_URL}/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=${limit}`,
    { headers },
    'Bluesky'
  );

  if (!data?.feed) return null;

  const posts = data.feed
    .filter((item: any) => !item.reply) // Filter out replies, show only top-level posts
    .map((item: any) => {
      const post = item.post;
      return {
        text: post.record.text,
        createdAt: post.record.createdAt,
        uri: `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`,
        likeCount: post.likeCount || 0,
        replyCount: post.replyCount || 0,
        repostCount: post.repostCount || 0,
      };
    });

  return { posts, handle };
}
