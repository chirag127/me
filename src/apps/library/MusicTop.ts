// Music Top
import { getLastFmTopTracks, getLastFmTopArtists } from '../../services/media';

export default async function MusicTop(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Top Music</h1><p class="page-subtitle">All-time favorites from Last.fm</p></header><section class="section"><h2 class="section-title">🎤 Top Artists</h2><div id="top-artists" class="artists-grid">Loading...</div></section><section class="section"><h2 class="section-title">🎵 Top Tracks</h2><div id="top-tracks" class="tracks-list">Loading...</div></section></div><style>.artists-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-4)}.artist-card{padding:var(--space-4);background:var(--glass-bg);border-radius:var(--radius-lg);text-align:center}.tracks-list{display:flex;flex-direction:column;gap:var(--space-2)}.track-item{display:flex;justify-content:space-between;padding:var(--space-3);background:var(--glass-bg);border-radius:var(--radius-md)}</style>`;
  try {
    const [artists, tracks] = await Promise.all([getLastFmTopArtists('overall', 6), getLastFmTopTracks('overall', 10)]);
    const artistsEl = document.getElementById('top-artists');
    const tracksEl = document.getElementById('top-tracks');
    if (artistsEl) artistsEl.innerHTML = artists.map(a => `<div class="artist-card"><strong>${a.name}</strong><p>${parseInt(a.playcount).toLocaleString()} plays</p></div>`).join('');
    if (tracksEl) tracksEl.innerHTML = tracks.map(t => `<div class="track-item"><span>${t.name} - ${t.artist.name}</span><span>${parseInt(t.playcount).toLocaleString()} plays</span></div>`).join('');
  } catch {}
}
