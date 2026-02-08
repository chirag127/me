/**
 * LastfmRecent - Recent Listening History
 * Real data from Last.fm API
 */

import { LastFmAPI } from '../../services/api';
import type { LastFmTrack } from '../../services/api';

export default async function LastfmRecent(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎧 Recent Tracks</h1>
        <p class="page-subtitle">My listening history from Last.fm</p>
      </header>

      <div class="controls-bar">
        <div class="track-count" id="track-count">Loading...</div>
      </div>

      <div class="tracks-timeline" id="tracks-timeline">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading recent tracks...</p>
        </div>
      </div>
    </div>

    <style>
      .controls-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-6);
        padding: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border-radius: var(--radius-xl);
      }

      .track-count {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .tracks-timeline {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .date-header {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-tertiary);
        padding: var(--space-4) 0 var(--space-2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        margin-bottom: var(--space-2);
      }

      .track-row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3) var(--space-4);
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid transparent;
        border-radius: var(--radius-lg);
        transition: all 0.2s;
        text-decoration: none;
        color: inherit;
      }

      .track-row:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(99, 102, 241, 0.2);
      }

      .track-row.now-playing {
        background: rgba(34, 197, 94, 0.1);
        border-color: rgba(34, 197, 94, 0.3);
      }

      .track-time {
        width: 60px;
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        text-align: right;
      }

      .track-artwork {
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md);
        object-fit: cover;
      }

      .track-info {
        flex: 1;
        min-width: 0;
      }

      .track-name {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-artist-album {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .now-badge {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
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

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  await loadTracks();
}

async function loadTracks(): Promise<void> {
  const container = document.getElementById('tracks-timeline');
  const countEl = document.getElementById('track-count');
  if (!container) return;

  try {
    const tracks = await LastFmAPI.getRecentTracks(50);

    if (tracks.length === 0) {
      container.innerHTML = '<div class="loading-state">No recent tracks found</div>';
      return;
    }

    if (countEl) countEl.textContent = `${tracks.length} recent tracks`;

    // Group by date
    const grouped = groupByDate(tracks);

    container.innerHTML = Object.entries(grouped).map(([date, dateTracks]) => `
      <div class="date-group">
        <div class="date-header">${date}</div>
        ${dateTracks.map(track => {
          const isNowPlaying = track['@attr']?.nowplaying === 'true';
          const time = track.date ? new Date(parseInt(track.date.uts) * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'Now';
          const artwork = getArtwork(track.image);

          return `
            <a href="${track.url}" target="_blank" class="track-row ${isNowPlaying ? 'now-playing' : ''}">
              <div class="track-time">${time}</div>
              <img class="track-artwork" src="${artwork}" alt="" onerror="this.src='https://via.placeholder.com/44?text=🎵'">
              <div class="track-info">
                <div class="track-name">${track.name}</div>
                <div class="track-artist-album">${track.artist['#text']}${track.album['#text'] ? ` • ${track.album['#text']}` : ''}</div>
              </div>
              ${isNowPlaying ? '<span class="now-badge">NOW</span>' : ''}
            </a>
          `;
        }).join('')}
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<div class="loading-state">Failed to load tracks</div>';
  }
}

function groupByDate(tracks: LastFmTrack[]): Record<string, LastFmTrack[]> {
  const groups: Record<string, LastFmTrack[]> = {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  tracks.forEach(track => {
    let dateKey: string;
    if (track['@attr']?.nowplaying === 'true') {
      dateKey = 'Now Playing';
    } else if (track.date) {
      const date = new Date(parseInt(track.date.uts) * 1000);
      const dateStr = date.toDateString();
      if (dateStr === today) dateKey = 'Today';
      else if (dateStr === yesterday) dateKey = 'Yesterday';
      else dateKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    } else {
      dateKey = 'Unknown';
    }

    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(track);
  });

  return groups;
}

function getArtwork(images: { '#text': string; size: string }[]): string {
  const medium = images.find(i => i.size === 'medium' || i.size === 'large');
  return medium?.['#text'] || images[images.length - 1]?.['#text'] || '';
}
