/**
 * TraktCollection - User's Media Collection from Trakt.tv
 * Display owned/collected movies and TV shows
 */

import { TraktAPI } from '../../services/api';
import type { TraktCollectionItem } from '../../services/api';

export default async function TraktCollection(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📀 Collection</h1>
        <p class="page-subtitle">My owned movies and TV shows from Trakt.tv</p>
      </header>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="movies">Movies</button>
          <button class="tab" data-tab="shows">TV Shows</button>
        </div>
      </div>

      <div class="collection-grid" id="collection-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading collection...</p>
        </div>
      </div>
    </div>

    <style>
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
        background: rgba(16, 185, 129, 0.2);
        color: var(--text-primary);
      }

      .collection-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--space-4);
      }

      .collection-card {
        position: relative;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s;
        text-decoration: none;
        color: inherit;
      }

      .collection-card:hover {
        transform: translateY(-4px);
        border-color: rgba(16, 185, 129, 0.4);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      }

      .collection-poster {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
      }

      .collection-poster-placeholder {
        width: 100%;
        aspect-ratio: 2/3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: var(--space-3);
      }

      .poster-icon {
        font-size: 3rem;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      }

      .poster-title {
        font-size: var(--text-sm);
        font-weight: 600;
        text-align: center;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        line-height: 1.3;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      .collection-badge {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        font-size: var(--text-xs);
        font-weight: 600;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-md);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .collection-info {
        padding: var(--space-3);
      }

      .collection-title {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .collection-meta {
        font-size: var(--text-xs);
        color: var(--text-secondary);
        margin-top: var(--space-1);
      }

      .loading-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-8);
        color: var(--text-secondary);
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(16, 185, 129, 0.2);
        border-top-color: #10b981;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-4);
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

    // Add tab functionality
    const tabs = container.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadCollection(tab.getAttribute('data-tab') || 'movies');
        });
    });

    // Initial load
    loadCollection('movies');
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function loadCollection(tab: string): Promise<void> {
    const container = document.getElementById('collection-grid');
    if (!container) return;

    container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading collection...</p>
    </div>
  `;

    try {
        const type = tab === 'movies' ? 'movies' : 'shows';
        const collection = await TraktAPI.getCollection(type);

        if (collection.length === 0) {
            container.innerHTML = '<div class="loading-state">No items in collection</div>';
            return;
        }

        // FM-DB API: Free Movie Database - no auth required
        const FMDB_POSTER_URL = 'https://imdb.iamidiotareyoutoo.com/photo';

        container.innerHTML = collection.map(item => {
            const isMovie = item.movie !== undefined;
            const title = isMovie ? item.movie!.title : item.show!.title;
            const year = isMovie ? item.movie!.year : item.show!.year;
            const imdbId = isMovie ? item.movie!.ids.imdb : item.show!.ids.imdb;
            const tmdbId = isMovie ? item.movie!.ids.tmdb : item.show!.ids.tmdb;
            const icon = isMovie ? '🎬' : '📺';
            const collectedAt = formatDate(item.collected_at);

            // Count episodes for shows
            const episodeCount = !isMovie && item.seasons
                ? item.seasons.reduce((acc, s) => acc + s.episodes.length, 0)
                : 0;

            // Generate gradient colors based on title
            const getGradient = (t: string) => {
                const colors = [
                    ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
                    ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb']
                ];
                const idx = t.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
                return colors[idx];
            };
            const [c1, c2] = getGradient(title);

            const posterUrl = imdbId ? `${FMDB_POSTER_URL}/${imdbId}?w=300&h=450` : '';
            const link = imdbId ? `https://www.imdb.com/title/${imdbId}` : `https://www.themoviedb.org/${isMovie ? 'movie' : 'tv'}/${tmdbId}`;

            return imdbId ? `
        <a href="${link}" target="_blank" class="collection-card">
          <img class="collection-poster" src="${posterUrl}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" alt="${title}">
          <div class="collection-poster-placeholder" style="display:none;background:linear-gradient(135deg,${c1},${c2});">
            <span class="poster-icon">${icon}</span>
            <span class="poster-title">${title}</span>
          </div>
          ${!isMovie && episodeCount > 0 ? `<div class="collection-badge">${episodeCount} eps</div>` : ''}
          <div class="collection-info">
            <div class="collection-title" title="${title}">${title}</div>
            <div class="collection-meta">${year} • Collected ${collectedAt}</div>
          </div>
        </a>
      ` : `
        <a href="${link}" target="_blank" class="collection-card">
          <div class="collection-poster-placeholder" style="background:linear-gradient(135deg,${c1},${c2});">
            <span class="poster-icon">${icon}</span>
            <span class="poster-title">${title}</span>
          </div>
          ${!isMovie && episodeCount > 0 ? `<div class="collection-badge">${episodeCount} eps</div>` : ''}
          <div class="collection-info">
            <div class="collection-title" title="${title}">${title}</div>
            <div class="collection-meta">${year} • Collected ${collectedAt}</div>
          </div>
        </a>
      `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<div class="loading-state">Failed to load collection. Make sure Trakt profile is public.</div>';
    }
}
