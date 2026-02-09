/**
 * MusicTags - User's most used genre tags from Last.fm
 * Tag cloud visualization
 */

import { LastFmAPI } from '../../services/api';
import type { LastFmTag } from '../../services/api';

export default async function MusicTags(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🏷️ Music Tags</h1>
        <p class="page-subtitle">My most used genre tags on Last.fm</p>
      </header>

      <div class="tags-cloud" id="tags-cloud">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading tags...</p>
        </div>
      </div>

      <div class="tags-list" id="tags-list"></div>
    </div>

    <style>
      .tags-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        justify-content: center;
        padding: var(--space-8);
        margin-bottom: var(--space-8);
        background: rgba(255, 255, 255, 0.02);
        border-radius: var(--radius-xl);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .tag-bubble {
        display: inline-flex;
        align-items: center;
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-full);
        text-decoration: none;
        color: white;
        font-weight: 500;
        transition: all 0.3s;
        text-transform: lowercase;
      }

      .tag-bubble:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }

      .tag-bubble.size-1 { font-size: 0.75rem; opacity: 0.7; }
      .tag-bubble.size-2 { font-size: 0.875rem; opacity: 0.8; }
      .tag-bubble.size-3 { font-size: 1rem; }
      .tag-bubble.size-4 { font-size: 1.25rem; }
      .tag-bubble.size-5 { font-size: 1.5rem; font-weight: 600; }
      .tag-bubble.size-6 { font-size: 1.75rem; font-weight: 700; }

      .tags-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-3);
      }

      .tag-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-3) var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        text-decoration: none;
        color: inherit;
        transition: all 0.3s;
      }

      .tag-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(139, 92, 246, 0.4);
      }

      .tag-name {
        font-weight: 500;
        color: var(--text-primary);
      }

      .tag-count {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        background: rgba(139, 92, 246, 0.2);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-full);
      }

      .loading-state {
        flex: 1;
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

      .empty-state {
        text-align: center;
        padding: var(--space-12);
        color: var(--text-secondary);
      }
    </style>
  `;

    loadTags();
}

function getTagColor(index: number): string {
    const colors = [
        '#f43f5e', '#ec4899', '#a855f7', '#8b5cf6', '#6366f1',
        '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981',
        '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316'
    ];
    return colors[index % colors.length];
}

function getTagSize(count: number, maxCount: number): number {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 6;
    if (ratio > 0.6) return 5;
    if (ratio > 0.4) return 4;
    if (ratio > 0.2) return 3;
    if (ratio > 0.1) return 2;
    return 1;
}

async function loadTags(): Promise<void> {
    const cloudContainer = document.getElementById('tags-cloud');
    const listContainer = document.getElementById('tags-list');
    if (!cloudContainer || !listContainer) return;

    try {
        const tags = await LastFmAPI.getTopTags(50);

        if (tags.length === 0) {
            cloudContainer.innerHTML = '<div class="empty-state"><p>No tags found</p></div>';
            return;
        }

        const maxCount = Math.max(...tags.map(t => parseInt(t.count) || 0));

        // Tag cloud
        cloudContainer.innerHTML = tags.slice(0, 30).map((tag, i) => {
            const count = parseInt(tag.count) || 0;
            const size = getTagSize(count, maxCount);
            const color = getTagColor(i);
            return `
        <a href="${tag.url}" target="_blank" class="tag-bubble size-${size}"
           style="background: ${color};">
          #${tag.name}
        </a>
      `;
        }).join('');

        // Tag list
        listContainer.innerHTML = tags.map(tag => `
      <a href="${tag.url}" target="_blank" class="tag-item">
        <span class="tag-name">#${tag.name}</span>
        <span class="tag-count">${tag.count}</span>
      </a>
    `).join('');
    } catch (error) {
        cloudContainer.innerHTML = '<div class="loading-state">Failed to load tags</div>';
    }
}
