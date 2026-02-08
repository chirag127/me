/**
 * TV Shows Page - Displays TV show watch history from Trakt.tv
 * Liquid Glass 2026 Design
 */

interface TVShow {
  id: number;
  title: string;
  year: number;
  poster: string;
  seasons: number;
  episodes: number;
  watchedEpisodes: number;
  rating: number;
  status: 'watching' | 'completed' | 'paused' | 'dropped';
  lastWatched: string;
  network: string;
}

export default async function TVShows(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📺 TV Shows</h1>
        <p class="page-subtitle">Series I'm watching and have watched</p>
      </header>

      <div class="tv-stats" id="tv-stats">
        <div class="stat-card glass">
          <span class="stat-value" id="total-shows">--</span>
          <span class="stat-label">Total Shows</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="total-episodes">--</span>
          <span class="stat-label">Episodes</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="currently-watching">--</span>
          <span class="stat-label">Watching</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="completed-shows">--</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>

      <div class="tv-tabs">
        <button class="tab-btn active" data-status="all">All</button>
        <button class="tab-btn" data-status="watching">📺 Watching</button>
        <button class="tab-btn" data-status="completed">✅ Completed</button>
        <button class="tab-btn" data-status="paused">⏸️ Paused</button>
      </div>

      <div class="tv-grid" id="tv-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading shows...</p>
        </div>
      </div>
    </div>

    <style>
      .tv-stats {
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
      }

      .stat-card .stat-value {
        display: block;
        font-size: var(--text-3xl);
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-card .stat-label {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .tv-tabs {
        display: flex;
        gap: var(--space-2);
        margin-bottom: var(--space-6);
        overflow-x: auto;
        padding-bottom: var(--space-2);
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
        white-space: nowrap;
      }

      .tab-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .tab-btn.active {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
        border-color: rgba(99, 102, 241, 0.4);
        color: var(--text-primary);
      }

      .tv-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .tv-card {
        display: flex;
        gap: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        transition: all 0.3s ease;
      }

      .tv-card:hover {
        transform: translateY(-4px);
        border-color: rgba(99, 102, 241, 0.3);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
      }

      .tv-poster {
        width: 80px;
        height: 120px;
        border-radius: var(--radius-md);
        object-fit: cover;
        flex-shrink: 0;
      }

      .tv-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .tv-title {
        font-size: var(--text-base);
        font-weight: 600;
        margin-bottom: var(--space-1);
      }

      .tv-network {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-bottom: var(--space-3);
      }

      .tv-progress {
        margin-top: auto;
      }

      .progress-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: var(--space-2);
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #6366f1, #a855f7);
        border-radius: 3px;
        transition: width 0.5s ease;
      }

      .progress-text {
        display: flex;
        justify-content: space-between;
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .tv-status {
        padding: 2px 8px;
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 600;
      }

      .tv-status.watching {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
      }

      .tv-status.completed {
        background: rgba(99, 102, 241, 0.2);
        color: #818cf8;
      }

      .tv-status.paused {
        background: rgba(251, 191, 36, 0.2);
        color: #fbbf24;
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
        .tv-stats {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    </style>
  `;

  await loadTVShows();
  setupTabs();
}

async function loadTVShows(): Promise<void> {
  const grid = document.getElementById('tv-grid');

  // Demo data
  const demoShows: TVShow[] = [
    {
      id: 1,
      title: "The Last of Us",
      year: 2023,
      poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
      seasons: 2,
      episodes: 17,
      watchedEpisodes: 17,
      rating: 9,
      status: 'completed',
      lastWatched: "2024-05-12",
      network: "HBO"
    },
    {
      id: 2,
      title: "Shogun",
      year: 2024,
      poster: "https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1W2w4rL0QI.jpg",
      seasons: 1,
      episodes: 10,
      watchedEpisodes: 10,
      rating: 10,
      status: 'completed',
      lastWatched: "2024-04-23",
      network: "FX"
    },
    {
      id: 3,
      title: "House of the Dragon",
      year: 2022,
      poster: "https://image.tmdb.org/t/p/w500/t9XkeE7HzOsdQcDDDapDYh8Rrmt.jpg",
      seasons: 2,
      episodes: 18,
      watchedEpisodes: 12,
      rating: 8,
      status: 'watching',
      lastWatched: "2024-07-28",
      network: "HBO"
    }
  ];

  if (grid) {
    grid.innerHTML = demoShows.map(show => {
      const progress = Math.round((show.watchedEpisodes / show.episodes) * 100);
      return `
        <div class="tv-card" data-status="${show.status}">
          <img src="${show.poster}" alt="${show.title}" class="tv-poster" loading="lazy">
          <div class="tv-info">
            <div class="tv-title">${show.title}</div>
            <div class="tv-network">${show.network} • ${show.year}</div>
            <div class="tv-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <div class="progress-text">
                <span>${show.watchedEpisodes}/${show.episodes} episodes</span>
                <span class="tv-status ${show.status}">${show.status}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Update stats
  const totalShows = document.getElementById('total-shows');
  const totalEpisodes = document.getElementById('total-episodes');
  const watching = document.getElementById('currently-watching');
  const completed = document.getElementById('completed-shows');

  if (totalShows) totalShows.textContent = demoShows.length.toString();
  if (totalEpisodes) totalEpisodes.textContent = demoShows.reduce((sum, s) => sum + s.watchedEpisodes, 0).toString();
  if (watching) watching.textContent = demoShows.filter(s => s.status === 'watching').length.toString();
  if (completed) completed.textContent = demoShows.filter(s => s.status === 'completed').length.toString();
}

function setupTabs(): void {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.tv-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const status = tab.getAttribute('data-status');
      cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        (card as HTMLElement).style.display =
          status === 'all' || status === cardStatus ? '' : 'none';
      });
    });
  });
}
