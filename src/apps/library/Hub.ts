/**
 * Hub - Library Hub / Overview
 * Central navigation for all library content
 */

import { LastFmAPI, TraktAPI, AniListAPI, OpenLibraryAPI } from '../../services/api';

export default async function Hub(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📚 Library</h1>
        <p class="page-subtitle">All my media consumption in one place</p>
      </header>

      <div class="library-grid" id="library-grid">
        <!-- Music Section -->
        <div class="library-section music">
          <div class="section-header">
            <h2>🎵 Music</h2>
            <span class="source">Last.fm</span>
          </div>
          <div class="section-stats" id="music-stats">
            <div class="stat-loading">Loading...</div>
          </div>
          <div class="section-links">
            <a href="#/library/music-now-playing" class="section-link">Now Playing</a>
            <a href="#/library/music-recent" class="section-link">Recent</a>
            <a href="#/library/music-top" class="section-link">Top Charts</a>
          </div>
        </div>

        <!-- Movies Section -->
        <div class="library-section movies">
          <div class="section-header">
            <h2>🎬 Movies</h2>
            <span class="source">Trakt.tv</span>
          </div>
          <div class="section-stats" id="movies-stats">
            <div class="stat-loading">Loading...</div>
          </div>
          <div class="section-links">
            <a href="#/library/movies" class="section-link">Watched</a>
            <a href="#/library/watch-activity" class="section-link">Activity</a>
          </div>
        </div>

        <!-- TV Section -->
        <div class="library-section tv">
          <div class="section-header">
            <h2>📺 TV Shows</h2>
            <span class="source">Trakt.tv</span>
          </div>
          <div class="section-stats" id="tv-stats">
            <div class="stat-loading">Loading...</div>
          </div>
          <div class="section-links">
            <a href="#/library/tv-shows" class="section-link">Watched</a>
            <a href="#/library/watch-activity" class="section-link">Activity</a>
          </div>
        </div>

        <!-- Anime Section -->
        <div class="library-section anime">
          <div class="section-header">
            <h2>🎌 Anime</h2>
            <span class="source">AniList</span>
          </div>
          <div class="section-stats" id="anime-stats">
            <div class="stat-loading">Loading...</div>
          </div>
          <div class="section-links">
            <a href="#/library/anime" class="section-link">Anime List</a>
            <a href="#/library/manga" class="section-link">Manga List</a>
          </div>
        </div>

        <!-- Books Section -->
        <div class="library-section books">
          <div class="section-header">
            <h2>📖 Books</h2>
            <span class="source">OpenLibrary</span>
          </div>
          <div class="section-stats" id="books-stats">
            <div class="stat-loading">Loading...</div>
          </div>
          <div class="section-links">
            <a href="#/library/books-read" class="section-link">Read</a>
            <a href="#/library/books-tbr" class="section-link">Want to Read</a>
          </div>
        </div>

        <!-- Browse History Section -->
        <div class="library-section history">
          <div class="section-header">
            <h2>🌐 Browse History</h2>
            <span class="source">LifeLogger</span>
          </div>
          <div class="section-stats" id="history-stats">
            <div class="stat-loading">Loading...</div>
          </div>
          <div class="section-links">
            <a href="#/library/browse-history" class="section-link">History</a>
            <a href="#/library/videos" class="section-link">Videos</a>
          </div>
        </div>
      </div>
    </div>

    <style>
      .library-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--space-6);
      }

      .library-section {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-2xl);
        padding: var(--space-6);
        transition: all 0.3s;
      }

      .library-section:hover {
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateY(-2px);
      }

      .library-section.music { border-color: rgba(34, 197, 94, 0.2); }
      .library-section.music:hover { border-color: rgba(34, 197, 94, 0.5); }

      .library-section.movies { border-color: rgba(245, 158, 11, 0.2); }
      .library-section.movies:hover { border-color: rgba(245, 158, 11, 0.5); }

      .library-section.tv { border-color: rgba(139, 92, 246, 0.2); }
      .library-section.tv:hover { border-color: rgba(139, 92, 246, 0.5); }

      .library-section.anime { border-color: rgba(2, 169, 255, 0.2); }
      .library-section.anime:hover { border-color: rgba(2, 169, 255, 0.5); }

      .library-section.books { border-color: rgba(16, 185, 129, 0.2); }
      .library-section.books:hover { border-color: rgba(16, 185, 129, 0.5); }

      .library-section.history { border-color: rgba(59, 130, 246, 0.2); }
      .library-section.history:hover { border-color: rgba(59, 130, 246, 0.5); }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
      }

      .section-header h2 {
        font-size: var(--text-lg);
        margin: 0;
      }

      .source {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        background: rgba(255, 255, 255, 0.05);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
      }

      .section-stats {
        display: flex;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
        min-height: 48px;
      }

      .stat-item {
        text-align: center;
      }

      .stat-value {
        font-size: var(--text-xl);
        font-weight: 700;
      }

      .stat-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .stat-loading {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .section-links {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }

      .section-link {
        padding: var(--space-2) var(--space-3);
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-lg);
        font-size: var(--text-sm);
        color: var(--text-secondary);
        text-decoration: none;
        transition: all 0.2s;
      }

      .section-link:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
      }

      @media (max-width: 640px) {
        .library-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;

  // Load stats for each section
  loadMusicStats();
  loadTraktStats();
  loadAnimeStats();
  loadBooksStats();
  loadHistoryStats();
}

