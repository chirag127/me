/**
 * TraktActivity - Recent Watch Activity from Trakt.tv
 * Real data from Trakt API
 */

import { TraktAPI } from '../../services/api';
import type { TraktHistoryItem, TraktStats } from '../../services/api';

export default async function TraktActivity(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎫 Watch Activity</h1>
        <p class="page-subtitle">My recent watching from Trakt.tv</p>
      </header>

      <div class="stats-overview" id="stats-overview">
        <div class="loading-state small">Loading stats...</div>
      </div>

      <div class="filter-bar">
        <div class="filter-tabs" id="filter-tabs">
          <button class="filter-tab active" data-type="all">All</button>
          <button class="filter-tab" data-type="movies">Movies</button>
          <button class="filter-tab" data-type="shows">TV Shows</button>
        </div>
      </div>

      <div class="activity-timeline" id="activity-timeline">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading activity...</p>
        </div>
      </div>
    </div>

    <style>
      .stats-overview {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: var(--space-3);
        margin-bottom: var(--space-6);
      }

      .stat-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        text-align: center;
      }

      .stat-card .value {
        font-size: var(--text-xl);
        font-weight: 700;
        background: linear-gradient(135deg, #f59e0b, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-card .label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .filter-bar {
        margin-bottom: var(--space-6);
      }

      .filter-tabs {
        display: flex;
        gap: var(--space-1);
        background: rgba(255, 255, 255, 0.03);
        padding: var(--space-1);
        border-radius: var(--radius-lg);
        width: fit-content;
      }

      .filter-tab {
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

      .filter-tab:hover { color: var(--text-primary); }
      .filter-tab.active {
        background: rgba(99, 102, 241, 0.2);
        color: var(--text-primary);
      }

      .activity-timeline {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .date-group {
        margin-bottom: var(--space-4);
      }

      .date-header {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-tertiary);
        padding-bottom: var(--space-2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        margin-bottom: var(--space-3);
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: var(--radius-xl);
        transition: all 0.2s;
      }

      .activity-item:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(99, 102, 241, 0.3);
      }

      .activity-type {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(99, 102, 241, 0.1);
        border-radius: var(--radius-lg);
        font-size: 20px;
      }

      .activity-type.movie { background: rgba(245, 158, 11, 0.1); }
      .activity-type.episode { background: rgba(139, 92, 246, 0.1); }

      .activity-content {
        flex: 1;
        min-width: 0;
      }

      .activity-title {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .activity-meta {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .activity-time {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        white-space: nowrap;
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
        border-top-color: var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 768px) {
        .stats-overview { grid-template-columns: repeat(3, 1fr); }
      }

      @media (max-width: 480px) {
        .stats-overview { grid-template-columns: repeat(2, 1fr); }
      }
    </style>
  `;

  let currentFilter = 'all';
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-type')!;
      loadActivity(currentFilter);
    });
  });

  await Promise.all([loadStats(), loadActivity('all')]);
}

async function loadStats(): Promise<void> {
  const container = document.getElementById('stats-overview');
  if (!container) return;

  try {
    const stats = await TraktAPI.getStats();
    if (!stats) {
      container.innerHTML = '';
      return;
    }

    const movieHours = Math.floor(stats.movies.minutes / 60);
    const showHours = Math.floor(stats.episodes.minutes / 60);

    container.innerHTML = `
      <div class="stat-card">
        <div class="value">${stats.movies.watched}</div>
        <div class="label">Movies</div>
      </div>
      <div class="stat-card">
        <div class="value">${stats.shows.watched}</div>
        <div class="label">Shows</div>
      </div>
      <div class="stat-card">
        <div class="value">${stats.episodes.watched}</div>
        <div class="label">Episodes</div>
      </div>
      <div class="stat-card">
        <div class="value">${movieHours}</div>
        <div class="label">Movie Hours</div>
      </div>
      <div class="stat-card">
        <div class="value">${showHours}</div>
        <div class="label">TV Hours</div>
      </div>
      <div class="stat-card">
        <div class="value">${Math.floor((movieHours + showHours) / 24)}</div>
        <div class="label">Total Days</div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = '';
  }
}

async function loadActivity(filter: string): Promise<void> {
  const container = document.getElementById('activity-timeline');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading activity...</p>
    </div>
  `;

  try {
    let history: TraktHistoryItem[] = [];

    if (filter === 'all' || filter === 'movies') {
      const movies = await TraktAPI.getHistory('movies', 25);
      history = history.concat(movies);
    }
    if (filter === 'all' || filter === 'shows') {
      const shows = await TraktAPI.getHistory('shows', 25);
      history = history.concat(shows);
    }

    // Sort by watched date
    history.sort((a, b) => new Date(b.watched_at).getTime() - new Date(a.watched_at).getTime());

    if (history.length === 0) {
      container.innerHTML = '<div class="loading-state">No activity found. Make sure your Trakt profile is public.</div>';
      return;
    }

    // Group by date
    const grouped = groupByDate(history);

    container.innerHTML = Object.entries(grouped).map(([date, items]) => `
      <div class="date-group">
        <div class="date-header">${date}</div>
        ${items.map(item => {
          const isMovie = item.type === 'movie';
          const title = isMovie ? item.movie?.title : item.show?.title;
          const meta = isMovie ? item.movie?.year : `S${item.episode?.season}E${item.episode?.number}: ${item.episode?.title}`;
          const time = new Date(item.watched_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

          return `
            <div class="activity-item">
              <div class="activity-type ${isMovie ? 'movie' : 'episode'}">${isMovie ? '🎬' : '📺'}</div>
              <div class="activity-content">
                <div class="activity-title">${title}</div>
                <div class="activity-meta">${meta}</div>
              </div>
              <div class="activity-time">${time}</div>
            </div>
          `;
        }).join('')}
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<div class="loading-state">Failed to load activity. Make sure your Trakt profile is public.</div>';
  }
}

function groupByDate(items: TraktHistoryItem[]): Record<string, TraktHistoryItem[]> {
  const groups: Record<string, TraktHistoryItem[]> = {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  items.forEach(item => {
    const date = new Date(item.watched_at);
    const dateStr = date.toDateString();
    let key: string;

    if (dateStr === today) key = 'Today';
    else if (dateStr === yesterday) key = 'Yesterday';
    else key = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return groups;
}
