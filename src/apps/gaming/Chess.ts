// Chess
import { getLichessUser } from '../../services/gaming';

export default async function Chess(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Chess</h1><p class="page-subtitle">Lichess ratings and games</p></header><div id="chess-content" class="glass-panel">Loading...</div></div><style>.chess-stats{padding:var(--space-6)}.ratings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-4);margin-top:var(--space-4)}.rating-card{text-align:center;padding:var(--space-4);background:var(--glass-bg);border-radius:var(--radius-lg)}.rating-value{font-size:var(--text-2xl);font-weight:700;font-family:var(--font-mono);background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.rating-type{font-size:var(--text-sm);color:var(--text-secondary)}</style>`;
  try {
    const user = await getLichessUser();
    const content = document.getElementById('chess-content');
    if (content) content.innerHTML = `<div class="chess-stats"><h3>@${user.username}</h3><p>${user.count.all.toLocaleString()} games played</p><p>W: ${user.count.win} | D: ${user.count.draw} | L: ${user.count.loss}</p><div class="ratings-grid">${Object.entries(user.perfs).filter(([_, v]) => v?.rating).map(([k, v]) => `<div class="rating-card"><span class="rating-value">${v?.rating}</span><span class="rating-type">${k}</span></div>`).join('')}</div></div>`;
  } catch { document.getElementById('chess-content')!.innerHTML = '<p class="muted" style="padding:var(--space-6)">Failed to load chess stats</p>'; }
}
