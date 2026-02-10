/**
 * Project Me - LeetCode Page
 */

import { getLeetCodeStats } from '../../services/coding';

export default async function LeetCode(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">LeetCode — Problem Solving</h1>
        <p class="page-subtitle">Algorithmic prowess demonstrated through competitive programming</p>
      </header>

      <div class="leetcode-stats glass-panel" id="leetcode-stats">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading stats...</p>
        </div>
      </div>
    </div>

    <style>
      .leetcode-stats {
        padding: var(--space-8);
      }

      .lc-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-6);
      }

      .lc-stat {
        text-align: center;
        padding: var(--space-4);
        background: var(--glass-bg);
        border-radius: var(--radius-lg);
      }

      .lc-stat .value {
        font-size: var(--text-4xl);
        font-weight: 700;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .lc-stat .label {
        color: var(--text-secondary);
      }

      .lc-stat.easy { border-left: 4px solid var(--accent-green); }
      .lc-stat.medium { border-left: 4px solid var(--accent-orange); }
      .lc-stat.hard { border-left: 4px solid var(--accent-red); }
    </style>
  `;

  loadStats();
}

async function loadStats(): Promise<void> {
  const container = document.getElementById('leetcode-stats');
  if (!container) return;

  try {
    const stats = await getLeetCodeStats();
    container.innerHTML = `
      <div class="lc-grid">
        <div class="lc-stat">
          <span class="value">${stats.totalSolved}</span>
          <span class="label">Total Solved</span>
        </div>
        <div class="lc-stat easy">
          <span class="value">${stats.easySolved}</span>
          <span class="label">Easy (${stats.totalEasy})</span>
        </div>
        <div class="lc-stat medium">
          <span class="value">${stats.mediumSolved}</span>
          <span class="label">Medium (${stats.totalMedium})</span>
        </div>
        <div class="lc-stat hard">
          <span class="value">${stats.hardSolved}</span>
          <span class="label">Hard (${stats.totalHard})</span>
        </div>
        <div class="lc-stat">
          <span class="value">${stats.acceptanceRate.toFixed(1)}%</span>
          <span class="label">Acceptance Rate</span>
        </div>
        <div class="lc-stat">
          <span class="value">#${stats.ranking.toLocaleString()}</span>
          <span class="label">Global Ranking</span>
        </div>
      </div>
    `;
  } catch {
    container.innerHTML = '<p class="muted">Failed to load LeetCode stats</p>';
  }
}
