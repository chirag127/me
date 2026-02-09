/**
 * Project Me - Contact Page
 * Contact form with Formspree integration
 */

import { IDENTITY, SOCIAL } from '../../data';
import { submitFormspree, createMailerLiteForm } from '../../services/init';
import { communication } from '../../config/services';

export default async function Contact(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <div class="page animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">Contact</h1>
        <p class="page-subtitle">Let's get in touch</p>
      </header>

      <div class="contact-layout">
        <!-- Contact Form -->
        <div class="contact-form-section glass-panel">
          <h2><i class="fas fa-paper-plane"></i> Send a Message</h2>
          <form id="contact-form" class="contact-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="your@email.com" required />
            </div>
            <div class="form-group">
              <label for="subject">Subject</label>
              <input type="text" id="subject" name="subject" placeholder="What's this about?" required />
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="Your message..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-full" id="submit-btn">
              <i class="fas fa-send"></i> Send Message
            </button>
            <div id="form-status" class="form-status"></div>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="contact-info-section">
          <div class="contact-card glass-panel">
            <h3><i class="fas fa-envelope"></i> Email</h3>
            <p>The best way to reach me</p>
            <a href="mailto:${IDENTITY.email}" class="btn btn-secondary">${IDENTITY.email}</a>
          </div>
          <div class="contact-card glass-panel">
            <h3><i class="fab fa-linkedin"></i> LinkedIn</h3>
            <p>Professional network</p>
            <a href="${SOCIAL.linkedin.url}" target="_blank" class="btn btn-secondary">Connect →</a>
          </div>
          <div class="contact-card glass-panel">
            <h3><i class="fab fa-github"></i> GitHub</h3>
            <p>Open source work</p>
            <a href="${SOCIAL.github.url}" target="_blank" class="btn btn-secondary">Follow →</a>
          </div>
          <div class="contact-card glass-panel">
            <h3><i class="fab fa-twitter"></i> Twitter</h3>
            <p>Quick updates</p>
            <a href="https://twitter.com/chirag_singhal_" target="_blank" class="btn btn-secondary">Follow →</a>
          </div>
        </div>
      </div>

      <!-- Newsletter Section -->
      <div class="newsletter-section glass-panel">
        <div class="newsletter-content">
          <h2><i class="fas fa-paper-plane"></i> Subscribe to Newsletter</h2>
          <p>Get the latest updates on my projects, articles, and tech insights delivered to your inbox.</p>
        </div>
        <div class="newsletter-form-container">
          ${createMailerLiteForm({ buttonText: 'Subscribe', placeholder: 'Enter your email address', className: 'newsletter-form' })}
        </div>
      </div>

    </div>

    <style>
      .contact-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-6);
      }

      @media (max-width: 768px) {
        .contact-layout {
          grid-template-columns: 1fr;
        }
      }

      .contact-form-section {
        padding: var(--space-6);
      }

      .contact-form-section h2 {
        margin-bottom: var(--space-5);
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .contact-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .form-group label {
        font-weight: 500;
        color: var(--text-secondary);
      }

      .form-group input,
      .form-group textarea {
        padding: var(--space-3) var(--space-4);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: var(--text-base);
        transition: all var(--transition-fast);
      }

      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--accent-blue);
        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
      }

      .form-group textarea {
        resize: vertical;
        min-height: 120px;
      }

      .btn-full {
        width: 100%;
        justify-content: center;
      }

      .form-status {
        text-align: center;
        padding: var(--space-3);
        border-radius: var(--radius-md);
        display: none;
      }

      .form-status.success {
        display: block;
        background: rgba(52, 199, 89, 0.2);
        color: var(--accent-green);
      }

      .form-status.error {
        display: block;
        background: rgba(255, 59, 48, 0.2);
        color: var(--accent-red);
      }

      .contact-info-section {
        display: grid;
        gap: var(--space-4);
      }

      .contact-card {
        padding: var(--space-5);
        text-align: center;
        transition: all var(--transition-fast);
      }

      .contact-card:hover {
        transform: translateY(-2px);
        border-color: var(--accent-blue);
      }

      .contact-card h3 {
        margin-bottom: var(--space-2);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
      }

      .contact-card p {
        color: var(--text-secondary);
        margin-bottom: var(--space-4);
      }

      .newsletter-section {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: var(--space-6);
        gap: var(--space-4);
      }

      .newsletter-content h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        margin-bottom: var(--space-2);
      }

      .newsletter-content p {
        color: var(--text-secondary);
        max-width: 500px;
        margin: 0 auto;
      }

      .newsletter-form-container {
        width: 100%;
        max-width: 400px;
      }

      .newsletter-form {
        display: flex;
        gap: var(--space-2);
      }

      .newsletter-form input {
        flex: 1;
        padding: var(--space-3) var(--space-4);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        color: var(--text-primary);
      }

      .newsletter-form button {
        padding: var(--space-3) var(--space-5);
        background: var(--accent-blue);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 500;
        transition: all var(--transition-fast);
      }

      .newsletter-form button:hover {
        background: var(--accent-indigo);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(88, 86, 214, 0.3);
      }

      @media (max-width: 600px) {
        .newsletter-form {
          flex-direction: column;
        }
        .newsletter-form button {
          width: 100%;
        }
      }
    </style>
  `;

  // Form submission handler
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const statusEl = document.getElementById('form-status') as HTMLDivElement;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });

      // Update UI
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      statusEl.className = 'form-status';
      statusEl.style.display = 'none';

      // Check if Formspree is configured
      if (communication.formspree.enabled && communication.formspree.formId) {
        const result = await submitFormspree(data);

        if (result.success) {
          statusEl.className = 'form-status success';
          statusEl.textContent = result.message;
          form.reset();
        } else {
          statusEl.className = 'form-status error';
          statusEl.textContent = result.message;
        }
      } else {
        // Fallback: open mailto
        const mailtoUrl = `mailto:${IDENTITY.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`)}`;
        window.open(mailtoUrl, '_blank');
        statusEl.className = 'form-status success';
        statusEl.textContent = 'Opening your email client...';
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-send"></i> Send Message';
    });
  }
}
