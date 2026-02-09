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
        padding: var(--space-2) var(--space-5) var(--space-2) var(--space-4);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        font-size: var(--text-sm);
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        transition: all 0.2s;
      }

      .period-select select:hover {
        background-color: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
      }

      .period-select select:focus {
        outline: none;
        border-color: rgba(99, 102, 241, 0.5);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: var(--space-5);
      }

      .item-card {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4) var(--space-5);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        color: inherit;
      }

      .item-card:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(99, 102, 241, 0.4);
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      }

      .item-rank {
        font-size: var(--text-2xl);
        font-weight: 700;
        color: var(--text-tertiary);
        width: 44px;
        text-align: center;
        flex-shrink: 0;
      }

      .item-rank.rank-1 {
        background: linear-gradient(135deg, #ffd700, #ffb700);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 2px 4px rgba(255, 183, 0, 0.3));
        font-size: var(--text-3xl);
      }

      .item-rank.rank-2 {
        background: linear-gradient(135deg, #e8e8e8, #b8b8b8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 2px 4px rgba(184, 184, 184, 0.3));
      }

      .item-rank.rank-3 {
        background: linear-gradient(135deg, #cd7f32, #a05a2c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 2px 4px rgba(205, 127, 50, 0.3));
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
      ${tracks.map((track, i) => {
        const rankClass = i < 3 ? `rank-${i + 1}` : '';
        const artistName = track.artist['#text'] || (track.artist as unknown as { name: string }).name;
        return `
        <a href="${track.url}" target="_blank" class="item-card" title="${track.name} by ${artistName}">
          <div class="item-rank ${rankClass}">${i + 1}</div>
          <img class="item-artwork" src="${getArtwork(track.image)}" alt="${track.name}" onerror="this.src='https://via.placeholder.com/64?text=🎵'">
          <div class="item-info">
            <div class="item-name" title="${track.name}">${track.name}</div>
            <div class="item-secondary" title="${artistName}">${artistName}</div>
          </div>
          <div class="item-plays">${formatNumber(parseInt(track.playcount || '0'))} plays</div>
        </a>
      `}).join('')}
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
      ${artists.map((artist, i) => {
        const rankClass = i < 3 ? `rank-${i + 1}` : '';
        return `
        <a href="${artist.url}" target="_blank" class="item-card" title="${artist.name}">
          <div class="item-rank ${rankClass}">${i + 1}</div>
          <img class="item-artwork" src="${getArtwork(artist.image)}" alt="${artist.name}" onerror="this.src='https://via.placeholder.com/64?text=🎤'">
          <div class="item-info">
            <div class="item-name" title="${artist.name}">${artist.name}</div>
          </div>
          <div class="item-plays">${formatNumber(parseInt(artist.playcount))} plays</div>
        </a>
      `}).join('')}
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
      ${albums.map((album, i) => {
        const rankClass = i < 3 ? `rank-${i + 1}` : '';
        return `
        <a href="${album.url}" target="_blank" class="item-card" title="${album.name} by ${album.artist.name}">
          <div class="item-rank ${rankClass}">${i + 1}</div>
          <img class="item-artwork" src="${getArtwork(album.image)}" alt="${album.name}" onerror="this.src='https://via.placeholder.com/64?text=💿'">
          <div class="item-info">
            <div class="item-name" title="${album.name}">${album.name}</div>
            <div class="item-secondary" title="${album.artist.name}">${album.artist.name}</div>
          </div>
          <div class="item-plays">${formatNumber(parseInt(album.playcount))} plays</div>
        </a>
      `}).join('')}
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
