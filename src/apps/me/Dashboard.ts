/**
 * Project Me - Professional Dashboard (Hire Me Landing Page)
 * Employer-focused: hero, metrics, skills, projects, career, education, CTA
 */

import { RESUME } from '../../data/resume';
import { SOCIAL, IDENTITY } from '../../data';
import { getAggregateCodingStats } from '../../services/coding';
import { formatNumber } from '../../services/utility';

export default async function Dashboard(container: HTMLElement): Promise<void> {
  const yearsExp = Math.max(1, new Date().getFullYear() - 2023);

  container.innerHTML = `
    <div class="page animate-fade-in hire-page">

      <!-- HERO -->
      <section class="hire-hero glass-panel">
        <div class="hire-hero-avatar">CS</div>
        <div class="hire-hero-info">
          <h1 class="hire-hero-name">${RESUME.personal.name}</h1>
          <p class="hire-hero-title">${RESUME.personal.position} <span class="hire-sep">|</span> ${RESUME.personal.tagline}</p>
          <p class="hire-hero-location">📍 ${RESUME.personal.location}</p>
          <p class="hire-hero-quote">"${RESUME.personal.quote}"</p>
          <div class="hire-hero-actions">
            <a href="#/connect/mail" class="btn btn-primary hire-btn-lg">📧 Contact Me</a>
            <a href="https://github.com/${RESUME.personal.github}" target="_blank" class="btn btn-secondary">GitHub</a>
            <a href="https://linkedin.com/in/${RESUME.personal.linkedin}" target="_blank" class="btn btn-secondary">LinkedIn</a>
            <a href="mailto:${RESUME.personal.email}" class="btn btn-ghost">✉️ ${RESUME.personal.email}</a>
          </div>
        </div>
      </section>

      <!-- IMPACT METRICS -->
      <section class="hire-metrics">
        <div class="hire-metric">
          <span class="hire-metric-value">${yearsExp}+</span>
          <span class="hire-metric-label">Years Experience</span>
        </div>
        <div class="hire-metric">
          <span class="hire-metric-value" id="metric-repos">--</span>
          <span class="hire-metric-label">GitHub Repos</span>
        </div>
        <div class="hire-metric">
          <span class="hire-metric-value" id="metric-leetcode">--</span>
          <span class="hire-metric-label">LeetCode Solved</span>
        </div>
        <div class="hire-metric">
          <span class="hire-metric-value" id="metric-stars">--</span>
          <span class="hire-metric-label">GitHub Stars</span>
        </div>
        <div class="hire-metric">
          <span class="hire-metric-value">7</span>
          <span class="hire-metric-label">Projects Shipped</span>
        </div>
        <div class="hire-metric">
          <span class="hire-metric-value">🏆</span>
          <span class="hire-metric-label">College Topper</span>
        </div>
      </section>

      <!-- PROFESSIONAL SUMMARY -->
      <section class="section">
        <h2 class="section-title">📋 Professional Summary</h2>
        <div class="glass-panel hire-summary">
          <p>${RESUME.summary}</p>
        </div>
      </section>

      <!-- TECHNICAL ARSENAL -->
      <section class="section">
        <h2 class="section-title">🎯 Technical Arsenal</h2>
        <div class="hire-skills-grid">
          ${RESUME.skills.map(cat => `
            <div class="hire-skill-card glass-panel">
              <h4>${cat.category}</h4>
              <div class="skill-tags">
                ${cat.skills.map(s => `<span class="tag">${s}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <a href="#/work/skills" class="btn btn-ghost hire-view-more">View Full Skills Matrix →</a>
      </section>

      <!-- FEATURED PROJECTS -->
      <section class="section">
        <h2 class="section-title">🚀 Featured Projects</h2>
        <div class="hire-projects-grid">
          ${RESUME.projects.slice(0, 3).map((project, i) => `
            <div class="hire-project-card glass-panel">
              <div class="hire-project-rank">#${i + 1}</div>
              <h3>${project.name}</h3>
              <div class="skill-tags">
                ${project.techStack.map(t => `<span class="tag primary">${t}</span>`).join('')}
              </div>
              <ul class="hire-project-highlights">
                ${project.highlights.slice(0, 2).map(h => `<li>${h}</li>`).join('')}
              </ul>
              <a href="https://${project.link}" target="_blank" class="btn btn-ghost">View on GitHub →</a>
            </div>
          `).join('')}
        </div>
        <a href="#/work/projects" class="btn btn-ghost hire-view-more">View All ${RESUME.projects.length} Projects →</a>
      </section>

      <!-- CAREER TIMELINE -->
      <section class="section">
        <h2 class="section-title">💼 Career</h2>
        <div class="hire-timeline">
          ${RESUME.experience.map(exp => `
            <div class="hire-timeline-item glass-panel">
              <div class="hire-timeline-header">
                <div>
                  <h3>${exp.title}</h3>
                  <p class="hire-timeline-company">${exp.company}</p>
                  <p class="hire-timeline-meta">📍 ${exp.location} · ${exp.startDate} — ${exp.endDate}</p>
                </div>
                ${exp.current ? '<span class="tag success">Current</span>' : ''}
              </div>
              <ul class="hire-timeline-highlights">
                ${exp.highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        <a href="#/work/history" class="btn btn-ghost hire-view-more">View Full Experience →</a>
      </section>

      <!-- EDUCATION & HONORS -->
      <section class="section">
        <h2 class="section-title">🎓 Education & Achievements</h2>
        <div class="hire-edu-grid">
          ${RESUME.education.map(edu => `
            <div class="hire-edu-card glass-panel">
              <h4>${edu.degree}</h4>
              <p class="hire-edu-institution">${edu.institution}</p>
              <p class="hire-edu-year">${edu.year}</p>
              <div class="skill-tags">
                ${edu.details.map(d => `<span class="tag">${d}</span>`).join('')}
              </div>
            </div>
          `).join('')}
          ${RESUME.honors.map(honor => `
            <div class="hire-edu-card glass-panel hire-honor">
              <h4>🏆 ${honor.title}</h4>
              <p>${honor.description}</p>
              <p class="hire-edu-year">${honor.year}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- CTA -->
      <section class="hire-cta glass-panel">
        <h2>Interested? Let's Talk!</h2>
        <p>I'm actively looking for challenging roles in Backend Engineering, System Design, and GenAI.</p>
        <div class="hire-cta-actions">
          <a href="#/connect/mail" class="btn btn-primary hire-btn-lg">📧 Get in Touch</a>
          <a href="https://linkedin.com/in/${RESUME.personal.linkedin}" target="_blank" class="btn btn-secondary hire-btn-lg">LinkedIn</a>
          <a href="https://github.com/${RESUME.personal.github}" target="_blank" class="btn btn-secondary hire-btn-lg">GitHub</a>
        </div>
      </section>

    </div>

    <style>
      /* ========== HERO ========== */
      .hire-hero {
        display: flex;
        gap: var(--space-8);
        padding: var(--space-8);
        align-items: center;
        margin-bottom: var(--space-6);
        border-left: 4px solid var(--accent-blue);
      }

      .hire-hero-avatar {
        width: 130px;
        height: 130px;
        border-radius: var(--radius-2xl);
        background: var(--gradient-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        font-weight: 800;
        color: white;
        flex-shrink: 0;
        box-shadow: 0 8px 32px rgba(88, 86, 214, 0.3);
      }

      .hire-hero-name {
        font-size: clamp(1.8rem, 4vw, 2.8rem);
        font-weight: 800;
        margin-bottom: var(--space-1);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hire-hero-title {
        font-size: var(--text-lg);
        color: var(--text-secondary);
        margin-bottom: var(--space-1);
      }

      .hire-sep {
        color: var(--accent-blue);
        margin: 0 var(--space-1);
      }

      .hire-hero-location {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin-bottom: var(--space-2);
      }

      .hire-hero-quote {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        font-style: italic;
        margin-bottom: var(--space-4);
        border-left: 2px solid var(--accent-blue);
        padding-left: var(--space-3);
      }

      .hire-hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
      }

      .hire-btn-lg {
        padding: var(--space-3) var(--space-6) !important;
        font-size: var(--text-base) !important;
        font-weight: 600 !important;
      }

      /* ========== METRICS ========== */
      .hire-metrics {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-8);
      }

      .hire-metric {
        text-align: center;
        padding: var(--space-5);
        background: var(--glass-bg);
        border-radius: var(--radius-lg);
        border: 1px solid var(--glass-border);
        backdrop-filter: blur(10px);
        transition: transform var(--transition-fast);
      }

      .hire-metric:hover {
        transform: translateY(-2px);
      }

      .hire-metric-value {
        display: block;
        font-size: var(--text-2xl);
        font-weight: 800;
        font-family: var(--font-mono);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: var(--space-1);
      }

      .hire-metric-label {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* ========== SUMMARY ========== */
      .hire-summary {
        padding: var(--space-6);
      }

      .hire-summary p {
        line-height: 1.9;
        color: var(--text-secondary);
        font-size: var(--text-base);
      }

      /* ========== SKILLS ========== */
      .hire-skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-4);
        margin-bottom: var(--space-4);
      }

      .hire-skill-card {
        padding: var(--space-5);
        border-left: 3px solid var(--accent-blue);
        transition: transform var(--transition-fast);
      }

      .hire-skill-card:hover {
        transform: translateY(-2px);
      }

      .hire-skill-card h4 {
        margin-bottom: var(--space-3);
        color: var(--accent-blue);
        font-size: var(--text-base);
      }

      .hire-view-more {
        display: inline-block;
        margin-top: var(--space-2);
      }

      /* ========== PROJECTS ========== */
      .hire-projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--space-5);
        margin-bottom: var(--space-4);
      }

      .hire-project-card {
        padding: var(--space-6);
        position: relative;
        border-top: 3px solid var(--accent-purple);
        transition: transform var(--transition-fast);
      }

      .hire-project-card:hover {
        transform: translateY(-3px);
      }

      .hire-project-rank {
        position: absolute;
        top: var(--space-4);
        right: var(--space-4);
        font-size: var(--text-sm);
        color: var(--accent-purple);
        font-weight: 700;
        font-family: var(--font-mono);
      }

      .hire-project-card h3 {
        font-size: var(--text-lg);
        margin-bottom: var(--space-3);
        padding-right: var(--space-6);
      }

      .hire-project-highlights {
        list-style: none;
        margin: var(--space-4) 0;
      }

      .hire-project-highlights li {
        position: relative;
        padding-left: var(--space-5);
        margin-bottom: var(--space-2);
        font-size: var(--text-sm);
        color: var(--text-secondary);
        line-height: 1.6;
      }

      .hire-project-highlights li::before {
        content: '→';
        position: absolute;
        left: 0;
        color: var(--accent-purple);
        font-weight: 600;
      }

      /* ========== TIMELINE ========== */
      .hire-timeline {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      }

      .hire-timeline-item {
        padding: var(--space-6);
        border-left: 3px solid var(--accent-green);
        transition: transform var(--transition-fast);
      }

      .hire-timeline-item:hover {
        transform: translateY(-2px);
      }

      .hire-timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-4);
      }

      .hire-timeline-header h3 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-1);
      }

      .hire-timeline-company {
        color: var(--accent-blue);
        font-weight: 500;
      }

      .hire-timeline-meta {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin-top: var(--space-1);
      }

      .hire-timeline-highlights {
        list-style: none;
      }

      .hire-timeline-highlights li {
        position: relative;
        padding-left: var(--space-5);
        margin-bottom: var(--space-2);
        font-size: var(--text-sm);
        color: var(--text-secondary);
        line-height: 1.6;
      }

      .hire-timeline-highlights li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--accent-green);
        font-weight: 700;
      }

      /* ========== EDUCATION ========== */
      .hire-edu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .hire-edu-card {
        padding: var(--space-5);
      }

      .hire-edu-card h4 {
        margin-bottom: var(--space-2);
      }

      .hire-edu-institution {
        color: var(--accent-blue);
        font-size: var(--text-sm);
        margin-bottom: var(--space-1);
      }

      .hire-edu-year {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
        margin-bottom: var(--space-3);
      }

      .hire-honor {
        border-left: 3px solid #FFD700;
      }

      /* ========== CTA ========== */
      .hire-cta {
        text-align: center;
        padding: var(--space-10) var(--space-8);
        margin-top: var(--space-8);
        border: 2px solid var(--accent-blue);
        background: linear-gradient(135deg, rgba(88, 86, 214, 0.1), rgba(0, 122, 255, 0.1));
      }

      .hire-cta h2 {
        font-size: var(--text-3xl);
        margin-bottom: var(--space-3);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hire-cta p {
        color: var(--text-secondary);
        margin-bottom: var(--space-6);
        font-size: var(--text-lg);
      }

      .hire-cta-actions {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: var(--space-4);
      }

      /* ========== RESPONSIVE ========== */
      @media (max-width: 768px) {
        .hire-hero {
          flex-direction: column;
          text-align: center;
        }

        .hire-hero-actions {
          justify-content: center;
        }

        .hire-hero-quote {
          text-align: left;
        }

        .hire-metrics {
          grid-template-columns: repeat(3, 1fr);
        }

        .hire-timeline-header {
          flex-direction: column;
          gap: var(--space-2);
        }
      }

      @media (max-width: 480px) {
        .hire-metrics {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    </style>
  `;

  // Load live coding stats
  loadMetrics();
}

async function loadMetrics(): Promise<void> {
  try {
    const stats = await getAggregateCodingStats();
    const reposEl = document.getElementById('metric-repos');
    const leetEl = document.getElementById('metric-leetcode');
    const starsEl = document.getElementById('metric-stars');

    if (reposEl) reposEl.textContent = formatNumber(stats.github.repos);
    if (leetEl) leetEl.textContent = formatNumber(stats.leetcode.solved);
    if (starsEl) starsEl.textContent = formatNumber(stats.github.stars);
  } catch (error) {
    console.error('Failed to load metrics:', error);
  }
}
