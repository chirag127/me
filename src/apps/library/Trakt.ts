// Trakt - Recently Watched
import { getTraktRecentMovies, type TraktMovie } from '../../services/media';

export default async function Trakt(c: HTMLElement): Promise<void> {
  c.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Tracking</h1>
        <p class="page-subtitle">Recently watched on Trakt</p>
      </header>

      <div id="trakt-films" class="films-grid">
        <div class="loading-spinner"></div>
      </div>
    </div>

    <style>
      .films-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--space-4);
      }

      .film-card {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-fast);
        text-decoration: none;
        color: var(--text-primary);
      }

      .film-card:hover {
        background: var(--glass-bg-hover);
        border-color: var(--accent-purple);
        transform: translateY(-2px);
      }

      .film-icon {
        font-size: 2rem;
        background: rgba(88, 86, 214, 0.1);
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
      }

      .film-info {
        flex: 1;
        min-width: 0;
      }

      .film-title {
        font-weight: 600;
        margin-bottom: var(--space-1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .film-meta {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        display: flex;
        gap: var(--space-2);
      }
    </style>
  `;

  try {
    const films = await getTraktRecentMovies(24);
    const el = document.getElementById('trakt-films');

    if (el) {
      if (films.length === 0) {
        el.innerHTML = '<p class="muted" style="grid-column: 1/-1; text-align: center;">No history found on Trakt.</p>';
        return;
      }

      el.innerHTML = films.map((f: TraktMovie) => `
        <a href="https://trakt.tv/movies/${f.movie.ids.slug}" target="_blank" class="film-card">
          <div class="film-icon">🎬</div>
          <div class="film-info">
            <div class="film-title" title="${f.movie.title}">${f.movie.title}</div>
            <div class="film-meta">
              <span>${f.movie.year}</span>
              <span>•</span>
              <span>${new Date(f.watched_at).toLocaleDateString()}</span>
            </div>
          </div>
        </a>
      `).join('');
    }
  } catch (error) {
    const el = document.getElementById('trakt-films');
    if (el) {
      el.innerHTML = '<p class="muted" style="grid-column: 1/-1; text-align: center;">Failed to load Trakt history.</p>';
    }
  }
}
