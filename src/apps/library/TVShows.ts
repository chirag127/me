/**
 * TraktTVShows - Watched TV Shows from Trakt.tv
 * Real data from Trakt API
 */

import { TraktAPI } from '../../services/api';
import type { TraktShow, TraktStats } from '../../services/api';

export default async function TraktTVShows(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📺 TV Shows</h1>
        <p class="page-subtitle">My TV collection from Trakt.tv</p>
      </header>

      <div class="stats-bar" id="stats-bar">
        <div class="loading-state small">Loading stats...</div>
      </div>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="watched">Watched</button>
          <button class="tab" data-tab="history">Recent Episodes</button>
          <button class="tab" data-tab="watchlist">Watchlist</button>
        </div>
      </div>

      <div class="shows-grid" id="shows-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading shows...</p>
        </div>
      </div>
    </div>

    <style>
      .stats-bar {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .stat-item {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        text-align: center;
      }

      .stat-value {
        font-size: var(--text-2xl);
        font-weight: 700;
        background: linear-gradient(135deg, #8b5cf6, #6366f1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .tabs-section { margin-bottom: var(--space-6); }

      .tabs {
        display: flex;
        gap: var(--space-1);
        background: rgba(255, 255, 255, 0.03);
        padding: var(--space-1);
        border-radius: var(--radius-lg);
        width: fit-content;
      }

      .tab {
        padding: var(--space-2) var(--space-4);
        background: transparent;
        border: none;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .tab:hover { color: var(--text-primary); }
      .tab.active {
        background: rgba(139, 92, 246, 0.2);
        color: var(--text-primary);
      }

      .shows-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--space-4);
      }

      .show-card {
        position: relative;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s;
        text-decoration: none;
        color: inherit;
      }

      .show-card:hover {
        transform: translateY(-4px);
        border-color: rgba(139, 92, 246, 0.4);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      }

      .show-poster {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
      }

      .show-poster-placeholder {
        width: 100%;
        aspect-ratio: 2/3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: var(--space-3);
        text-align: center;
      }

      .poster-icon {
        font-size: 2rem;
        opacity: 0.9;
      }

      .poster-title {
        font-size: var(--text-xs);
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }


      .show-info {
        padding: var(--space-3);
      }

      .show-title {
        font-size: var(--text-sm);
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .show-meta {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .show-episodes {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: rgba(0,0,0,0.7);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 600;
      }

      .episode-item {
        display: flex;
        gap: var(--space-4);
        padding: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        text-decoration: none;
        color: inherit;
        transition: all 0.2s;
      }

      .episode-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(139, 92, 246, 0.3);
      }

      .episode-number {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        background: rgba(255, 255, 255, 0.05);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        white-space: nowrap;
      }

      .episode-info { flex: 1; min-width: 0; }

      .episode-show {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .episode-title {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .episode-time {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        white-space: nowrap;
      }

      .loading-state {
        text-align: center;
        padding: var(--space-12);
        color: var(--text-tertiary);
        grid-column: 1 / -1;
      }

      .loading-state.small { padding: var(--space-4); }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: #8b5cf6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .stats-bar { grid-template-columns: repeat(2, 1fr); }
        .shows-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
      }
    </style>
  `;

  let currentTab = 'watched';
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab')!;
      loadShows(currentTab);
    });
  });

  await Promise.all([loadStats(), loadShows('watched')]);
}

async function loadStats(): Promise<void> {
  const container = document.getElementById('stats-bar');
  if (!container) return;

  try {
    const stats = await TraktAPI.getStats();
    if (!stats) {
      container.innerHTML = '';
      return;
    }

    const hours = Math.floor(stats.episodes.minutes / 60);
    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${stats.shows.watched}</div>
        <div class="stat-label">Shows Watched</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.episodes.watched}</div>
        <div class="stat-label">Episodes</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${hours}</div>
        <div class="stat-label">Hours Watched</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${Math.floor(hours / 24)}</div>
        <div class="stat-label">Days Spent</div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = '';
  }
}

async function loadShows(tab: string): Promise<void> {
  const container = document.getElementById('shows-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading shows...</p>
    </div>
  `;

  try {
    if (tab === 'history') {
      await loadEpisodeHistory(container);
      return;
    }

    let shows: { title: string; year: number; tmdbId: number; imdbId: string; plays?: number }[] = [];

    switch (tab) {
      case 'watched':
        const watched = await TraktAPI.getWatchedShows();
        shows = watched.map(s => ({
          title: s.show.title,
          year: s.show.year,
          tmdbId: s.show.ids.tmdb,
          imdbId: s.show.ids.imdb,
          plays: s.plays
        }));
        break;
      case 'watchlist':
        const watchlist = await TraktAPI.getWatchlist('shows');
        shows = watchlist.filter(w => w.show).map(w => ({
          title: w.show!.title,
          year: w.show!.year,
          tmdbId: w.show!.ids.tmdb,
          imdbId: w.show!.ids.imdb
        }));
        break;
    }

    if (shows.length === 0) {
      container.innerHTML = '<div class="loading-state">No shows found</div>';
      return;
    }

    // FM-DB API: Free Movie Database - no auth required
    const FMDB_POSTER_URL = 'https://imdb.iamidiotareyoutoo.com/photo';

    container.innerHTML = shows.map(show => {
      // Use FM-DB poster API with IMDB ID - no auth required
      const posterUrl = show.imdbId
        ? `${FMDB_POSTER_URL}/${show.imdbId}?w=300&h=450`
        : '';

      // Fallback gradient for shows without IMDB ID
      const getGradient = (title: string) => {
        const colors = [
          ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
          ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb']
        ];
        const idx = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
        return colors[idx];
      };
      const [c1, c2] = getGradient(show.title);

      return show.imdbId ? `
        <a href="https://www.imdb.com/title/${show.imdbId}" target="_blank" class="show-card">
          <img class="show-poster" src="${posterUrl}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" alt="${show.title}">
          <div class="show-poster-placeholder" style="display:none;background:linear-gradient(135deg,${c1},${c2});">
            <span class="poster-icon">📺</span>
            <span class="poster-title">${show.title}</span>
          </div>
          ${show.plays ? `<div class="show-episodes">${show.plays} eps</div>` : ''}
          <div class="show-info">
            <div class="show-title">${show.title}</div>
            <div class="show-meta">${show.year}</div>
          </div>
        </a>
      ` : `
        <a href="https://www.themoviedb.org/tv/${show.tmdbId}" target="_blank" class="show-card">
          <div class="show-poster-placeholder" style="background:linear-gradient(135deg,${c1},${c2});">
            <span class="poster-icon">📺</span>
            <span class="poster-title">${show.title}</span>
          </div>
          ${show.plays ? `<div class="show-episodes">${show.plays} eps</div>` : ''}
          <div class="show-info">
            <div class="show-title">${show.title}</div>
            <div class="show-meta">${show.year}</div>
          </div>
        </a>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = '<div class="loading-state">Failed to load shows. Make sure Trakt profile is public.</div>';
  }
}

async function loadEpisodeHistory(container: HTMLElement): Promise<void> {
  try {
    const history = await TraktAPI.getHistory('shows', 30);

    if (history.length === 0) {
      container.innerHTML = '<div class="loading-state">No recent episodes</div>';
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: var(--space-3); grid-column: 1 / -1;">
        ${history.filter(h => h.show && h.episode).map(h => `
          <div class="episode-item">
            <div class="episode-number">S${String(h.episode!.season).padStart(2, '0')}E${String(h.episode!.number).padStart(2, '0')}</div>
            <div class="episode-info">
              <div class="episode-show">${h.show!.title}</div>
              <div class="episode-title">${h.episode!.title}</div>
            </div>
            <div class="episode-time">${formatTimeAgo(h.watched_at)}</div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<div class="loading-state">Failed to load history</div>';
  }
}

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
