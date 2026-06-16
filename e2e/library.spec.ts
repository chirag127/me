import { test, expect } from '@playwright/test';

test.describe('Library Section', () => {
  test('library hub page loads', async ({ page }) => {
    await page.goto('/library');
    await expect(page).toHaveURL(/\/library$/);
    await expect(page.locator('h1')).toContainText('Library');
  });

  test('library category cards render', async ({ page }) => {
    await page.goto('/library');
    await expect(page.locator('text=Movies')).toBeVisible();
    await expect(page.locator('text=Anime')).toBeVisible();
    await expect(page.locator('text=Books')).toBeVisible();
    await expect(page.locator('text=Music')).toBeVisible();
  });

  test('library stats render', async ({ page }) => {
    await page.goto('/library');
    // Check that some stat values are present
    const stats = page.locator('text=/Read|Watching|Scrobbles|Tracked/');
    await expect(stats.first()).toBeVisible();
  });

  test('more collections section renders', async ({ page }) => {
    await page.goto('/library');
    await expect(page.locator('text=More Collections')).toBeVisible();
    await expect(page.locator('text=Manga')).toBeVisible();
    await expect(page.locator('text=Podcasts')).toBeVisible();
  });

  test('navigating to books page works', async ({ page }) => {
    await page.goto('/library');
    await page.click('a[href="/library/books"]');
    await expect(page).toHaveURL(/\/library\/books$/);
  });

  test('navigating to movies page works', async ({ page }) => {
    await page.goto('/library');
    await page.click('a[href="/library/movies"]');
    await expect(page).toHaveURL(/\/library\/movies$/);
  });
});
