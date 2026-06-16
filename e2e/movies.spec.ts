import { test, expect } from '@playwright/test';

test.describe('Movies Section', () => {
  test('movies page loads', async ({ page }) => {
    await page.goto('/library/movies');
    await expect(page).toHaveURL(/\/library\/movies$/);
    await expect(page.locator('h1')).toContainText('Movies');
  });

  test('movies page has sub-page navigation', async ({ page }) => {
    await page.goto('/library/movies');
    await expect(page.locator('a[href="/library/movies-watched"]')).toBeVisible();
    await expect(page.locator('a[href="/library/movies-rated"]')).toBeVisible();
    await expect(page.locator('a[href="/library/movies-watchlist"]')).toBeVisible();
  });

  test('movies page shows stats', async ({ page }) => {
    await page.goto('/library/movies');
    await expect(page.locator('text=Films Logged')).toBeVisible();
    await expect(page.locator('text=Mean Rating')).toBeVisible();
  });

  test('movies page has back to library link', async ({ page }) => {
    await page.goto('/library/movies');
    const backLink = page.locator('a[href="/library"]');
    await expect(backLink).toBeVisible();
  });

  test('movies page has Trakt profile link', async ({ page }) => {
    await page.goto('/library/movies');
    const traktLink = page.locator('a[href="https://trakt.tv"]');
    await expect(traktLink).toBeVisible();
  });
});
