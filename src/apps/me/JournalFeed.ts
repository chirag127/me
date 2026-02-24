/**
 * Project Me - Journal Feed Page
 * Browse all entries with heatmap, filters, and DB source selector
 */

import {
    MOOD_MAP,
    getJournalEntries,
    getAllJournalEntries,
    computeStats,
    type JournalEntry,
    type JournalPage,
} from '../../services/journal';
import { Timestamp } from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

/** Cloudflare Worker URL for backup DB reads */
const WORKER_URL = 'https://journal-proxy.chirag127.workers.dev';

/** Database sources */
const DB_SOURCES = [
    { id: 'firebase', label: 'Firebase Firestore', icon: '🔥' },
    { id: 'd1', label: 'Cloudflare D1', icon: '☁️' },
    { id: 'turso', label: 'Turso (libSQL)', icon: '🐢' },
    { id: 'supabase', label: 'Supabase', icon: '⚡' },
    { id: 'neon', label: 'Neon Postgres', icon: '🟢' },
    { id: 'xata', label: 'Xata', icon: '🦋' },
    { id: 'cockroachdb', label: 'CockroachDB', icon: '🪳' },
    { id: 'oracle', label: 'Oracle Cloud', icon: '🔴' },
    { id: 'mongodb', label: 'MongoDB Atlas', icon: '🍃' },
    { id: 'dynamodb', label: 'DynamoDB', icon: '📦' },
    { id: 'appwrite', label: 'Appwrite', icon: '🅰️' },
    { id: 'github', label: 'GitHub JSON', icon: '🐙' },
];

