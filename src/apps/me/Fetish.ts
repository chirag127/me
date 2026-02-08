/**
 * Project Me - Fetish Page
 * Content with age verification and content warning
 */

const STORAGE_KEY = 'pm-fetish-verified';

export default async function Fetish(container: HTMLElement): Promise<void> {
  const isVerified = sessionStorage.getItem(STORAGE_KEY) === 'true';

  if (!isVerified) {
    renderAgeGate(container);
  } else {
    renderContent(container);
  }
}

function renderAgeGate(container: HTMLElement): void {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <div class="age-gate-overlay">
        <div class="age-gate-modal glass-panel">
          <div class="warning-icon">🔞</div>
          <h1 class="warning-title">Content Warning</h1>
          <div class="warning-content">
            <p>This page contains content that may not be suitable for all audiences.</p>
            <p>You must be <strong>18 years or older</strong> to view this content.</p>
          </div>
          <div class="age-gate-actions">
            <button class="btn btn-secondary" id="exit-btn">Exit</button>
            <button class="btn btn-primary" id="verify-btn">I'm 18+ • Continue</button>
          </div>
          <p class="disclaimer">By clicking "Continue", you confirm that you are of legal age to view mature content in your jurisdiction.</p>
        </div>
      </div>
    </div>

    <style>
      .age-gate-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        z-index: 9999;
      }

      .age-gate-modal {
        max-width: 480px;
        padding: var(--space-8);
        text-align: center;
        margin: var(--space-4);
      }

      .warning-icon {
        font-size: 4rem;
        margin-bottom: var(--space-4);
      }

      .warning-title {
        font-size: var(--text-2xl);
        font-weight: 700;
        margin-bottom: var(--space-4);
        color: #FF3B30;
      }

      .warning-content {
        margin-bottom: var(--space-6);
        color: var(--text-secondary);
        line-height: 1.8;
      }

      .warning-content strong {
        color: var(--text-primary);
      }

      .age-gate-actions {
        display: flex;
        gap: var(--space-4);
        justify-content: center;
        margin-bottom: var(--space-4);
      }

      .age-gate-actions .btn {
        padding: var(--space-3) var(--space-6);
        font-weight: 600;
      }

      .btn-secondary {
        background: var(--glass-bg);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
      }

      .btn-secondary:hover {
        background: var(--glass-bg-hover);
      }

      .btn-primary {
        background: linear-gradient(135deg, #FF3B30, #FF9500);
        color: white;
        border: none;
      }

      .btn-primary:hover {
        opacity: 0.9;
        transform: scale(1.02);
      }

      .disclaimer {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        max-width: 360px;
        margin: 0 auto;
      }
    </style>
  `;

  // Event listeners
  document.getElementById('exit-btn')?.addEventListener('click', () => {
    window.location.hash = '#/me/index';
  });

  document.getElementById('verify-btn')?.addEventListener('click', () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    renderContent(container);
  });
}

function renderContent(container: HTMLElement): void {
  const fetishes = [
    {
      icon: '⌨️',
      title: 'Mechanical Keyboards',
      description: 'The satisfying click-clack of custom mechanical keyboards. From Cherry MX Blues to Gateron Yellows, I\'m obsessed with the perfect typing experience.',
      intensity: 'Mild'
    },
    {
      icon: '📊',
      title: 'Clean Code Architecture',
      description: 'There\'s something deeply satisfying about perfectly organized code. SOLID principles, design patterns, and immaculate folder structures.',
      intensity: 'Moderate'
    },
    {
      icon: '🖥️',
      title: 'Terminal Aesthetics',
      description: 'Custom shell themes, Tokyo Night colorschemes, ligature fonts. My terminal is a work of art that I spend way too much time customizing.',
      intensity: 'Intense'
    },
    {
      icon: '📈',
      title: 'Performance Optimization',
      description: 'Shaving milliseconds off response times. Watching those Lighthouse scores hit 100. The dopamine hit of a perfectly optimized system.',
      intensity: 'Extreme'
    },
    {
      icon: '🧹',
      title: 'Refactoring Legacy Code',
      description: 'Yes, I actually enjoy it. Taking spaghetti code and turning it into something beautiful and maintainable.',
      intensity: 'Questionable'
    },
    {
      icon: '📝',
      title: 'Documentation',
      description: 'Well-written docs with examples, diagrams, and proper formatting. I spend more time on README files than I\'d like to admit.',
      intensity: 'Wholesome'
    },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">🔞 My Weird Fetishes</h1>
        <p class="page-subtitle">Developer obsessions that might be too intense</p>
      </header>

      <div class="content-warning-banner">
        <span>⚠️</span>
        <p>Warning: The following content contains extreme developer obsessions that may cause nodding, laughter, or existential reflection.</p>
      </div>

      <div class="fetish-grid">
        ${fetishes.map(f => `
          <div class="fetish-card glass-panel">
            <div class="fetish-header">
              <span class="fetish-icon">${f.icon}</span>
              <span class="intensity-badge intensity-${f.intensity.toLowerCase()}">${f.intensity}</span>
            </div>
            <h3 class="fetish-title">${f.title}</h3>
            <p class="fetish-desc">${f.description}</p>
          </div>
        `).join('')}
      </div>

      <div class="disclaimer-footer">
        <p>This page is meant to be humorous. "Fetish" here refers to strong developer preferences and obsessions, not anything inappropriate. 🙂</p>
      </div>
    </div>

    <style>
      .content-warning-banner {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        background: rgba(255, 59, 48, 0.1);
        border: 1px solid rgba(255, 59, 48, 0.3);
        border-radius: var(--radius-lg);
        margin-bottom: var(--space-6);
        color: var(--text-secondary);
      }

      .content-warning-banner span {
        font-size: var(--text-xl);
      }

      .fetish-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--space-6);
      }

      .fetish-card {
        padding: var(--space-6);
        transition: all var(--transition-base);
      }

      .fetish-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      }

      .fetish-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
      }

      .fetish-icon {
        font-size: var(--text-4xl);
      }

      .intensity-badge {
        font-size: var(--text-xs);
        font-weight: 600;
        padding: var(--space-1) var(--space-3);
        border-radius: var(--radius-full);
        text-transform: uppercase;
      }

      .intensity-mild { background: rgba(52, 199, 89, 0.2); color: #34C759; }
      .intensity-moderate { background: rgba(255, 149, 0, 0.2); color: #FF9500; }
      .intensity-intense { background: rgba(255, 59, 48, 0.2); color: #FF3B30; }
      .intensity-extreme { background: rgba(175, 82, 222, 0.2); color: #AF52DE; }
      .intensity-questionable { background: rgba(88, 86, 214, 0.2); color: #5856D6; }
      .intensity-wholesome { background: rgba(0, 199, 190, 0.2); color: #00C7BE; }

      .fetish-title {
        font-size: var(--text-lg);
        font-weight: 700;
        margin-bottom: var(--space-2);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .fetish-desc {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        line-height: 1.7;
      }

      .disclaimer-footer {
        margin-top: var(--space-8);
        padding: var(--space-4);
        background: var(--glass-bg);
        border-radius: var(--radius-lg);
        text-align: center;
      }

      .disclaimer-footer p {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      @media (max-width: 768px) {
        .fetish-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
}
