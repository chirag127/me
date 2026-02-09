/**
 * MusicProfile - Full Last.fm profile dashboard
 */

import { LastFmAPI } from '../../services/api';
import type { LastFmUser, LastFmArtist, LastFmTrack, LastFmAlbum } from '../../services/api';

export default async function MusicProfile(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">👤 Music Profile</h1>
        <p class="page-subtitle">My Last.fm listening profile</p>
      </header>

      <div class="profile-content" id="profile-content">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    </div>

    <style>
      .profile-card {
        display: flex;
        align-items: center;
        gap: var(--space-6);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-6);
        margin-bottom: var(--space-6);
      }

      .profile-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid rgba(139, 92, 246, 0.5);
      }

      .profile-info h2 {
        font-size: var(--text-2xl);
        margin-bottom: var(--space-2);
      }

      .profile-join-date {
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      .profile-link {
        display: inline-block;
        margin-top: var(--space-3);
        color: #d51007;
        text-decoration: none;
        font-weight: 500;
        font-size: var(--text-sm);
      }

      .profile-link:hover {
        text-decoration: underline;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--space-4);
        margin-bottom: var(--space-8);
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
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label {
        color: var(--text-secondary);
        font-size: var(--text-sm);
        margin-top: var(--space-1);
      }

      .section-title {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .top-items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: var(--space-3);
        margin-bottom: var(--space-8);
      }

      .top-item {
        text-align: center;
        text-decoration: none;
        color: inherit;
      }

      .top-item-img {
        width: 100%;
        aspect-ratio: 1;
        border-radius: var(--radius-lg);
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
        margin-bottom: var(--space-2);
      }

      .top-item-placeholder {
        width: 100%;
        aspect-ratio: 1;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin-bottom: var(--space-2);
      }

      .top-item-name {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .top-item-plays {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
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

    loadProfile();
}

function formatNumber(num: string | number): string {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

function getGradient(name: string): string {
    const colors = [
        ['#f43f5e', '#ec4899'], ['#8b5cf6', '#6366f1'], ['#06b6d4', '#0ea5e9'],
        ['#10b981', '#14b8a6'], ['#f59e0b', '#f97316']
    ];
    const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
    return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
}

async function loadProfile(): Promise<void> {
    const container = document.getElementById('profile-content');
    if (!container) return;

    try {
        const [user, topArtists, topTracks, topAlbums] = await Promise.all([
            LastFmAPI.getUserInfo(),
            LastFmAPI.getTopArtists('overall', 8),
            LastFmAPI.getTopTracks('overall', 8),
            LastFmAPI.getTopAlbums('overall', 8)
        ]);

        if (!user) {
            container.innerHTML = '<div class="loading-state">Failed to load profile</div>';
            return;
        }

        const avatar = user.image?.find(i => i.size === 'extralarge')?.['#text'] || '';
        const joinDate = new Date(parseInt(user.registered.unixtime) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

        container.innerHTML = `
      <div class="profile-card">
        ${avatar ? `<img class="profile-avatar" src="${avatar}" alt="${user.name}">` : ''}
        <div class="profile-info">
          <h2>${user.name}</h2>
          <div class="profile-join-date">🗓️ Scrobbling since ${joinDate}</div>
          <a href="https://www.last.fm/user/${user.name}" target="_blank" class="profile-link">
            View on Last.fm →
          </a>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${formatNumber(user.playcount)}</div>
          <div class="stat-label">Scrobbles</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(user.artist_count)}</div>
          <div class="stat-label">Artists</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(user.album_count)}</div>
          <div class="stat-label">Albums</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(user.track_count)}</div>
          <div class="stat-label">Tracks</div>
        </div>
      </div>

      <div class="section-title">🎤 Top Artists</div>
      <div class="top-items-grid">
        ${topArtists.map(artist => {
            const img = artist.image?.find(i => i.size === 'large')?.['#text'] || '';
            return `
            <a href="${artist.url}" target="_blank" class="top-item">
              ${img ? `
                <img class="top-item-img" src="${img}" alt="${artist.name}"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="top-item-placeholder" style="display:none;background:${getGradient(artist.name)};">🎤</div>
              ` : `
                <div class="top-item-placeholder" style="background:${getGradient(artist.name)};">🎤</div>
              `}
              <div class="top-item-name">${artist.name}</div>
              <div class="top-item-plays">${formatNumber(artist.playcount)} plays</div>
            </a>
          `;
        }).join('')}
      </div>

      <div class="section-title">🎵 Top Tracks</div>
      <div class="top-items-grid">
        ${topTracks.map(track => {
            const img = (track as any).image?.find((i: any) => i.size === 'large')?.['#text'] || '';
            return `
            <a href="${track.url}" target="_blank" class="top-item">
              ${img ? `
                <img class="top-item-img" src="${img}" alt="${track.name}"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="top-item-placeholder" style="display:none;background:${getGradient(track.name)};">🎵</div>
              ` : `
                <div class="top-item-placeholder" style="background:${getGradient(track.name)};">🎵</div>
              `}
              <div class="top-item-name">${track.name}</div>
              <div class="top-item-plays">${formatNumber(track.playcount || '0')} plays</div>
            </a>
          `;
        }).join('')}
      </div>

      <div class="section-title">💿 Top Albums</div>
      <div class="top-items-grid">
        ${topAlbums.map(album => {
            const img = album.image?.find(i => i.size === 'large')?.['#text'] || '';
            return `
            <a href="${album.url}" target="_blank" class="top-item">
              ${img ? `
                <img class="top-item-img" src="${img}" alt="${album.name}"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="top-item-placeholder" style="display:none;background:${getGradient(album.name)};">💿</div>
              ` : `
                <div class="top-item-placeholder" style="background:${getGradient(album.name)};">💿</div>
              `}
              <div class="top-item-name">${album.name}</div>
              <div class="top-item-plays">${formatNumber(album.playcount)} plays</div>
            </a>
          `;
        }).join('')}
      </div>
    `;
    } catch (error) {
        container.innerHTML = '<div class="loading-state">Failed to load profile</div>';
    }
}
