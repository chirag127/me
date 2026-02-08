/**
 * Project Me - Passions Page
 * Showcase what drives and motivates me
 */

export default async function Passions(container: HTMLElement): Promise<void> {
  const passions = [
    {
      icon: '🚀',
      title: 'Building Products',
      description: 'Turning ideas into reality through code, creating tools that solve real problems and make life easier.',
      color: '#007AFF'
    },
    {
      icon: '🧠',
      title: 'Generative AI',
      description: 'Pioneering the future of AI-driven automation, from LangChain agents to multimodal systems.',
      color: '#5856D6'
    },
    {
      icon: '🌐',
      title: 'Open Source Community',
      description: 'Giving back to the developer ecosystem, sharing knowledge, and collaborating globally.',
      color: '#34C759'
    },
    {
      icon: '📈',
      title: 'System Design',
      description: 'Architecting scalable, resilient systems that can handle millions of requests with elegance.',
      color: '#FF9500'
    },
    {
      icon: '🎯',
      title: 'Problem Solving',
      description: 'The thrill of cracking complex algorithms and finding elegant solutions to hard problems.',
      color: '#FF2D55'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Always exploring the edge of what\'s possible, experimenting with new technologies.',
      color: '#00C7BE'
    },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">❤️ My Passions</h1>
        <p class="page-subtitle">What drives me and keeps me motivated every day</p>
      </header>

      <div class="passions-container">
        ${passions.map(passion => `
          <div class="passion-card glass-panel" style="--accent: ${passion.color}">
            <div class="passion-icon-wrap">
              <span class="passion-icon">${passion.icon}</span>
            </div>
            <div class="passion-content">
              <h3 class="passion-title">${passion.title}</h3>
              <p class="passion-desc">${passion.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <style>
      .passions-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
        margin-top: var(--space-6);
      }

      .passion-card {
        display: flex;
        align-items: center;
        gap: var(--space-6);
        padding: var(--space-6);
        transition: all var(--transition-base);
        border-left: 4px solid var(--accent);
      }

      .passion-card:hover {
        transform: translateX(8px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      }

      .passion-icon-wrap {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--accent), transparent);
        border-radius: var(--radius-xl);
        flex-shrink: 0;
      }

      .passion-icon {
        font-size: var(--text-4xl);
      }

      .passion-content {
        flex: 1;
      }

      .passion-title {
        font-size: var(--text-xl);
        font-weight: 700;
        margin-bottom: var(--space-2);
        color: var(--text-primary);
      }

      .passion-desc {
        font-size: var(--text-base);
        color: var(--text-secondary);
        line-height: 1.7;
      }

      @media (max-width: 768px) {
        .passion-card {
          flex-direction: column;
          text-align: center;
        }

        .passion-card:hover {
          transform: translateY(-4px);
        }
      }
    </style>
  `;
}
