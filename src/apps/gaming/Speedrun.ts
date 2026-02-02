// Speedrun
import { getSpeedrunPBs } from '../../services/gaming';

export default async function Speedrun(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Speedruns</h1><p class="page-subtitle">Personal bests from Speedrun.com</p></header><div id="speedrun-list" class="speedrun-list">Loading...</div></div><style>.speedrun-list{display:flex;flex-direction:column;gap:var(--space-3)}.pb-card{padding:var(--space-4);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg);display:flex;justify-content:space-between;align-items:center}.pb-place{font-size:var(--text-2xl);font-weight:700}.pb-time{font-family:var(--font-mono);color:var(--accent-blue)}</style>`;
  try {
    const pbs = await getSpeedrunPBs();
    const list = document.getElementById('speedrun-list');
    if (list) list.innerHTML = pbs.length ? pbs.slice(0, 10).map(p => `<a href="${p.run.weblink}" target="_blank" class="pb-card"><span class="pb-place">#${p.place}</span><span class="pb-time">${Math.floor(p.run.times.primary_t / 60)}:${String(Math.floor(p.run.times.primary_t % 60)).padStart(2, '0')}</span></a>`).join('') : '<p class="muted">No personal bests found</p>';
  } catch { document.getElementById('speedrun-list')!.innerHTML = '<p class="muted">Failed to load speedruns</p>'; }
}
