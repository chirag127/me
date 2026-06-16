import { test, expect } from '@playwright/test';

test.describe('Books Section', () => {
  test('books page loads', async ({ page }) => {
    await page.goto('/library/books');
    await expect(page).toHaveURL(/\/library\/books$/);
    await expect(page.locator('h1')).toContainText('Books');
  });

  test('books page has sub-page navigation', async ({ page }) => {
    await page.goto('/library/books');
    await expect(page.locator('a[href="/library/books-read"]')).toBeVisible();
    await expect(page.locator('a[href="/library/books-want-to-read"]')).toBeVisible();
  });

  test('books page shows stats', async ({ page }) => {
    await page.goto('/library/books');
    await expect(page.locator('text=Books Read')).toBeVisible();
    await expect(page.locator('text=Currently Reading')).toBeVisible();
    await expect(page.locator('text=Want to Read')).toBeVisible();
  });

  test('books page has back to library link', async ({ page }) => {
    await page.goto('/library/books');
    const backLink = page.locator('a[href="/library"]');
    await expect(backLink).toBeVisible();
  });

  test('books read sub-page loads', async ({ page }) => {
    await page.goto('/library/books-read');
    await expect(page).toHaveURL(/\/library\/books-read$/);
  });

  test('books want-to-read sub-page loads', async ({ page }) => {
    await page.goto('/library/books-want-to-read');
    await expect(page).toHaveURL(/\/library\/books-want-to-read$/);
  });

  test('books page has OpenLibrary profile link', async ({ page }) => {
    await page.goto('/library/books');
    const olLink = page.locator('a[href*="openlibrary.org"]');
    await expect(olLink).toBeVisible();
  });
});
