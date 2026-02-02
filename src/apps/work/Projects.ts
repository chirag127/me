/**
 * Project Me - Projects Page
 */

import { RESUME } from '../../data/resume';
import { getPinnedRepos, type GitHubRepo } from '../../services/coding';

export default async function Projects(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Projects</h1>
        <p class="page-subtitle">Things I've built and contributed to</p>
      </header>

      <section class="section">
        <h2 class="section-title">🚀 Featured Projects</h2>
        <div class="projects-grid">
          ${RESUME.projects.map(project => `
            <div class="project-card glass-panel">
              <h3>${project.name}</h3>
              <div class="project-tech">
                ${project.techStack.map(t => `<span class="tag primary">${t}</span>`).join('')}
              </div>
              <ul class="project-highlights">
                ${project.highlights.slice(0, 2).map(h => `<li>${h}</li>`).join('')}
              </ul>
              <a href="https://${project.link}" target="_blank" class="btn btn-ghost">View on GitHub →</a>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">📦 GitHub Repos</h2>
        <div class="repos-grid" id="repos-grid">
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading repositories...</p>
          </div>
        </div>
      </section>
    </div>

    <style>
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: var(--space-4);
      }

      .project-card {
        padding: var(--space-5);
      }

      .project-card h3 {
        margin-bottom: var(--space-3);
      }

      .project-tech {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-4);
      }

      .project-highlights {
        list-style: none;
        margin-bottom: var(--space-4);
      }

      .project-highlights li {
        position: relative;
        padding-left: var(--space-4);
        margin-bottom: var(--space-2);
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .project-highlights li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--accent-blue);
      }

      .repos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .repo-card {
        padding: var(--space-4);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-fast);
      }

      .repo-card:hover {
        transform: translateY(-4px);
        border-color: var(--glass-border-hover);
      }

      .repo-name {
        font-weight: 600;
        color: var(--accent-blue);
        margin-bottom: var(--space-2);
      }

      .repo-desc {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-bottom: var(--space-3);
      }

      .repo-meta {
        display: flex;
        gap: var(--space-4);
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }
    </style>
  `;

  loadRepos();
}

async function loadRepos(): Promise<void> {
  const grid = document.getElementById('repos-grid');
  if (!grid) return;

  try {
    const repos = await getPinnedRepos();
    grid.innerHTML = repos.map((repo: GitHubRepo) => `
      <a href="${repo.html_url}" target="_blank" class="repo-card">
        <div class="repo-name">${repo.name}</div>
        <p class="repo-desc">${repo.description || 'No description'}</p>
        <div class="repo-meta">
          ${repo.language ? `<span>🔵 ${repo.language}</span>` : ''}
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
      </a>
    `).join('');
  } catch (error) {
    grid.innerHTML = '<p class="muted">Failed to load repositories</p>';
  }
}
