// Articles
import { getDevToArticles } from '../../services/social';
import { formatRelativeTime } from '../../services/utility';

export default async function Articles(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Articles</h1><p class="page-subtitle">Technical writing on Dev.to</p></header><div id="articles-list" class="articles-list">Loading...</div></div><style>.articles-list{display:flex;flex-direction:column;gap:var(--space-4)}.article-card{padding:var(--space-5);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg);transition:all var(--transition-fast)}.article-card:hover{transform:translateY(-4px);border-color:var(--accent-blue)}.article-title{font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-2)}.article-desc{color:var(--text-secondary);font-size:var(--text-sm);margin-bottom:var(--space-3)}.article-meta{display:flex;gap:var(--space-4);font-size:var(--text-xs);color:var(--text-tertiary)}.article-tags{display:flex;gap:var(--space-2);margin-top:var(--space-3)}</style>`;
  try {
    const articles = await getDevToArticles(10);
    const list = document.getElementById('articles-list');
    if (list) list.innerHTML = articles.map(a => `<a href="${a.url}" target="_blank" class="article-card"><div class="article-title">${a.title}</div><div class="article-desc">${a.description}</div><div class="article-meta"><span>❤️ ${a.public_reactions_count}</span><span>💬 ${a.comments_count}</span><span>📖 ${a.reading_time_minutes} min</span><span>${formatRelativeTime(a.published_at)}</span></div><div class="article-tags">${a.tag_list.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}</div></a>`).join('');
  } catch { document.getElementById('articles-list')!.innerHTML = '<p class="muted">Failed to load articles</p>'; }
}
