import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables
config();

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  projects: [
    // Web Testing Projects
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        viewport: { width: 1920, height: 1080 }
      }
    },

    // Mobile Testing Projects
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    },
    {
      name: 'Mobile Edge',
      use: { ...devices['Galaxy S21'] }
    },

    // Tablet Testing Projects
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] }
    },
    {
      name: 'iPad Mini',
      use: { ...devices['iPad Mini'] }
    },

    // API Testing Project
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api'
      }
    }
  ],

  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run start',
        port: 3000,
        reuseExistingServer: !process.env.CI
      }
});
