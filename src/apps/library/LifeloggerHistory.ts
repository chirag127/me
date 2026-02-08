/**
 * Browse History Page - Displays full browsing history
 * Auth-gated: Requires Google login or password
 * Liquid Glass 2026 Design
 */

interface BrowseEntry {
  id: string;
  url: string;
  title: string;
  timestamp: string;
  type: 'browse' | 'search' | 'video';
  screenshot_url?: string;
}

// API URL - Set after deploying Apps Script
const API_BASE_URL = '';

export default async function BrowseHistory(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🌐 Browse History</h1>
        <p class="page-subtitle">Your complete digital footprint</p>
      </header>

      <!-- Auth Gate -->
      <div class="auth-gate glass" id="auth-gate">
        <div class="auth-content">
          <span class="auth-icon">🔐</span>
          <h2>Protected Content</h2>
          <p>Sign in to view your browse history</p>

          <div class="auth-options">
            <button class="btn btn-primary" id="google-auth-btn">
              Sign in with Google
            </button>

            <div class="auth-divider">
              <span>or</span>
            </div>

            <div class="password-form">
              <input type="password" id="password-input" placeholder="Enter password" class="input-glass">
              <button class="btn btn-secondary" id="password-btn">Unlock</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section (Public) -->
      <div class="browse-stats" id="browse-stats">
        <div class="stat-card glass">
          <span class="stat-value" id="total-pages">--</span>
          <span class="stat-label">Pages Visited</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="today-pages">--</span>
          <span class="stat-label">Today</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="unique-domains">--</span>
          <span class="stat-label">Domains</span>
        </div>
        <div class="stat-card glass">
          <span class="stat-value" id="avg-daily">--</span>
          <span class="stat-label">Avg/Day</span>
        </div>
      </div>

      <!-- Top Domains (Public) -->
      <div class="top-domains glass" id="top-domains">
        <h3>🏆 Top Domains</h3>
        <div class="domains-grid" id="domains-grid">
          <div class="loading-state">Loading...</div>
        </div>
      </div>

      <!-- History List (Protected) -->
      <div class="history-section" id="history-section" style="display: none;">
        <div class="history-controls">
          <div class="search-box glass">
            <span class="search-icon">🔍</span>
            <input type="text" id="history-search" placeholder="Search history...">
          </div>
          <div class="filter-buttons">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="browse">Pages</button>
            <button class="filter-btn" data-filter="search">Searches</button>
            <button class="filter-btn" data-filter="video">Videos</button>
          </div>
        </div>

        <div class="history-list" id="history-list">
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading history...</p>
          </div>
        </div>

        <button class="btn btn-ghost load-more" id="load-more">Load More</button>
      </div>
    </div>

    <style>
      .auth-gate.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-2xl);
        padding: var(--space-8);
        text-align: center;
        margin-bottom: var(--space-6);
      }

      .auth-gate.authenticated {
        display: none;
      }

      .auth-icon {
        font-size: 48px;
        display: block;
        margin-bottom: var(--space-4);
      }

      .auth-content h2 {
        margin-bottom: var(--space-2);
      }

      .auth-content p {
        color: var(--text-secondary);
        margin-bottom: var(--space-6);
      }

      .auth-options {
        max-width: 300px;
        margin: 0 auto;
      }

      .btn-primary {
        width: 100%;
        padding: var(--space-4);
        background: linear-gradient(135deg, #4285F4, #6366f1);
        border: none;
        border-radius: var(--radius-lg);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(66, 133, 244, 0.3);
      }

      .auth-divider {
        display: flex;
        align-items: center;
        margin: var(--space-4) 0;
        color: var(--text-tertiary);
      }

      .auth-divider::before,
      .auth-divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--border);
      }

      .auth-divider span {
        padding: 0 var(--space-3);
        font-size: var(--text-sm);
      }

      .password-form {
        display: flex;
        gap: var(--space-2);
      }

      .input-glass {
        flex: 1;
        padding: var(--space-3) var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        font-size: var(--text-sm);
        outline: none;
      }

      .input-glass:focus {
        border-color: rgba(99, 102, 241, 0.5);
      }

      .btn-secondary {
        padding: var(--space-3) var(--space-4);
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.12);
      }

      .browse-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .stat-card.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-5);
        text-align: center;
        transition: all 0.3s ease;
      }

      .stat-card.glass:hover {
        transform: translateY(-4px);
        border-color: rgba(99, 102, 241, 0.3);
      }

      .stat-card .stat-value {
        display: block;
        font-size: var(--text-3xl);
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .stat-card .stat-label {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .top-domains.glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        padding: var(--space-6);
        margin-bottom: var(--space-6);
      }

      .top-domains h3 {
        margin-bottom: var(--space-4);
      }

      .domains-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: var(--space-3);
      }

      .domain-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3);
        background: rgba(255, 255, 255, 0.03);
        border-radius: var(--radius-lg);
        transition: all 0.2s;
      }

      .domain-item:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .domain-favicon {
        width: 20px;
        height: 20px;
        border-radius: 4px;
      }

      .domain-info {
        flex: 1;
        min-width: 0;
      }

      .domain-name {
        font-size: var(--text-sm);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .domain-count {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .history-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
        flex-wrap: wrap;
      }

      .search-box.glass {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        padding: var(--space-3) var(--space-4);
        flex: 1;
        max-width: 400px;
      }

      .search-box input {
        flex: 1;
        background: none;
        border: none;
        color: var(--text-primary);
        outline: none;
      }

      .filter-buttons {
        display: flex;
        gap: var(--space-2);
      }

      .filter-btn {
        padding: var(--space-2) var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-lg);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all 0.2s;
      }

      .filter-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .filter-btn.active {
        background: rgba(99, 102, 241, 0.2);
        border-color: rgba(99, 102, 241, 0.4);
        color: var(--text-primary);
      }

      .history-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .history-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-xl);
        transition: all 0.2s;
      }

      .history-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(99, 102, 241, 0.2);
      }

      .history-type {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(99, 102, 241, 0.1);
        border-radius: var(--radius-lg);
        font-size: 18px;
      }

      .history-type.search {
        background: rgba(251, 191, 36, 0.1);
      }

      .history-type.video {
        background: rgba(236, 72, 153, 0.1);
      }

      .history-content {
        flex: 1;
        min-width: 0;
      }

      .history-title {
        font-size: var(--text-sm);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: var(--space-1);
      }

      .history-url {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .history-time {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        white-space: nowrap;
      }

      .load-more {
        width: 100%;
        margin-top: var(--space-4);
      }

      .loading-state {
        text-align: center;
        padding: var(--space-8);
        color: var(--text-tertiary);
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-3);
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @media (max-width: 768px) {
        .browse-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .history-controls {
          flex-direction: column;
          align-items: stretch;
        }

        .search-box.glass {
          max-width: none;
        }

        .filter-buttons {
          overflow-x: auto;
        }
      }
    </style>
  `;

  // Load public stats
  await loadPublicStats();

  // Setup auth handlers
  setupAuth();
}

async function loadPublicStats(): Promise<void> {
  // Demo stats - replace with API call
  const stats = {
    totalPages: 12547,
    todayPages: 89,
    uniqueDomains: 234,
    avgDaily: 142,
    topDomains: [
      { name: 'github.com', count: 1523 },
      { name: 'google.com', count: 987 },
      { name: 'stackoverflow.com', count: 654 },
      { name: 'youtube.com', count: 543 },
      { name: 'twitter.com', count: 321 },
      { name: 'reddit.com', count: 234 }
    ]
  };

  // Update stat cards
  const totalPages = document.getElementById('total-pages');
  const todayPages = document.getElementById('today-pages');
  const uniqueDomains = document.getElementById('unique-domains');
  const avgDaily = document.getElementById('avg-daily');

  if (totalPages) totalPages.textContent = stats.totalPages.toLocaleString();
  if (todayPages) todayPages.textContent = stats.todayPages.toString();
  if (uniqueDomains) uniqueDomains.textContent = stats.uniqueDomains.toString();
  if (avgDaily) avgDaily.textContent = stats.avgDaily.toString();

  // Render top domains
  const domainsGrid = document.getElementById('domains-grid');
  if (domainsGrid) {
    domainsGrid.innerHTML = stats.topDomains.map(d => `
      <div class="domain-item">
        <img class="domain-favicon" src="https://www.google.com/s2/favicons?domain=${d.name}&sz=32" alt="">
        <div class="domain-info">
          <div class="domain-name">${d.name}</div>
          <div class="domain-count">${d.count.toLocaleString()} visits</div>
        </div>
      </div>
    `).join('');
  }
}

function setupAuth(): void {
  const googleBtn = document.getElementById('google-auth-btn');
  const passwordBtn = document.getElementById('password-btn');
  const passwordInput = document.getElementById('password-input') as HTMLInputElement;

  googleBtn?.addEventListener('click', async () => {
    // In production, use OAuth flow
    alert('Google Auth would trigger here');
    // After auth, show history section
    showProtectedContent();
  });

  passwordBtn?.addEventListener('click', async () => {
    const password = passwordInput?.value;
    if (password) {
      // Verify password via API
      // For demo, accept any password
      showProtectedContent();
    }
  });
}

function showProtectedContent(): void {
  document.getElementById('auth-gate')?.classList.add('authenticated');
  const historySection = document.getElementById('history-section');
  if (historySection) {
    historySection.style.display = 'block';
    loadHistory();
  }
}

async function loadHistory(): Promise<void> {
  const historyList = document.getElementById('history-list');
  if (!historyList) return;

  // Demo data
  const entries: BrowseEntry[] = [
    { id: '1', url: 'https://github.com/chirag127/me', title: 'chirag127/me - GitHub', timestamp: '2024-06-15T14:30:00Z', type: 'browse' },
    { id: '2', url: 'https://google.com/search?q=typescript+tips', title: 'typescript tips - Google Search', timestamp: '2024-06-15T14:25:00Z', type: 'search' },
    { id: '3', url: 'https://stackoverflow.com/questions/12345', title: 'How to use async/await - Stack Overflow', timestamp: '2024-06-15T14:20:00Z', type: 'browse' },
  ];

  historyList.innerHTML = entries.map(entry => `
    <div class="history-item" data-type="${entry.type}">
      <div class="history-type ${entry.type}">
        ${entry.type === 'search' ? '🔍' : entry.type === 'video' ? '🎬' : '🌐'}
      </div>
      <div class="history-content">
        <div class="history-title">${entry.title}</div>
        <div class="history-url">${entry.url}</div>
      </div>
      <div class="history-time">${formatTime(entry.timestamp)}</div>
    </div>
  `).join('');

  // Setup filtering
  setupFilters();
}

function setupFilters(): void {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const items = document.querySelectorAll('.history-item');
      items.forEach(item => {
        const type = item.getAttribute('data-type');
        (item as HTMLElement).style.display =
          filter === 'all' || filter === type ? '' : 'none';
      });
    });
  });
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}
