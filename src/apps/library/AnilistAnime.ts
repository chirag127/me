// Anime
import { getAnimeList } from '../../services/media';

export default async function Anime(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Anime</h1><p class="page-subtitle">My anime collection from AniList</p></header><div id="anime-grid" class="anime-grid">Loading...</div></div><style>.anime-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--space-4)}.anime-card{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg);overflow:hidden}.anime-card img{width:100%;aspect-ratio:2/3;object-fit:cover}.anime-info{padding:var(--space-3)}.anime-title{font-size:var(--text-sm);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.anime-progress{font-size:var(--text-xs);color:var(--text-secondary)}</style>`;
  try {
    const anime = await getAnimeList();
    const watching = anime.filter(a => a.status === 'CURRENT').slice(0, 12);
    const el = c.querySelector('#anime-grid');
    if (el) el.innerHTML = watching.length ? watching.map(a => `<div class="anime-card"><img src="${a.media.coverImage.large}" alt="${a.media.title.romaji}"><div class="anime-info"><div class="anime-title">${a.media.title.english || a.media.title.romaji}</div><div class="anime-progress">${a.progress}/${a.media.episodes || '?'} eps</div></div></div>`).join('') : '<p class="muted">No anime found</p>';
  } catch {}
}
