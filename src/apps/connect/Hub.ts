// Connect Hub
import { getAggregateSocialStats } from '../../services/social';
import { SOCIAL } from '../../data';

export default async function Hub(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Professional Network</h1><p class="page-subtitle">Connect with me across developer and professional platforms</p></header><div class="bento-grid"><div class="bento-item"><h3>🐘 Mastodon</h3><p id="mastodon-stats">Loading...</p><a href="${SOCIAL.mastodon.url}" target="_blank" class="btn btn-ghost">Follow →</a></div><div class="bento-item"><h3>🦋 Bluesky</h3><a href="${SOCIAL.bluesky.url}" target="_blank" class="btn btn-ghost">Follow →</a></div><div class="bento-item"><h3>📝 Dev.to</h3><p id="devto-stats">Loading...</p><a href="${SOCIAL.devto.url}" target="_blank" class="btn btn-ghost">Read →</a></div><div class="bento-item span-2"><h3>📧 Hire Me</h3><p>Interested in my skills? Let's discuss opportunities.</p><a href="#/connect/mail" class="btn btn-primary">Contact Me →</a></div></div></div>`;
  try {
    const stats = await getAggregateSocialStats();
    const mastodon = document.getElementById('mastodon-stats');
    const devto = document.getElementById('devto-stats');
    if (mastodon) mastodon.textContent = `${stats.mastodon.followers} followers`;
    if (devto) devto.textContent = `${stats.devto.articles} articles, ${stats.devto.reactions} reactions`;
  } catch { }
}