async function loadMusicStats(): Promise<void> {
  const container = document.getElementById('music-stats');
  if (!container) return;

  try {
    const user = await LastFmAPI.getUserInfo();
    if (user) {
      container.innerHTML = `
        <div class="stat-item">
          <div class="stat-value">${formatNumber(parseInt(user.playcount))}</div>
          <div class="stat-label">Scrobbles</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${formatNumber(parseInt(user.artist_count))}</div>
          <div class="stat-label">Artists</div>
        </div>
      `;
    }
  } catch {
    container.innerHTML = '<div class="stat-loading">--</div>';
  }
}

async function loadTraktStats(): Promise<void> {
  const moviesContainer = document.getElementById('movies-stats');
  const tvContainer = document.getElementById('tv-stats');

  try {
    const stats = await TraktAPI.getStats();
    if (stats) {
      if (moviesContainer) {
        moviesContainer.innerHTML = `
          <div class="stat-item">
            <div class="stat-value">${stats.movies.watched}</div>
            <div class="stat-label">Movies</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${Math.floor(stats.movies.minutes / 60)}h</div>
            <div class="stat-label">Watch Time</div>
          </div>
        `;
      }
      if (tvContainer) {
        tvContainer.innerHTML = `
          <div class="stat-item">
            <div class="stat-value">${stats.shows.watched}</div>
            <div class="stat-label">Shows</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${stats.episodes.watched}</div>
            <div class="stat-label">Episodes</div>
          </div>
        `;
      }
    }
  } catch {
    if (moviesContainer) moviesContainer.innerHTML = '<div class="stat-loading">--</div>';
    if (tvContainer) tvContainer.innerHTML = '<div class="stat-loading">--</div>';
  }
}

async function loadAnimeStats(): Promise<void> {
  const container = document.getElementById('anime-stats');
  if (!container) return;

  try {
    const anime = await AniListAPI.getAnimeList();
    const manga = await AniListAPI.getMangaList();
    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${anime.length}</div>
        <div class="stat-label">Anime</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${manga.length}</div>
        <div class="stat-label">Manga</div>
      </div>
    `;
  } catch {
    container.innerHTML = '<div class="stat-loading">--</div>';
  }
}

async function loadBooksStats(): Promise<void> {
  const container = document.getElementById('books-stats');
  if (!container) return;

  try {
    const [read, tbr] = await Promise.all([
      OpenLibraryAPI.getReadBooks(),
      OpenLibraryAPI.getWantToRead()
    ]);
    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${read.length}</div>
        <div class="stat-label">Read</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${tbr.length}</div>
        <div class="stat-label">TBR</div>
      </div>
    `;
  } catch {
    container.innerHTML = '<div class="stat-loading">--</div>';
  }
}

async function loadHistoryStats(): Promise<void> {
  const container = document.getElementById('history-stats');
  if (!container) return;

  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycby1Bvb7jjn6GYlL-ESEMjEi2yiU0R0B30yuUmxz_WKYLDlaFYX4EGObFvLFnwf3m44BtA/exec?action=stats');
    const stats = await res.json();
    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${formatNumber(stats.totalPages || 0)}</div>
        <div class="stat-label">Pages</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${formatNumber(stats.totalSearches || 0)}</div>
        <div class="stat-label">Searches</div>
      </div>
    `;
  } catch {
    container.innerHTML = '<div class="stat-loading">--</div>';
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
