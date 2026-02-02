/**
 * Project Me - NPM Page
 */

export default async function NPM(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">NPM Packages</h1>
        <p class="page-subtitle">Published packages and downloads</p>
      </header>

      <div class="glass-panel empty-state">
        <span class="empty-icon">📦</span>
        <h3>Coming Soon</h3>
        <p>NPM package statistics will be displayed here once packages are published.</p>
        <a href="https://www.npmjs.com/~chirag127" target="_blank" class="btn btn-secondary">View NPM Profile →</a>
      </div>
    </div>

    <style>
      .empty-state {
        padding: var(--space-12);
        text-align: center;
      }

      .empty-icon {
        font-size: var(--text-6xl);
        display: block;
        margin-bottom: var(--space-4);
      }

      .empty-state h3 {
        margin-bottom: var(--space-2);
      }

      .empty-state p {
        color: var(--text-secondary);
        margin-bottom: var(--space-6);
      }
    </style>
  `;
}
