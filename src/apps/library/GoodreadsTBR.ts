// Books TBR (To Be Read) - Display want-to-read books from OpenLibrary
import { getBooksToRead, getBookCoverUrl, getBookUrl, getOpenLibraryUser } from '../../services/books';
import { CONFIG } from '../../config';

export default async function BooksTBR(c: HTMLElement): Promise<void> {
  // Show loading state
  c.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📖 To Be Read</h1>
        <p class="page-subtitle">My reading list</p>
      </header>
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading reading queue...</p>
      </div>
    </div>
  `;

  try {
    const [readingLog, user] = await Promise.all([
      getBooksToRead(50),
      getOpenLibraryUser()
    ]);

    const books = readingLog.reading_log_entries;
    const totalCount = user?.reading_log_counts?.want_to_read || readingLog.total_results || books.length;

    if (books.length === 0) {
      c.innerHTML = `
        <div class="page animate-fade-in">
          <header class="page-header">
            <h1 class="page-title">📖 To Be Read</h1>
            <p class="page-subtitle">My reading list</p>
          </header>
          <div class="glass-panel empty-state">
            <span class="empty-icon">📖</span>
            <h3>Reading Queue Empty</h3>
            <p>No books in the want-to-read list yet.</p>
            <a href="https://openlibrary.org/people/${CONFIG.user.openlibrary}" target="_blank" class="btn btn-primary">OpenLibrary →</a>
          </div>
        </div>
        <style>
          .empty-state { padding: var(--space-12); text-align: center; }
          .empty-icon { font-size: var(--text-6xl); display: block; margin-bottom: var(--space-4); }
          .empty-state h3 { margin-bottom: var(--space-2); }
          .empty-state p { color: var(--text-secondary); margin-bottom: var(--space-6); }
        </style>
      `;
      return;
    }

    c.innerHTML = `
      <div class="page animate-fade-in">
        <header class="page-header">
          <h1 class="page-title">📖 To Be Read</h1>
          <p class="page-subtitle">${totalCount} books in my reading queue</p>
        </header>

        <div class="stats-bar glass-panel">
          <div class="stat">
            <span class="stat-value">${totalCount}</span>
            <span class="stat-label">Want to Read</span>
          </div>
          <div class="stat">
            <span class="stat-value">${user?.reading_log_counts?.currently_reading || 0}</span>
            <span class="stat-label">Currently Reading</span>
          </div>
          <div class="stat">
            <span class="stat-value">${user?.reading_log_counts?.already_read || 0}</span>
            <span class="stat-label">Already Read</span>
          </div>
          <a href="https://openlibrary.org/people/${CONFIG.user.openlibrary}" target="_blank" class="btn btn-secondary">
            View Profile →
          </a>
        </div>

        <div class="books-grid">
          ${books.map(entry => {
            const coverUrl = getBookCoverUrl(entry.work.cover_id, 'M');
            const bookUrl = getBookUrl(entry.work.key);
            const author = entry.work.author_names?.[0] || 'Unknown Author';
            const year = entry.work.first_publish_year || '';

            return `
              <a href="${bookUrl}" target="_blank" class="book-card glass-panel">
                <div class="book-cover">
                  ${coverUrl
                    ? `<img src="${coverUrl}" alt="${entry.work.title}" loading="lazy" />`
                    : `<div class="no-cover">📖</div>`
                  }
                </div>
                <div class="book-info">
                  <h3 class="book-title">${entry.work.title}</h3>
                  <p class="book-author">${author}</p>
                  ${year ? `<span class="book-year">${year}</span>` : ''}
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>

      <style>
        .stats-bar {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          padding: var(--space-4) var(--space-6);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .stat-value {
          font-size: var(--text-2xl);
          font-weight: 700;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stats-bar .btn {
          margin-left: auto;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: var(--space-4);
        }

        .book-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all var(--transition-normal);
          text-decoration: none;
          color: inherit;
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .book-cover {
          aspect-ratio: 2/3;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-cover {
          font-size: var(--text-4xl);
          color: var(--text-tertiary);
        }

        .book-info {
          padding: var(--space-3);
        }

        .book-title {
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-1);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-author {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin-bottom: var(--space-1);
        }

        .book-year {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        @media (max-width: 768px) {
          .stats-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats-bar .btn {
            margin-left: 0;
            margin-top: var(--space-4);
          }

          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }
        }
      </style>
    `;
  } catch (error) {
    console.error('Failed to load TBR books:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    c.innerHTML = `
      <div class="page animate-fade-in">
        <header class="page-header">
          <h1 class="page-title">📖 To Be Read</h1>
          <p class="page-subtitle">My reading list</p>
        </header>
        <div class="glass-panel empty-state">
          <span class="empty-icon">⚠️</span>
          <h3>Unable to Load Books</h3>
          <p>Error: ${errorMsg}</p>
          <p class="text-xs text-muted" style="margin-top: 0.5rem; word-break: break-all;">Check console for details.</p>
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
            <a href="https://openlibrary.org/people/${CONFIG.user.openlibrary}" target="_blank" class="btn btn-primary">View on OpenLibrary →</a>
            <button onclick="location.reload()" class="btn btn-secondary">Retry</button>
          </div>
        </div>
      </div>
      <style>
        .empty-state { padding: var(--space-12); text-align: center; }
        .empty-icon { font-size: var(--text-6xl); display: block; margin-bottom: var(--space-4); }
        .empty-state h3 { margin-bottom: var(--space-2); }
        .empty-state p { color: var(--text-secondary); margin-bottom: var(--space-6); }
        .text-xs { font-size: 0.75rem; }
        .text-muted { color: var(--text-tertiary); }
      </style>
    `;
  }
}
