/**
 * Project Me - Certifications Page
 */

export default async function Certs(container: HTMLElement): Promise<void> {
  const certifications = [
    { name: 'Meta Backend Developer', issuer: 'Coursera / Meta', year: '2023', icon: '🔵' },
    { name: 'AWS Cloud Practitioner', issuer: 'AWS', year: '2023', icon: '☁️' },
    { name: 'Python for Everybody', issuer: 'Coursera / UMich', year: '2021', icon: '🐍' },
  ];

  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Certifications</h1>
        <p class="page-subtitle">Professional certifications and courses</p>
      </header>

      <div class="certs-grid">
        ${certifications.map(cert => `
          <div class="cert-card glass-panel">
            <span class="cert-icon">${cert.icon}</span>
            <h3>${cert.name}</h3>
            <p class="cert-issuer">${cert.issuer}</p>
            <span class="tag">${cert.year}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <style>
      .certs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .cert-card {
        padding: var(--space-6);
        text-align: center;
      }

      .cert-icon {
        font-size: var(--text-4xl);
        display: block;
        margin-bottom: var(--space-4);
      }

      .cert-card h3 {
        margin-bottom: var(--space-2);
      }

      .cert-issuer {
        color: var(--text-secondary);
        font-size: var(--text-sm);
        margin-bottom: var(--space-3);
      }
    </style>
  `;
}
