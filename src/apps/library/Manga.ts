// Manga
import { getMangaList } from '../../services/media';

export default async function Manga(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Manga</h1><p class="page-subtitle">My manga collection from AniList</p></header><div id="manga-grid" class="manga-grid">Loading...</div></div><style>.manga-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--space-4)}.manga-card{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg);overflow:hidden}.manga-card img{width:100%;aspect-ratio:2/3;object-fit:cover}.manga-info{padding:var(--space-3)}.manga-title{font-size:var(--text-sm);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.manga-progress{font-size:var(--text-xs);color:var(--text-secondary)}</style>`;
  try {
    const manga = await getMangaList();
    const reading = manga.filter(m => m.status === 'CURRENT').slice(0, 12);
    const el = document.getElementById('manga-grid');
    if (el) el.innerHTML = reading.length ? reading.map(m => `<div class="manga-card"><img src="${m.media.coverImage.large}" alt="${m.media.title.romaji}"><div class="manga-info"><div class="manga-title">${m.media.title.english || m.media.title.romaji}</div><div class="manga-progress">${m.progress}/${m.media.chapters || '?'} ch</div></div></div>`).join('') : '<p class="muted">No manga found</p>';
  } catch {}
}
