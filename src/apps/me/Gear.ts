/**
 * Project Me - Gear Page
 * Tech stack, setup, & equipment with analytics derived from purchases
 */

import { GEAR, getCurrentGear, getGearHistory, getTotalGearValue, type GearCategory } from '../../data';
import { formatNumber } from '../../services/utility';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const CATEGORY_COLORS: Record<string, string> = {
  'Computers': '#6c5ce7',
  'Mobile Devices': '#e17055',
  'Audio': '#00cec9',
  'Peripherals': '#fdcb6e',
  'Networking': '#0984e3',
  'Storage': '#d63031',
  'Power & Charging': '#00b894',
  'Home Entertainment': '#e84393',
  'Home Appliances': '#636e72',
  'Development': '#a29bfe',
  'Services': '#55efc4',
};

const PLATFORM_COLORS: Record<string, string> = {
  flipkart: '#f7dc6f',
  amazon: '#ff9900',
  deodap: '#2ecc71',
  other: '#636e72',
};

export default async function Gear(container: HTMLElement): Promise<void> {
  const currentGear = getCurrentGear();
  const retiredGear = getGearHistory();
  const totalValue = getTotalGearValue();
  const allItems = GEAR.flatMap(cat => cat.items);

  // Investment by category
  const investmentByCategory: Record<string, number> = {};
  GEAR.forEach(cat => {
    const total = cat.items.reduce((sum, item) => sum + (item.price || 0), 0);
    if (total > 0) investmentByCategory[cat.name] = total;
  });

  // Investment by platform
  const investmentByPlatform: Record<string, number> = {};
  allItems.filter(i => i.price && i.platform).forEach(item => {
    const plat = item.platform!;
    investmentByPlatform[plat] = (investmentByPlatform[plat] || 0) + (item.price || 0);
  });

  container.innerHTML = `
    <div class="page animate-fade-in gear-page">
      <header class="page-header">
        <h1 class="page-title">Gear & Setup</h1>
        <p class="page-subtitle">My tech stack, tools, and services</p>
      </header>

      <!-- Stats -->
      <div class="gear-stats-row">
        <div class="gear-stat glass-panel">
          <span class="gear-stat-icon">💰</span>
          <span class="gear-stat-value">₹${formatNumber(totalValue)}</span>
          <span class="gear-stat-label">Active Investment</span>
        </div>
        <div class="gear-stat glass-panel">
          <span class="gear-stat-icon">✅</span>
          <span class="gear-stat-value">${currentGear.length}</span>
          <span class="gear-stat-label">Active Items</span>
        </div>
        <div class="gear-stat glass-panel">
          <span class="gear-stat-icon">📦</span>
          <span class="gear-stat-value">${retiredGear.length}</span>
          <span class="gear-stat-label">Retired</span>
        </div>
        <div class="gear-stat glass-panel">
          <span class="gear-stat-icon">📂</span>
          <span class="gear-stat-value">${GEAR.length}</span>
          <span class="gear-stat-label">Categories</span>
        </div>
      </div>

      <!-- Charts -->
      <div class="gear-charts-row">
        <div class="gear-chart-card glass-panel">
          <h3>📊 Investment by Category</h3>
          <div class="gear-chart-container"><canvas id="gear-cat-donut"></canvas></div>
        </div>
        <div class="gear-chart-card glass-panel">
          <h3>🏪 Investment by Platform</h3>
          <div class="gear-chart-container"><canvas id="gear-plat-donut"></canvas></div>
        </div>
      </div>

      <!-- Gear Categories -->
      <div class="gear-toggle-bar glass-panel">
        <button class="gear-toggle active" data-view="current">✅ Current Gear</button>
        <button class="gear-toggle" data-view="retired">📦 Retired</button>
        <button class="gear-toggle" data-view="all">🔲 All</button>
      </div>

      <div class="gear-categories" id="gear-categories">
        ${GEAR.map(cat => renderCategory(cat, 'current')).join('')}
      </div>

      <!-- Link to purchases -->
      <div class="gear-link glass-panel">
        <a href="#/me/purchases" class="gear-link-btn">🛒 View All Purchases →</a>
      </div>
    </div>

    <style>
      .gear-page { max-width: 1200px; margin: 0 auto; }

      .gear-stats-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      @media (max-width: 700px) { .gear-stats-row { grid-template-columns: repeat(2, 1fr); } }

      .gear-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--space-4);
        gap: var(--space-1);
        text-align: center;
      }

      .gear-stat-icon { font-size: var(--text-2xl); }
      .gear-stat-value { font-size: var(--text-xl); font-weight: 700; font-family: var(--font-mono); background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .gear-stat-label { font-size: var(--text-xs); color: var(--text-secondary); }

      .gear-charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      @media (max-width: 700px) { .gear-charts-row { grid-template-columns: 1fr; } }

      .gear-chart-card { padding: var(--space-4); }
      .gear-chart-card h3 { margin-bottom: var(--space-3); font-size: var(--text-sm); }
      .gear-chart-container { position: relative; max-height: 250px; display: flex; justify-content: center; }

      .gear-toggle-bar {
        display: flex;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-4);
        margin-bottom: var(--space-4);
      }

      .gear-toggle {
        padding: var(--space-2) var(--space-4);
        border: 1px solid var(--glass-border);
        background: transparent;
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--text-xs);
        font-weight: 600;
        transition: all 0.2s;
      }

      .gear-toggle:hover { background: var(--glass-bg); color: var(--text-primary); }
      .gear-toggle.active { background: var(--accent-blue); color: #fff; border-color: var(--accent-blue); }

      .gear-category {
        margin-bottom: var(--space-4);
      }

      .gear-category-header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-3);
        font-size: var(--text-md);
        font-weight: 700;
      }

      .gear-items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-3);
      }

      .gear-item-card {
        padding: var(--space-4);
        border-radius: var(--radius-lg);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .gear-item-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }

      .gear-item-card.retired { opacity: 0.6; }

      .gear-item-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-2);
      }

      .gear-item-icon { font-size: var(--text-xl); }

      .gear-platform-badge {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: var(--radius-sm);
      }

      .gear-platform-badge.flipkart { background: rgba(247, 220, 111, 0.2); color: #f7dc6f; }
      .gear-platform-badge.amazon { background: rgba(255, 153, 0, 0.2); color: #ff9900; }
      .gear-platform-badge.deodap { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }

      .gear-item-name { font-weight: 600; font-size: var(--text-sm); margin-bottom: 2px; }
      .gear-item-brand { font-size: var(--text-xs); color: var(--text-secondary); }
      .gear-item-model { font-size: var(--text-xs); color: var(--accent-blue); font-weight: 500; }
      .gear-item-specs { font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-1); }

      .gear-item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--space-2);
        padding-top: var(--space-2);
        border-top: 1px solid var(--glass-border);
      }

      .gear-item-price { font-family: var(--font-mono); font-weight: 700; font-size: var(--text-xs); color: var(--accent-green); }
      .gear-item-date { font-size: 10px; color: var(--text-secondary); }

      .gear-retired-badge {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        background: rgba(231, 76, 60, 0.2);
        color: #e74c3c;
      }

      .gear-link { text-align: center; padding: var(--space-4); }
      .gear-link-btn { color: var(--accent-blue); text-decoration: none; font-weight: 600; font-size: var(--text-sm); }
      .gear-link-btn:hover { text-decoration: underline; }
    </style>
  `;

  // Charts
  const catLabels = Object.keys(investmentByCategory);
  const catColors = catLabels.map(k => CATEGORY_COLORS[k] || '#636e72');
  new Chart(document.getElementById('gear-cat-donut') as HTMLCanvasElement, {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [{ data: catLabels.map(k => investmentByCategory[k]), backgroundColor: catColors, borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '55%',
      plugins: {
        legend: { position: 'right', labels: { color: '#ccc', font: { size: 10 }, padding: 10 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${formatNumber(ctx.parsed)}` } },
      }
    }
  });

  const platLabels = Object.keys(investmentByPlatform);
  const platColors = platLabels.map(k => PLATFORM_COLORS[k] || '#636e72');
  new Chart(document.getElementById('gear-plat-donut') as HTMLCanvasElement, {
    type: 'doughnut',
    data: {
      labels: platLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      datasets: [{ data: platLabels.map(k => investmentByPlatform[k]), backgroundColor: platColors, borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '55%',
      plugins: {
        legend: { position: 'right', labels: { color: '#ccc', font: { size: 10 }, padding: 10 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${formatNumber(ctx.parsed)}` } },
      }
    }
  });

  // Toggle view
  const toggleBar = container.querySelector('.gear-toggle-bar')!;
  const categoriesEl = document.getElementById('gear-categories')!;

  toggleBar.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.gear-toggle') as HTMLElement;
    if (!btn) return;
    toggleBar.querySelectorAll('.gear-toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view as 'current' | 'retired' | 'all';
    categoriesEl.innerHTML = GEAR.map(cat => renderCategory(cat, view)).join('');
  });
}

