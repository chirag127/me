/**
 * BooksCurrentlyReading - Books currently being read from OpenLibrary
 */

import { OpenLibraryAPI } from '../../services/api';
import type { OpenLibraryBook } from '../../services/api';

export default async function BooksCurrentlyReading(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📖 Currently Reading</h1>
        <p class="page-subtitle">Books I'm reading right now</p>
      </header>

      <div class="reading-grid" id="reading-grid">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading books...</p>
        </div>
      </div>
    </div>

    <style>
      .reading-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-5);
      }

      .book-card {
        display: flex;
        gap: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        text-decoration: none;
        color: inherit;
        transition: all 0.3s;
      }

      .book-card:hover {
        border-color: rgba(34, 197, 94, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }

      .book-cover {
        width: 80px;
        height: 120px;
        border-radius: var(--radius-md);
        object-fit: cover;
        flex-shrink: 0;
      }

      .book-cover-placeholder {
        width: 80px;
        height: 120px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 2rem;
      }

      .book-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .book-title {
        font-size: var(--text-base);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--space-1);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .book-author {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-bottom: var(--space-2);
      }

      .reading-status {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--text-xs);
        color: #22c55e;
        background: rgba(34, 197, 94, 0.15);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-full);
        margin-top: auto;
        width: fit-content;
      }

      .reading-status::before {
        content: '';
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
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
        border: 3px solid rgba(34, 197, 94, 0.2);
        border-top-color: #22c55e;
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

      .empty-state-icon {
        font-size: 3rem;
        margin-bottom: var(--space-4);
      }
    </style>
  `;

    loadBooks();
}

function getBookGradient(title: string): string {
    const colors = [
        ['#22c55e', '#10b981'], ['#0ea5e9', '#06b6d4'], ['#8b5cf6', '#a855f7'],
        ['#f59e0b', '#eab308'], ['#ef4444', '#f43f5e']
    ];
    const idx = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
    return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
}

async function loadBooks(): Promise<void> {
    const container = document.getElementById('reading-grid');
    if (!container) return;

    try {
        const books = await OpenLibraryAPI.getCurrentlyReading();

        if (books.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📚</div>
          <p>Not currently reading any books</p>
        </div>
      `;
            return;
        }

        container.innerHTML = books.map(book => {
            const work = book.work;
            const title = work?.title || 'Unknown Title';
            const author = work?.author_names?.join(', ') || 'Unknown Author';
            const coverId = work?.cover_id;
            const coverUrl = coverId ? OpenLibraryAPI.getBookCover(coverId, 'M') : '';
            const workKey = work?.key || '';
            const bookUrl = workKey ? `https://openlibrary.org${workKey}` : '#';

            return `
        <a href="${bookUrl}" target="_blank" class="book-card">
          ${coverUrl ? `
            <img class="book-cover" src="${coverUrl}" alt="${title}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div class="book-cover-placeholder" style="display:none;background:${getBookGradient(title)};">📖</div>
          ` : `
            <div class="book-cover-placeholder" style="background:${getBookGradient(title)};">📖</div>
          `}
          <div class="book-info">
            <div class="book-title">${title}</div>
            <div class="book-author">by ${author}</div>
            <div class="reading-status">Currently Reading</div>
          </div>
        </a>
      `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<div class="loading-state">Failed to load books</div>';
    }
}
