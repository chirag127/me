/**
 * GoodreadsTBR → OpenLibrary Want to Read
 * Real data from OpenLibrary API
 */

import { OpenLibraryAPI } from '../../services/api';
import type { OpenLibraryBook } from '../../services/api';

export default async function OpenLibraryTBR(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📚 Want to Read</h1>
        <p class="page-subtitle">Books on my reading list from OpenLibrary</p>
      </header>

      <div class="stats-bar" id="stats-bar">
        <div class="loading-state small">Loading...</div>
      </div>

      <div class="currently-reading" id="currently-reading"></div>

      <div class="books-grid" id="books-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading want to read...</p>
        </div>
      </div>
    </div>

    <style>
      .stats-bar {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
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
        background: linear-gradient(135deg, #f59e0b, #d97706);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .currently-reading {
        margin-bottom: var(--space-6);
      }

      .currently-reading h3 {
        font-size: var(--text-lg);
        margin-bottom: var(--space-4);
        color: var(--text-secondary);
      }

      .current-book {
        display: flex;
        gap: var(--space-6);
        padding: var(--space-6);
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
        border: 1px solid rgba(245, 158, 11, 0.2);
        border-radius: var(--radius-2xl);
      }

      .current-book-cover {
        width: 120px;
        height: 180px;
        object-fit: cover;
        border-radius: var(--radius-lg);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }

      .current-book-info h4 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-2);
      }

      .current-book-info p {
        color: var(--text-secondary);
        margin-bottom: var(--space-2);
      }

      .books-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: var(--space-4);
      }

      .book-card {
        position: relative;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s;
        text-decoration: none;
        color: inherit;
      }

      .book-card:hover {
        transform: translateY(-4px);
        border-color: rgba(245, 158, 11, 0.4);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      }

      .book-cover {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
      }

      .book-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .book-info {
        padding: var(--space-3);
      }

      .book-title {
        font-size: var(--text-sm);
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: var(--space-1);
      }

      .book-author {
        font-size: var(--text-xs);
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .loading-state {
        text-align: center;
        padding: var(--space-12);
        color: var(--text-tertiary);
        grid-column: 1 / -1;
      }

      .loading-state.small { padding: var(--space-4); }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: #f59e0b;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .current-book { flex-direction: column; align-items: center; text-align: center; }
        .books-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
      }
    </style>
  `;

  await loadBooks();
}

async function loadBooks(): Promise<void> {
  const container = document.getElementById('books-grid');
  const statsBar = document.getElementById('stats-bar');
  const currentlyReading = document.getElementById('currently-reading');
  if (!container) return;

  try {
    const [wantToRead, reading] = await Promise.all([
      OpenLibraryAPI.getWantToRead(),
      OpenLibraryAPI.getCurrentlyReading()
    ]);

    // Stats
    if (statsBar) {
      const authors = new Set(wantToRead.flatMap(b => b.work.author_names || []));
      statsBar.innerHTML = `
        <div class="stat-item">
          <div class="stat-value">${wantToRead.length}</div>
          <div class="stat-label">Want to Read</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${reading.length}</div>
          <div class="stat-label">Currently Reading</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${authors.size}</div>
          <div class="stat-label">Authors</div>
        </div>
      `;
    }

    // Currently reading
    if (currentlyReading && reading.length > 0) {
      const book = reading[0];
      const coverUrl = book.work.cover_id
        ? OpenLibraryAPI.getBookCover(book.work.cover_id, 'L')
        : null;

      currentlyReading.innerHTML = `
        <h3>📖 Currently Reading</h3>
        <a href="https://openlibrary.org${book.work.key}" target="_blank" class="current-book">
          ${coverUrl
            ? `<img class="current-book-cover" src="${coverUrl}" alt="${book.work.title}">`
            : '<div class="current-book-cover" style="display: flex; align-items: center; justify-content: center; background: rgba(245, 158, 11, 0.2);">📚</div>'
          }
          <div class="current-book-info">
            <h4>${book.work.title}</h4>
            <p>${book.work.author_names?.join(', ') || 'Unknown Author'}</p>
            ${book.work.first_publish_year ? `<p style="font-size: var(--text-sm); color: var(--text-tertiary);">First published ${book.work.first_publish_year}</p>` : ''}
          </div>
        </a>
      `;
    }

    // Want to read grid
    if (wantToRead.length === 0) {
      container.innerHTML = '<div class="loading-state">No books in want to read list</div>';
      return;
    }

    container.innerHTML = wantToRead.map(book => {
      const coverUrl = book.work.cover_id
        ? OpenLibraryAPI.getBookCover(book.work.cover_id, 'M')
        : null;
      const authors = book.work.author_names?.join(', ') || 'Unknown Author';

      return `
        <a href="https://openlibrary.org${book.work.key}" target="_blank" class="book-card">
          <div class="book-cover">
            ${coverUrl
              ? `<img src="${coverUrl}" alt="${book.work.title}" loading="lazy" onerror="this.parentElement.innerHTML='📚'">`
              : '📚'
            }
          </div>
          <div class="book-info">
            <div class="book-title">${book.work.title}</div>
            <div class="book-author">${authors}</div>
          </div>
        </a>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = '<div class="loading-state">Failed to load books. Make sure reading list is public on OpenLibrary.</div>';
  }
}
