/**
 * TraktMovies - Watched Movies from Trakt.tv
 * Real data from Trakt API
 */

import { TraktAPI } from '../../services/api';
import type { TraktMovie, TraktHistoryItem, TraktStats } from '../../services/api';

export default async function TraktMovies(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎬 Movies</h1>
        <p class="page-subtitle">My movie collection from Trakt.tv</p>
      </header>

      <div class="stats-bar" id="stats-bar">
        <div class="loading-state small">Loading stats...</div>
      </div>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="watched">Watched</button>
          <button class="tab" data-tab="history">Recent</button>
          <button class="tab" data-tab="watchlist">Watchlist</button>
        </div>
      </div>

      <div class="movies-grid" id="movies-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading movies...</p>
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
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .tabs-section {
        margin-bottom: var(--space-6);
      }

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
        background: rgba(245, 158, 11, 0.2);
        color: var(--text-primary);
      }

      .movies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--space-4);
      }

      .movie-card {
        position: relative;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s;
        text-decoration: none;
        color: inherit;
      }

      .movie-card:hover {
        transform: translateY(-4px);
        border-color: rgba(245, 158, 11, 0.4);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      }

      .movie-poster {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
      }

      .movie-info {
        padding: var(--space-3);
      }

      .movie-title {
        font-size: var(--text-sm);
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .movie-meta {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .movie-plays {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: rgba(0,0,0,0.7);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 600;
      }

      .loading-state {
        text-align: center;
        padding: var(--space-12);
        color: var(--text-tertiary);
      }

      .loading-state.small {
        padding: var(--space-4);
        grid-column: 1 / -1;
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: #f59e0b;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .stats-bar { grid-template-columns: repeat(2, 1fr); }
        .movies-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
      }
    </style>
  `;

  // Setup tabs
  let currentTab = 'watched';
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab')!;
      loadMovies(currentTab);
    });
  });

  await Promise.all([loadStats(), loadMovies('watched')]);
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

    const hours = Math.floor(stats.movies.minutes / 60);
    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${stats.movies.watched}</div>
        <div class="stat-label">Movies Watched</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.movies.plays}</div>
        <div class="stat-label">Total Plays</div>
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

async function loadMovies(tab: string): Promise<void> {
  const container = document.getElementById('movies-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading movies...</p>
    </div>
  `;

  try {
    let movies: { title: string; year: number; tmdbId: number; plays?: number; watchedAt?: string }[] = [];

    switch (tab) {
      case 'watched':
        const watched = await TraktAPI.getWatchedMovies();
        movies = watched.map(m => ({
          title: m.movie.title,
          year: m.movie.year,
          tmdbId: m.movie.ids.tmdb,
          plays: m.plays,
          watchedAt: m.last_watched_at
        }));
        break;
      case 'history':
        const history = await TraktAPI.getHistory('movies', 50);
        movies = history.filter(h => h.movie).map(h => ({
          title: h.movie!.title,
          year: h.movie!.year,
          tmdbId: h.movie!.ids.tmdb,
          watchedAt: h.watched_at
        }));
        break;
      case 'watchlist':
        const watchlist = await TraktAPI.getWatchlist('movies');
        movies = watchlist.filter(w => w.movie).map(w => ({
          title: w.movie!.title,
          year: w.movie!.year,
          tmdbId: w.movie!.ids.tmdb
        }));
        break;
    }

    if (movies.length === 0) {
      container.innerHTML = '<div class="loading-state">No movies found</div>';
      return;
    }

    container.innerHTML = movies.map(movie => `
      <a href="https://www.themoviedb.org/movie/${movie.tmdbId}" target="_blank" class="movie-card">
        <img class="movie-poster" src="https://image.tmdb.org/t/p/w300/${movie.tmdbId}"
             onerror="this.src='https://via.placeholder.com/160x240?text=🎬'" alt="${movie.title}">
        ${movie.plays ? `<div class="movie-plays">${movie.plays}x</div>` : ''}
        <div class="movie-info">
          <div class="movie-title">${movie.title}</div>
          <div class="movie-meta">${movie.year}${movie.watchedAt ? ' • ' + formatDate(movie.watchedAt) : ''}</div>
        </div>
      </a>
    `).join('');

    // Fix posters with TMDB API
    container.querySelectorAll('.movie-poster').forEach(async (img, i) => {
      const tmdbId = movies[i]?.tmdbId;
      if (tmdbId) {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=2a2fb17f9d4242a4901ec8d77bb5dcc6`);
          const data = await res.json();
          if (data.poster_path) {
            (img as HTMLImageElement).src = `https://image.tmdb.org/t/p/w300${data.poster_path}`;
          }
        } catch {}
      }
    });
  } catch (error) {
    container.innerHTML = '<div class="loading-state">Failed to load movies. Make sure Trakt profile is public.</div>';
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
