/**
 * Project Me - Philosophy Page
 * Values, ethics, and approach to work
 */

export default async function Philosophy(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Philosophy</h1>
        <p class="page-subtitle">Principles that guide my work and life</p>
      </header>

      <div class="bento-grid">
        <div class="bento-item span-2">
          <h3>🧠 Engineering Mindset</h3>
          <p>I believe in writing code that humans can read first, machines second. Clean architecture, meaningful abstractions, and thorough documentation aren't optional - they're essential.</p>
        </div>

        <div class="bento-item">
          <h3>🔄 Iterative Excellence</h3>
          <p>Perfect is the enemy of shipped. I prefer quick iterations, constant feedback, and continuous improvement.</p>
        </div>

        <div class="bento-item">
          <h3>🌱 Growth Mindset</h3>
          <p>Every bug is a lesson. Every code review is an opportunity. I embrace challenges as pathways to mastery.</p>
        </div>

        <div class="bento-item span-2">
          <h3>🤖 AI-Augmented Development</h3>
          <p>I see AI as a powerful collaborator, not a replacement. Using tools like GitHub Copilot and LLMs to amplify creativity while maintaining code quality and understanding.</p>
        </div>

        <div class="bento-item">
          <h3>📚 Open Source Spirit</h3>
          <p>Knowledge should be free. I contribute to open source and believe in building on the shoulders of giants.</p>
        </div>

        <div class="bento-item">
          <h3>⚡ Performance Matters</h3>
          <p>60% latency reduction isn't just a metric - it's user happiness. I obsess over optimization.</p>
        </div>

        <div class="bento-item span-3">
          <h3>💎 Technical Principles</h3>
          <div class="principles-grid">
            <div class="principle">
              <span class="principle-icon">🏗️</span>
              <div>
                <strong>SOLID Design</strong>
                <p>Single responsibility, open for extension, closed for modification</p>
              </div>
            </div>
            <div class="principle">
              <span class="principle-icon">🧪</span>
              <div>
                <strong>TDD When It Matters</strong>
                <p>Tests are documentation that runs</p>
              </div>
            </div>
            <div class="principle">
              <span class="principle-icon">📦</span>
              <div>
                <strong>Modular Architecture</strong>
                <p>Build small, compose big</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .principles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-4);
        margin-top: var(--space-4);
      }

      .principle {
        display: flex;
        gap: var(--space-3);
        padding: var(--space-3);
        background: var(--glass-bg);
        border-radius: var(--radius-md);
      }

      .principle-icon {
        font-size: var(--text-2xl);
      }

      .principle strong {
        display: block;
        margin-bottom: var(--space-1);
      }

      .principle p {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin: 0;
      }
    </style>
  `;
}
