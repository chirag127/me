/**
 * MusicLovedTracks - Favorite/Loved tracks from Last.fm
 * Display tracks the user has hearted
 */

import { LastFmAPI } from '../../services/api';
import type { LastFmLovedTrack } from '../../services/api';

export default async function MusicLovedTracks(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">❤️ Loved Tracks</h1>
        <p class="page-subtitle">My favorite tracks from Last.fm</p>
      </header>

      <div class="loved-tracks-grid" id="loved-tracks-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading loved tracks...</p>
        </div>
      </div>
    </div>

    <style>
      .loved-tracks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-4);
      }

      .loved-track-card {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        text-decoration: none;
        color: inherit;
        transition: all 0.3s;
      }

      .loved-track-card:hover {
        border-color: rgba(244, 63, 94, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }

      .loved-track-art {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-md);
        background: rgba(255, 255, 255, 0.05);
        flex-shrink: 0;
        object-fit: cover;
      }

      .loved-track-art-placeholder {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .loved-track-info {
        flex: 1;
        min-width: 0;
      }

      .loved-track-name {
        font-size: var(--text-base);
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .heart-icon {
        color: #f43f5e;
        font-size: 1rem;
      }

      .loved-track-artist {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-top: var(--space-1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .loved-track-date {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
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
        border: 3px solid rgba(244, 63, 94, 0.2);
        border-top-color: #f43f5e;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-4);
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

    loadLovedTracks();
}

function formatDate(timestamp: string): string {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
}

async function loadLovedTracks(): Promise<void> {
    const container = document.getElementById('loved-tracks-grid');
    if (!container) return;

    try {
        const tracks = await LastFmAPI.getLovedTracks(100);

        if (tracks.length === 0) {
            container.innerHTML = '<div class="loading-state">No loved tracks found</div>';
            return;
        }

        container.innerHTML = tracks.map(track => {
            const albumArt = track.image?.find(i => i.size === 'large')?.['#text'] || '';
            const lovedDate = track.date ? formatDate(track.date.uts) : '';

            // Generate gradient for placeholder
            const getGradient = (name: string) => {
                const colors = [
                    ['#f43f5e', '#ec4899'], ['#8b5cf6', '#6366f1'], ['#06b6d4', '#0ea5e9'],
                    ['#10b981', '#14b8a6'], ['#f59e0b', '#f97316'], ['#ef4444', '#dc2626']
                ];
                const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
                return colors[idx];
            };
            const [c1, c2] = getGradient(track.name);

            return `
        <a href="${track.url}" target="_blank" class="loved-track-card">
          ${albumArt ? `
            <img class="loved-track-art" src="${albumArt}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" alt="${track.name}">
            <div class="loved-track-art-placeholder" style="display:none;background:linear-gradient(135deg,${c1},${c2});">🎵</div>
          ` : `
            <div class="loved-track-art-placeholder" style="background:linear-gradient(135deg,${c1},${c2});">🎵</div>
          `}
          <div class="loved-track-info">
            <div class="loved-track-name">
              <span class="heart-icon">❤️</span>
              ${track.name}
            </div>
            <div class="loved-track-artist">${track.artist.name}</div>
            ${lovedDate ? `<div class="loved-track-date">Loved ${lovedDate}</div>` : ''}
          </div>
        </a>
      `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<div class="loading-state">Failed to load loved tracks</div>';
    }
}
