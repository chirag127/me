/**
 * Project Me - Reputation Page (StackOverflow, etc.)
 */

import { getCodeWarsUser } from '../../services/coding';
import CONFIG from '../../config';

export default async function Reputation(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Developer Reputation</h1>
        <p class="page-subtitle">Community recognition across StackOverflow, CodeWars, and developer platforms</p>
      </header>

      <div class="bento-grid">
        <div class="bento-item" id="codewars-stats">
          <h3>🥋 CodeWars</h3>
          <div class="loading-spinner small"></div>
        </div>

        <div class="bento-item">
          <h3>📚 Stack Overflow</h3>
          <a href="https://stackoverflow.com/users/${CONFIG.user.github}" target="_blank" class="btn btn-ghost">View Profile →</a>
        </div>

        <div class="bento-item">
          <h3>🔷 Holopin</h3>
          <a href="https://holopin.io/@${CONFIG.user.holopin}" target="_blank" class="btn btn-ghost">View Badges →</a>
        </div>
      </div>
    </div>

    <style>
      .loading-spinner.small {
        width: 24px;
        height: 24px;
      }

      .cw-honor {
        font-size: var(--text-3xl);
        font-weight: 700;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    </style>
  `;

  loadCodeWars();
}

async function loadCodeWars(): Promise<void> {
  const container = document.getElementById('codewars-stats');
  if (!container) return;

  try {
    const user = await getCodeWarsUser();
    container.innerHTML = `
      <h3>🥋 CodeWars</h3>
      <p class="cw-honor">${user.honor} Honor</p>
      <p>${user.codeChallenges.totalCompleted} Kata Completed</p>
      <p>Rank: ${user.ranks.overall.name}</p>
    `;
  } catch {
    container.innerHTML = `
      <h3>🥋 CodeWars</h3>
      <p class="muted">Unable to load stats</p>
    `;
  }
}
