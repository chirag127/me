/**
 * Videos Page - Displays video watch history from Google Sheets
 * Tabs: YouTube Shorts | YouTube Videos | Other Videos
 * Liquid Glass 2026 Design
 */

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  platform: 'youtube' | 'youtube-short' | 'other';
  duration: number;
  watchedAt: string;
  channel: string;
  progress: number;
}

// Google Sheets API URL - Set this after deploying Apps Script
const SHEETS_API_URL = '';

export default async function Videos(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📹 Videos</h1>
        <p class="page-subtitle">Everything I've been watching</p>
      </header>

      <div class="videos-stats">
        <div class="stat-card glass">
          <span class="stat-value" id="total-videos">--</span>
          <span class="stat-label">Videos Watched</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="shorts-count">--</span>
          <span class="stat-label">YouTube Shorts</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="youtube-count">--</span>
          <span class="stat-label">YouTube Videos</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="other-count">--</span>
          <span class="stat-label">Other Sites</span>
        </div>
      </div>

      <div class="videos-controls">
        <div class="video-tabs">
          <button class="tab-btn active" data-platform="all">
            📊 All
          </button>
          <button class="tab-btn" data-platform="youtube-short">
            📱 Shorts
          </button>
          <button class="tab-btn" data-platform="youtube">
            ▶️ YouTube
          </button>
          <button class="tab-btn" data-platform="other">
            🌐 Other
          </button>
        </div>
        <div class="search-box glass">
          <span class="search-icon">🔍</span>
          <input type="text" id="video-search" placeholder="Search videos...">
        </div>
      </div>

      <div class="videos-grid" id="videos-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading videos...</p>
        </div>
      </div>

      <!-- Video Modal -->
      <div class="video-modal" id="video-modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content glass">
          <button class="modal-close" id="modal-close">✕</button>
          <div class="video-embed" id="video-embed"></div>
          <div class="modal-info" id="modal-info"></div>
        </div>
      </div>

      <div class="channel-stats glass" id="channel-stats">
        <h3>📺 Top Channels</h3>
        <div class="channels-grid" id="channels-grid"></div>
      </div>

      <div class="watch-timeline glass" id="watch-timeline">
        <h3>📈 Watch Activity</h3>
        <div class="timeline-chart" id="timeline-chart"></div>
      </div>
    </div>

    <style>
      .videos-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .stat-card.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-5);
        text-align: center;
        transition: all 0.3s ease;
      }

      .stat-card.glass:hover {
        transform: translateY(-4px);
        border-color: rgba(99, 102, 241, 0.3);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
      }

      .stat-card .stat-value {
        display: block;
        font-size: var(--text-3xl);
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-card .stat-label {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .videos-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        flex-wrap: wrap;
      }

      .video-tabs {
        display: flex;
        gap: var(--space-2);
      }

      .tab-btn {
        padding: var(--space-3) var(--space-5);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tab-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .tab-btn.active {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
        border-color: rgba(99, 102, 241, 0.4);
        color: var(--text-primary);
      }

      .search-box.glass {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        padding: var(--space-3) var(--space-4);
        width: 280px;
      }

      .search-box input {
        flex: 1;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: var(--text-sm);
        outline: none;
      }

      .videos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
        margin-bottom: var(--space-8);
      }

      .video-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .video-card:hover {
        transform: translateY(-4px);
        border-color: rgba(99, 102, 241, 0.3);
        box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
      }

      .video-card:hover .video-play-overlay {
        opacity: 1;
      }

      .video-thumb-container {
        position: relative;
        aspect-ratio: 16/9;
      }

      .video-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
      }

      .video-play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .play-button {
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }

      .video-duration {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.8);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }

      .video-platform-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .video-platform-badge.youtube {
        background: rgba(255, 0, 0, 0.9);
      }

      .video-platform-badge.youtube-short {
        background: rgba(255, 0, 80, 0.9);
      }

      .video-platform-badge.other {
        background: rgba(99, 102, 241, 0.9);
      }

      .video-info {
        padding: var(--space-4);
      }

      .video-title {
        font-size: var(--text-sm);
        font-weight: 600;
        margin-bottom: var(--space-2);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .video-meta {
        display: flex;
        justify-content: space-between;
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .video-channel {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 60%;
      }

      /* Modal */
      .video-modal {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .video-modal.active {
        display: flex;
      }

      .modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
      }

      .modal-content.glass {
        position: relative;
        width: 90%;
        max-width: 900px;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-2xl);
        overflow: hidden;
      }

      .modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        z-index: 10;
        transition: background 0.2s;
      }

      .modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .video-embed {
        aspect-ratio: 16/9;
        background: black;
      }

      .video-embed iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      .modal-info {
        padding: var(--space-5);
      }

      .modal-info h3 {
        margin-bottom: var(--space-2);
      }

      .modal-info p {
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      /* Channel Stats */
      .channel-stats.glass,
      .watch-timeline.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-6);
        margin-bottom: var(--space-6);
      }

      .channel-stats h3,
      .watch-timeline h3 {
        margin-bottom: var(--space-4);
      }

      .channels-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: var(--space-3);
      }

      .channel-card {
        background: rgba(255, 255, 255, 0.03);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        text-align: center;
        transition: all 0.2s ease;
      }

      .channel-card:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .channel-avatar {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        border-radius: 50%;
        margin: 0 auto var(--space-2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .channel-name {
        font-size: var(--text-sm);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .channel-count {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      /* Timeline Chart */
      .timeline-chart {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 100px;
      }

      .timeline-bar {
        flex: 1;
        background: linear-gradient(to top, #6366f1, #a855f7);
        border-radius: 4px 4px 0 0;
        transition: height 0.5s ease;
        min-height: 4px;
      }

      .loading-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-8);
        color: var(--text-tertiary);
      }

      .spinner {
        width: 40px;
        height: 40px;
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
        .videos-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .videos-controls {
          flex-direction: column;
          align-items: stretch;
        }

        .video-tabs {
          overflow-x: auto;
          padding-bottom: var(--space-2);
        }

        .search-box.glass {
          width: 100%;
        }
      }
    </style>
  `;

  await loadVideos();
  setupVideoControls();
}

async function loadVideos(): Promise<void> {
  const grid = document.getElementById('videos-grid');

  // Demo data - In production, fetch from Google Sheets API
  const demoVideos: Video[] = [
    {
      id: '1',
      title: "Building a Real-Time Chat App with WebSockets",
      url: "https://www.youtube.com/watch?v=1demotest1",
      thumbnail: "https://img.youtube.com/vi/1demotest1/maxresdefault.jpg",
      platform: 'youtube',
      duration: 1845,
      watchedAt: "2024-06-15T14:30:00Z",
      channel: "Fireship",
      progress: 100
    },
    {
      id: '2',
      title: "AI just got way more powerful #shorts",
      url: "https://www.youtube.com/shorts/2demotest2",
      thumbnail: "https://img.youtube.com/vi/2demotest2/maxresdefault.jpg",
      platform: 'youtube-short',
      duration: 58,
      watchedAt: "2024-06-15T12:00:00Z",
      channel: "Fireship",
      progress: 100
    },
    {
      id: '3',
      title: "The Future of Web Development - 2024 Edition",
      url: "https://www.youtube.com/watch?v=3demotest3",
      thumbnail: "https://img.youtube.com/vi/3demotest3/maxresdefault.jpg",
      platform: 'youtube',
      duration: 2456,
      watchedAt: "2024-06-14T18:00:00Z",
      channel: "Theo - t3.gg",
      progress: 75
    },
    {
      id: '4',
      title: "Quick TypeScript tip #coding",
      url: "https://www.youtube.com/shorts/4demotest4",
      thumbnail: "https://img.youtube.com/vi/4demotest4/maxresdefault.jpg",
      platform: 'youtube-short',
      duration: 45,
      watchedAt: "2024-06-14T10:00:00Z",
      channel: "Matt Pocock",
      progress: 100
    },
    {
      id: '5',
      title: "Interesting Tech Documentary",
      url: "https://vimeo.com/123456",
      thumbnail: "",
      platform: 'other',
      duration: 3600,
      watchedAt: "2024-06-13T20:00:00Z",
      channel: "Documentary Channel",
      progress: 50
    }
  ];

  if (grid) {
    grid.innerHTML = demoVideos.map(video => `
      <div class="video-card" data-platform="${video.platform}" data-id="${video.id}" data-url="${video.url}">
        <div class="video-thumb-container">
          <img src="${video.thumbnail || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect fill="%231a1a2e" width="16" height="9"/><text x="8" y="5" text-anchor="middle" fill="%23666" font-size="2">📹</text></svg>'}"
               alt="${video.title}" class="video-thumb" loading="lazy">
          <div class="video-play-overlay">
            <div class="play-button">▶</div>
          </div>
          <span class="video-platform-badge ${video.platform}">${getPlatformLabel(video.platform)}</span>
          <span class="video-duration">${formatDuration(video.duration)}</span>
        </div>
        <div class="video-info">
          <div class="video-title">${video.title}</div>
          <div class="video-meta">
            <span class="video-channel">${video.channel}</span>
            <span>${formatTimeAgo(video.watchedAt)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Update stats
  const totalVideos = document.getElementById('total-videos');
  const shortsCount = document.getElementById('shorts-count');
  const youtubeCount = document.getElementById('youtube-count');
  const otherCount = document.getElementById('other-count');

  if (totalVideos) totalVideos.textContent = demoVideos.length.toString();
  if (shortsCount) shortsCount.textContent = demoVideos.filter(v => v.platform === 'youtube-short').length.toString();
  if (youtubeCount) youtubeCount.textContent = demoVideos.filter(v => v.platform === 'youtube').length.toString();
  if (otherCount) otherCount.textContent = demoVideos.filter(v => v.platform === 'other').length.toString();

  // Render channel stats
  renderChannelStats(demoVideos);

  // Render timeline
  renderTimeline(demoVideos);
}

function getPlatformLabel(platform: string): string {
  switch (platform) {
    case 'youtube-short': return 'Short';
    case 'youtube': return 'YouTube';
    default: return 'Other';
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

function renderChannelStats(videos: Video[]): void {
  const channelsGrid = document.getElementById('channels-grid');
  if (!channelsGrid) return;

  const channelCounts: Record<string, number> = {};
  videos.forEach(v => {
    channelCounts[v.channel] = (channelCounts[v.channel] || 0) + 1;
  });

  const sorted = Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  channelsGrid.innerHTML = sorted.map(([channel, count]) => `
    <div class="channel-card">
      <div class="channel-avatar">📺</div>
      <div class="channel-name">${channel}</div>
      <div class="channel-count">${count} videos</div>
    </div>
  `).join('');
}

function renderTimeline(videos: Video[]): void {
  const chart = document.getElementById('timeline-chart');
  if (!chart) return;

  // Group by day (last 7 days)
  const days: number[] = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();

  videos.forEach(v => {
    const date = new Date(v.watchedAt);
    const daysAgo = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (daysAgo >= 0 && daysAgo < 7) {
      days[6 - daysAgo]++;
    }
  });

  const max = Math.max(...days, 1);

  chart.innerHTML = days.map((count, i) => `
    <div class="timeline-bar" style="height: ${(count / max) * 100}%" title="${count} videos"></div>
  `).join('');
}

function setupVideoControls(): void {
  // Tab filtering
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.video-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const platform = tab.getAttribute('data-platform');
      cards.forEach(card => {
        const cardPlatform = card.getAttribute('data-platform');
        (card as HTMLElement).style.display =
          platform === 'all' || platform === cardPlatform ? '' : 'none';
      });
    });
  });

  // Search
  const searchInput = document.getElementById('video-search') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    cards.forEach(card => {
      const title = card.querySelector('.video-title')?.textContent?.toLowerCase() || '';
      const channel = card.querySelector('.video-channel')?.textContent?.toLowerCase() || '';
      (card as HTMLElement).style.display =
        title.includes(query) || channel.includes(query) ? '' : 'none';
    });
  });

  // Video modal
  const modal = document.getElementById('video-modal');
  const modalClose = document.getElementById('modal-close');
  const videoEmbed = document.getElementById('video-embed');
  const modalInfo = document.getElementById('modal-info');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const url = card.getAttribute('data-url') || '';
      const title = card.querySelector('.video-title')?.textContent || '';
      const channel = card.querySelector('.video-channel')?.textContent || '';

      // Extract YouTube video ID
      const ytMatch = url.match(/(?:v=|\/shorts\/)([a-zA-Z0-9_-]{11})/);

      if (ytMatch && videoEmbed && modalInfo) {
        videoEmbed.innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
        `;
        modalInfo.innerHTML = `
          <h3>${title}</h3>
          <p>${channel}</p>
        `;
        modal?.classList.add('active');
      } else {
        // Open in new tab for non-YouTube
        window.open(url, '_blank');
      }
    });
  });

  modalClose?.addEventListener('click', () => {
    modal?.classList.remove('active');
    if (videoEmbed) videoEmbed.innerHTML = '';
  });

  document.querySelector('.modal-backdrop')?.addEventListener('click', () => {
    modal?.classList.remove('active');
    if (videoEmbed) videoEmbed.innerHTML = '';
  });
}
