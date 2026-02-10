/**
 * Project Me - Services Page
 */

export default async function Services(container: HTMLElement): Promise<void> {
  const services = [
    { name: 'Backend Development', desc: 'Python/FastAPI APIs, microservices architecture', icon: '⚙️' },
    { name: 'AI/ML Development', desc: 'LangChain agents, RAG pipelines, fine-tuning', icon: '🤖' },
    { name: 'DevOps & Cloud', desc: 'Docker, Kubernetes, AWS, CI/CD', icon: '☁️' },
    { name: 'Technical Consulting', desc: 'System design, code reviews, architecture', icon: '💡' },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">What I Bring to Your Team</h1>
        <p class="page-subtitle">Core competencies I deliver from day one in backend, AI, and cloud engineering</p>
      </header>

      <div class="services-grid">
        ${services.map(service => `
          <div class="service-card glass-panel">
            <span class="service-icon">${service.icon}</span>
            <h3>${service.name}</h3>
            <p>${service.desc}</p>
          </div>
        `).join('')}
      </div>

      <div class="cta-section glass-panel">
        <h2>Ready to Add Me to Your Team?</h2>
        <p>I'm actively looking for challenging roles where I can deliver immediate impact.</p>
        <a href="#/connect/mail" class="btn btn-primary">📧 Hire Me →</a>
      </div>
    </div>

    <style>
      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-4);
        margin-bottom: var(--space-8);
      }

      .service-card {
        padding: var(--space-6);
        text-align: center;
      }

      .service-icon {
        font-size: var(--text-4xl);
        display: block;
        margin-bottom: var(--space-4);
      }

      .service-card h3 {
        margin-bottom: var(--space-2);
      }

      .service-card p {
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      .cta-section {
        padding: var(--space-8);
        text-align: center;
      }

      .cta-section h2 {
        margin-bottom: var(--space-2);
      }

      .cta-section p {
        color: var(--text-secondary);
        margin-bottom: var(--space-4);
      }
    </style>
  `;
}
