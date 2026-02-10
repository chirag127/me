/**
 * Project Me - Education Page
 */

import { RESUME } from '../../data/resume';

export default async function Education(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Education & Honors</h1>
        <p class="page-subtitle">College Topper (Rank 1) • JEE Advanced Qualifier • Academic Excellence</p>
      </header>

      <div class="education-list">
        ${RESUME.education.map(edu => `
          <div class="edu-card glass-panel">
            <div class="edu-icon">🎓</div>
            <div class="edu-content">
              <h3>${edu.degree}</h3>
              <p class="edu-institution">${edu.institution}</p>
              <p class="edu-location">${edu.location}</p>
              <p class="edu-year">${edu.year}</p>
              <div class="edu-details">
                ${edu.details.map(d => `<span class="tag success">${d}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <section class="section">
        <h2 class="section-title">🏆 Academic Honors</h2>
        <div class="bento-grid">
          ${RESUME.honors.map(honor => `
            <div class="bento-item">
              <h4>${honor.title}</h4>
              <p>${honor.description}</p>
              <span class="honor-year">${honor.year}</span>
            </div>
          `).join('')}
        </div>
      </section>
    </div>

    <style>
      .education-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
        margin-bottom: var(--space-8);
      }

      .edu-card {
        display: flex;
        gap: var(--space-6);
        padding: var(--space-6);
      }

      .edu-icon {
        font-size: var(--text-4xl);
        flex-shrink: 0;
      }

      .edu-content h3 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-2);
      }

      .edu-institution {
        color: var(--accent-blue);
        font-weight: 500;
      }

      .edu-location,
      .edu-year {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
      }

      .edu-details {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-top: var(--space-3);
      }

      .honor-year {
        display: block;
        margin-top: var(--space-2);
        color: var(--text-tertiary);
        font-size: var(--text-sm);
      }
    </style>
  `;
}
