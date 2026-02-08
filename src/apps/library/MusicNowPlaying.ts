/**
 * LastfmNowPlaying - Now Playing + Recent Tracks
 * Real data from Last.fm API
 */

import { LastFmAPI } from '../../services/api';
import type { LastFmTrack } from '../../services/api';

export default async function LastfmNowPlaying(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎵 Now Playing</h1>
        <p class="page-subtitle">What I'm listening to right now</p>
      </header>

      <div class="now-playing-section" id="now-playing">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Checking what's playing...</p>
        </div>
      </div>

      <section class="recent-section">
        <h2>📻 Recent Tracks</h2>
        <div class="tracks-grid" id="recent-tracks">
          <div class="loading-state">Loading recent tracks...</div>
        </div>
      </section>

      <section class="stats-section" id="stats-section">
        <h2>📊 Listening Stats</h2>
        <div class="stats-grid" id="stats-grid">
          <div class="loading-state">Loading stats...</div>
        </div>
      </section>
    </div>

    <style>
      .now-playing-section {
        margin-bottom: var(--space-8);
      }

      .now-playing-card {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15));
        backdrop-filter: blur(20px);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: var(--radius-2xl);
        padding: var(--space-8);
        display: flex;
        align-items: center;
        gap: var(--space-6);
        position: relative;
        overflow: hidden;
      }

      .now-playing-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent);
        animation: shimmer 3s infinite;
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      .now-playing-artwork {
        width: 140px;
        height: 140px;
        border-radius: var(--radius-xl);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        object-fit: cover;
      }

      .now-playing-info {
        flex: 1;
      }

      .now-playing-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
        padding: var(--space-1) var(--space-3);
        border-radius: var(--radius-full);
        font-size: var(--text-xs);
        font-weight: 600;
        margin-bottom: var(--space-3);
      }

      .now-playing-badge::before {
        content: '';
        width: 8px;
        height: 8px;
        background: currentColor;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      .now-playing-title {
        font-size: var(--text-2xl);
        font-weight: 700;
        margin-bottom: var(--space-2);
      }

      .now-playing-artist {
        font-size: var(--text-lg);
        color: var(--text-secondary);
        margin-bottom: var(--space-1);
      }

      .now-playing-album {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .not-playing {
        text-align: center;
        padding: var(--space-8);
        color: var(--text-tertiary);
      }

      .not-playing-icon {
        font-size: 48px;
        margin-bottom: var(--space-4);
      }

      .recent-section, .stats-section {
        margin-bottom: var(--space-8);
      }

      .recent-section h2, .stats-section h2 {
        margin-bottom: var(--space-4);
      }

      .tracks-grid {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .track-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        transition: all 0.2s;
      }

      .track-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(99, 102, 241, 0.2);
        transform: translateX(4px);
      }

      .track-artwork {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-lg);
        object-fit: cover;
      }

      .track-info {
        flex: 1;
        min-width: 0;
      }

      .track-name {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: var(--space-1);
      }

      .track-artist {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-time {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        white-space: nowrap;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
      }

      .stat-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-5);
        text-align: center;
      }

      .stat-value {
        font-size: var(--text-3xl);
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-label {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .loading-state {
        text-align: center;
        padding: var(--space-8);
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

      @media (max-width: 768px) {
        .now-playing-card {
          flex-direction: column;
          text-align: center;
        }
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    </style>
  `;

  // Fetch and render data
  await Promise.all([
    loadNowPlaying(),
    loadRecentTracks(),
    loadStats()
  ]);
}

async function loadNowPlaying(): Promise<void> {
  const container = document.getElementById('now-playing');
  if (!container) return;

  try {
    const nowPlaying = await LastFmAPI.getNowPlaying();
    const recentTracks = await LastFmAPI.getRecentTracks(1);

    if (nowPlaying) {
      const artwork = getArtwork(nowPlaying.image);
      container.innerHTML = `
        <div class="now-playing-card">
          <img class="now-playing-artwork" src="${artwork}" alt="${nowPlaying.name}" onerror="this.src='https://via.placeholder.com/140?text=🎵'">
          <div class="now-playing-info">
            <div class="now-playing-badge">NOW PLAYING</div>
            <div class="now-playing-title">${nowPlaying.name}</div>
            <div class="now-playing-artist">${nowPlaying.artist['#text']}</div>
            <div class="now-playing-album">${nowPlaying.album['#text'] || ''}</div>
          </div>
        </div>
      `;
    } else if (recentTracks.length > 0) {
      const track = recentTracks[0];
      const artwork = getArtwork(track.image);
      const timeAgo = track.date ? formatTimeAgo(parseInt(track.date.uts) * 1000) : 'Just now';
      container.innerHTML = `
        <div class="not-playing">
          <div class="not-playing-icon">🎧</div>
          <p>Not currently playing</p>
          <p style="margin-top: var(--space-2);">Last played: <strong>${track.name}</strong> by ${track.artist['#text']} (${timeAgo})</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="not-playing">
          <div class="not-playing-icon">🎵</div>
          <p>No recent listening activity</p>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `<div class="not-playing">Failed to load now playing</div>`;
  }
}

async function loadRecentTracks(): Promise<void> {
  const container = document.getElementById('recent-tracks');
  if (!container) return;

  try {
    const tracks = await LastFmAPI.getRecentTracks(20);

    if (tracks.length === 0) {
      container.innerHTML = '<div class="not-playing">No recent tracks</div>';
      return;
    }

    container.innerHTML = tracks.map(track => {
      const artwork = getArtwork(track.image);
      const isNowPlaying = track['@attr']?.nowplaying === 'true';
      const timeAgo = track.date ? formatTimeAgo(parseInt(track.date.uts) * 1000) : 'Now';

      return `
        <a href="${track.url}" target="_blank" class="track-item">
          <img class="track-artwork" src="${artwork}" alt="${track.name}" onerror="this.src='https://via.placeholder.com/56?text=🎵'">
          <div class="track-info">
            <div class="track-name">${track.name}</div>
            <div class="track-artist">${track.artist['#text']}</div>
          </div>
          <div class="track-time">${isNowPlaying ? '🎵 Now' : timeAgo}</div>
        </a>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = '<div class="not-playing">Failed to load recent tracks</div>';
  }
}

async function loadStats(): Promise<void> {
  const container = document.getElementById('stats-grid');
  if (!container) return;

  try {
    const user = await LastFmAPI.getUserInfo();

    if (!user) {
      container.innerHTML = '<div class="not-playing">Failed to load stats</div>';
      return;
    }

    container.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${formatNumber(parseInt(user.playcount))}</div>
        <div class="stat-label">Scrobbles</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${formatNumber(parseInt(user.artist_count))}</div>
        <div class="stat-label">Artists</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${formatNumber(parseInt(user.album_count))}</div>
        <div class="stat-label">Albums</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${formatNumber(parseInt(user.track_count))}</div>
        <div class="stat-label">Tracks</div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<div class="not-playing">Failed to load stats</div>';
  }
}

function getArtwork(images: { '#text': string; size: string }[]): string {
  const large = images.find(i => i.size === 'extralarge' || i.size === 'large');
  return large?.['#text'] || images[images.length - 1]?.['#text'] || 'https://via.placeholder.com/140?text=🎵';
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
