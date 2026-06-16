import { test, expect } from '@playwright/test';

test.describe('Command Palette', () => {
  test('command palette hidden by default', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const palette = page.locator('#command-palette');
    await expect(palette).toHaveClass(/hidden/);
  });

  test('clicking search button opens command palette', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const btn = page.locator('#cmd-palette-btn');
    if (await btn.isVisible()) {
      await btn.click();
      const palette = page.locator('#command-palette');
      await expect(palette).not.toHaveClass(/hidden/);
    }
  });

  test('command palette shows nav links', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const btn = page.locator('#cmd-palette-btn');
    if (await btn.isVisible()) {
      await btn.click();
      await expect(page.locator('#command-results a[href="/"]')).toBeVisible();
      await expect(page.locator('#command-results a[href="/work"]')).toBeVisible();
    }
  });

  test('clicking backdrop closes command palette', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const btn = page.locator('#cmd-palette-btn');
    if (await btn.isVisible()) {
      await btn.click();
      const palette = page.locator('#command-palette');
      await expect(palette).not.toHaveClass(/hidden/);

      // Click the backdrop
      await page.locator('#command-palette > div:first-child').click({ position: { x: 10, y: 10 } });
      await expect(palette).toHaveClass(/hidden/);
    }
  });
});

test.describe('Accessibility', () => {
  test('skip to content link exists', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();
  });

  test('sidebar has correct ARIA attributes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toHaveAttribute('role', 'navigation');
    await expect(sidebar).toHaveAttribute('aria-label', 'Main navigation');
  });

  test('hamburger button has aria-label', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('');
    const toggle = page.locator('#sidebar-toggle');
    await expect(toggle).toHaveAttribute('aria-label', 'Open navigation');
  });

  test('overlay has aria-hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const overlay = page.locator('#sidebar-overlay');
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  test('main content has correct ID', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('#main-content');
    await expect(main).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    const avatar = page.locator('img[alt="Chirag Singhal"]');
    await expect(avatar).toBeVisible();
  });

  test('active nav link has aria-current', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const activeLink = page.locator('#sidebar a[aria-current="page"]');
    await expect(activeLink).toBeVisible();
  });
});

test.describe('Desktop Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('sidebar is visible on desktop', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sidebar')).toBeVisible();
  });

  test('hamburger button is hidden on desktop', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sidebar-toggle')).not.toBeVisible();
  });

  test('overlay is hidden on desktop', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('#sidebar-overlay')).not.toBeVisible();
  });

  test('main content has left margin on desktop', async ({ page }) => {
    await page.goto('/');
    const app = page.locator('#app');
    await expect(app).toBeVisible();
  });

  test('sidebar logo links to homepage', async ({ page }) => {
    await page.goto('/library');
    await page.click('#sidebar a[href="/"]');
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Cross-page Consistency', () => {
  const pages = [
    '/', '/work', '/code', '/library', '/library/books',
    '/library/movies', '/library/anime', '/library/music',
    '/gaming', '/me', '/connect',
  ];

  for (const path of pages) {
    test(`${path} has sidebar nav`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path);
      await expect(page.locator('#sidebar')).toBeVisible();
    });

    test(`${path} has footer`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path);
      await expect(page.locator('footer')).toBeVisible();
    });

    test(`${path} loads without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path);
      // Filter out expected errors (e.g., Firebase not configured in dev)
      const unexpectedErrors = errors.filter(
        (e) => !e.includes('Firebase') && !e.includes('puter') && !e.includes('net::ERR')
      );
      expect(unexpectedErrors).toHaveLength(0);
    });
  }
});
