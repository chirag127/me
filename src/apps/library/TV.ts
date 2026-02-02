// TV
import { getTraktHistory } from '../../services/media';

export default async function TV(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">TV Shows</h1><p class="page-subtitle">Episodes tracked on Trakt</p></header><div id="shows" class="shows-list">Loading...</div></div><style>.shows-list{display:flex;flex-direction:column;gap:var(--space-2)}.show-item{padding:var(--space-4);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg)}</style>`;
  try {
    const shows = await getTraktHistory(10);
    const el = document.getElementById('shows');
    if (el) el.innerHTML = shows.length ? shows.map(s => `<div class="show-item"><strong>${s.show.title}</strong> (${s.show.year})</div>`).join('') : '<p class="muted">No shows tracked</p>';
  } catch {}
}
