/**
 * GoodreadsRead → OpenLibrary Read Books
 * Real data from OpenLibrary API
 */

import { OpenLibraryAPI } from '../../services/api';
import type { OpenLibraryBook } from '../../services/api';

export default async function OpenLibraryRead(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📖 Books Read</h1>
        <p class="page-subtitle">Books I've finished reading from OpenLibrary</p>
      </header>

      <div class="stats-bar" id="stats-bar">
        <div class="loading-state small">Loading...</div>
      </div>

      <div class="books-grid" id="books-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading read books...</p>
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
        background: linear-gradient(135deg, #10b981, #059669);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
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
        border-color: rgba(16, 185, 129, 0.4);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      }

      .book-cover {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
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

      .book-year {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
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
        border-top-color: #10b981;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .stats-bar { grid-template-columns: repeat(3, 1fr); }
        .books-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
      }
    </style>
  `;

  await loadBooks();
}

async function loadBooks(): Promise<void> {
  const container = document.getElementById('books-grid');
  const statsBar = document.getElementById('stats-bar');
  if (!container) return;

  try {
    const books = await OpenLibraryAPI.getReadBooks();

    if (statsBar) {
      // Get unique authors
      const authors = new Set(books.flatMap(b => b.work.author_names || []));
      statsBar.innerHTML = `
        <div class="stat-item">
          <div class="stat-value">${books.length}</div>
          <div class="stat-label">Books Read</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${authors.size}</div>
          <div class="stat-label">Authors</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">📚</div>
          <div class="stat-label">OpenLibrary</div>
        </div>
      `;
    }

    if (books.length === 0) {
      container.innerHTML = '<div class="loading-state">No books found. Make reading list public on OpenLibrary.</div>';
      return;
    }

    container.innerHTML = books.map(book => {
      const coverUrl = book.work.cover_id
        ? OpenLibraryAPI.getBookCover(book.work.cover_id, 'M')
        : null;
      const authors = book.work.author_names?.join(', ') || 'Unknown Author';

      return `
        <a href="https://openlibrary.org${book.work.key}" target="_blank" class="book-card">
          <div class="book-cover">
            ${coverUrl
              ? `<img src="${coverUrl}" alt="${book.work.title}" loading="lazy" onerror="this.parentElement.innerHTML='📖'">`
              : '📖'
            }
          </div>
          <div class="book-info">
            <div class="book-title">${book.work.title}</div>
            <div class="book-author">${authors}</div>
            ${book.work.first_publish_year ? `<div class="book-year">${book.work.first_publish_year}</div>` : ''}
          </div>
        </a>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = '<div class="loading-state">Failed to load books. Make sure reading list is public.</div>';
  }
}
