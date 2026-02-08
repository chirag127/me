/**
 * LifeloggerVideos - Video Scrobbles from LifeLogger
 * Real data from Google Sheets Apps Script
 */

// Get API URL
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycby1Bvb7jjn6GYlL-ESEMjEi2yiU0R0B30yuUmxz_WKYLDlaFYX4EGObFvLFnwf3m44BtA/exec';

interface VideoEntry {
  timestamp: string;
  platform: string;
  title: string;
  url: string;
  duration?: number;
  screenshot_url?: string;
}

interface VideoStats {
  totalVideos: number;
  platforms: { name: string; count: number }[];
}

export default async function LifeloggerVideos(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎬 Video History</h1>
        <p class="page-subtitle">Videos tracked by LifeLogger (non-YouTube/Netflix)</p>
      </header>

      <div class="stats-bar" id="stats-bar">
        <div class="loading-state small">Loading stats...</div>
      </div>

      <div class="info-banner">
        <div class="info-icon">📝</div>
        <div class="info-text">
          <strong>Note:</strong> YouTube, Netflix, Prime Video, and Spotify are handled by dedicated scrobblers
          (Web Scrobbler, Universal Trakt Scrobbler). LifeLogger captures other video content.
        </div>
      </div>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="stats">Public Stats</button>
          <button class="tab" data-tab="videos">Video History 🔒</button>
        </div>
      </div>

      <div class="content-area" id="content-area">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    </div>

    <style>
      .stats-bar {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .stat-item {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        text-align: center;
      }

      .stat-value {
        font-size: var(--text-2xl);
        font-weight: 700;
        background: linear-gradient(135deg, #ef4444, #f97316);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .info-banner {
        display: flex;
        gap: var(--space-4);
        padding: var(--space-4);
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: var(--radius-xl);
        margin-bottom: var(--space-6);
      }

      .info-icon { font-size: 24px; }

      .info-text {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .tabs-section { margin-bottom: var(--space-6); }

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
        background: rgba(239, 68, 68, 0.2);
        color: var(--text-primary);
      }

      .platforms-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--space-4);
      }

      .platform-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-6);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        text-align: center;
        transition: all 0.2s;
      }

      .platform-card:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(239, 68, 68, 0.3);
        transform: translateY(-2px);
      }

      .platform-icon {
        font-size: 48px;
      }

      .platform-name {
        font-weight: 600;
      }

      .platform-count {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .scrobblers-section {
        margin-top: var(--space-8);
        padding: var(--space-6);
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: var(--radius-xl);
      }

      .scrobblers-section h3 {
        margin-bottom: var(--space-4);
      }

      .scrobblers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-3);
      }

      .scrobbler-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3);
        background: rgba(255, 255, 255, 0.03);
        border-radius: var(--radius-lg);
      }

      .scrobbler-icon { font-size: 24px; }

      .scrobbler-info { flex: 1; }

      .scrobbler-name { font-weight: 500; font-size: var(--text-sm); }

      .scrobbler-desc { font-size: var(--text-xs); color: var(--text-tertiary); }

      .auth-notice {
        text-align: center;
        padding: var(--space-8);
        background: rgba(255, 255, 255, 0.02);
        border: 1px dashed rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-xl);
        color: var(--text-tertiary);
      }

      .auth-notice-icon { font-size: 48px; margin-bottom: var(--space-4); }

      .loading-state {
        text-align: center;
        padding: var(--space-12);
        color: var(--text-tertiary);
      }

      .loading-state.small { padding: var(--space-4); grid-column: 1 / -1; }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: #ef4444;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .stats-bar { grid-template-columns: repeat(2, 1fr); }
        .info-banner { flex-direction: column; }
      }
    </style>
  `;

  let currentTab = 'stats';
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab')!;
      loadContent(currentTab);
    });
  });

  await Promise.all([loadStats(), loadContent('stats')]);
}

async function loadStats(): Promise<void> {
  const container = document.getElementById('stats-bar');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}?action=stats`);
    const stats = await res.json();

    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${stats.totalVideos || 0}</div>
        <div class="stat-label">Videos Tracked</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.platforms?.length || 0}</div>
        <div class="stat-label">Platforms</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">--</div>
        <div class="stat-label">Watch Hours</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">🎬</div>
        <div class="stat-label">LifeLogger</div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="stat-item" style="grid-column: 1 / -1;">
        <div class="stat-value">--</div>
        <div class="stat-label">Stats unavailable</div>
      </div>
    `;
  }
}

async function loadContent(tab: string): Promise<void> {
  const container = document.getElementById('content-area');
  if (!container) return;

  if (tab === 'stats') {
    await loadPlatformStats(container);
  } else {
    container.innerHTML = `
      <div class="auth-notice">
        <div class="auth-notice-icon">🔒</div>
        <h3>Protected Content</h3>
        <p>Full video history is only visible to authorized users.</p>
      </div>
    `;
  }
}

async function loadPlatformStats(container: HTMLElement): Promise<void> {
  // Show the complementary scrobblers section
  container.innerHTML = `
    <div class="platforms-grid" id="platforms-grid">
      <div class="loading-state">Loading platform stats...</div>
    </div>

    <div class="scrobblers-section">
      <h3>🔗 Complementary Scrobblers</h3>
      <p style="margin-bottom: var(--space-4); color: var(--text-secondary); font-size: var(--text-sm);">
        These dedicated scrobblers handle major streaming platforms:
      </p>
      <div class="scrobblers-grid">
        <div class="scrobbler-item">
          <div class="scrobbler-icon">🎵</div>
          <div class="scrobbler-info">
            <div class="scrobbler-name">Web Scrobbler</div>
            <div class="scrobbler-desc">YouTube, Spotify, SoundCloud → Last.fm</div>
          </div>
        </div>
        <div class="scrobbler-item">
          <div class="scrobbler-icon">📺</div>
          <div class="scrobbler-info">
            <div class="scrobbler-name">Universal Trakt Scrobbler</div>
            <div class="scrobbler-desc">Netflix, Prime, Disney+ → Trakt.tv</div>
          </div>
        </div>
        <div class="scrobbler-item">
          <div class="scrobbler-icon">🎮</div>
          <div class="scrobbler-info">
            <div class="scrobbler-name">RetroAchievements</div>
            <div class="scrobbler-desc">Retro gaming achievements</div>
          </div>
        </div>
        <div class="scrobbler-item">
          <div class="scrobbler-icon">📖</div>
          <div class="scrobbler-info">
            <div class="scrobbler-name">OpenLibrary</div>
            <div class="scrobbler-desc">Book reading progress</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Try to load actual platform stats
  try {
    const res = await fetch(`${API_BASE_URL}?action=stats`);
    const stats = await res.json();
    const platformsGrid = document.getElementById('platforms-grid');

    if (platformsGrid && stats.platforms?.length > 0) {
      platformsGrid.innerHTML = stats.platforms.map((p: { name: string; count: number }) => `
        <div class="platform-card">
          <div class="platform-icon">${getPlatformIcon(p.name)}</div>
          <div class="platform-name">${p.name}</div>
          <div class="platform-count">${p.count} videos</div>
        </div>
      `).join('');
    } else if (platformsGrid) {
      platformsGrid.innerHTML = `
        <div class="platform-card">
          <div class="platform-icon">🎬</div>
          <div class="platform-name">Misc Sites</div>
          <div class="platform-count">Tracked by LifeLogger</div>
        </div>
      `;
    }
  } catch (error) {
    const platformsGrid = document.getElementById('platforms-grid');
    if (platformsGrid) {
      platformsGrid.innerHTML = '<p style="color: var(--text-tertiary);">Platform stats unavailable</p>';
    }
  }
}

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    'twitch': '🟣',
    'vimeo': '🔵',
    'dailymotion': '🔷',
    'twitter': '🐦',
    'tiktok': '🎵',
    'instagram': '📸',
    'facebook': '👤',
    'bilibili': '📺',
    'crunchyroll': '🍥'
  };
  return icons[platform.toLowerCase()] || '🎬';
}
