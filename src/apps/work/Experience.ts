/**
 * Project Me - Experience Page
 * Detailed work timeline
 */

import { RESUME } from '../../data/resume';

export default async function Experience(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Experience</h1>
        <p class="page-subtitle">My professional journey</p>
      </header>

      <div class="timeline">
        ${RESUME.experience.map(exp => `
          <div class="timeline-item">
            <div class="exp-header">
              <div>
                <h3>${exp.title}</h3>
                <p class="exp-company">${exp.company}</p>
                <p class="exp-location">📍 ${exp.location}</p>
              </div>
              <div class="exp-period">
                <span class="tag ${exp.current ? 'success' : ''}">${exp.startDate} - ${exp.endDate}</span>
              </div>
            </div>
            <ul class="exp-highlights">
              ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>

    <style>
      .exp-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-4);
      }

      .exp-header h3 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-1);
      }

      .exp-company {
        color: var(--accent-blue);
        font-weight: 500;
      }

      .exp-location {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
      }

      .exp-highlights {
        list-style: none;
      }

      .exp-highlights li {
        position: relative;
        padding-left: var(--space-5);
        margin-bottom: var(--space-3);
        color: var(--text-secondary);
        line-height: 1.6;
      }

      .exp-highlights li::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: var(--accent-blue);
      }
    </style>
  `;
}
