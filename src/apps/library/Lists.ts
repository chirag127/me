/**
 * TraktLists - User's Custom Lists from Trakt.tv
 * Display custom lists and their items
 */

import { TraktAPI } from '../../services/api';
import type { TraktList, TraktListItem } from '../../services/api';

export default async function TraktLists(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📋 Lists</h1>
        <p class="page-subtitle">My custom lists from Trakt.tv</p>
      </header>

      <div class="lists-container" id="lists-container">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading lists...</p>
        </div>
      </div>
    </div>

    <style>
      .lists-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
      }

      .list-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-5);
        transition: all 0.3s;
        cursor: pointer;
      }

      .list-card:hover {
        border-color: rgba(139, 92, 246, 0.4);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }

      .list-card.expanded {
        border-color: rgba(139, 92, 246, 0.5);
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-3);
      }

      .list-name {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .list-name-icon {
        font-size: 1.2em;
      }

      .list-privacy {
        font-size: var(--text-xs);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-md);
        background: rgba(139, 92, 246, 0.2);
        color: #a78bfa;
      }

      .list-description {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-bottom: var(--space-3);
        line-height: 1.5;
      }

      .list-stats {
        display: flex;
        gap: var(--space-4);
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .list-stat {
        display: flex;
        align-items: center;
        gap: var(--space-1);
      }

      .list-items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: var(--space-3);
        margin-top: var(--space-4);
        padding-top: var(--space-4);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .list-item-card {
        position: relative;
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s;
        text-decoration: none;
        color: inherit;
      }

      .list-item-card:hover {
        transform: translateY(-2px);
        border-color: rgba(139, 92, 246, 0.4);
      }

      .list-item-poster {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
      }

      .list-item-placeholder {
        width: 100%;
        aspect-ratio: 2/3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-1);
        padding: var(--space-2);
      }

      .list-item-icon {
        font-size: 2rem;
      }

      .list-item-title {
        font-size: var(--text-xs);
        font-weight: 500;
        text-align: center;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .list-item-rank {
        position: absolute;
        top: var(--space-1);
        left: var(--space-1);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: var(--text-xs);
        font-weight: 600;
        padding: 2px 6px;
        border-radius: var(--radius-sm);
      }

      .expand-text {
        text-align: center;
        padding: var(--space-3);
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      .loading-state {
        text-align: center;
        padding: var(--space-8);
        color: var(--text-secondary);
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

    // Load lists
    loadLists();
}

async function loadLists(): Promise<void> {
    const container = document.getElementById('lists-container');
    if (!container) return;

    try {
        const lists = await TraktAPI.getLists();

        if (lists.length === 0) {
            container.innerHTML = '<div class="loading-state">No custom lists found</div>';
            return;
        }

        container.innerHTML = lists.map(list => `
      <div class="list-card" data-list-id="${list.ids.slug}">
        <div class="list-header">
          <div class="list-name">
            <span class="list-name-icon">📋</span>
            ${list.name}
          </div>
          <span class="list-privacy">${list.privacy}</span>
        </div>
        ${list.description ? `<div class="list-description">${list.description}</div>` : ''}
        <div class="list-stats">
          <span class="list-stat">📊 ${list.item_count} items</span>
          <span class="list-stat">❤️ ${list.likes} likes</span>
          <span class="list-stat">💬 ${list.comment_count} comments</span>
        </div>
        <div class="list-items" id="list-items-${list.ids.slug}">
          <div class="expand-text">Click to see items</div>
        </div>
      </div>
    `).join('');

        // Add click handlers to expand lists
        container.querySelectorAll('.list-card').forEach(card => {
            card.addEventListener('click', async (e) => {
                const listId = card.getAttribute('data-list-id');
                if (!listId) return;

                const itemsContainer = document.getElementById(`list-items-${listId}`);
                if (!itemsContainer) return;

                // Toggle expanded state
                if (card.classList.contains('expanded')) {
                    card.classList.remove('expanded');
                    itemsContainer.innerHTML = '<div class="expand-text">Click to see items</div>';
                    return;
                }

                card.classList.add('expanded');
                itemsContainer.innerHTML = '<div class="expand-text">Loading items...</div>';

                try {
                    const items = await TraktAPI.getListItems(listId);

                    if (items.length === 0) {
                        itemsContainer.innerHTML = '<div class="expand-text">No items in this list</div>';
                        return;
                    }

                    // FM-DB API
                    const FMDB_POSTER_URL = 'https://imdb.iamidiotareyoutoo.com/photo';

                    itemsContainer.innerHTML = `<div class="list-items-grid">${items.slice(0, 20).map(item => {
                        const isMovie = item.type === 'movie' && item.movie;
                        const title = isMovie ? item.movie!.title : item.show?.title || 'Unknown';
                        const imdbId = isMovie ? item.movie!.ids.imdb : item.show?.ids.imdb;
                        const tmdbId = isMovie ? item.movie!.ids.tmdb : item.show?.ids.tmdb;
                        const icon = isMovie ? '🎬' : '📺';

                        const getGradient = (t: string) => {
                            const colors = [
                                ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
                                ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb']
                            ];
                            const idx = t.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
                            return colors[idx];
                        };
                        const [c1, c2] = getGradient(title);

                        const posterUrl = imdbId ? `${FMDB_POSTER_URL}/${imdbId}?w=200&h=300` : '';
                        const link = imdbId ? `https://www.imdb.com/title/${imdbId}` : `https://www.themoviedb.org/${isMovie ? 'movie' : 'tv'}/${tmdbId}`;

                        return imdbId ? `
              <a href="${link}" target="_blank" class="list-item-card" onclick="event.stopPropagation();">
                <div class="list-item-rank">#${item.rank}</div>
                <img class="list-item-poster" src="${posterUrl}"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" alt="${title}">
                <div class="list-item-placeholder" style="display:none;background:linear-gradient(135deg,${c1},${c2});">
                  <span class="list-item-icon">${icon}</span>
                  <span class="list-item-title">${title}</span>
                </div>
              </a>
            ` : `
              <a href="${link}" target="_blank" class="list-item-card" onclick="event.stopPropagation();">
                <div class="list-item-rank">#${item.rank}</div>
                <div class="list-item-placeholder" style="background:linear-gradient(135deg,${c1},${c2});">
                  <span class="list-item-icon">${icon}</span>
                  <span class="list-item-title">${title}</span>
                </div>
              </a>
            `;
                    }).join('')}${items.length > 20 ? '<div class="expand-text">+ ' + (items.length - 20) + ' more items</div>' : ''}</div>`;
                } catch (error) {
                    itemsContainer.innerHTML = '<div class="expand-text">Failed to load items</div>';
                }
            });
        });
    } catch (error) {
        container.innerHTML = '<div class="loading-state">Failed to load lists. Make sure Trakt profile is public.</div>';
    }
}
