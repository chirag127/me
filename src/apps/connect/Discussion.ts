// Discussion
import { SOCIAL } from '../../data';

export default async function Discussion(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Discussion</h1><p class="page-subtitle">Reddit & HackerNews</p></header><div class="bento-grid"><div class="bento-item"><h3>🔴 Reddit</h3><a href="${SOCIAL.reddit.url}" target="_blank" class="btn btn-ghost">View Profile →</a></div><div class="bento-item"><h3>🟠 HackerNews</h3><a href="${SOCIAL.hackernews.url}" target="_blank" class="btn btn-ghost">View Profile →</a></div></div></div>`;
}
