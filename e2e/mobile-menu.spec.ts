import { test, expect } from '@playwright/test';

test.describe('Mobile Hamburger Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
  });

  test('hamburger button is visible on mobile', async ({ page }) => {
    const toggle = page.locator('#sidebar-toggle');
    await expect(toggle).toBeVisible();
  });

  test('sidebar is hidden by default on mobile', async ({ page }) => {
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('clicking hamburger opens sidebar', async ({ page }) => {
    const toggle = page.locator('#sidebar-toggle');
    const sidebar = page.locator('#sidebar');

    await toggle.click();
    await expect(sidebar).not.toHaveClass(/-translate-x-full/);
  });

  test('overlay appears when sidebar is open', async ({ page }) => {
    const toggle = page.locator('#sidebar-toggle');
    const overlay = page.locator('#sidebar-overlay');

    await toggle.click();
    await expect(overlay).not.toHaveClass(/opacity-0/);
  });

  test('clicking overlay closes sidebar', async ({ page }) => {
    const toggle = page.locator('#sidebar-toggle');
    const sidebar = page.locator('#sidebar');
    const overlay = page.locator('#sidebar-overlay');

    await toggle.click();
    await expect(sidebar).not.toHaveClass(/-translate-x-full/);

    await overlay.click();
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('close button inside sidebar closes it', async ({ page }) => {
    const toggle = page.locator('#sidebar-toggle');
    const sidebar = page.locator('#sidebar');
    const closeBtn = page.locator('#sidebar-close');

    await toggle.click();
    await expect(sidebar).not.toHaveClass(/-translate-x-full/);

    await closeBtn.click();
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('clicking nav link closes sidebar on mobile', async ({ page }) => {
    const toggle = page.locator('#sidebar-toggle');
    const sidebar = page.locator('#sidebar');

    await toggle.click();
    await expect(sidebar).not.toHaveClass(/-translate-x-full/);

    await page.click('a[href="/work"]');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('pressing Escape closes sidebar', async ({ page }) => {
    const toggle = page.locator('#sidebar-toggle');
    const sidebar = page.locator('#sidebar');

    await toggle.click();
    await expect(sidebar).not.toHaveClass(/-translate-x-full/);

    await page.keyboard.press('Escape');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('body scroll is locked when sidebar is open', async ({ page }) => {
    const toggle = page.locator('#sidebar-toggle');
    await toggle.click();

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');
  });
});
