/**
 * Project Me - Work Summary Page
 * Visual Resume overview
 */

import { RESUME } from '../../data/resume';

export default async function Summary(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Professional Resume</h1>
        <p class="page-subtitle">${RESUME.personal.position} • ${RESUME.personal.tagline} • Available for Hire</p>
      </header>

      <section class="hero-section glass-panel">
        <div class="hero-avatar">CS</div>
        <div class="hero-info">
          <h2>${RESUME.personal.name}</h2>
          <p>${RESUME.personal.position} — ${RESUME.personal.tagline}</p>
          <p class="hero-location">📍 ${RESUME.personal.location}</p>
          <div class="hero-links">
            <a href="#/connect/mail" class="btn btn-primary">📧 Hire Me</a>
            <a href="mailto:${RESUME.personal.email}" class="btn btn-secondary">✉️ Email</a>
            <a href="https://github.com/${RESUME.personal.github}" target="_blank" class="btn btn-secondary">GitHub</a>
            <a href="https://linkedin.com/in/${RESUME.personal.linkedin}" target="_blank" class="btn btn-secondary">LinkedIn</a>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">📋 Professional Summary</h2>
        <div class="summary-text glass-panel">
          <p>${RESUME.summary}</p>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">💼 Current Role</h2>
        <div class="current-role glass-panel">
          <div class="role-header">
            <div>
              <h3>${RESUME.experience[0].title}</h3>
              <p class="role-company">${RESUME.experience[0].company}</p>
            </div>
            <span class="tag success">Current</span>
          </div>
          <ul class="role-highlights">
            ${RESUME.experience[0].highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}
          </ul>
          <a href="#/work/history" class="btn btn-ghost">View Full Career History →</a>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">🎯 Technical Skills</h2>
        <div class="skills-overview">
          ${RESUME.skills.map(cat => `
            <div class="skill-cat glass-panel">
              <h4>${cat.category}</h4>
              <div class="skill-tags">
                ${cat.skills.map(s => `<span class="tag">${s}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <a href="#/work/skills" class="btn btn-ghost" style="margin-top:var(--space-4);display:inline-block">View Proficiency Levels →</a>
      </section>

      <section class="section">
        <h2 class="section-title">🎓 Education & Credentials</h2>
        <div class="education-cards">
          ${RESUME.education.map(edu => `
            <div class="edu-card glass-panel">
              <h4>${edu.degree}</h4>
              <p class="edu-institution">${edu.institution}</p>
              <p class="edu-year">${edu.year}</p>
              <div class="edu-details">
                ${edu.details.map(d => `<span class="tag">${d}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="hire-cta-section glass-panel" style="text-align:center;padding:var(--space-8);margin-top:var(--space-6);border:2px solid var(--accent-blue);background:linear-gradient(135deg,rgba(88,86,214,0.1),rgba(0,122,255,0.1))">
        <h2 style="font-size:var(--text-2xl);margin-bottom:var(--space-3);background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Ready to Hire Me?</h2>
        <p style="color:var(--text-secondary);margin-bottom:var(--space-5)">I'm actively seeking challenging roles in Backend Engineering, System Design, and GenAI.</p>
        <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:var(--space-3)">
          <a href="#/connect/mail" class="btn btn-primary" style="padding:var(--space-3) var(--space-6);font-size:var(--text-base);font-weight:600">📧 Contact Me</a>
          <a href="https://linkedin.com/in/${RESUME.personal.linkedin}" target="_blank" class="btn btn-secondary" style="padding:var(--space-3) var(--space-6);font-size:var(--text-base);font-weight:600">LinkedIn</a>
        </div>
      </section>
    </div>

    <style>
      .hero-section {
        display: flex;
        gap: var(--space-8);
        padding: var(--space-8);
        align-items: center;
        margin-bottom: var(--space-8);
      }

      .hero-avatar {
        width: 120px;
        height: 120px;
        border-radius: var(--radius-2xl);
        background: var(--gradient-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--text-4xl);
        font-weight: 700;
        color: white;
        flex-shrink: 0;
      }

      .hero-info h2 {
        font-size: var(--text-3xl);
        margin-bottom: var(--space-1);
      }

      .hero-info > p {
        color: var(--text-secondary);
      }

      .hero-location {
        margin-top: var(--space-2);
      }

      .hero-links {
        display: flex;
        gap: var(--space-3);
        margin-top: var(--space-4);
      }

      .summary-text {
        padding: var(--space-6);
      }

      .summary-text p {
        line-height: 1.8;
        color: var(--text-secondary);
      }

      .current-role {
        padding: var(--space-6);
      }

      .role-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-4);
      }

      .role-header h3 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-1);
      }

      .role-company {
        color: var(--accent-blue);
      }

      .role-highlights {
        list-style: none;
        margin-bottom: var(--space-4);
      }

      .role-highlights li {
        position: relative;
        padding-left: var(--space-5);
        margin-bottom: var(--space-2);
        color: var(--text-secondary);
      }

      .role-highlights li::before {
        content: '→';
        position: absolute;
        left: 0;
        color: var(--accent-blue);
      }

      .skills-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .skill-cat {
        padding: var(--space-5);
      }

      .skill-cat h4 {
        margin-bottom: var(--space-3);
        color: var(--accent-blue);
      }

      .skill-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      .education-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-4);
      }

      .edu-card {
        padding: var(--space-5);
      }

      .edu-card h4 {
        margin-bottom: var(--space-1);
      }

      .edu-institution {
        color: var(--accent-blue);
        font-size: var(--text-sm);
      }

      .edu-year {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
        margin-bottom: var(--space-3);
      }

      .edu-details {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      @media (max-width: 768px) {
        .hero-section {
          flex-direction: column;
          text-align: center;
        }

        .hero-links {
          justify-content: center;
          flex-wrap: wrap;
        }
      }
    </style>
  `;
}
