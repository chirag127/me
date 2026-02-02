/**
 * Project Me - Story Page
 * Interactive Timeline of life story
 */

import { RESUME } from '../../data/resume';

export default async function Story(container: HTMLElement): Promise<void> {
  const timelineEvents = [
    { year: '2024', title: 'Joined TCS', description: 'Started as Software Engineer at Tata Consultancy Services, working on enterprise pricing systems.' },
    { year: '2024', title: 'Graduated B.Tech', description: 'Completed B.Tech in Computer Science from AKTU with 8.81 CGPA - College Topper (Rank 1).' },
    { year: '2023', title: 'QRsay Developer', description: 'Built full-stack food e-commerce platform handling thousands of concurrent requests.' },
    { year: '2020', title: 'JEE Advanced', description: 'Secured All India Rank 11870 (Top 1%) in JEE Advanced 2020.' },
    { year: '2020', title: '12th Grade Topper', description: 'Scored 97% in CBSE Class 12, becoming School Topper.' },
  ];

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
        <h2 class="section-title">📅 Timeline</h2>
        <div class="timeline">
          ${timelineEvents.map(event => `
            <div class="timeline-item">
              <div class="timeline-year">${event.year}</div>
              <div class="timeline-content">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
              </div>
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

      .timeline-year {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--accent-blue);
        margin-bottom: var(--space-1);
      }

      .timeline-content h3 {
        font-size: var(--text-lg);
        margin-bottom: var(--space-2);
      }

      .timeline-content p {
        color: var(--text-secondary);
      }
    </style>
  `;
}
