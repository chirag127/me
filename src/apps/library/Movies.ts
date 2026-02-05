// Movies - Letterboxd
import { getLetterboxdFilms } from '../../services/media';

export default async function Movies(c: HTMLElement): Promise<void> {
  c.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Movies</h1>
        <p class="page-subtitle">Films I've watched on Letterboxd</p>
      </header>

      <div id="films" class="films-grid">
        <div class="loading-spinner"></div>
      </div>
    </div>

    <style>
      .films-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-4);
      }

      .film-card {
        display: block;
        padding: var(--space-4);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-fast);
        text-decoration: none;
        color: var(--text-primary);
        height: 100%;
      }

      .film-card:hover {
        background: var(--glass-bg-hover);
        border-color: var(--accent-orange);
        transform: translateY(-2px);
      }

      .film-title {
        font-weight: 600;
        margin-bottom: var(--space-2);
        line-height: 1.4;
      }

      .film-date {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }
    </style>
  `;

  try {
    const films = await getLetterboxdFilms(12);
    const el = c.querySelector('#films');

    if (el) {
      if (films.length === 0) {
        el.innerHTML = '<p class="muted" style="grid-column: 1/-1; text-align: center;">No films found.</p>';
        return;
      }

      el.innerHTML = films.map(f => `
        <a href="${f.link}" target="_blank" class="film-card">
          <div class="film-title">${f.title}</div>
          <div class="film-date">${new Date(f.pubDate).toLocaleDateString()}</div>
        </a>
      `).join('');
    }
  } catch (error) {
    const el = c.querySelector('#films');
    if (el) {
      el.innerHTML = '<p class="muted"></p>'; // Silent fail
    }
  }
}
