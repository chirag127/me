/**
 * MusicFriends - Last.fm friends and what they're listening to
 */

import { LastFmAPI } from '../../services/api';
import type { LastFmFriend } from '../../services/api';

export default async function MusicFriends(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">👥 Music Friends</h1>
        <p class="page-subtitle">My Last.fm friends and their listening</p>
      </header>

      <div class="friends-grid" id="friends-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading friends...</p>
        </div>
      </div>
    </div>

    <style>
      .friends-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .friend-card {
        display: flex;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-5);
        text-decoration: none;
        color: inherit;
        transition: all 0.3s;
      }

      .friend-card:hover {
        border-color: rgba(99, 102, 241, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }

      .friend-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
      }

      .friend-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        object-fit: cover;
      }

      .friend-avatar-placeholder {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
      }

      .friend-name {
        font-weight: 600;
        color: var(--text-primary);
      }

      .friend-username {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .friend-recent {
        margin-top: auto;
        padding-top: var(--space-3);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .friend-recent-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-bottom: var(--space-1);
      }

      .friend-recent-track {
        font-size: var(--text-sm);
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .friend-recent-artist {
        font-size: var(--text-xs);
        color: var(--text-secondary);
      }

      .friend-country {
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
        border: 3px solid rgba(99, 102, 241, 0.2);
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-4);
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-12);
        color: var(--text-secondary);
      }
    </style>
  `;

    loadFriends();
}

async function loadFriends(): Promise<void> {
    const container = document.getElementById('friends-grid');
    if (!container) return;

    try {
        const friends = await LastFmAPI.getFriends(50);

        if (friends.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No friends found on Last.fm</p></div>';
            return;
        }

        container.innerHTML = friends.map(friend => {
            const avatar = friend.image?.find(i => i.size === 'medium')?.['#text'] || '';
            const hasRecentTrack = friend.recenttrack?.name;

            return `
        <a href="${friend.url}" target="_blank" class="friend-card">
          <div class="friend-header">
            ${avatar ? `
              <img class="friend-avatar" src="${avatar}" alt="${friend.name}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
              <div class="friend-avatar-placeholder" style="display:none;">👤</div>
            ` : `
              <div class="friend-avatar-placeholder">👤</div>
            `}
            <div>
              <div class="friend-name">${friend.realname || friend.name}</div>
              <div class="friend-username">@${friend.name}</div>
              ${friend.country ? `<div class="friend-country">📍 ${friend.country}</div>` : ''}
            </div>
          </div>

          ${hasRecentTrack ? `
            <div class="friend-recent">
              <div class="friend-recent-label">🎧 Recently Listening</div>
              <div class="friend-recent-track">${friend.recenttrack?.name}</div>
              <div class="friend-recent-artist">${friend.recenttrack?.artist?.['#text'] || ''}</div>
            </div>
          ` : ''}
        </a>
      `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<div class="loading-state">Failed to load friends</div>';
    }
}
