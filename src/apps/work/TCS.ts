/**
 * Project Me - TCS Case Study Page
 */

export default async function TCS(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">TCS — Enterprise Engineering at Scale</h1>
        <p class="page-subtitle">60% latency reduction on enterprise pricing engines • Production Python & CI/CD</p>
      </header>

      <div class="case-study-content">
        <section class="case-section glass-panel">
          <h2>🏢 The Context</h2>
          <p>Tata Consultancy Services is a global leader in IT services, consulting, and business solutions. I joined as a Software Engineer in June 2025, working on enterprise-scale pricing engines and data validation systems.</p>
        </section>

        <section class="case-section glass-panel">
          <h2>🎯 The Challenge</h2>
          <p>The existing pricing engine had significant latency issues for high-volume transactions. Legacy XML-based systems needed to be bridged with modern RESTful APIs while maintaining 100% data integrity.</p>
        </section>

        <section class="case-section glass-panel">
          <h2>💡 My Contributions</h2>
          <div class="contributions">
            <div class="contribution">
              <span class="contribution-stat">60%</span>
              <span class="contribution-label">Latency Reduction</span>
              <p>Optimized pricing engines using Python for quote generation</p>
            </div>
            <div class="contribution">
              <span class="contribution-stat">100%</span>
              <span class="contribution-label">Data Integrity</span>
              <p>Modular validation pipelines across distributed systems</p>
            </div>
            <div class="contribution">
              <span class="contribution-stat">CI/CD</span>
              <span class="contribution-label">Automation</span>
              <p>Automated workflows with strict linting standards</p>
            </div>
          </div>
        </section>

        <section class="case-section glass-panel">
          <h2>🛠️ Technologies Used</h2>
          <div class="tech-tags">
            <span class="tag primary">Python</span>
            <span class="tag primary">JavaScript</span>
            <span class="tag">XML Processing</span>
            <span class="tag">RESTful APIs</span>
            <span class="tag">CI/CD</span>
            <span class="tag">Agile</span>
          </div>
        </section>
      </div>
    </div>

    <style>
      .case-study-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
      }

      .case-section {
        padding: var(--space-6);
      }

      .case-section h2 {
        margin-bottom: var(--space-4);
        font-size: var(--text-xl);
      }

      .case-section p {
        color: var(--text-secondary);
        line-height: 1.7;
      }

      .contributions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-4);
        margin-top: var(--space-4);
      }

      .contribution {
        text-align: center;
        padding: var(--space-4);
        background: var(--glass-bg);
        border-radius: var(--radius-lg);
      }

      .contribution-stat {
        display: block;
        font-size: var(--text-3xl);
        font-weight: 700;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .contribution-label {
        display: block;
        font-weight: 600;
        margin-bottom: var(--space-2);
      }

      .contribution p {
        font-size: var(--text-sm);
        margin: 0;
      }

      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
    </style>
  `;
}
