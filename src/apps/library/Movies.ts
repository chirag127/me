// Movies
import { getLetterboxdFilms } from '../../services/media';

export default async function Movies(c: HTMLElement): Promise<void> {
  c.innerHTML = `<div class="page animate-fade-in"><header class="page-header"><h1 class="page-title">Movies</h1><p class="page-subtitle">Films I've watched on Letterboxd</p></header><div id="films" class="films-grid">Loading...</div></div><style>.films-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-4)}.film-card{padding:var(--space-4);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg)}.film-title{font-weight:600;margin-bottom:var(--space-2)}.film-date{font-size:var(--text-xs);color:var(--text-tertiary)}</style>`;
  try {
    const films = await getLetterboxdFilms(12);
    const el = document.getElementById('films');
    if (el) el.innerHTML = films.length ? films.map(f => `<a href="${f.link}" target="_blank" class="film-card"><div class="film-title">${f.title}</div><div class="film-date">${new Date(f.pubDate).toLocaleDateString()}</div></a>`).join('') : '<p class="muted">No films found</p>';
  } catch {}
}
