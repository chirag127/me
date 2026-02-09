/**
 * Project Me - Purchases Page
 * Shopping history with analytics
 */

import {
  PURCHASES,
  getRecentPurchases,
  getTotalSpent,
  getSpendingByCategory,
  getPurchasesByYear,
  type Purchase
} from '../../data';
import { formatNumber } from '../../services/utility';

export default async function Purchases(container: HTMLElement): Promise<void> {
  const recentPurchases = getRecentPurchases(15);
  const totalSpent = getTotalSpent();
  const spendingByCategory = getSpendingByCategory();
  const currentYear = new Date().getFullYear();
  const thisYearSpent = getTotalSpent(currentYear);
  const lastYearSpent = getTotalSpent(currentYear - 1);

  // Category icons
  const categoryIcons: Record<string, string> = {
    electronics: '📱',
    clothing: '👕',
    food: '🍫',
    accessories: '🎒',
    home: '🏠',
    books: '📚',
    other: '📦'
  };

  // Status colors
  const statusColors: Record<string, string> = {
    delivered: 'var(--accent-green)',
    refunded: 'var(--accent-orange)',
    cancelled: 'var(--accent-red)',
    exchanged: 'var(--accent-blue)',
    replaced: 'var(--accent-purple)'
  };

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Purchases</h1>
        <p class="page-subtitle">Shopping history & analytics</p>
      </header>

      <div class="bento-grid">
        <!-- Stats Overview -->
        <div class="bento-item span-2">
          <h3>📊 Spending Overview</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <span class="value">₹${formatNumber(totalSpent)}</span>
              <span class="label">Total Spent</span>
            </div>
            <div class="stat-box">
              <span class="value">₹${formatNumber(thisYearSpent)}</span>
              <span class="label">${currentYear}</span>
            </div>
            <div class="stat-box">
              <span class="value">₹${formatNumber(lastYearSpent)}</span>
              <span class="label">${currentYear - 1}</span>
            </div>
            <div class="stat-box">
              <span class="value">${PURCHASES.filter(p => p.status === 'delivered').length}</span>
              <span class="label">Items Delivered</span>
            </div>
          </div>
        </div>

        <!-- By Category -->
        <div class="bento-item">
          <h3>📂 By Category</h3>
          <div class="category-breakdown">
            ${Object.entries(spendingByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => `
                <div class="category-row">
                  <span class="category-name">${categoryIcons[cat] || '📦'} ${cat}</span>
                  <span class="category-amount">₹${formatNumber(amount)}</span>
                </div>
              `).join('')}
          </div>
        </div>

        <!-- Recent Purchases -->
        <div class="bento-item span-2">
          <h3>🛒 Recent Purchases</h3>
          <div class="purchases-list">
            ${recentPurchases.map(p => `
              <div class="purchase-card">
                <div class="purchase-icon">${categoryIcons[p.category] || '📦'}</div>
                <div class="purchase-info">
                  <span class="purchase-name" title="${p.name}">${p.name}</span>
                  <span class="purchase-meta">
                    ${p.color ? `${p.color}` : ''}
                    ${p.size ? ` • Size ${p.size}` : ''}
                    • ${new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div class="purchase-price">
                  <span class="price-value">₹${p.price}</span>
                  ${p.deliveryFee ? `<span class="delivery-fee">+₹${p.deliveryFee}</span>` : ''}
                </div>
                <span class="purchase-status" style="color: ${statusColors[p.status]}">${p.status}</span>
                <span class="purchase-platform ${p.platform}">${p.platform}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <style>
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
        margin-top: var(--space-4);
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .stat-box {
        text-align: center;
        padding: var(--space-4);
        background: var(--glass-bg);
        border-radius: var(--radius-lg);
      }

      .stat-box .value {
        font-size: var(--text-2xl);
        font-weight: 700;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: block;
      }

      .stat-box .label {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .category-breakdown {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-top: var(--space-4);
      }

      .category-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-2) var(--space-3);
        background: var(--glass-bg);
        border-radius: var(--radius-md);
      }

      .category-name {
        font-size: var(--text-sm);
        text-transform: capitalize;
      }

      .category-amount {
        font-family: var(--font-mono);
        color: var(--accent-green);
        font-weight: 600;
      }

      .purchases-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-top: var(--space-4);
        max-height: 500px;
        overflow-y: auto;
      }

      .purchase-card {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: var(--space-3);
        align-items: center;
        padding: var(--space-3);
        background: var(--glass-bg);
        border-radius: var(--radius-md);
        border: 1px solid var(--glass-border);
      }

      .purchase-icon {
        font-size: var(--text-xl);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--glass-bg);
        border-radius: var(--radius-md);
      }

      .purchase-info {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .purchase-name {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 300px;
      }

      .purchase-meta {
        font-size: var(--text-xs);
        color: var(--text-secondary);
      }

      .purchase-price {
        text-align: right;
      }

      .price-value {
        font-family: var(--font-mono);
        font-weight: 600;
        color: var(--text-primary);
      }

      .delivery-fee {
        display: block;
        font-size: var(--text-xs);
        color: var(--text-secondary);
      }

      .purchase-status {
        font-size: var(--text-xs);
        font-weight: 600;
        text-transform: uppercase;
        padding: var(--space-1) var(--space-2);
        background: var(--glass-bg);
        border-radius: var(--radius-sm);
      }

      .purchase-platform {
        font-size: var(--text-xs);
        font-weight: 600;
        text-transform: uppercase;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
      }

      .purchase-platform.flipkart {
        background: rgba(247, 220, 111, 0.2);
        color: #f7dc6f;
      }

      .purchase-platform.amazon {
        background: rgba(255, 153, 0, 0.2);
        color: #ff9900;
      }

      @media (max-width: 600px) {
        .purchase-card {
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
        }
        .purchase-price, .purchase-status {
          grid-column: 2;
          justify-self: start;
        }
      }
    </style>
  `;
}
