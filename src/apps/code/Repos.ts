/**
 * Project Me - Repos Page
 */

import { getGitHubRepos, type GitHubRepo } from '../../services/coding';

export default async function Repos(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Repositories</h1>
        <p class="page-subtitle">Open source projects and code</p>
      </header>

      <div class="repos-list" id="repos-list">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading repositories...</p>
        </div>
      </div>
    </div>

    <style>
      .repos-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--space-4);
      }

      .repo-card {
        padding: var(--space-5);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-fast);
      }

      .repo-card:hover {
        transform: translateY(-4px);
        border-color: var(--accent-blue);
      }

      .repo-name {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--accent-blue);
        margin-bottom: var(--space-2);
      }

      .repo-desc {
        color: var(--text-secondary);
        font-size: var(--text-sm);
        margin-bottom: var(--space-4);
      }

      .repo-meta {
        display: flex;
        gap: var(--space-4);
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .repo-topics {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-top: var(--space-3);
      }
    </style>
  `;

  loadRepos();
}

async function loadRepos(): Promise<void> {
  const list = document.getElementById('repos-list');
  if (!list) return;

  try {
    const repos = await getGitHubRepos('updated', 20);
    list.innerHTML = repos.map((repo: GitHubRepo) => `
      <a href="${repo.html_url}" target="_blank" class="repo-card">
        <div class="repo-name">${repo.name}</div>
        <p class="repo-desc">${repo.description || 'No description available'}</p>
        <div class="repo-meta">
          ${repo.language ? `<span>🔵 ${repo.language}</span>` : ''}
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
        ${repo.topics?.length ? `
          <div class="repo-topics">
            ${repo.topics.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        ` : ''}
      </a>
    `).join('');
  } catch {
    list.innerHTML = '<p class="muted">Failed to load repositories</p>';
  }
}
