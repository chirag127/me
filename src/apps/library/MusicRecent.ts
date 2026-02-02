// Music Recent
import { getLastFmRecentTracks, type LastFmTrack } from '../../services/media';
import { formatRelativeTime } from '../../services/utility';

export default async function MusicRecent(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Recent Listens</h1><p class="page-subtitle">What I've been playing</p></header><div id="recent-tracks" class="tracks-list">Loading...</div></div><style>.tracks-list{display:flex;flex-direction:column;gap:var(--space-2)}.track-item{display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg)}.track-img{width:50px;height:50px;border-radius:var(--radius-sm);object-fit:cover}.track-info{flex:1}.track-name{font-weight:500}.track-artist{font-size:var(--text-sm);color:var(--text-secondary)}.track-time{font-size:var(--text-xs);color:var(--text-tertiary)}</style>`;
  try {
    const tracks = await getLastFmRecentTracks(20);
    const el = document.getElementById('recent-tracks');
    if (el) el.innerHTML = tracks.map((t: LastFmTrack) => {
      const img = t.image.find(i => i.size === 'medium')?.['#text'] || '';
      const time = t['@attr']?.nowplaying === 'true' ? '🎵 Now Playing' : t.date ? formatRelativeTime(parseInt(t.date.uts) * 1000) : '';
      return `<a href="${t.url}" target="_blank" class="track-item">${img ? `<img src="${img}" class="track-img">` : ''}<div class="track-info"><div class="track-name">${t.name}</div><div class="track-artist">${t.artist['#text']}</div></div><span class="track-time">${time}</span></a>`;
    }).join('');
  } catch {}
}
