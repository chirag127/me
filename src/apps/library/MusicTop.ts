/**
 * LastfmTop - Top Tracks, Artists, Albums
 * Real data from Last.fm API with period filter
 */

import { LastFmAPI } from '../../services/api';
import type { LastFmTrack, LastFmArtist, LastFmAlbum } from '../../services/api';

type Period = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
type Tab = 'tracks' | 'artists' | 'albums';

let currentPeriod: Period = 'overall';
let currentTab: Tab = 'tracks';

export default async function LastfmTop(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🏆 Top Music</h1>
        <p class="page-subtitle">My most played tracks, artists, and albums</p>
      </header>

      <div class="controls-bar">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="tracks">Tracks</button>
          <button class="tab" data-tab="artists">Artists</button>
          <button class="tab" data-tab="albums">Albums</button>
        </div>
        <div class="period-select">
          <select id="period-select">
            <option value="overall">All Time</option>
            <option value="12month">Last Year</option>
            <option value="6month">Last 6 Months</option>
            <option value="3month">Last 3 Months</option>
            <option value="1month">Last Month</option>
            <option value="7day">Last Week</option>
          </select>
        </div>
      </div>

      <div class="content-area" id="content-area">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading top music...</p>
        </div>
      </div>
    </div>

    <style>
      .controls-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-6);
        flex-wrap: wrap;
        gap: var(--space-4);
      }

      .tabs {
        display: flex;
        gap: var(--space-1);
        background: rgba(255, 255, 255, 0.03);
        padding: var(--space-1);
        border-radius: var(--radius-lg);
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

      .tab:hover {
        color: var(--text-primary);
      }

      .tab.active {
        background: rgba(99, 102, 241, 0.2);
        color: var(--text-primary);
      }

      .period-select select {
        padding: var(--space-2) var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        font-size: var(--text-sm);
        cursor: pointer;
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .item-card {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        transition: all 0.2s;
        text-decoration: none;
        color: inherit;
      }

      .item-card:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateY(-2px);
      }

      .item-rank {
        font-size: var(--text-2xl);
        font-weight: 700;
        color: var(--text-tertiary);
        width: 40px;
        text-align: center;
      }

      .item-rank.top-3 {
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .item-artwork {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-lg);
        object-fit: cover;
      }

      .item-info {
        flex: 1;
        min-width: 0;
      }

      .item-name {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: var(--space-1);
      }

      .item-secondary {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item-plays {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        white-space: nowrap;
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

      @media (max-width: 640px) {
        .controls-bar {
          flex-direction: column;
          align-items: stretch;
        }
      }
    </style>
  `;

  // Setup tab handlers
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab') as Tab;
      loadContent();
    });
  });

  // Setup period handler
  document.getElementById('period-select')?.addEventListener('change', (e) => {
    currentPeriod = (e.target as HTMLSelectElement).value as Period;
    loadContent();
  });

  await loadContent();
}

async function loadContent(): Promise<void> {
  const container = document.getElementById('content-area');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading ${currentTab}...</p>
    </div>
  `;

  try {
    switch (currentTab) {
      case 'tracks':
        await loadTracks(container);
        break;
      case 'artists':
        await loadArtists(container);
        break;
      case 'albums':
        await loadAlbums(container);
        break;
    }
  } catch (error) {
    container.innerHTML = '<div class="loading-state">Failed to load data</div>';
  }
}

async function loadTracks(container: HTMLElement): Promise<void> {
  const tracks = await LastFmAPI.getTopTracks(currentPeriod, 30);

  if (tracks.length === 0) {
    container.innerHTML = '<div class="loading-state">No tracks found for this period</div>';
    return;
  }

  container.innerHTML = `
    <div class="items-grid">
      ${tracks.map((track, i) => `
        <a href="${track.url}" target="_blank" class="item-card">
          <div class="item-rank ${i < 3 ? 'top-3' : ''}">${i + 1}</div>
          <img class="item-artwork" src="${getArtwork(track.image)}" alt="" onerror="this.src='https://via.placeholder.com/64?text=🎵'">
          <div class="item-info">
            <div class="item-name">${track.name}</div>
            <div class="item-secondary">${track.artist['#text'] || (track.artist as unknown as { name: string }).name}</div>
          </div>
          <div class="item-plays">${formatNumber(parseInt(track.playcount || '0'))} plays</div>
        </a>
      `).join('')}
    </div>
  `;
}

async function loadArtists(container: HTMLElement): Promise<void> {
  const artists = await LastFmAPI.getTopArtists(currentPeriod, 30);

  if (artists.length === 0) {
    container.innerHTML = '<div class="loading-state">No artists found for this period</div>';
    return;
  }

  container.innerHTML = `
    <div class="items-grid">
      ${artists.map((artist, i) => `
        <a href="${artist.url}" target="_blank" class="item-card">
          <div class="item-rank ${i < 3 ? 'top-3' : ''}">${i + 1}</div>
          <img class="item-artwork" src="${getArtwork(artist.image)}" alt="" onerror="this.src='https://via.placeholder.com/64?text=🎤'">
          <div class="item-info">
            <div class="item-name">${artist.name}</div>
          </div>
          <div class="item-plays">${formatNumber(parseInt(artist.playcount))} plays</div>
        </a>
      `).join('')}
    </div>
  `;
}

async function loadAlbums(container: HTMLElement): Promise<void> {
  const albums = await LastFmAPI.getTopAlbums(currentPeriod, 30);

  if (albums.length === 0) {
    container.innerHTML = '<div class="loading-state">No albums found for this period</div>';
    return;
  }

  container.innerHTML = `
    <div class="items-grid">
      ${albums.map((album, i) => `
        <a href="${album.url}" target="_blank" class="item-card">
          <div class="item-rank ${i < 3 ? 'top-3' : ''}">${i + 1}</div>
          <img class="item-artwork" src="${getArtwork(album.image)}" alt="" onerror="this.src='https://via.placeholder.com/64?text=💿'">
          <div class="item-info">
            <div class="item-name">${album.name}</div>
            <div class="item-secondary">${album.artist.name}</div>
          </div>
          <div class="item-plays">${formatNumber(parseInt(album.playcount))} plays</div>
        </a>
      `).join('')}
    </div>
  `;
}

function getArtwork(images: { '#text': string; size: string }[]): string {
  const large = images.find(i => i.size === 'large' || i.size === 'extralarge');
  return large?.['#text'] || images[images.length - 1]?.['#text'] || '';
}

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
