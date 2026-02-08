/**
 * AnilistManga - Manga List from AniList
 * Real data from AniList GraphQL API
 */

import { AniListAPI } from '../../services/api';
import type { AniListMedia } from '../../services/api';

type Tab = 'reading' | 'completed' | 'planned' | 'all';

export default async function AnilistManga(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📚 Manga</h1>
        <p class="page-subtitle">My manga list from AniList</p>
      </header>

      <div class="stats-bar" id="stats-bar">
        <div class="loading-state small">Loading stats...</div>
      </div>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="reading">Reading</button>
          <button class="tab" data-tab="completed">Completed</button>
          <button class="tab" data-tab="planned">Plan to Read</button>
          <button class="tab" data-tab="all">All</button>
        </div>
      </div>

      <div class="manga-grid" id="manga-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading manga list...</p>
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
        background: linear-gradient(135deg, #f472b6, #ec4899);
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
        background: rgba(236, 72, 153, 0.2);
        color: var(--text-primary);
      }

      .manga-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--space-4);
      }

      .manga-card {
        position: relative;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s;
        text-decoration: none;
        color: inherit;
      }

      .manga-card:hover {
        transform: translateY(-4px);
        border-color: rgba(236, 72, 153, 0.4);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      }

      .manga-cover {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
      }

      .manga-info {
        padding: var(--space-3);
      }

      .manga-title {
        font-size: var(--text-sm);
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: var(--space-1);
      }

      .manga-meta {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .manga-score {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: rgba(0,0,0,0.8);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 600;
      }

      .manga-score.high { color: #22c55e; }
      .manga-score.mid { color: #f59e0b; }
      .manga-score.low { color: #ef4444; }

      .manga-progress {
        position: absolute;
        bottom: 60px;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(0,0,0,0.5);
      }

      .manga-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #f472b6, #ec4899);
      }

      .manga-format {
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
        border-top-color: #ec4899;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .stats-bar { grid-template-columns: repeat(3, 1fr); }
        .manga-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
      }
    </style>
  `;

  let currentTab: Tab = 'reading';
  let allManga: AniListMedia[] = [];

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab') as Tab;
      renderManga(filterByStatus(allManga, currentTab));
    });
  });

  await loadManga();

  async function loadManga(): Promise<void> {
    try {
      allManga = await AniListAPI.getMangaList();
      updateStats(allManga);
      renderManga(filterByStatus(allManga, currentTab));
    } catch (error) {
      document.getElementById('manga-grid')!.innerHTML = '<div class="loading-state">Failed to load manga list</div>';
    }
  }
}

function filterByStatus(manga: AniListMedia[], tab: Tab): AniListMedia[] {
  if (tab === 'all') return manga;
  const statusMap: Record<string, string> = {
    'reading': 'CURRENT',
    'completed': 'COMPLETED',
    'planned': 'PLANNING'
  };
  return manga.filter(m => m.userStatus === statusMap[tab]);
}

function updateStats(manga: AniListMedia[]): void {
  const container = document.getElementById('stats-bar');
  if (!container) return;

  const reading = manga.filter(m => m.userStatus === 'CURRENT').length;
  const completed = manga.filter(m => m.userStatus === 'COMPLETED').length;
  const planned = manga.filter(m => m.userStatus === 'PLANNING').length;
  const totalChapters = manga.reduce((sum, m) => sum + (m.userProgress || 0), 0);

  container.innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${manga.length}</div>
      <div class="stat-label">Total Manga</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${reading}</div>
      <div class="stat-label">Reading</div>
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
      <div class="stat-value">${totalChapters}</div>
      <div class="stat-label">Chapters Read</div>
    </div>
  `;
}

function renderManga(manga: AniListMedia[]): void {
  const container = document.getElementById('manga-grid');
  if (!container) return;

  if (manga.length === 0) {
    container.innerHTML = '<div class="loading-state">No manga in this category</div>';
    return;
  }

  container.innerHTML = manga.map(m => {
    const title = m.title.english || m.title.romaji;
    const scoreClass = m.userScore ? (m.userScore >= 8 ? 'high' : m.userScore >= 6 ? 'mid' : 'low') : '';
    const progress = m.chapters ? (m.userProgress || 0) / m.chapters * 100 : 0;

    return `
      <a href="https://anilist.co/manga/${m.id}" target="_blank" class="manga-card">
        <img class="manga-cover" src="${m.coverImage.large}" alt="${title}" loading="lazy">
        ${m.userScore ? `<div class="manga-score ${scoreClass}">${m.userScore}/10</div>` : ''}
        ${progress > 0 && progress < 100 ? `
          <div class="manga-progress">
            <div class="manga-progress-bar" style="width: ${progress}%"></div>
          </div>
        ` : ''}
        <div class="manga-info">
          <div class="manga-title">${title}</div>
          <div class="manga-meta">
            <span>${m.userProgress || 0}/${m.chapters || '?'} ch</span>
            <span class="manga-format">${m.format}</span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}
