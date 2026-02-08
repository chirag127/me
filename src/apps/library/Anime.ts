/**
 * AnilistAnime - Anime List from AniList
 * Real data from AniList GraphQL API
 */

import { AniListAPI } from '../../services/api';
import type { AniListMedia } from '../../services/api';

type Tab = 'watching' | 'completed' | 'planned' | 'all';

export default async function AnilistAnime(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎌 Anime</h1>
        <p class="page-subtitle">My anime list from AniList</p>
      </header>

      <div class="stats-bar" id="stats-bar">
        <div class="loading-state small">Loading stats...</div>
      </div>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="watching">Watching</button>
          <button class="tab" data-tab="completed">Completed</button>
          <button class="tab" data-tab="planned">Plan to Watch</button>
          <button class="tab" data-tab="all">All</button>
        </div>
      </div>

      <div class="anime-grid" id="anime-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading anime list...</p>
        </div>
      </div>
    </div>

    <style>
      .stats-bar {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--space-3);
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
        font-size: var(--text-xl);
        font-weight: 700;
        background: linear-gradient(135deg, #02a9ff, #3db4f2);
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
        background: rgba(2, 169, 255, 0.2);
        color: var(--text-primary);
      }

      .anime-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--space-4);
      }

      .anime-card {
        position: relative;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s;
        text-decoration: none;
        color: inherit;
      }

      .anime-card:hover {
        transform: translateY(-4px);
        border-color: rgba(2, 169, 255, 0.4);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      }

      .anime-cover {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
      }

      .anime-info {
        padding: var(--space-3);
      }

      .anime-title {
        font-size: var(--text-sm);
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: var(--space-1);
      }

      .anime-meta {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .anime-score {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: rgba(0,0,0,0.8);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 600;
      }

      .anime-score.high { color: #22c55e; }
      .anime-score.mid { color: #f59e0b; }
      .anime-score.low { color: #ef4444; }

      .anime-progress {
        position: absolute;
        bottom: 60px;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(0,0,0,0.5);
      }

      .anime-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #02a9ff, #3db4f2);
      }

      .anime-format {
        background: rgba(255, 255, 255, 0.1);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
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
        border-top-color: #02a9ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .stats-bar { grid-template-columns: repeat(3, 1fr); }
        .anime-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
      }
    </style>
  `;

  let currentTab: Tab = 'watching';
  let allAnime: AniListMedia[] = [];

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab') as Tab;
      renderAnime(filterByStatus(allAnime, currentTab));
    });
  });

  await loadAnime();

  async function loadAnime(): Promise<void> {
    try {
      allAnime = await AniListAPI.getAnimeList();
      updateStats(allAnime);
      renderAnime(filterByStatus(allAnime, currentTab));
    } catch (error) {
      document.getElementById('anime-grid')!.innerHTML = '<div class="loading-state">Failed to load anime list</div>';
    }
  }
}

function filterByStatus(anime: AniListMedia[], tab: Tab): AniListMedia[] {
  if (tab === 'all') return anime;
  const statusMap: Record<string, string> = {
    'watching': 'CURRENT',
    'completed': 'COMPLETED',
    'planned': 'PLANNING'
  };
  return anime.filter(a => a.userStatus === statusMap[tab]);
}

function updateStats(anime: AniListMedia[]): void {
  const container = document.getElementById('stats-bar');
  if (!container) return;

  const watching = anime.filter(a => a.userStatus === 'CURRENT').length;
  const completed = anime.filter(a => a.userStatus === 'COMPLETED').length;
  const planned = anime.filter(a => a.userStatus === 'PLANNING').length;
  const totalEpisodes = anime.reduce((sum, a) => sum + (a.userProgress || 0), 0);
  const avgScore = anime.filter(a => a.userScore).reduce((sum, a, _, arr) => sum + (a.userScore || 0) / arr.length, 0);

  container.innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${anime.length}</div>
      <div class="stat-label">Total Anime</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${watching}</div>
      <div class="stat-label">Watching</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${completed}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${planned}</div>
      <div class="stat-label">Planned</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${totalEpisodes}</div>
      <div class="stat-label">Episodes</div>
    </div>
  `;
}

function renderAnime(anime: AniListMedia[]): void {
  const container = document.getElementById('anime-grid');
  if (!container) return;

  if (anime.length === 0) {
    container.innerHTML = '<div class="loading-state">No anime in this category</div>';
    return;
  }

  container.innerHTML = anime.map(a => {
    const title = a.title.english || a.title.romaji;
    const scoreClass = a.userScore ? (a.userScore >= 8 ? 'high' : a.userScore >= 6 ? 'mid' : 'low') : '';
    const progress = a.episodes ? (a.userProgress || 0) / a.episodes * 100 : 0;

    return `
      <a href="https://anilist.co/anime/${a.id}" target="_blank" class="anime-card">
        <img class="anime-cover" src="${a.coverImage.large}" alt="${title}" loading="lazy">
        ${a.userScore ? `<div class="anime-score ${scoreClass}">${a.userScore}/10</div>` : ''}
        ${progress > 0 && progress < 100 ? `
          <div class="anime-progress">
            <div class="anime-progress-bar" style="width: ${progress}%"></div>
          </div>
        ` : ''}
        <div class="anime-info">
          <div class="anime-title">${title}</div>
          <div class="anime-meta">
            <span>${a.userProgress || 0}/${a.episodes || '?'} eps</span>
            <span class="anime-format">${a.format}</span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}
