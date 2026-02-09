/**
 * Project Me - Story Page
 * Interactive Timeline of life story using MILESTONES data
 */

import { RESUME } from '../../data/resume';
import { MILESTONES, getMilestonesByCategory, type Milestone } from '../../data';

export default async function Story(container: HTMLElement): Promise<void> {
  // Get all milestones sorted by date
  const allMilestones = [...MILESTONES].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group by year
  const yearGroups = allMilestones.reduce((acc, m) => {
    const year = new Date(m.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {} as Record<string, Milestone[]>);

  // Category icons
  const categoryIcons: Record<string, string> = {
    education: '🎓',
    career: '💼',
    achievement: '🏆',
    project: '🚀',
    personal: '🌟',
    certification: '📜',
  };

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">My Story</h1>
        <p class="page-subtitle">A journey through code, learning, and growth</p>
      </header>

      <section class="section">
        <div class="intro-card glass-panel">
          <blockquote>"${RESUME.personal.quote}"</blockquote>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">📅 Timeline (${allMilestones.length} milestones)</h2>
        <div class="timeline">
          ${Object.entries(yearGroups)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, milestones]) => `
              <div class="year-section">
                <div class="year-marker">${year}</div>
                ${milestones.map(m => `
                  <div class="timeline-item">
                    <div class="timeline-icon">${categoryIcons[m.category] || '📌'}</div>
                    <div class="timeline-content glass-panel">
                      <div class="timeline-header">
                        <span class="timeline-date">${new Date(m.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                        <span class="timeline-category">${m.category}</span>
                      </div>
                      <h3>${m.title}</h3>
                      <p>${m.description}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            `).join('')}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">🎯 Core Values</h2>
        <div class="bento-grid">
          <div class="bento-item">
            <h3>🚀 Continuous Learning</h3>
            <p>Always exploring new technologies, from LangChain to Kubernetes.</p>
          </div>
          <div class="bento-item">
            <h3>🔧 Problem Solving</h3>
            <p>Breaking down complex challenges into elegant solutions.</p>
          </div>
          <div class="bento-item">
            <h3>🤝 Collaboration</h3>
            <p>Thriving in Agile teams, contributing to open source.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">📊 Milestones by Category</h2>
        <div class="category-stats">
          ${Object.entries(categoryIcons).map(([cat, icon]) => {
        const count = getMilestonesByCategory(cat as Milestone['category']).length;
        return count > 0 ? `
              <div class="cat-stat glass-panel">
                <span class="cat-icon">${icon}</span>
                <span class="cat-count">${count}</span>
                <span class="cat-name">${cat}</span>
              </div>
            ` : '';
      }).join('')}
        </div>
      </section>
    </div>

    <style>
      .intro-card {
        padding: var(--space-8);
        margin-bottom: var(--space-8);
      }

      .intro-card blockquote {
        font-size: var(--text-xl);
        font-style: italic;
        color: var(--text-secondary);
        border-left: 4px solid var(--accent-blue);
        padding-left: var(--space-4);
        margin: 0;
      }

      .timeline {
        position: relative;
      }

      .year-section {
        margin-bottom: var(--space-8);
      }

      .year-marker {
        font-size: var(--text-2xl);
        font-weight: 700;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: var(--space-4);
      }

      .timeline-item {
        display: flex;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
      }

      .timeline-icon {
        font-size: var(--text-2xl);
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--glass-bg);
        border-radius: var(--radius-lg);
        border: 1px solid var(--glass-border);
      }

      .timeline-content {
        flex: 1;
        padding: var(--space-4);
      }

      .timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-2);
      }

      .timeline-date {
        font-size: var(--text-sm);
        color: var(--accent-blue);
        font-weight: 600;
      }

      .timeline-category {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        text-transform: uppercase;
        padding: var(--space-1) var(--space-2);
        background: var(--glass-bg);
        border-radius: var(--radius-sm);
      }

      .timeline-content h3 {
        font-size: var(--text-lg);
        margin-bottom: var(--space-2);
      }

      .timeline-content p {
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      .timeline-location {
        display: inline-block;
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        margin-top: var(--space-2);
      }

      .category-stats {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-4);
      }

      .cat-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--space-4);
        min-width: 100px;
      }

      .cat-icon {
        font-size: var(--text-2xl);
      }

      .cat-count {
        font-size: var(--text-xl);
        font-weight: 700;
        font-family: var(--font-mono);
        color: var(--accent-blue);
      }

      .cat-name {
        font-size: var(--text-xs);
        color: var(--text-secondary);
        text-transform: capitalize;
      }

      @media (max-width: 600px) {
        .timeline-item {
          flex-direction: column;
        }
        .timeline-icon {
          width: 36px;
          height: 36px;
          font-size: var(--text-lg);
        }
      }
    </style>
  `;
}
