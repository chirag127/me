import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Chirag Singhal/);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').filter({ hasText: 'Engineering' }).first();
    await expect(h1).toBeVisible();
  });

  test('status badge shows current role', async ({ page }) => {
    await page.goto('');
    const badge = page.locator('text=/Available|Software Engineer|TCS/i').first();
    await expect(badge).toBeVisible();
  });

  test('CTAs are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="/work"]').first()).toBeVisible();
    await expect(page.locator('a[href="/connect"]').first()).toBeVisible();
  });

  test('value proposition cards render', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('text=/Scalable|AI-First|Cloud-Native|Full-Stack/i');
    await expect(cards.first()).toBeVisible();
  });

  test('stats section renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=GitHub Stars')).toBeVisible();
    await expect(page.locator('text=LeetCode Solved')).toBeVisible();
  });

  test('featured projects section renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Featured Work')).toBeVisible();
  });

  test('testimonials section renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=What People Say')).toBeVisible();
  });

  test('blog/articles section renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Technical Insights')).toBeVisible();
  });

  test('hire CTA section renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator("text=Let's build something great")).toBeVisible();
  });

  test('footer renders with correct links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('a[href="/privacy"]')).toBeVisible();
    await expect(footer.locator('a[href="/terms"]')).toBeVisible();
    await expect(footer.locator('a[href="https://github.com/chirag127"]')).toBeVisible();
  });

  test('social links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="https://github.com/chirag127"]').first()).toBeVisible();
    await expect(page.locator('a[href="https://linkedin.com/in/chirag127"]').first()).toBeVisible();
  });
});
