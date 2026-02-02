/**
 * Project Me - Code Stats Page
 */

import { getAggregateCodingStats } from '../../services/coding';
import { formatNumber } from '../../services/utility';

export default async function Stats(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Coding Stats</h1>
        <p class="page-subtitle">The quantified coder</p>
      </header>

      <div class="bento-grid" id="stats-container">
        <div class="bento-item span-2">
          <h3>📊 Overview</h3>
          <div class="stats-grid" id="stats-grid">Loading...</div>
        </div>

        <div class="bento-item">
          <h3>🔥 Activity</h3>
          <img src="https://github-readme-streak-stats.herokuapp.com/?user=chirag127&theme=dark&hide_border=true" alt="Streak" class="streak-embed">
        </div>

        <div class="bento-item">
          <h3>📈 GitHub Stats</h3>
          <img src="https://github-readme-stats.vercel.app/api?username=chirag127&show_icons=true&theme=dark&hide_border=true" alt="GitHub Stats" class="streak-embed">
        </div>
      </div>
    </div>

    <style>
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-4);
        margin-top: var(--space-4);
      }

      .stat-box {
        text-align: center;
        padding: var(--space-4);
        background: var(--glass-bg);
        border-radius: var(--radius-lg);
      }

      .stat-box .value {
        font-size: var(--text-3xl);
        font-weight: 700;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-box .label {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .streak-embed {
        width: 100%;
        max-height: 200px;
        object-fit: contain;
        border-radius: var(--radius-md);
      }
    </style>
  `;

  loadStats();
}

async function loadStats(): Promise<void> {
  const grid = document.getElementById('stats-grid');
  if (!grid) return;

  try {
    const stats = await getAggregateCodingStats();
    grid.innerHTML = `
      <div class="stat-box">
        <span class="value">${formatNumber(stats.github.repos)}</span>
        <span class="label">Repositories</span>
      </div>
      <div class="stat-box">
        <span class="value">${formatNumber(stats.github.stars)}</span>
        <span class="label">Stars</span>
      </div>
      <div class="stat-box">
        <span class="value">${formatNumber(stats.leetcode.solved)}</span>
        <span class="label">LeetCode</span>
      </div>
    `;
  } catch {
    grid.innerHTML = '<p class="muted">Failed to load stats</p>';
  }
}
