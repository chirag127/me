/**
 * Project Me - Purchase Analytics Page
 * Deep-dive analytics with yearly/monthly trends, top purchases, category & platform breakdowns
 */

import {
    PURCHASES,
    getTotalSpent,
    getSpendingByCategory,
    getSpendingByPlatform,
    getSpendingByMonth,
    getSpendingByYearMap,
    getDeliveredPurchases,
    getAverageOrderValue,
    getTopPurchases,
    getPurchaseYears,
    getItemCountByMonth,
    type Purchase
} from '../../data';
import { formatNumber } from '../../services/utility';
import {
    Chart, DoughnutController, BarController, LineController,
    ArcElement, BarElement, LineElement, PointElement,
    CategoryScale, LinearScale, Tooltip, Legend, Filler
} from 'chart.js';

Chart.register(
    DoughnutController, BarController, LineController,
    ArcElement, BarElement, LineElement, PointElement,
    CategoryScale, LinearScale, Tooltip, Legend, Filler
);

const CATEGORY_COLORS: Record<string, string> = {
    electronics: '#6c5ce7', clothing: '#00b894', food: '#fdcb6e',
    accessories: '#e17055', home: '#0984e3', books: '#d63031', other: '#636e72',
};

const PLATFORM_COLORS: Record<string, string> = {
    flipkart: '#f7dc6f', amazon: '#ff9900', deodap: '#2ecc71', other: '#636e72',
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default async function PurchaseAnalytics(container: HTMLElement): Promise<void> {
    const deliveredCount = getDeliveredPurchases().length;
    const totalSpent = getTotalSpent();
    const avgOrder = getAverageOrderValue();
    const spendingByCategory = getSpendingByCategory();
    const spendingByPlatform = getSpendingByPlatform();
    const yearlySpending = getSpendingByYearMap();
    const years = getPurchaseYears();
    const top10 = getTopPurchases(10);
    const currentYear = new Date().getFullYear();

    // Category item counts
    const categoryItemCounts: Record<string, number> = {};
    PURCHASES.filter(p => p.status === 'delivered').forEach(p => {
        categoryItemCounts[p.category] = (categoryItemCounts[p.category] || 0) + 1;
    });

    // Platform item counts
    const platformItemCounts: Record<string, number> = {};
    PURCHASES.filter(p => p.status === 'delivered').forEach(p => {
        platformItemCounts[p.platform] = (platformItemCounts[p.platform] || 0) + 1;
    });

    container.innerHTML = `
    <div class="page animate-fade-in analytics-page">
      <header class="page-header">
        <h1 class="page-title">Purchase Analytics</h1>
        <p class="page-subtitle">Deep dive into ${deliveredCount} purchases across ${years.length} years</p>
      </header>

      <!-- Summary Insights -->
      <div class="insights-row">
        <div class="insight-card glass-panel">
          <span class="insight-icon">💰</span>
          <div class="insight-content">
            <span class="insight-value">₹${formatNumber(totalSpent)}</span>
            <span class="insight-label">Lifetime Spending</span>
          </div>
        </div>
        <div class="insight-card glass-panel">
          <span class="insight-icon">📊</span>
          <div class="insight-content">
            <span class="insight-value">₹${formatNumber(avgOrder)}</span>
            <span class="insight-label">Average Order</span>
          </div>
        </div>
        <div class="insight-card glass-panel">
          <span class="insight-icon">📦</span>
          <div class="insight-content">
            <span class="insight-value">${deliveredCount}</span>
            <span class="insight-label">Total Orders</span>
          </div>
        </div>
        <div class="insight-card glass-panel">
          <span class="insight-icon">📅</span>
          <div class="insight-content">
            <span class="insight-value">${years.length}</span>
            <span class="insight-label">Years Shopping</span>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="analytics-grid">
        <!-- Row 1: Year-over-Year + Monthly -->
        <div class="chart-panel glass-panel">
          <h3>📊 Yearly Spending Comparison</h3>
          <div class="chart-wrap chart-wrap-bar"><canvas id="yearly-bar"></canvas></div>
        </div>
        <div class="chart-panel glass-panel">
          <h3>📈 Monthly Trend
            <select id="month-year-select" class="inline-select">
              ${years.map(y => `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`).join('')}
            </select>
          </h3>
          <div class="chart-wrap chart-wrap-line"><canvas id="monthly-line"></canvas></div>
        </div>

        <!-- Row 2: Category + Platform donuts -->
        <div class="chart-panel glass-panel">
          <h3>📂 Category Breakdown</h3>
          <div class="chart-wrap chart-wrap-donut"><canvas id="cat-donut"></canvas></div>
          <div class="breakdown-list" id="cat-breakdown">
            ${Object.entries(spendingByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, amount]) => `
                <div class="breakdown-item">
                  <span class="breakdown-dot" style="background:${CATEGORY_COLORS[cat] || '#636e72'}"></span>
                  <span class="breakdown-name">${cat}</span>
                  <span class="breakdown-count">${categoryItemCounts[cat] || 0} items</span>
                  <span class="breakdown-amount">₹${formatNumber(amount)}</span>
                </div>
              `).join('')}
          </div>
        </div>
        <div class="chart-panel glass-panel">
          <h3>🏪 Platform Breakdown</h3>
          <div class="chart-wrap chart-wrap-donut"><canvas id="plat-donut"></canvas></div>
          <div class="breakdown-list">
            ${Object.entries(spendingByPlatform)
            .sort(([, a], [, b]) => b - a)
            .map(([plat, amount]) => `
                <div class="breakdown-item">
                  <span class="breakdown-dot" style="background:${PLATFORM_COLORS[plat] || '#636e72'}"></span>
                  <span class="breakdown-name">${plat}</span>
                  <span class="breakdown-count">${platformItemCounts[plat] || 0} items</span>
                  <span class="breakdown-amount">₹${formatNumber(amount)}</span>
                </div>
              `).join('')}
          </div>
        </div>

        <!-- Row 3: Purchase Frequency -->
        <div class="chart-panel glass-panel chart-full">
          <h3>📦 Purchase Frequency (Items Per Month,
            <select id="freq-year-select" class="inline-select">
              ${years.map(y => `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`).join('')}
            </select>)
          </h3>
          <div class="chart-wrap chart-wrap-bar"><canvas id="freq-bar"></canvas></div>
        </div>
      </div>

      <!-- Top 10 Purchases -->
      <div class="top-purchases glass-panel">
        <h3>🏆 Top 10 Most Expensive Purchases</h3>
        <div class="top-list">
          ${top10.map((p, i) => `
            <div class="top-item">
              <span class="top-rank">${i + 1}</span>
              <div class="top-info">
                <span class="top-name" title="${p.name}">${p.name}</span>
                <span class="top-meta">${new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · <span class="platform-tag ${p.platform}">${p.platform}</span></span>
              </div>
              <span class="top-price">₹${formatNumber(p.price + (p.deliveryFee || 0))}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Back link -->
      <div class="back-link">
        <a href="#/me/purchases" class="back-btn">← Back to Purchases</a>
      </div>
    </div>

    <style>
      .analytics-page { max-width: 1200px; margin: 0 auto; }

      .insights-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      @media (max-width: 700px) { .insights-row { grid-template-columns: repeat(2, 1fr); } }

      .insight-card {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
      }

      .insight-icon { font-size: var(--text-2xl); }
      .insight-content { display: flex; flex-direction: column; }
      .insight-value { font-size: var(--text-lg); font-weight: 700; font-family: var(--font-mono); background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .insight-label { font-size: var(--text-xs); color: var(--text-secondary); }

      .analytics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      @media (max-width: 800px) { .analytics-grid { grid-template-columns: 1fr; } }

      .chart-panel { padding: var(--space-4); }
      .chart-panel h3 { margin-bottom: var(--space-3); font-size: var(--text-sm); display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
      .chart-full { grid-column: 1 / -1; }

      .chart-wrap { position: relative; }
      .chart-wrap-bar, .chart-wrap-line { height: 220px; }
      .chart-wrap-donut { max-height: 220px; display: flex; justify-content: center; margin-bottom: var(--space-3); }

      .inline-select {
        padding: 2px 8px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
        color: var(--text-primary);
        font-size: var(--text-xs);
        cursor: pointer;
      }

      .breakdown-list { display: flex; flex-direction: column; gap: var(--space-1); }
      .breakdown-item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-xs); }
      .breakdown-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .breakdown-name { text-transform: capitalize; font-weight: 600; flex: 1; }
      .breakdown-count { color: var(--text-secondary); }
      .breakdown-amount { font-family: var(--font-mono); font-weight: 600; }

      .top-purchases { padding: var(--space-4); margin-bottom: var(--space-4); }
      .top-purchases h3 { margin-bottom: var(--space-4); font-size: var(--text-sm); }
      .top-list { display: flex; flex-direction: column; gap: var(--space-2); }

      .top-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-md);
        transition: background 0.15s;
      }

      .top-item:hover { background: var(--glass-bg); }

      .top-rank {
        width: 28px; height: 28px;
        display: flex; align-items: center; justify-content: center;
        background: var(--glass-bg);
        border-radius: 50%;
        font-weight: 700;
        font-size: var(--text-xs);
        color: var(--text-secondary);
        flex-shrink: 0;
      }

      .top-item:nth-child(1) .top-rank { background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; }
      .top-item:nth-child(2) .top-rank { background: linear-gradient(135deg, #C0C0C0, #A0A0A0); color: #000; }
      .top-item:nth-child(3) .top-rank { background: linear-gradient(135deg, #CD7F32, #A0522D); color: #fff; }

      .top-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .top-name { font-weight: 500; font-size: var(--text-sm); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .top-meta { font-size: var(--text-xs); color: var(--text-secondary); }

      .platform-tag { font-weight: 700; text-transform: uppercase; }
      .platform-tag.flipkart { color: #f7dc6f; }
      .platform-tag.amazon { color: #ff9900; }
      .platform-tag.deodap { color: #2ecc71; }

      .top-price { font-family: var(--font-mono); font-weight: 700; font-size: var(--text-sm); color: var(--accent-green); white-space: nowrap; }

      .back-link { text-align: center; padding: var(--space-4); }
      .back-btn { color: var(--accent-blue); text-decoration: none; font-weight: 600; font-size: var(--text-sm); }
      .back-btn:hover { text-decoration: underline; }
    </style>
  `;

    // --- Charts ---
    // Yearly bar
    const sortedYears = Object.keys(yearlySpending).map(Number).sort((a, b) => a - b);
    new Chart(document.getElementById('yearly-bar') as HTMLCanvasElement, {
        type: 'bar',
        data: {
            labels: sortedYears.map(String),
            datasets: [{
                label: 'Yearly Spending',
                data: sortedYears.map(y => yearlySpending[y]),
                backgroundColor: sortedYears.map((_, i) => {
                    const colors = ['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#0984e3', '#d63031'];
                    return colors[i % colors.length];
                }),
                borderWidth: 0,
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => `₹${formatNumber(ctx.parsed.y ?? 0)}` } },
            },
            scales: {
                x: { ticks: { color: '#888' }, grid: { display: false } },
                y: { ticks: { color: '#888', callback: (v) => `₹${formatNumber(Number(v))}` }, grid: { color: 'rgba(255,255,255,0.05)' } },
            }
        }
    });

    // Monthly line chart (with year selector)
    function renderMonthlyLine(year: number) {
        const canvas = document.getElementById('monthly-line') as HTMLCanvasElement;
        const existing = Chart.getChart(canvas);
        if (existing) existing.destroy();

        const monthlyData = getSpendingByMonth(year);

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: monthNames,
                datasets: [{
                    label: `Spending (${year})`,
                    data: Object.values(monthlyData),
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6c5ce7',
                    pointBorderWidth: 0,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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

    renderMonthlyLine(currentYear);
    document.getElementById('month-year-select')!.addEventListener('change', (e) => {
        renderMonthlyLine(parseInt((e.target as HTMLSelectElement).value));
    });

    // Category donut
    const catLabels = Object.keys(spendingByCategory);
    new Chart(document.getElementById('cat-donut') as HTMLCanvasElement, {
        type: 'doughnut',
        data: {
            labels: catLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
            datasets: [{ data: catLabels.map(k => spendingByCategory[k]), backgroundColor: catLabels.map(k => CATEGORY_COLORS[k] || '#636e72'), borderWidth: 0, hoverOffset: 8 }]
        },
        options: {
            responsive: true, maintainAspectRatio: true, cutout: '55%',
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${formatNumber(ctx.parsed)}` } },
            }
        }
    });

    // Platform donut
    const platLabels = Object.keys(spendingByPlatform);
    new Chart(document.getElementById('plat-donut') as HTMLCanvasElement, {
        type: 'doughnut',
        data: {
            labels: platLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
            datasets: [{ data: platLabels.map(k => spendingByPlatform[k]), backgroundColor: platLabels.map(k => PLATFORM_COLORS[k] || '#636e72'), borderWidth: 0, hoverOffset: 8 }]
        },
        options: {
            responsive: true, maintainAspectRatio: true, cutout: '55%',
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${formatNumber(ctx.parsed)}` } },
            }
        }
    });

    // Frequency bar chart (with year selector)
    function renderFreqBar(year: number) {
        const canvas = document.getElementById('freq-bar') as HTMLCanvasElement;
        const existing = Chart.getChart(canvas);
        if (existing) existing.destroy();

        const countData = getItemCountByMonth(year);

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: monthNames,
                datasets: [{
                    label: `Orders (${year})`,
                    data: Object.values(countData),
                    backgroundColor: 'rgba(0, 184, 148, 0.6)',
                    borderColor: '#00b894',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y} items` } },
                },
                scales: {
                    x: { ticks: { color: '#888', font: { size: 10 } }, grid: { display: false } },
                    y: {
                        ticks: { color: '#888', font: { size: 10 }, stepSize: 1 },
                        grid: { color: 'rgba(255,255,255,0.05)' },
                    },
                }
            }
        });
    }

    renderFreqBar(currentYear);
    document.getElementById('freq-year-select')!.addEventListener('change', (e) => {
        renderFreqBar(parseInt((e.target as HTMLSelectElement).value));
    });
}
