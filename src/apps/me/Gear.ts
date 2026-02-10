/**
 * Project Me - Gear Page
 * Hardware and software from actual purchase history
 */

import { GEAR, getTotalGearValue, type GearCategory } from '../../data';
import { formatNumber } from '../../services/utility';

export default async function Gear(container: HTMLElement): Promise<void> {
  const totalValue = getTotalGearValue();

  // Render a gear category section
  const renderCategory = (category: GearCategory) => `
    <section class="section">
      <h2 class="section-title">${category.icon} ${category.name}</h2>
      <div class="gear-grid">
        ${category.items.filter(item => item.current).map(item => `
          <div class="gear-item glass-panel">
            <span class="gear-icon">${item.icon}</span>
            <div class="gear-info">
              <span class="gear-category">${item.brand || ''} ${item.model || item.name}</span>
              <span class="gear-name">${item.specs || ''}</span>
              ${item.price ? `<span class="gear-price">₹${formatNumber(item.price)}</span>` : ''}
              ${item.acquiredDate ? `<span class="gear-date">${new Date(item.acquiredDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>` : ''}
            </div>
            ${item.platform ? `<span class="gear-platform ${item.platform}">${item.platform}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Engineering Setup</h1>
        <p class="page-subtitle">Tools, hardware, and development environment I use daily</p>
      </header>

      <div class="gear-stats glass-panel">
        <div class="stat">
          <span class="stat-value">₹${formatNumber(totalValue)}</span>
          <span class="stat-label">Total Gear Value</span>
        </div>
        <div class="stat">
          <span class="stat-value">${GEAR.length}</span>
          <span class="stat-label">Categories</span>
        </div>
        <div class="stat">
          <span class="stat-value">${GEAR.flatMap(c => c.items).filter(i => i.current).length}</span>
          <span class="stat-label">Active Items</span>
        </div>
      </div>

      ${GEAR.map(category => renderCategory(category)).join('')}
    </div>

    <style>
      .gear-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-4);
        padding: var(--space-6);
        margin-bottom: var(--space-8);
        text-align: center;
      }

      .stat-value {
        font-size: var(--text-2xl);
        font-weight: 700;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: block;
      }

      .stat-label {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .gear-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .gear-item {
        display: flex;
        align-items: flex-start;
        gap: var(--space-4);
        padding: var(--space-4);
        position: relative;
      }

      .gear-icon {
        font-size: var(--text-3xl);
        flex-shrink: 0;
      }

      .gear-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        flex: 1;
      }

      .gear-category {
        font-weight: 600;
        color: var(--text-primary);
      }

      .gear-name {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .gear-price {
        font-size: var(--text-sm);
        font-family: var(--font-mono);
        color: var(--accent-green);
        font-weight: 600;
      }

      .gear-date {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .gear-platform {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        font-size: var(--text-xs);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        text-transform: uppercase;
        font-weight: 600;
      }

      .gear-platform.flipkart {
        background: rgba(247, 220, 111, 0.2);
        color: #f7dc6f;
      }

      .gear-platform.amazon {
        background: rgba(255, 153, 0, 0.2);
        color: #ff9900;
      }

      @media (max-width: 768px) {
        .gear-stats {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
}
