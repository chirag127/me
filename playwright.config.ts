import { defineConfig, devices } from '@playwright/test';

// Allow forcing a specific Chromium binary when the bundled one can't
// download (e.g. Windows Defender ASR blocking the post-install script).
// Set CHROME_EXECUTABLE_PATH=... in the shell to override.
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH;
const chromiumLaunchOptions = chromeExecutablePath
  ? { launchOptions: { executablePath: chromeExecutablePath } }
  : {};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? 'github' : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], ...chromiumLaunchOptions },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'], ...chromiumLaunchOptions },
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    // PLAYWRIGHT_PREVIEW_ONLY=1 → skip the build (assumes dist/ is fresh).
    // Default still builds first so CI runs work without manual prep.
    command: process.env.PLAYWRIGHT_PREVIEW_ONLY
      ? 'pnpm run preview'
      : 'pnpm run build && pnpm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 240000,
  },
});
