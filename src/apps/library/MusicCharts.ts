/**
 * MusicCharts - Weekly charts from Last.fm
 * Tracks, Artists, Albums with date range selection
 */

import { LastFmAPI } from '../../services/api';
import type { LastFmChartWeek, LastFmWeeklyTrack, LastFmWeeklyArtist, LastFmWeeklyAlbum } from '../../services/api';

let chartWeeks: LastFmChartWeek[] = [];
let currentTab = 'tracks';

export default async function MusicCharts(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📊 Weekly Charts</h1>
        <p class="page-subtitle">My listening charts from Last.fm</p>
      </header>

      <div class="chart-controls">
        <div class="tabs">
          <button class="tab active" data-tab="tracks">🎵 Tracks</button>
          <button class="tab" data-tab="artists">🎤 Artists</button>
          <button class="tab" data-tab="albums">💿 Albums</button>
        </div>
        <div class="week-selector">
          <select id="week-select">
            <option value="current">This Week</option>
          </select>
        </div>
      </div>

      <div class="chart-content" id="chart-content">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading charts...</p>
        </div>
      </div>
    </div>

    <style>
      .chart-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        flex-wrap: wrap;
      }

      .tabs {
        display: flex;
        gap: var(--space-2);
      }

      .tab {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-secondary);
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all 0.2s;
        font-size: var(--text-sm);
      }

      .tab:hover, .tab.active {
        background: linear-gradient(135deg, #8b5cf6, #6366f1);
        border-color: transparent;
        color: white;
      }

      .week-selector select {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-lg);
        font-size: var(--text-sm);
      }

      .chart-content {
        background: rgba(255, 255, 255, 0.02);
        border-radius: var(--radius-xl);
        border: 1px solid rgba(255, 255, 255, 0.05);
        overflow: hidden;
      }

      .chart-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: background 0.2s;
      }

      .chart-item:hover {
        background: rgba(255, 255, 255, 0.03);
      }

      .chart-rank {
        font-size: var(--text-lg);
        font-weight: 700;
        color: var(--text-tertiary);
        width: 40px;
        text-align: center;
      }

      .chart-rank.top-3 {
        color: #fbbf24;
      }

      .chart-info {
        flex: 1;
        min-width: 0;
      }

      .chart-name {
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .chart-artist {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .chart-plays {
        font-size: var(--text-sm);
        color: var(--accent);
        background: rgba(139, 92, 246, 0.2);
        padding: var(--space-1) var(--space-3);
        border-radius: var(--radius-full);
        white-space: nowrap;
      }

      .loading-state {
        text-align: center;
        padding: var(--space-8);
        color: var(--text-secondary);
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(139, 92, 246, 0.2);
        border-top-color: #8b5cf6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-4);
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

    // Load chart weeks
    await loadChartWeeks();

    // Setup tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.getAttribute('data-tab') || 'tracks';
            loadChart();
        });
    });

    // Setup week selector
    document.getElementById('week-select')?.addEventListener('change', loadChart);

    // Initial load
    loadChart();
}

async function loadChartWeeks(): Promise<void> {
    try {
        chartWeeks = await LastFmAPI.getWeeklyChartList();
        const select = document.getElementById('week-select') as HTMLSelectElement;
        if (select && chartWeeks.length > 0) {
            select.innerHTML = chartWeeks.slice(-12).reverse().map((week, i) => {
                const from = new Date(parseInt(week.from) * 1000);
                const to = new Date(parseInt(week.to) * 1000);
                const label = i === 0 ? 'This Week' : `${from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                return `<option value="${i}">${label}</option>`;
            }).join('');
        }
    } catch (e) {
        console.error('Failed to load chart weeks', e);
    }
}

async function loadChart(): Promise<void> {
    const container = document.getElementById('chart-content');
    if (!container) return;

    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading...</p></div>';

    const select = document.getElementById('week-select') as HTMLSelectElement;
    const weekIndex = parseInt(select?.value || '0');
    const weeks = chartWeeks.slice(-12).reverse();
    const week = weeks[weekIndex];

    try {
        let html = '';

        if (currentTab === 'tracks') {
            const tracks = await LastFmAPI.getWeeklyTrackChart(week ? parseInt(week.from) : undefined, week ? parseInt(week.to) : undefined);
            html = tracks.slice(0, 50).map((track, i) => `
        <div class="chart-item">
          <div class="chart-rank ${i < 3 ? 'top-3' : ''}">${i + 1}</div>
          <div class="chart-info">
            <div class="chart-name">${track.name}</div>
            <div class="chart-artist">${track.artist['#text']}</div>
          </div>
          <div class="chart-plays">${track.playcount} plays</div>
        </div>
      `).join('');
        } else if (currentTab === 'artists') {
            const artists = await LastFmAPI.getWeeklyArtistChart(week ? parseInt(week.from) : undefined, week ? parseInt(week.to) : undefined);
            html = artists.slice(0, 50).map((artist, i) => `
        <div class="chart-item">
          <div class="chart-rank ${i < 3 ? 'top-3' : ''}">${i + 1}</div>
          <div class="chart-info">
            <div class="chart-name">${artist.name}</div>
          </div>
          <div class="chart-plays">${artist.playcount} plays</div>
        </div>
      `).join('');
        } else {
            const albums = await LastFmAPI.getWeeklyAlbumChart(week ? parseInt(week.from) : undefined, week ? parseInt(week.to) : undefined);
            html = albums.slice(0, 50).map((album, i) => `
        <div class="chart-item">
          <div class="chart-rank ${i < 3 ? 'top-3' : ''}">${i + 1}</div>
          <div class="chart-info">
            <div class="chart-name">${album.name}</div>
            <div class="chart-artist">${album.artist['#text']}</div>
          </div>
          <div class="chart-plays">${album.playcount} plays</div>
        </div>
      `).join('');
        }

        container.innerHTML = html || '<div class="loading-state">No data for this period</div>';
    } catch (error) {
        container.innerHTML = '<div class="loading-state">Failed to load chart</div>';
    }
}
