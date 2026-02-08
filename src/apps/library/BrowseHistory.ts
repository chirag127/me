/**
 * LifeloggerHistory - Browse History from LifeLogger
 * Real data from Google Sheets Apps Script
 */

import { CONFIG } from '../../config';

interface HistoryEntry {
  timestamp: string;
  url: string;
  title: string;
  type?: string;
  query?: string;
  engine?: string;
  screenshot_url?: string;
}

interface StatsData {
  totalPages: number;
  totalSearches: number;
  topDomains: { name: string; count: number }[];
}

// Get API URL from config or localStorage
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycby1Bvb7jjn6GYlL-ESEMjEi2yiU0R0B30yuUmxz_WKYLDlaFYX4EGObFvLFnwf3m44BtA/exec';

export default async function LifeloggerHistory(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🌐 Browse History</h1>
        <p class="page-subtitle">My digital footprint tracked by LifeLogger</p>
      </header>

      <div class="stats-bar" id="stats-bar">
        <div class="loading-state small">Loading public stats...</div>
      </div>

      <div class="tabs-section">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="stats">Public Stats</button>
          <button class="tab" data-tab="history">Full History 🔒</button>
          <button class="tab" data-tab="searches">Searches 🔒</button>
        </div>
      </div>

      <div class="content-area" id="content-area">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    </div>

    <style>
      .stats-bar {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
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
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .tabs-section { margin-bottom: var(--space-6); }

      .tabs {
        display: flex;
        gap: var(--space-1);
        background: rgba(255, 255, 255, 0.03);
        padding: var(--space-1);
        border-radius: var(--radius-lg);
        width: fit-content;
      }

      .tab {
        padding: var(--space-2) var(--space-4);
        background: transparent;
        border: none;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .tab:hover { color: var(--text-primary); }
      .tab.active {
        background: rgba(59, 130, 246, 0.2);
        color: var(--text-primary);
      }

      .domains-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-3);
      }

      .domain-card {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        transition: all 0.2s;
      }

      .domain-card:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(59, 130, 246, 0.3);
      }

      .domain-rank {
        font-size: var(--text-lg);
        font-weight: 700;
        color: var(--text-tertiary);
        width: 32px;
      }

      .domain-favicon {
        width: 24px;
        height: 24px;
        border-radius: var(--radius-sm);
      }

      .domain-info { flex: 1; }

      .domain-name {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .domain-visits {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .history-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .history-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3) var(--space-4);
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: var(--radius-lg);
        text-decoration: none;
        color: inherit;
        transition: all 0.2s;
      }

      .history-item:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(59, 130, 246, 0.3);
      }

      .history-time {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        width: 60px;
      }

      .history-favicon {
        width: 20px;
        height: 20px;
        border-radius: var(--radius-sm);
      }

      .history-info { flex: 1; min-width: 0; }

      .history-title {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .history-url {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .search-badge {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 500;
      }

      .auth-notice {
        text-align: center;
        padding: var(--space-8);
        background: rgba(255, 255, 255, 0.02);
        border: 1px dashed rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-xl);
        color: var(--text-tertiary);
      }

      .auth-notice-icon { font-size: 48px; margin-bottom: var(--space-4); }

      .loading-state {
        text-align: center;
        padding: var(--space-12);
        color: var(--text-tertiary);
      }

      .loading-state.small { padding: var(--space-4); grid-column: 1 / -1; }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .stats-bar { grid-template-columns: repeat(2, 1fr); }
      }
    </style>
  `;

  let currentTab = 'stats';
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab')!;
      loadContent(currentTab);
    });
  });

  await Promise.all([loadStats(), loadContent('stats')]);
}

async function loadStats(): Promise<void> {
  const container = document.getElementById('stats-bar');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}?action=stats`);
    const stats: StatsData = await res.json();

    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${formatNumber(stats.totalPages || 0)}</div>
        <div class="stat-label">Pages Visited</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${formatNumber(stats.totalSearches || 0)}</div>
        <div class="stat-label">Searches</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.topDomains?.length || 0}</div>
        <div class="stat-label">Unique Domains</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">🌐</div>
        <div class="stat-label">LifeLogger</div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="stat-item" style="grid-column: 1 / -1;">
        <div class="stat-value">--</div>
        <div class="stat-label">Stats unavailable</div>
      </div>
    `;
  }
}

async function loadContent(tab: string): Promise<void> {
  const container = document.getElementById('content-area');
  if (!container) return;

  if (tab === 'stats') {
    await loadTopDomains(container);
  } else if (tab === 'history' || tab === 'searches') {
    container.innerHTML = `
      <div class="auth-notice">
        <div class="auth-notice-icon">🔒</div>
        <h3>Protected Content</h3>
        <p>Full history is only visible to authorized users.</p>
        <p style="margin-top: var(--space-2); font-size: var(--text-sm);">
          This data is tracked by the LifeLogger Chrome extension.
        </p>
      </div>
    `;
  }
}

async function loadTopDomains(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading top domains...</p>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE_URL}?action=stats`);
    const stats: StatsData = await res.json();
    const domains = stats.topDomains || [];

    if (domains.length === 0) {
      container.innerHTML = '<div class="auth-notice"><p>No domain data available yet.</p></div>';
      return;
    }

    container.innerHTML = `
      <h3 style="margin-bottom: var(--space-4);">🏆 Top Domains</h3>
      <div class="domains-grid">
        ${domains.slice(0, 20).map((domain, i) => `
          <div class="domain-card">
            <div class="domain-rank">${i + 1}</div>
            <img class="domain-favicon" src="https://www.google.com/s2/favicons?sz=64&domain=${domain.name}" alt="" onerror="this.src='https://via.placeholder.com/24?text=🌐'">
            <div class="domain-info">
              <div class="domain-name">${domain.name}</div>
              <div class="domain-visits">${formatNumber(domain.count)} visits</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<div class="auth-notice"><p>Failed to load domains. API may not be configured.</p></div>';
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
