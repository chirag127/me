import { test, expect } from '@playwright/test';

test.describe('Visual Screenshots - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('homepage full page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('desktop-homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('library page screenshot', async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('desktop-library.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('books page screenshot', async ({ page }) => {
    await page.goto('/library/books');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('desktop-books.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('movies page screenshot', async ({ page }) => {
    await page.goto('/library/movies');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('desktop-movies.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('work page screenshot', async ({ page }) => {
    await page.goto('/work');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('desktop-work.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('connect page screenshot', async ({ page }) => {
    await page.goto('/connect');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('desktop-connect.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe('Visual Screenshots - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('homepage mobile screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('mobile sidebar open screenshot', async ({ page }) => {
    await page.goto('/');
    await page.locator('#sidebar-toggle').click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('mobile-sidebar-open.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('library mobile screenshot', async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-library.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('books page mobile screenshot', async ({ page }) => {
    await page.goto('/library/books');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-books.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('movies page mobile screenshot', async ({ page }) => {
    await page.goto('/library/movies');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-movies.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
