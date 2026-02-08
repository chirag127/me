/**
 * Project Me - Interests Page
 * Showcase personal interests and curiosities
 */

export default async function Interests(container: HTMLElement): Promise<void> {
  const interests = [
    { icon: '🤖', title: 'Artificial Intelligence', description: 'Exploring the frontiers of machine learning, LLMs, and neural networks' },
    { icon: '🌌', title: 'Space Exploration', description: 'Fascinated by the cosmos, black holes, and humanity\'s journey to the stars' },
    { icon: '💻', title: 'Open Source', description: 'Contributing to and learning from the global developer community' },
    { icon: '🧬', title: 'Science & Technology', description: 'Staying curious about breakthroughs in physics, biology, and computing' },
    { icon: '📚', title: 'Continuous Learning', description: 'Always expanding knowledge through courses, books, and hands-on projects' },
    { icon: '🎮', title: 'Gaming Culture', description: 'Appreciating game design, storytelling, and interactive experiences' },
    { icon: '🎵', title: 'Music Discovery', description: 'Exploring genres from lo-fi to classical, always seeking new sounds' },
    { icon: '🌍', title: 'World Events', description: 'Keeping up with global trends, geopolitics, and technological shifts' },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">💡 My Interests</h1>
        <p class="page-subtitle">Things that capture my curiosity and attention</p>
      </header>

      <div class="interests-grid">
        ${interests.map(interest => `
          <div class="interest-card glass-panel">
            <span class="interest-icon">${interest.icon}</span>
            <h3 class="interest-title">${interest.title}</h3>
            <p class="interest-desc">${interest.description}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <style>
      .interests-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-6);
        margin-top: var(--space-6);
      }

      .interest-card {
        padding: var(--space-6);
        text-align: center;
        transition: all var(--transition-base);
        cursor: default;
      }

      .interest-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      }

      .interest-icon {
        font-size: var(--text-5xl);
        display: block;
        margin-bottom: var(--space-4);
      }

      .interest-title {
        font-size: var(--text-lg);
        font-weight: 600;
        margin-bottom: var(--space-2);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .interest-desc {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .interests-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
}
