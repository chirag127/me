import { test, expect } from '@playwright/test';

test.describe('Work Section', () => {
  test('work page loads', async ({ page }) => {
    await page.goto('/work');
    await expect(page).toHaveURL(/\/work$/);
  });

  test('career page loads', async ({ page }) => {
    await page.goto('/work/career');
    await expect(page).toHaveURL(/\/work\/career$/);
  });

  test('skills page loads', async ({ page }) => {
    await page.goto('/work/skills');
    await expect(page).toHaveURL(/\/work\/skills$/);
  });

  test('projects page loads', async ({ page }) => {
    await page.goto('/work/projects');
    await expect(page).toHaveURL(/\/work\/projects$/);
  });

  test('education page loads', async ({ page }) => {
    await page.goto('/work/education');
    await expect(page).toHaveURL(/\/work\/education$/);
  });

  test('certifications page loads', async ({ page }) => {
    await page.goto('/work/certifications');
    await expect(page).toHaveURL(/\/work\/certifications$/);
  });
});

test.describe('Code Section', () => {
  test('code dashboard loads', async ({ page }) => {
    await page.goto('/code');
    await expect(page).toHaveURL(/\/code$/);
  });

  test('repos page loads', async ({ page }) => {
    await page.goto('/code/repos');
    await expect(page).toHaveURL(/\/code\/repos$/);
  });

  test('npm page loads', async ({ page }) => {
    await page.goto('/code/npm');
    await expect(page).toHaveURL(/\/code\/npm$/);
  });

  test('stackoverflow page loads', async ({ page }) => {
    await page.goto('/code/stackoverflow');
    await expect(page).toHaveURL(/\/code\/stackoverflow$/);
  });
});

test.describe('Me Section', () => {
  test('me page loads', async ({ page }) => {
    await page.goto('/me');
    await expect(page).toHaveURL(/\/me$/);
  });

  test('story page loads', async ({ page }) => {
    await page.goto('/me/story');
    await expect(page).toHaveURL(/\/me\/story$/);
  });

  test('philosophy page loads', async ({ page }) => {
    await page.goto('/me/philosophy');
    await expect(page).toHaveURL(/\/me\/philosophy$/);
  });

  test('interests page loads', async ({ page }) => {
    await page.goto('/me/interests');
    await expect(page).toHaveURL(/\/me\/interests$/);
  });

  test('gear page loads', async ({ page }) => {
    await page.goto('/me/gear');
    await expect(page).toHaveURL(/\/me\/gear$/);
  });
});

test.describe('Connect Section', () => {
  test('connect page loads', async ({ page }) => {
    await page.goto('/connect');
    await expect(page).toHaveURL(/\/connect$/);
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/connect/contact');
    await expect(page).toHaveURL(/\/connect\/contact$/);
  });
});

test.describe('System Section', () => {
  test('system page loads', async ({ page }) => {
    await page.goto('/system');
    await expect(page).toHaveURL(/\/system$/);
  });

  test('changelog page loads', async ({ page }) => {
    await page.goto('/system/changelog');
    await expect(page).toHaveURL(/\/system\/changelog$/);
  });
});

test.describe('Legal Pages', () => {
  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL(/\/privacy$/);
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveURL(/\/terms$/);
  });

  test('cookie policy page loads', async ({ page }) => {
    await page.goto('/cookie-policy');
    await expect(page).toHaveURL(/\/cookie-policy$/);
  });

  test('disclaimer page loads', async ({ page }) => {
    await page.goto('/disclaimer');
    await expect(page).toHaveURL(/\/disclaimer$/);
  });
});

test.describe('Gaming Section', () => {
  test('gaming page loads', async ({ page }) => {
    await page.goto('/gaming');
    await expect(page).toHaveURL(/\/gaming$/);
  });
});

test.describe('404 Page', () => {
  test('non-existent page returns 404', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response?.status()).toBe(404);
  });
});