export default async function JournalFeed(container: HTMLElement): Promise<void> {
    container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">📰 Journal Feed</h1>
        <p class="page-subtitle">Browse all entries & contribution heatmap</p>
      </header>

      <!-- Controls -->
      <div class="feed-controls glass-panel">
        <div class="feed-control-group">
          <label for="db-source">Data Source</label>
          <select id="db-source" class="feed-select">
            ${DB_SOURCES.map((s) => `<option value="${s.id}">${s.icon} ${s.label}</option>`).join('')}
          </select>
        </div>
        <div class="feed-control-group">
          <label for="mood-filter">Mood Filter</label>
          <select id="mood-filter" class="feed-select">
            <option value="all">All Moods</option>
            ${Object.entries(MOOD_MAP).map(([val, { emoji, label }]) => `<option value="${val}">${emoji} ${label}</option>`).join('')}
          </select>
        </div>
        <div class="feed-control-group">
          <label for="search-text">Search</label>
          <input type="text" id="search-text" class="feed-input" placeholder="Search entries...">
        </div>
      </div>

      <!-- Heatmap -->
      <div class="heatmap-section glass-panel">
        <h3 class="heatmap-title">📅 Contribution Heatmap</h3>
        <div class="heatmap-months" id="heatmap-months"></div>
        <div class="heatmap-grid" id="heatmap-grid">
          <div class="loading-container"><div class="loading-spinner"></div></div>
        </div>
        <div class="heatmap-legend">
          <span class="legend-label">Less</span>
          <span class="legend-cell" style="background:var(--glass-border);" title="0 entries"></span>
          <span class="legend-cell" style="background:rgba(0,122,255,0.2);" title="1 entry"></span>
          <span class="legend-cell" style="background:rgba(0,122,255,0.4);" title="2 entries"></span>
          <span class="legend-cell" style="background:rgba(0,122,255,0.6);" title="3 entries"></span>
          <span class="legend-cell" style="background:rgba(0,122,255,0.9);" title="4+ entries"></span>
          <span class="legend-label">More</span>
        </div>
      </div>

      <!-- Entries list -->
      <div id="feed-entries" class="feed-entries">
        <div class="loading-container"><div class="loading-spinner"></div><p>Loading entries...</p></div>
      </div>

      <!-- Load more -->
      <div id="feed-load-more" class="feed-load-more" style="display:none;">
        <button class="btn btn-secondary" id="btn-load-more">Load More</button>
      </div>
    </div>

    <style>
      /* Controls */
      .feed-controls { display: flex; flex-wrap: wrap; gap: var(--space-4); padding: var(--space-4) var(--space-5); margin-bottom: var(--space-5); }
      .feed-control-group { display: flex; flex-direction: column; gap: var(--space-1); min-width: 160px; flex: 1; }
      .feed-control-group label { font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
      .feed-select, .feed-input {
        padding: var(--space-2) var(--space-3); background: var(--glass-bg); border: 1px solid var(--glass-border);
        border-radius: var(--radius-md); color: var(--text-primary); font-size: var(--text-sm); font-family: inherit;
      }
      .feed-select:focus, .feed-input:focus { outline: none; border-color: var(--accent-blue); }

      /* Heatmap */
      .heatmap-section { padding: var(--space-5); margin-bottom: var(--space-5); overflow-x: auto; }
      .heatmap-title { margin-bottom: var(--space-3); font-size: var(--text-base); }
      .heatmap-months { display: flex; gap: 0; margin-bottom: 4px; padding-left: 0; }
      .heatmap-months span { font-size: 10px; color: var(--text-tertiary); text-align: center; }
      .heatmap-grid { display: flex; gap: 3px; min-width: 700px; }
      .heatmap-week { display: flex; flex-direction: column; gap: 3px; }
      .heatmap-cell {
        width: 12px; height: 12px; border-radius: 2px; background: var(--glass-border);
        transition: transform 0.1s; cursor: default;
      }
      .heatmap-cell:hover { transform: scale(1.5); }
      .heatmap-legend { display: flex; align-items: center; gap: 4px; margin-top: var(--space-3); justify-content: flex-end; }
      .legend-label { font-size: 10px; color: var(--text-tertiary); }
      .legend-cell { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }

      /* Entries */
      .feed-entries { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-4); }
      .feed-entry {
        padding: var(--space-5); background: var(--glass-bg); border-radius: var(--radius-lg);
        border: 1px solid var(--glass-border); transition: transform var(--transition-fast);
      }
      .feed-entry:hover { transform: translateY(-2px); }
      .feed-entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2); }
      .feed-entry-date { font-size: var(--text-xs); color: var(--text-tertiary); font-family: var(--font-mono); }
      .feed-entry-mood { font-size: 1.3rem; }
      .feed-entry-title { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-2); }
      .feed-entry-body { display: flex; flex-direction: column; gap: var(--space-2); }
      .feed-entry-field { font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; }
      .feed-entry-field strong { color: var(--accent-blue); font-weight: 500; }
      .feed-entry-tags { display: flex; gap: var(--space-2); margin-top: var(--space-2); flex-wrap: wrap; }
      .feed-tag { font-size: var(--text-xs); padding: 2px 8px; border-radius: 99px; background: rgba(0,122,255,0.1); color: var(--accent-blue); }

      .feed-load-more { text-align: center; padding: var(--space-4); }
      .feed-empty { text-align: center; padding: var(--space-8); color: var(--text-tertiary); }
      .feed-error { text-align: center; padding: var(--space-6); color: var(--accent-red, #FF3B30); }
      .db-badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: 99px; background: rgba(255,149,0,0.15); color: var(--accent-orange, #FF9500); margin-left: var(--space-2); }
    </style>
  `;

    // State
    let currentSource = 'firebase';
    let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
    let allEntries: JournalEntry[] = [];
    let hasMore = false;

    // Event listeners
    document.getElementById('db-source')?.addEventListener('change', (e) => {
        currentSource = (e.target as HTMLSelectElement).value;
        loadEntries(true);
    });

    document.getElementById('mood-filter')?.addEventListener('change', () => filterAndRender());
    document.getElementById('search-text')?.addEventListener('input', () => filterAndRender());

    document.getElementById('btn-load-more')?.addEventListener('click', () => {
        if (currentSource === 'firebase') loadFirebaseMore();
    });

    // Initial load
    loadEntries(true);

    // --- Functions ---

    async function loadEntries(reset: boolean): Promise<void> {
        const entriesEl = document.getElementById('feed-entries');
        if (!entriesEl) return;

        if (reset) {
            lastDoc = null;
            allEntries = [];
            entriesEl.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>Loading...</p></div>';
        }

        try {
            if (currentSource === 'firebase') {
                await loadFromFirebase(reset);
            } else {
                await loadFromWorker(currentSource);
            }
            buildHeatmap();
            filterAndRender();
        } catch (err) {
            entriesEl.innerHTML = `<div class="feed-error">Failed to load from ${currentSource}: ${err instanceof Error ? err.message : 'Unknown error'}</div>`;
        }
    }

    async function loadFromFirebase(reset: boolean): Promise<void> {
        if (reset) {
            // Load all for heatmap, but paginate for display
            allEntries = await getAllJournalEntries();
        }
        const page: JournalPage = await getJournalEntries(20, lastDoc);
        if (reset) {
            // allEntries already loaded above
        } else {
            allEntries = [...allEntries, ...page.entries];
        }
        lastDoc = page.lastDoc;
        hasMore = page.hasMore;
    }

    async function loadFirebaseMore(): Promise<void> {
        const page = await getJournalEntries(20, lastDoc);
        allEntries = [...allEntries, ...page.entries];
        lastDoc = page.lastDoc;
        hasMore = page.hasMore;
        filterAndRender();
    }

    async function loadFromWorker(source: string): Promise<void> {
        const resp = await fetch(`${WORKER_URL}/read?source=${source}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        allEntries = (data.entries || []).map((e: Record<string, unknown>, i: number) => ({
            ...e,
            id: (e.id as string) || `backup-${i}`,
            ts: e.ts ? (typeof e.ts === 'object' && 'seconds' in (e.ts as Record<string, unknown>)
                ? new Timestamp((e.ts as Record<string, number>).seconds, (e.ts as Record<string, number>).nanoseconds || 0)
                : Timestamp.fromDate(new Date(e.ts as string)))
                : Timestamp.now(),
        }));
        hasMore = false;
    }

    function filterAndRender(): void {
        const moodFilter = (document.getElementById('mood-filter') as HTMLSelectElement)?.value || 'all';
        const searchText = (document.getElementById('search-text') as HTMLInputElement)?.value?.toLowerCase().trim() || '';

        let filtered = allEntries;

        if (moodFilter !== 'all') {
            const moodVal = parseInt(moodFilter, 10);
            filtered = filtered.filter((e) => e.m === moodVal);
        }

        if (searchText) {
            filtered = filtered.filter((e) => {
                const combined = [e.t, e.d, e.w, e.g, e.h].filter(Boolean).join(' ').toLowerCase();
                return combined.includes(searchText);
            });
        }

        renderEntries(filtered);
    }

    function renderEntries(entries: JournalEntry[]): void {
        const entriesEl = document.getElementById('feed-entries');
        const loadMoreEl = document.getElementById('feed-load-more');
        if (!entriesEl) return;

        if (entries.length === 0) {
            entriesEl.innerHTML = '<div class="feed-empty">No entries found.</div>';
            if (loadMoreEl) loadMoreEl.style.display = 'none';
            return;
        }

        const srcBadge = currentSource !== 'firebase'
            ? `<span class="db-badge">${DB_SOURCES.find((s) => s.id === currentSource)?.icon || ''} ${currentSource}</span>`
            : '';

        entriesEl.innerHTML = entries.map((entry) => {
            const date = entry.ts instanceof Timestamp ? entry.ts.toDate() : new Date(entry.ts as unknown as string);
            const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const moodInfo = entry.m !== undefined && entry.m !== null ? MOOD_MAP[entry.m] : null;

            const fields: string[] = [];
            if (entry.w) fields.push(`<div class="feed-entry-field"><strong>📋 Will do:</strong> ${entry.w}</div>`);
            if (entry.g) fields.push(`<div class="feed-entry-field"><strong>⚡ Doing:</strong> ${entry.g}</div>`);
            if (entry.h) fields.push(`<div class="feed-entry-field"><strong>✅ Done:</strong> ${entry.h}</div>`);
            if (entry.d) fields.push(`<div class="feed-entry-field">${entry.d}</div>`);

            return `
        <article class="feed-entry">
          <div class="feed-entry-header">
            <span class="feed-entry-date">${dateStr}${srcBadge}</span>
            ${moodInfo ? `<span class="feed-entry-mood" title="${moodInfo.label}">${moodInfo.emoji}</span>` : ''}
          </div>
          ${entry.t ? `<div class="feed-entry-title">${entry.t}</div>` : ''}
          ${fields.length > 0 ? `<div class="feed-entry-body">${fields.join('')}</div>` : ''}
        </article>
      `;
        }).join('');

        if (loadMoreEl) {
            loadMoreEl.style.display = hasMore && currentSource === 'firebase' ? 'block' : 'none';
        }
    }

    function buildHeatmap(): void {
        const grid = document.getElementById('heatmap-grid');
        const monthsEl = document.getElementById('heatmap-months');
        if (!grid) return;

        const stats = computeStats(allEntries);
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364); // 365 days
        // Align to Sunday
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const weeks: string[][] = [];
        let currentWeek: string[] = [];
        const d = new Date(startDate);

        while (d <= today) {
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            currentWeek.push(key);

            if (d.getDay() === 6) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            d.setDate(d.getDate() + 1);
        }
        if (currentWeek.length > 0) weeks.push(currentWeek);

        // Month labels
        if (monthsEl) {
            const months: string[] = [];
            const m = new Date(startDate);
            let lastMonth = -1;
            for (let w = 0; w < weeks.length; w++) {
                const weekDate = new Date(weeks[w][0]);
                if (weekDate.getMonth() !== lastMonth) {
                    lastMonth = weekDate.getMonth();
                    months.push(
                        `<span style="width:${15}px;flex-shrink:0;">${weekDate.toLocaleDateString('en', { month: 'short' })}</span>`,
                    );
                } else {
                    months.push(`<span style="width:15px;flex-shrink:0;"></span>`);
                }
            }
            monthsEl.innerHTML = months.join('');
        }

        grid.innerHTML = weeks
            .map(
                (week) => `
        <div class="heatmap-week">
          ${week
                        .map((dateKey) => {
                            const count = stats.entriesByDate[dateKey] || 0;
                            const isFuture = new Date(dateKey) > today;
                            let bg = 'var(--glass-border)';
                            if (!isFuture && count > 0) {
                                if (count === 1) bg = 'rgba(0,122,255,0.2)';
                                else if (count === 2) bg = 'rgba(0,122,255,0.4)';
                                else if (count === 3) bg = 'rgba(0,122,255,0.6)';
                                else bg = 'rgba(0,122,255,0.9)';
                            }
                            return `<div class="heatmap-cell" style="background:${bg};" title="${dateKey}: ${count} entries"></div>`;
                        })
                        .join('')}
        </div>
      `,
            )
            .join('');
    }
}
