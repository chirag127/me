/**
 * TraktRatings - User's Ratings from Trakt.tv
 * Display rated movies and TV shows with star visualization
 */

import { TraktAPI } from '../../services/api';
import type { TraktRatingItem } from '../../services/api';

export default async function TraktRatings(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">⭐ Ratings</h1>
        <p class="page-subtitle">My movie and TV show ratings from Trakt.tv</p>
      </header>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="movies">Movies</button>
          <button class="tab" data-tab="shows">TV Shows</button>
          <button class="tab" data-tab="all">All</button>
        </div>
      </div>

      <div class="ratings-grid" id="ratings-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading ratings...</p>
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
        background: rgba(251, 191, 36, 0.2);
        color: var(--text-primary);
      }

      .ratings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--space-4);
      }

      .rating-card {
        position: relative;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s;
        text-decoration: none;
        color: inherit;
      }

      .rating-card:hover {
        transform: translateY(-4px);
        border-color: rgba(251, 191, 36, 0.4);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      }

      .rating-poster {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
      }

      .rating-poster-placeholder {
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

      .rating-badge {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: linear-gradient(135deg, #f59e0b, #f97316);
        color: white;
        font-size: var(--text-sm);
        font-weight: 700;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .rating-info {
        padding: var(--space-3);
      }

      .rating-title {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .rating-meta {
        font-size: var(--text-xs);
        color: var(--text-secondary);
        margin-top: var(--space-1);
      }

      .rating-stars {
        display: flex;
        gap: 2px;
        margin-top: var(--space-1);
      }

      .star {
        font-size: var(--text-sm);
      }

      .star.filled { color: #f59e0b; }
      .star.empty { color: rgba(255, 255, 255, 0.2); }

      .loading-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-8);
        color: var(--text-secondary);
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(251, 191, 36, 0.2);
        border-top-color: #f59e0b;
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
            loadRatings(tab.getAttribute('data-tab') || 'movies');
        });
    });

    // Initial load
    loadRatings('movies');
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderStars(rating: number): string {
    // Rating is 1-10, convert to 5-star scale
    const stars = Math.round(rating / 2);
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="star ${i <= stars ? 'filled' : 'empty'}">★</span>`;
    }
    return html;
}

async function loadRatings(tab: string): Promise<void> {
    const container = document.getElementById('ratings-grid');
    if (!container) return;

    container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading ratings...</p>
    </div>
  `;

    try {
        const type = tab === 'movies' ? 'movies' : tab === 'shows' ? 'shows' : 'all';
        const ratings = await TraktAPI.getRatings(type);

        if (ratings.length === 0) {
            container.innerHTML = '<div class="loading-state">No ratings found</div>';
            return;
        }

        // FM-DB API: Free Movie Database - no auth required
        const FMDB_POSTER_URL = 'https://imdb.iamidiotareyoutoo.com/photo';

        container.innerHTML = ratings.map(item => {
            const isMovie = item.type === 'movie' && item.movie;
            const isShow = item.type === 'show' && item.show;
            const title = isMovie ? item.movie!.title : isShow ? item.show!.title : 'Unknown';
            const year = isMovie ? item.movie!.year : isShow ? item.show!.year : 0;
            const imdbId = isMovie ? item.movie!.ids.imdb : isShow ? item.show!.ids.imdb : '';
            const tmdbId = isMovie ? item.movie!.ids.tmdb : isShow ? item.show!.ids.tmdb : 0;
            const icon = isMovie ? '🎬' : '📺';

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
        <a href="${link}" target="_blank" class="rating-card">
          <img class="rating-poster" src="${posterUrl}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" alt="${title}">
          <div class="rating-poster-placeholder" style="display:none;background:linear-gradient(135deg,${c1},${c2});">
            <span class="poster-icon">${icon}</span>
            <span class="poster-title">${title}</span>
          </div>
          <div class="rating-badge">${item.rating}/10</div>
          <div class="rating-info">
            <div class="rating-title" title="${title}">${title}</div>
            <div class="rating-meta">${year}</div>
            <div class="rating-stars">${renderStars(item.rating)}</div>
          </div>
        </a>
      ` : `
        <a href="${link}" target="_blank" class="rating-card">
          <div class="rating-poster-placeholder" style="background:linear-gradient(135deg,${c1},${c2});">
            <span class="poster-icon">${icon}</span>
            <span class="poster-title">${title}</span>
          </div>
          <div class="rating-badge">${item.rating}/10</div>
          <div class="rating-info">
            <div class="rating-title" title="${title}">${title}</div>
            <div class="rating-meta">${year}</div>
            <div class="rating-stars">${renderStars(item.rating)}</div>
          </div>
        </a>
      `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<div class="loading-state">Failed to load ratings. Make sure Trakt profile is public.</div>';
    }
}
