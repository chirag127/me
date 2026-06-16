import { test, expect } from '@playwright/test';

test.describe('Navigation Sidebar', () => {
  test('sidebar nav links are present on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toBeVisible();

    // Check all main nav sections
    const navLinks = [
      { name: 'Home', href: '/' },
      { name: 'Work', href: '/work' },
      { name: 'Code', href: '/code' },
      { name: 'Library', href: '/library' },
      { name: 'Gaming', href: '/gaming' },
      { name: 'Me', href: '/me' },
      { name: 'Connect', href: '/connect' },
      { name: 'System', href: '/system' },
    ];

    for (const link of navLinks) {
      await expect(sidebar.locator(`a[href="${link.href}"]`).first()).toBeVisible();
    }
  });

  test('sidebar shows availability status', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await expect(page.locator('text=Available for hire')).toBeVisible();
  });

  test('navigating to Work page works', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.click('a[href="/work"]');
    await expect(page).toHaveURL(/\/work$/);
  });

  test('navigating to Library page works', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.click('a[href="/library"]');
    await expect(page).toHaveURL(/\/library$/);
  });

  test('navigating to Connect page works', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.click('a[href="/connect"]');
    await expect(page).toHaveURL(/\/connect$/);
  });
});
