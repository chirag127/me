/**
 * Project Me - Skills Page with Radar Chart
 */

import { RESUME } from '../../data/resume';

export default async function Skills(container: HTMLElement): Promise<void> {
  const skillLevels = [
    { name: 'Python', level: 95 },
    { name: 'TypeScript', level: 85 },
    { name: 'FastAPI', level: 90 },
    { name: 'LangChain', level: 85 },
    { name: 'Docker', level: 80 },
    { name: 'Kubernetes', level: 75 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'AWS', level: 70 },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Skills</h1>
        <p class="page-subtitle">Technical expertise and proficiency</p>
      </header>

      <section class="section">
        <h2 class="section-title">📊 Proficiency Levels</h2>
        <div class="skills-bars glass-panel">
          ${skillLevels.map(skill => `
            <div class="skill-bar">
              <div class="skill-bar-header">
                <span>${skill.name}</span>
                <span>${skill.level}%</span>
              </div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill" style="width: ${skill.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">🏷️ Skills by Category</h2>
        <div class="bento-grid">
          ${RESUME.skills.map(cat => `
            <div class="bento-item">
              <h3>${cat.category}</h3>
              <div class="skill-tags">
                ${cat.skills.map(s => `<span class="tag">${s}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>

    <style>
      .skills-bars {
        padding: var(--space-6);
      }
    </style>
  `;
}
