/**
 * TraktSocial - User's Social Network from Trakt.tv
 * Display followers, following, and friends
 */

import { TraktAPI } from '../../services/api';
import type { TraktFollower, TraktProfile } from '../../services/api';

export default async function TraktSocial(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">👥 Social</h1>
        <p class="page-subtitle">My Trakt.tv social network</p>
      </header>

      <div class="profile-card" id="profile-card">
        <div class="loading-state small">Loading profile...</div>
      </div>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="followers">Followers</button>
          <button class="tab" data-tab="following">Following</button>
        </div>
      </div>

      <div class="social-grid" id="social-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    </div>

    <style>
      .profile-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-5);
        margin-bottom: var(--space-6);
        display: flex;
        align-items: center;
        gap: var(--space-5);
      }

      .profile-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        flex-shrink: 0;
      }

      .profile-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .profile-info {
        flex: 1;
      }

      .profile-name {
        font-size: var(--text-xl);
        font-weight: 700;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .profile-username {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-top: var(--space-1);
      }

      .profile-meta {
        display: flex;
        gap: var(--space-4);
        margin-top: var(--space-3);
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .vip-badge {
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        color: white;
        font-size: var(--text-xs);
        font-weight: 600;
        padding: 2px 8px;
        border-radius: var(--radius-md);
      }

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
        background: rgba(139, 92, 246, 0.2);
        color: var(--text-primary);
      }

      .social-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .user-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-4);
        text-decoration: none;
        color: inherit;
        transition: all 0.3s;
      }

      .user-card:hover {
        border-color: rgba(139, 92, 246, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }

      .user-avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
        overflow: hidden;
      }

      .user-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .user-info {
        flex: 1;
        min-width: 0;
      }

      .user-name {
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

      .user-username {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-top: var(--space-1);
      }

      .user-since {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .private-badge {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-secondary);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
      }

      .loading-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-8);
        color: var(--text-secondary);
      }

      .loading-state.small {
        padding: var(--space-4);
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

    // Load profile
    loadProfile();

    // Add tab functionality
    const tabs = container.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadSocial(tab.getAttribute('data-tab') || 'followers');
        });
    });

    // Initial load
    loadSocial('followers');
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function loadProfile(): Promise<void> {
    const container = document.getElementById('profile-card');
    if (!container) return;

    try {
        const profile = await TraktAPI.getProfile();

        const avatarUrl = profile.images?.avatar?.full;
        const joinedAt = formatDate(profile.joined_at);

        container.innerHTML = `
      <div class="profile-avatar">
        ${avatarUrl ? `<img src="${avatarUrl}" alt="${profile.username}">` : '👤'}
      </div>
      <div class="profile-info">
        <div class="profile-name">
          ${profile.name || profile.username}
          ${profile.vip ? '<span class="vip-badge">VIP</span>' : ''}
        </div>
        <div class="profile-username">@${profile.username}</div>
        <div class="profile-meta">
          ${profile.location ? `<span>📍 ${profile.location}</span>` : ''}
          <span>📅 Joined ${joinedAt}</span>
          ${profile.age ? `<span>🎂 ${profile.age} years old</span>` : ''}
        </div>
      </div>
    `;
    } catch (error) {
        container.innerHTML = '<div class="loading-state small">Failed to load profile</div>';
    }
}

async function loadSocial(tab: string): Promise<void> {
    const container = document.getElementById('social-grid');
    if (!container) return;

    container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading ${tab}...</p>
    </div>
  `;

    try {
        const users = tab === 'followers'
            ? await TraktAPI.getFollowers()
            : await TraktAPI.getFollowing();

        if (users.length === 0) {
            container.innerHTML = `<div class="loading-state">No ${tab} found</div>`;
            return;
        }

        container.innerHTML = users.map(item => {
            const user = item.user;
            const followedAt = formatDate(item.followed_at);
            const avatarUrl = user.images?.avatar?.full;

            // Generate gradient for avatar placeholder
            const getGradient = (name: string) => {
                const colors = [
                    ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
                    ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb']
                ];
                const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
                return colors[idx];
            };
            const [c1, c2] = getGradient(user.username);

            return `
        <a href="https://trakt.tv/users/${user.ids.slug}" target="_blank" class="user-card">
          <div class="user-avatar" style="background: linear-gradient(135deg, ${c1}, ${c2});">
            ${avatarUrl ? `<img src="${avatarUrl}" alt="${user.username}">` : user.username[0].toUpperCase()}
          </div>
          <div class="user-info">
            <div class="user-name">
              ${user.name || user.username}
              ${user.vip ? '<span class="vip-badge">VIP</span>' : ''}
              ${user.private ? '<span class="private-badge">Private</span>' : ''}
            </div>
            <div class="user-username">@${user.username}</div>
            <div class="user-since">${tab === 'followers' ? 'Following since' : 'Followed since'} ${followedAt}</div>
          </div>
        </a>
      `;
        }).join('');
    } catch (error) {
        container.innerHTML = `<div class="loading-state">Failed to load ${tab}. Make sure Trakt profile is public.</div>`;
    }
}
