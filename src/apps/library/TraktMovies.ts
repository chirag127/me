/**
 * Movies Page - Displays movie watch history from Trakt.tv
 * Liquid Glass 2026 Design
 */

import { RESUME } from '../../data/resume';

// Trakt API configuration
const TRAKT_CLIENT_ID = ''; // User needs to set this
const TRAKT_USERNAME = ''; // User's Trakt username

interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string;
  rating: number;
  watchedAt: string;
  runtime: number;
  genres: string[];
  overview: string;
}

export default async function Movies(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🎬 Movies</h1>
        <p class="page-subtitle">My cinematic journey</p>
      </header>

      <div class="movies-stats" id="movies-stats">
        <div class="stat-card glass">
          <span class="stat-value" id="total-movies">--</span>
          <span class="stat-label">Movies Watched</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="total-hours">--</span>
          <span class="stat-label">Hours Watched</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="avg-rating">--</span>
          <span class="stat-label">Avg Rating</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="this-year">--</span>
          <span class="stat-label">This Year</span>
        </div>
      </div>

      <div class="movies-filters">
        <div class="search-box glass">
          <span class="search-icon">🔍</span>
          <input type="text" id="movie-search" placeholder="Search movies...">
        </div>
        <select id="genre-filter" class="filter-select glass">
          <option value="">All Genres</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="horror">Horror</option>
          <option value="scifi">Sci-Fi</option>
          <option value="thriller">Thriller</option>
        </select>
        <select id="year-filter" class="filter-select glass">
          <option value="">All Years</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div class="movies-grid" id="movies-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading movies...</p>
        </div>
      </div>

      <div class="genres-chart glass" id="genres-chart">
        <h3>Genre Distribution</h3>
        <div class="chart-container" id="genre-bars"></div>
      </div>
    </div>

    <style>
      .movies-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .stat-card.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
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
        background-clip: text;
      }

      .stat-card .stat-label {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .movies-filters {
        display: flex;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        flex-wrap: wrap;
      }

      .search-box.glass {
        flex: 1;
        min-width: 200px;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        padding: var(--space-3) var(--space-4);
      }

      .search-box input {
        flex: 1;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: var(--text-sm);
        outline: none;
      }

      .filter-select.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        padding: var(--space-3) var(--space-4);
        color: var(--text-primary);
        font-size: var(--text-sm);
        cursor: pointer;
        outline: none;
      }

      .movies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--space-5);
        margin-bottom: var(--space-8);
      }

      .movie-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .movie-card:hover {
        transform: translateY(-8px) scale(1.02);
        border-color: rgba(99, 102, 241, 0.4);
        box-shadow: 0 16px 48px rgba(99, 102, 241, 0.2);
      }

      .movie-poster {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
      }

      .movie-info {
        padding: var(--space-3);
      }

      .movie-title {
        font-size: var(--text-sm);
        font-weight: 600;
        margin-bottom: var(--space-1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .movie-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .movie-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #fbbf24;
      }

      .genres-chart.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-6);
      }

      .genres-chart h3 {
        margin-bottom: var(--space-4);
      }

      .chart-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .genre-bar {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .genre-label {
        width: 100px;
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .genre-progress {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }

      .genre-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s ease;
      }

      .genre-count {
        width: 40px;
        text-align: right;
        font-size: var(--text-sm);
        color: var(--text-tertiary);
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

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-8);
      }

      .empty-state h3 {
        margin-bottom: var(--space-2);
      }

      .empty-state p {
        color: var(--text-tertiary);
        margin-bottom: var(--space-4);
      }

      @media (max-width: 768px) {
        .movies-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .movies-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    </style>
  `;

  // Load movies data
  await loadMovies();
  setupFilters();
}

async function loadMovies(): Promise<void> {
  const grid = document.getElementById('movies-grid');

  // Demo data - In production, this would fetch from Trakt API
  const demoMovies: Movie[] = [
    {
      id: 1,
      title: "Dune: Part Two",
      year: 2024,
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      rating: 9,
      watchedAt: "2024-03-15",
      runtime: 166,
      genres: ["Sci-Fi", "Adventure"],
      overview: "Follow the mythic journey of Paul Atreides..."
    },
    {
      id: 2,
      title: "Oppenheimer",
      year: 2023,
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFMYXv6bLWrxJWPqG6GMC.jpg",
      rating: 9,
      watchedAt: "2023-07-24",
      runtime: 180,
      genres: ["Drama", "History"],
      overview: "The story of American scientist J. Robert Oppenheimer..."
    },
    {
      id: 3,
      title: "Spider-Man: Across the Spider-Verse",
      year: 2023,
      poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      rating: 10,
      watchedAt: "2023-06-02",
      runtime: 140,
      genres: ["Animation", "Action"],
      overview: "Miles Morales catapults across the Multiverse..."
    }
  ];

  if (grid) {
    if (demoMovies.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>No movies yet</h3>
          <p>Connect your Trakt account to start tracking movies</p>
          <a href="https://trakt.tv" target="_blank" class="btn btn-primary">Connect Trakt</a>
        </div>
      `;
    } else {
      grid.innerHTML = demoMovies.map(movie => `
        <div class="movie-card" data-id="${movie.id}">
          <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
          <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-meta">
              <span>${movie.year}</span>
              <span class="movie-rating">⭐ ${movie.rating}/10</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Update stats
  updateStats(demoMovies);
  updateGenreChart(demoMovies);
}

function updateStats(movies: Movie[]): void {
  const totalMovies = document.getElementById('total-movies');
  const totalHours = document.getElementById('total-hours');
  const avgRating = document.getElementById('avg-rating');
  const thisYear = document.getElementById('this-year');

  if (totalMovies) totalMovies.textContent = movies.length.toString();

  if (totalHours) {
    const hours = Math.round(movies.reduce((sum, m) => sum + m.runtime, 0) / 60);
    totalHours.textContent = `${hours}h`;
  }

  if (avgRating) {
    const avg = movies.length > 0
      ? (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1)
      : '--';
    avgRating.textContent = avg.toString();
  }

  if (thisYear) {
    const currentYear = new Date().getFullYear();
    const count = movies.filter(m => new Date(m.watchedAt).getFullYear() === currentYear).length;
    thisYear.textContent = count.toString();
  }
}

function updateGenreChart(movies: Movie[]): void {
  const container = document.getElementById('genre-bars');
  if (!container) return;

  const genreCounts: Record<string, number> = {};
  movies.forEach(m => {
    m.genres.forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const sorted = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = sorted[0]?.[1] || 1;

  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

  container.innerHTML = sorted.map(([genre, count], i) => `
    <div class="genre-bar">
      <span class="genre-label">${genre}</span>
      <div class="genre-progress">
        <div class="genre-fill" style="width: ${(count / max) * 100}%; background: ${colors[i]}"></div>
      </div>
      <span class="genre-count">${count}</span>
    </div>
  `).join('');
}

function setupFilters(): void {
  const searchInput = document.getElementById('movie-search') as HTMLInputElement;

  searchInput?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const cards = document.querySelectorAll('.movie-card');

    cards.forEach(card => {
      const title = card.querySelector('.movie-title')?.textContent?.toLowerCase() || '';
      (card as HTMLElement).style.display = title.includes(query) ? '' : 'none';
    });
  });
}
