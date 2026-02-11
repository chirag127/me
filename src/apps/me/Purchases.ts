/**
 * Project Me - Purchases Page
 * Full shopping history with Chart.js analytics, filters, and search.
 * ALL stats and charts dynamically recalculate based on active filters.
 */

import {
  PURCHASES,
  getPurchaseYears,
  type Purchase
} from '../../data';
import { formatNumber } from '../../services/utility';
import { Chart, DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Color palettes
const CATEGORY_COLORS: Record<string, string> = {
  electronics: '#6c5ce7', clothing: '#00b894', food: '#fdcb6e',
  accessories: '#e17055', home: '#0984e3', books: '#d63031', other: '#636e72',
};

const PLATFORM_COLORS: Record<string, string> = {
  flipkart: '#f7dc6f', amazon: '#ff9900', deodap: '#2ecc71', other: '#636e72',
};

const categoryIcons: Record<string, string> = {
  electronics: '📱', clothing: '👕', food: '🍫',
  accessories: '🎒', home: '🏠', books: '📚', other: '📦'
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ITEMS_PER_PAGE = 25;

// --- Dynamic computation helpers (operate on any subset of purchases) ---
function computeTotalSpent(purchases: Purchase[]): number {
  return purchases
    .filter(p => p.status === 'delivered')
    .reduce((sum, p) => sum + p.price + (p.deliveryFee || 0), 0);
}

function computeDeliveredCount(purchases: Purchase[]): number {
  return purchases.filter(p => p.status === 'delivered').length;
}

function computeAvgOrder(purchases: Purchase[]): number {
  const delivered = purchases.filter(p => p.status === 'delivered');
  if (delivered.length === 0) return 0;
  const total = delivered.reduce((sum, p) => sum + p.price + (p.deliveryFee || 0), 0);
  return Math.round(total / delivered.length);
}

function computeSpendingByCategory(purchases: Purchase[]): Record<string, number> {
  const spending: Record<string, number> = {};
  purchases.filter(p => p.status === 'delivered').forEach(p => {
    spending[p.category] = (spending[p.category] || 0) + p.price + (p.deliveryFee || 0);
  });
  return spending;
}

function computeSpendingByPlatform(purchases: Purchase[]): Record<string, number> {
  const spending: Record<string, number> = {};
  purchases.filter(p => p.status === 'delivered').forEach(p => {
    spending[p.platform] = (spending[p.platform] || 0) + p.price + (p.deliveryFee || 0);
  });
  return spending;
}

function computeMonthlySpending(purchases: Purchase[], year: number): number[] {
  const spending = Array(12).fill(0);
  purchases
    .filter(p => p.status === 'delivered' && p.date.startsWith(String(year)))
    .forEach(p => {
      const month = parseInt(p.date.substring(5, 7)) - 1;
      spending[month] += p.price + (p.deliveryFee || 0);
    });
  return spending;
}

export default async function Purchases(container: HTMLElement): Promise<void> {
  const currentYear = new Date().getFullYear();
  const years = getPurchaseYears();
  const platformCount = new Set(PURCHASES.map(p => p.platform)).size;

  // Sorted all purchases (newest first)
  const allPurchases = [...PURCHASES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  container.innerHTML = `
    <div class="page animate-fade-in purchases-page">
      <header class="page-header">
        <h1 class="page-title">Purchases</h1>
        <p class="page-subtitle">Complete shopping history & analytics across ${platformCount} platforms</p>
      </header>

      <!-- Stats Cards (dynamic, updated on filter change) -->
      <div class="stats-row">
        <div class="stat-card glass-panel">
          <span class="stat-icon">💰</span>
          <span class="stat-value" id="stat-total-spent">—</span>
          <span class="stat-label">Total Spent</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-icon">📦</span>
          <span class="stat-value" id="stat-delivered">—</span>
          <span class="stat-label">Items Delivered</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-icon">📊</span>
          <span class="stat-value" id="stat-avg-order">—</span>
          <span class="stat-label">Avg Order</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-icon">📅</span>
          <span class="stat-value" id="stat-this-year">—</span>
          <span class="stat-label">${currentYear}</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-icon">📅</span>
          <span class="stat-value" id="stat-last-year">—</span>
          <span class="stat-label">${currentYear - 1}</span>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <div class="chart-card glass-panel">
          <h3>📂 Spending by Category</h3>
          <div class="chart-container">
            <canvas id="category-donut"></canvas>
          </div>
        </div>
        <div class="chart-card glass-panel">
          <h3>🏪 Spending by Platform</h3>
          <div class="chart-container">
            <canvas id="platform-donut"></canvas>
          </div>
        </div>
        <div class="chart-card glass-panel chart-wide">
          <h3 id="monthly-chart-title">📈 Monthly Spending (${currentYear})</h3>
          <div class="chart-container chart-container-bar">
            <canvas id="monthly-bar"></canvas>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filters-bar glass-panel">
        <div class="filter-group">
          <label>Platform</label>
          <div class="filter-tabs" id="platform-tabs">
            <button class="filter-tab active" data-platform="all">All</button>
            <button class="filter-tab" data-platform="flipkart">Flipkart</button>
            <button class="filter-tab" data-platform="amazon">Amazon</button>
            <button class="filter-tab" data-platform="deodap">Deodap</button>
          </div>
        </div>
        <div class="filter-group">
          <label>Category</label>
          <select id="category-filter" class="filter-select">
            <option value="all">All Categories</option>
            ${Object.keys(categoryIcons).map(cat => `<option value="${cat}">${categoryIcons[cat]} ${cat}</option>`).join('')}
          </select>
        </div>
        <div class="filter-group">
          <label>Year</label>
          <select id="year-filter" class="filter-select">
            <option value="all">All Years</option>
            ${years.map(y => `<option value="${y}">${y}</option>`).join('')}
          </select>
        </div>
        <div class="filter-group filter-search">
          <label>Search</label>
          <input type="text" id="search-input" class="filter-input" placeholder="Search products..." />
        </div>
        <div class="filter-group">
          <span id="result-count" class="result-count">—</span>
        </div>
      </div>

      <!-- Purchase List -->
      <div class="purchases-table-wrapper glass-panel">
        <table class="purchases-table" id="purchases-table">
          <thead>
            <tr>
              <th></th>
              <th class="sortable" data-sort="name">Name</th>
              <th class="sortable" data-sort="category">Category</th>
              <th class="sortable" data-sort="price">Price</th>
              <th class="sortable" data-sort="date">Date</th>
              <th>Platform</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="purchases-tbody">
          </tbody>
        </table>
        <div class="pagination" id="pagination"></div>
      </div>

      <!-- Analytics Link -->
      <div class="analytics-link glass-panel">
        <a href="#/me/purchase-analytics" class="analytics-btn">
          📊 View Detailed Analytics →
        </a>
      </div>
    </div>

    <style>
      .purchases-page { max-width: 1200px; margin: 0 auto; }

      .stats-row {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      @media (max-width: 900px) { .stats-row { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 500px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }

      .stat-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--space-4);
        gap: var(--space-1);
        text-align: center;
      }

      .stat-icon { font-size: var(--text-2xl); }

      .stat-value {
        font-size: var(--text-xl);
        font-weight: 700;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label { font-size: var(--text-xs); color: var(--text-secondary); }

      .charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .chart-card { padding: var(--space-4); }
      .chart-card h3 { margin-bottom: var(--space-3); font-size: var(--text-sm); }
      .chart-wide { grid-column: 1 / -1; }

      .chart-container { position: relative; max-height: 260px; display: flex; justify-content: center; }
      .chart-container-bar { max-height: 200px; }

      @media (max-width: 700px) { .charts-row { grid-template-columns: 1fr; } }

      .filters-bar {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-4);
        align-items: flex-end;
        padding: var(--space-4);
        margin-bottom: var(--space-4);
      }

      .filter-group { display: flex; flex-direction: column; gap: var(--space-1); }
      .filter-group label { font-size: var(--text-xs); color: var(--text-secondary); text-transform: uppercase; font-weight: 600; }

      .filter-tabs { display: flex; gap: var(--space-1); }

      .filter-tab {
        padding: var(--space-1) var(--space-3);
        border: 1px solid var(--glass-border);
        background: transparent;
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--text-xs);
        font-weight: 600;
        transition: all 0.2s;
      }

      .filter-tab:hover { background: var(--glass-bg); color: var(--text-primary); }
      .filter-tab.active { background: var(--accent-blue); color: #fff; border-color: var(--accent-blue); }

      .filter-select {
        padding: var(--space-2) var(--space-3);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: var(--text-xs);
      }

      .filter-input {
        padding: var(--space-2) var(--space-3);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: var(--text-xs);
        min-width: 180px;
      }

      .filter-search { flex: 1; min-width: 150px; }

      .result-count {
        font-size: var(--text-xs);
        color: var(--text-secondary);
        font-family: var(--font-mono);
        padding: var(--space-2) 0;
      }

      .purchases-table-wrapper { overflow-x: auto; padding: 0; }

      .purchases-table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--text-sm);
      }

      .purchases-table thead th {
        padding: var(--space-3) var(--space-3);
        text-align: left;
        font-size: var(--text-xs);
        color: var(--text-secondary);
        text-transform: uppercase;
        border-bottom: 1px solid var(--glass-border);
        position: sticky;
        top: 0;
        background: var(--bg-primary);
        z-index: 1;
      }

      .purchases-table th.sortable { cursor: pointer; user-select: none; }
      .purchases-table th.sortable:hover { color: var(--text-primary); }

      .purchases-table tbody tr {
        border-bottom: 1px solid var(--glass-border);
        transition: background 0.15s;
      }

      .purchases-table tbody tr:hover { background: var(--glass-bg); }

      .purchases-table td {
        padding: var(--space-2) var(--space-3);
        vertical-align: middle;
      }

      .product-name {
        max-width: 280px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        font-weight: 500;
      }

      .price-cell {
        font-family: var(--font-mono);
        font-weight: 600;
        white-space: nowrap;
      }

      .delivery-fee {
        font-size: var(--text-xs);
        color: var(--text-secondary);
      }

      .date-cell {
        font-size: var(--text-xs);
        color: var(--text-secondary);
        white-space: nowrap;
      }

      .category-badge {
        font-size: var(--text-xs);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        background: var(--glass-bg);
        text-transform: capitalize;
        white-space: nowrap;
      }

      .platform-badge {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 8px;
        border-radius: var(--radius-sm);
      }

      .platform-badge.flipkart { background: rgba(247, 220, 111, 0.2); color: #f7dc6f; }
      .platform-badge.amazon { background: rgba(255, 153, 0, 0.2); color: #ff9900; }
      .platform-badge.deodap { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }

      .status-badge {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 8px;
        border-radius: var(--radius-sm);
      }

      .status-badge.delivered { color: var(--accent-green); }
      .status-badge.refunded { color: var(--accent-orange); }
      .status-badge.cancelled { color: var(--accent-red); }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-4);
      }

      .page-btn {
        padding: var(--space-1) var(--space-3);
        border: 1px solid var(--glass-border);
        background: transparent;
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--text-xs);
        transition: all 0.2s;
      }

      .page-btn:hover { background: var(--glass-bg); color: var(--text-primary); }
      .page-btn.active { background: var(--accent-blue); color: #fff; border-color: var(--accent-blue); }
      .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

      .analytics-link {
        text-align: center;
        padding: var(--space-4);
        margin-top: var(--space-4);
      }

      .analytics-btn {
        display: inline-block;
        padding: var(--space-3) var(--space-6);
        background: var(--gradient-primary);
        color: #fff;
        border-radius: var(--radius-lg);
        text-decoration: none;
        font-weight: 600;
        font-size: var(--text-sm);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .analytics-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(108, 92, 231, 0.4); }

      @media (max-width: 600px) {
        .filters-bar { flex-direction: column; align-items: stretch; }
        .filter-tabs { flex-wrap: wrap; }
        .product-name { max-width: 150px; }
      }
    </style>
  `;

  // --- Chart instances (kept as references for dynamic updates) ---
  let categoryChart: Chart | null = null;
  let platformChart: Chart | null = null;
  let monthlyChart: Chart | null = null;

  // --- State ---
  let currentPage = 1;
  let currentPlatform = 'all';
  let currentCategory = 'all';
  let currentYearFilter = 'all';
  let searchQuery = '';
  let sortKey = 'date';
  let sortDir: 'asc' | 'desc' = 'desc';

  /** Get the currently filtered purchase list (before sorting) */
  function getFilteredPurchases(): Purchase[] {
    let filtered = [...allPurchases];
    if (currentPlatform !== 'all') filtered = filtered.filter(p => p.platform === currentPlatform);
    if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
    if (currentYearFilter !== 'all') filtered = filtered.filter(p => p.date.startsWith(currentYearFilter));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    // Sort
    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortKey === 'price') cmp = (a.price + (a.deliveryFee || 0)) - (b.price + (b.deliveryFee || 0));
      else if (sortKey === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return filtered;
  }

  /** Update ALL stat cards from the filtered data */
  function updateStats(filtered: Purchase[]) {
    const totalSpent = computeTotalSpent(filtered);
    const deliveredCount = computeDeliveredCount(filtered);
    const avgOrder = computeAvgOrder(filtered);

    // Yearly stats (from filtered dataset)
    const thisYearItems = filtered.filter(p => p.date.startsWith(String(currentYear)));
    const lastYearItems = filtered.filter(p => p.date.startsWith(String(currentYear - 1)));
    const thisYearSpent = computeTotalSpent(thisYearItems);
    const lastYearSpent = computeTotalSpent(lastYearItems);

    document.getElementById('stat-total-spent')!.textContent = `₹${formatNumber(totalSpent)}`;
    document.getElementById('stat-delivered')!.textContent = String(deliveredCount);
    document.getElementById('stat-avg-order')!.textContent = `₹${formatNumber(avgOrder)}`;
    document.getElementById('stat-this-year')!.textContent = `₹${formatNumber(thisYearSpent)}`;
    document.getElementById('stat-last-year')!.textContent = `₹${formatNumber(lastYearSpent)}`;
  }

  /** Rebuild or update the category donut chart */
  function updateCategoryChart(filtered: Purchase[]) {
    const spending = computeSpendingByCategory(filtered);
    const labels = Object.keys(spending);
    const data = labels.map(k => spending[k]);
    const colors = labels.map(k => CATEGORY_COLORS[k] || '#636e72');

    if (categoryChart) {
      categoryChart.data.labels = labels.map(l => l.charAt(0).toUpperCase() + l.slice(1));
      categoryChart.data.datasets[0].data = data;
      categoryChart.data.datasets[0].backgroundColor = colors;
      categoryChart.update();
    } else {
      categoryChart = new Chart(document.getElementById('category-donut') as HTMLCanvasElement, {
        type: 'doughnut',
        data: {
          labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
          datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }]
        },
        options: {
          responsive: true, maintainAspectRatio: true, cutout: '55%',
          plugins: {
            legend: { position: 'right', labels: { color: '#ccc', font: { size: 11 }, padding: 12 } },
            tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${formatNumber(ctx.parsed)}` } },
          },
        }
      });
    }
  }

  /** Rebuild or update the platform donut chart */
  function updatePlatformChart(filtered: Purchase[]) {
    const spending = computeSpendingByPlatform(filtered);
    const labels = Object.keys(spending);
    const data = labels.map(k => spending[k]);
    const colors = labels.map(k => PLATFORM_COLORS[k] || '#636e72');

    if (platformChart) {
      platformChart.data.labels = labels.map(l => l.charAt(0).toUpperCase() + l.slice(1));
      platformChart.data.datasets[0].data = data;
      platformChart.data.datasets[0].backgroundColor = colors;
      platformChart.update();
    } else {
      platformChart = new Chart(document.getElementById('platform-donut') as HTMLCanvasElement, {
        type: 'doughnut',
        data: {
          labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
          datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }]
        },
        options: {
          responsive: true, maintainAspectRatio: true, cutout: '55%',
          plugins: {
            legend: { position: 'right', labels: { color: '#ccc', font: { size: 11 }, padding: 12 } },
            tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${formatNumber(ctx.parsed)}` } },
          },
        }
      });
    }
  }

  /** Rebuild or update the monthly bar chart */
  function updateMonthlyChart(filtered: Purchase[]) {
    // Determine which year to show for the bar chart
    const yearForChart = currentYearFilter !== 'all' ? parseInt(currentYearFilter) : currentYear;
    document.getElementById('monthly-chart-title')!.textContent = `📈 Monthly Spending (${yearForChart})`;

    const data = computeMonthlySpending(filtered, yearForChart);

    if (monthlyChart) {
      monthlyChart.data.datasets[0].data = data;
      monthlyChart.data.datasets[0].label = `Spending (${yearForChart})`;
      monthlyChart.update();
    } else {
      monthlyChart = new Chart(document.getElementById('monthly-bar') as HTMLCanvasElement, {
        type: 'bar',
        data: {
          labels: monthNames,
          datasets: [{
            label: `Spending (${yearForChart})`,
            data,
            backgroundColor: 'rgba(108, 92, 231, 0.6)',
            borderColor: '#6c5ce7',
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `₹${formatNumber(ctx.parsed.y ?? 0)}` } },
          },
          scales: {
            x: { ticks: { color: '#888', font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: '#888', font: { size: 10 }, callback: (v) => `₹${formatNumber(Number(v))}` }, grid: { color: 'rgba(255,255,255,0.05)' } },
          }
        }
      });
    }
  }

  /** Main render: updates stats, charts, and table from current filters */
  function renderAll() {
    const filtered = getFilteredPurchases();

    // 1) Update stat cards dynamically
    updateStats(filtered);

    // 2) Update charts dynamically
    updateCategoryChart(filtered);
    updatePlatformChart(filtered);
    updateMonthlyChart(filtered);

    // 3) Table rendering
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

    const tbody = document.getElementById('purchases-tbody')!;
    tbody.innerHTML = pageItems.map(p => `
      <tr>
        <td>${categoryIcons[p.category] || '📦'}</td>
        <td><span class="product-name" title="${p.name}">${p.name}</span></td>
        <td><span class="category-badge">${p.category}</span></td>
        <td class="price-cell">₹${formatNumber(p.price)}${p.deliveryFee ? `<span class="delivery-fee"> +₹${p.deliveryFee}</span>` : ''}</td>
        <td class="date-cell">${new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        <td><span class="platform-badge ${p.platform}">${p.platform}</span></td>
        <td><span class="status-badge ${p.status}">${p.status}</span></td>
      </tr>
    `).join('');

    // Result count
    document.getElementById('result-count')!.textContent = `${filtered.length} items`;

    // Pagination
    const pagination = document.getElementById('pagination')!;
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }
    let paginationHtml = `<button class="page-btn" data-page="prev" ${currentPage <= 1 ? 'disabled' : ''}>← Prev</button>`;
    const maxBtns = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxBtns / 2));
    let endPage = Math.min(totalPages, startPage + maxBtns - 1);
    if (endPage - startPage < maxBtns - 1) startPage = Math.max(1, endPage - maxBtns + 1);
    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<button class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }
    paginationHtml += `<button class="page-btn" data-page="next" ${currentPage >= totalPages ? 'disabled' : ''}>Next →</button>`;
    pagination.innerHTML = paginationHtml;
  }

  // --- Event listeners ---
  document.getElementById('platform-tabs')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.filter-tab') as HTMLElement;
    if (!btn) return;
    document.querySelectorAll('#platform-tabs .filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPlatform = btn.dataset.platform || 'all';
    currentPage = 1;
    renderAll();
  });

  document.getElementById('category-filter')!.addEventListener('change', (e) => {
    currentCategory = (e.target as HTMLSelectElement).value;
    currentPage = 1;
    renderAll();
  });

  document.getElementById('year-filter')!.addEventListener('change', (e) => {
    currentYearFilter = (e.target as HTMLSelectElement).value;
    currentPage = 1;
    renderAll();
  });

  document.getElementById('search-input')!.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    currentPage = 1;
    renderAll();
  });

  // Sorting
  document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = (th as HTMLElement).dataset.sort!;
      if (sortKey === key) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey = key;
        sortDir = key === 'date' || key === 'price' ? 'desc' : 'asc';
      }
      renderAll();
    });
  });

  // Pagination clicks
  document.getElementById('pagination')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.page-btn') as HTMLElement;
    if (!btn || btn.hasAttribute('disabled')) return;
    const page = btn.dataset.page;
    if (page === 'prev') currentPage--;
    else if (page === 'next') currentPage++;
    else currentPage = parseInt(page!);
    renderAll();
  });

  // Initial render — all data, no filters
  renderAll();
}
