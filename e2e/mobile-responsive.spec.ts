import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('homepage hero text is readable on mobile', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    // Check font size is not too large for mobile
    const fontSize = await h1.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).fontSize)
    );
    expect(fontSize).toBeLessThanOrEqual(48);
  });

  test('value prop cards stack on mobile', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('text=/Scalable|AI-First|Cloud-Native|Full-Stack/i');
    await expect(cards.first()).toBeVisible();
  });

  test('stats grid renders on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=GitHub Stars')).toBeVisible();
    await expect(page.locator('text=Live Projects')).toBeVisible();
  });

  test('featured projects stack on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Featured Work')).toBeVisible();
  });

  test('footer renders correctly on mobile', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('a[href="/privacy"]')).toBeVisible();
  });

  test('page title shows in header on mobile', async ({ page }) => {
    await page.goto('/library');
    const headerTitle = page.locator('header h1');
    await expect(headerTitle).toBeVisible();
    await expect(headerTitle).toContainText('Library');
  });

  test('hire me CTA is visible on mobile', async ({ page }) => {
    await page.goto('/');
    const hireBtn = page.locator('a[href="/connect"]').filter({ hasText: 'Hire Me' }).first();
    await expect(hireBtn).toBeVisible();
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.goto('');
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});