function renderCategory(cat: GearCategory, view: 'current' | 'retired' | 'all'): string {
  let items = cat.items;
  if (view === 'current') items = items.filter(i => i.current);
  else if (view === 'retired') items = items.filter(i => !i.current);

  if (items.length === 0) return '';

  return `
    <div class="gear-category">
      <div class="gear-category-header">${cat.icon} ${cat.name} <span style="font-size:var(--text-xs);font-weight:400;color:var(--text-secondary)">(${items.length})</span></div>
      <div class="gear-items-grid">
        ${items.map(item => `
          <div class="gear-item-card${item.current ? '' : ' retired'}">
            <div class="gear-item-top">
              <span class="gear-item-icon">${item.icon}</span>
              <div style="display:flex;gap:4px;align-items:center;">
                ${item.platform ? `<span class="gear-platform-badge ${item.platform}">${item.platform}</span>` : ''}
                ${!item.current ? '<span class="gear-retired-badge">Retired</span>' : ''}
              </div>
            </div>
            <div class="gear-item-name">${item.name}</div>
            ${item.brand ? `<div class="gear-item-brand">${item.brand}</div>` : ''}
            ${item.model ? `<div class="gear-item-model">${item.model}</div>` : ''}
            ${item.specs ? `<div class="gear-item-specs">${item.specs}</div>` : ''}
            <div class="gear-item-footer">
              ${item.price ? `<span class="gear-item-price">₹${formatNumber(item.price)}</span>` : '<span></span>'}
              <span class="gear-item-date">
                ${item.acquiredDate ? new Date(item.acquiredDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                ${item.retiredDate ? ` → ${new Date(item.retiredDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : ''}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
