/**
 * Project Me - Gear Page
 * Hardware and software uses
 */

export default async function Gear(container: HTMLElement): Promise<void> {
  const hardware = [
    { category: 'Laptop', item: 'MacBook Pro M3', icon: '💻' },
    { category: 'Monitor', item: 'Dell UltraSharp 27"', icon: '🖥️' },
    { category: 'Keyboard', item: 'Keychron K2', icon: '⌨️' },
    { category: 'Mouse', item: 'Logitech MX Master 3', icon: '🖱️' },
    { category: 'Headphones', item: 'Sony WH-1000XM5', icon: '🎧' },
  ];

  const software = [
    { category: 'Editor', item: 'VS Code + Neovim', icon: '📝' },
    { category: 'Terminal', item: 'kitty + tmux', icon: '💻' },
    { category: 'Browser', item: 'Arc Browser', icon: '🌐' },
    { category: 'Notes', item: 'Obsidian', icon: '📓' },
    { category: 'Design', item: 'Figma', icon: '🎨' },
  ];

  const stack = [
    'Python', 'TypeScript', 'FastAPI', 'LangChain', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Gear</h1>
        <p class="page-subtitle">Tools I use to build cool stuff</p>
      </header>

      <section class="section">
        <h2 class="section-title">🔧 Hardware</h2>
        <div class="gear-grid">
          ${hardware.map(item => `
            <div class="gear-item glass-panel">
              <span class="gear-icon">${item.icon}</span>
              <div class="gear-info">
                <span class="gear-category">${item.category}</span>
                <span class="gear-name">${item.item}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">💿 Software</h2>
        <div class="gear-grid">
          ${software.map(item => `
            <div class="gear-item glass-panel">
              <span class="gear-icon">${item.icon}</span>
              <div class="gear-info">
                <span class="gear-category">${item.category}</span>
                <span class="gear-name">${item.item}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">🛠️ Tech Stack</h2>
        <div class="stack-tags">
          ${stack.map(tech => `<span class="tag primary">${tech}</span>`).join('')}
        </div>
      </section>
    </div>

    <style>
      .gear-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--space-4);
      }

      .gear-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
      }

      .gear-icon {
        font-size: var(--text-3xl);
      }

      .gear-info {
        display: flex;
        flex-direction: column;
      }

      .gear-category {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .gear-name {
        font-weight: 600;
      }

      .stack-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
    </style>
  `;
}
