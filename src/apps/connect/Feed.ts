// Feed
import { getMastodonStatuses, getBlueskyFeed } from '../../services/social';
import { formatRelativeTime } from '../../services/utility';

export default async function Feed(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Social Feed</h1><p class="page-subtitle">Latest posts from Mastodon & Bluesky</p></header><section class="section"><h2 class="section-title">🐘 Mastodon</h2><div id="mastodon-feed" class="posts-list">Loading...</div></section><section class="section"><h2 class="section-title">🦋 Bluesky</h2><div id="bluesky-feed" class="posts-list">Loading...</div></section></div><style>.posts-list{display:flex;flex-direction:column;gap:var(--space-3)}.post-card{padding:var(--space-4);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg)}.post-content{margin-bottom:var(--space-2)}.post-time{font-size:var(--text-xs);color:var(--text-tertiary)}</style>`;
  try {
    const [mastodon, bluesky] = await Promise.all([getMastodonStatuses(5), getBlueskyFeed(5)]);
    const mFeed = document.getElementById('mastodon-feed');
    const bFeed = document.getElementById('bluesky-feed');
    if (mFeed) mFeed.innerHTML = mastodon.length ? mastodon.map(s => `<a href="${s.url}" target="_blank" class="post-card"><div class="post-content">${s.content.replace(/<[^>]*>/g, '').slice(0, 200)}...</div><span class="post-time">${formatRelativeTime(s.created_at)}</span></a>`).join('') : '<p class="muted">No posts</p>';
    if (bFeed) bFeed.innerHTML = bluesky.length ? bluesky.map(p => `<div class="post-card"><div class="post-content">${p.post.record.text.slice(0, 200)}</div><span class="post-time">${formatRelativeTime(p.post.record.createdAt)}</span></div>`).join('') : '<p class="muted">No posts</p>';
  } catch {}
}
