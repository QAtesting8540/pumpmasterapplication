/**
 * Test utilities and helper functions for Pump Master automation
 */

import { Page, Browser, BrowserContext } from '@playwright/test';
import { TestDataFactory } from './TestDataFactory';

export class TestUtils {
  /**
   * Wait for network to be idle
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for all images to load
   */
  static async waitForImages(page: Page): Promise<void> {
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.every(img => img.complete);
    });
  }

  /**
   * Scroll to element and ensure it's visible
   */
  static async scrollToElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.locator(selector).waitFor({ state: 'visible' });
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await page.screenshot({
      path: `screenshots/${filename}`,
      fullPage: true
    });
  }

  /**
   * Generate unique test identifier
   */
  static generateTestId(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Simulate typing with realistic delays
   */
  static async typeWithDelay(page: Page, selector: string, text: string, delay: number = 100): Promise<void> {
    const element = page.locator(selector);
    await element.click();
    await element.clear();

    for (const char of text) {
      await element.type(char);
      await page.waitForTimeout(delay);
    }
  }

  /**
   * Simulate mouse hover with movement
   */
  static async hoverWithMovement(page: Page, selector: string): Promise<void> {
    const element = page.locator(selector);
    const box = await element.boundingBox();

    if (box) {
      // Move to element gradually
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
      await element.hover();
    }
  }

  /**
   * Wait for element to be stable (not moving)
   */
  static async waitForElementStable(page: Page, selector: string, timeout: number = 10000): Promise<void> {
    let previousPosition: { x: number; y: number } | null = null;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const box = await page.locator(selector).boundingBox();
        if (box) {
          const currentPosition = { x: box.x, y: box.y };

          if (
            previousPosition &&
            previousPosition.x === currentPosition.x &&
            previousPosition.y === currentPosition.y
          ) {
            return; // Element is stable
          }

          previousPosition = currentPosition;
        }
        await page.waitForTimeout(100);
      } catch {
        // Element might not be available yet
        await page.waitForTimeout(100);
      }
    }

    throw new Error(`Element ${selector} did not stabilize within ${timeout}ms`);
  }

  /**
   * Clear browser data
   */
  static async clearBrowserData(context: BrowserContext): Promise<void> {
    await context.clearCookies();
    await context.clearPermissions();

    // Clear local storage and session storage
    const pages = context.pages();
    for (const page of pages) {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    }
  }

  /**
   * Set viewport for different devices
   */
  static async setMobileViewport(page: Page): Promise<void> {
    await page.setViewportSize({ width: 375, height: 667 });
  }

  static async setTabletViewport(page: Page): Promise<void> {
    await page.setViewportSize({ width: 768, height: 1024 });
  }

  static async setDesktopViewport(page: Page): Promise<void> {
    await page.setViewportSize({ width: 1920, height: 1080 });
  }

  /**
   * Simulate network conditions
   */
  static async simulateSlowNetwork(page: Page): Promise<void> {
    await page.route('**/*', route => {
      // Add delay to simulate slow network
      setTimeout(() => route.continue(), 2000);
    });
  }

  static async simulateOffline(page: Page): Promise<void> {
    await page.context().setOffline(true);
  }

  static async restoreOnline(page: Page): Promise<void> {
    await page.context().setOffline(false);
  }

  /**
   * Mock API responses
   */
  static async mockApiResponse(page: Page, endpoint: string, response: any): Promise<void> {
    await page.route(`**/*${endpoint}*`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  static async mockApiError(page: Page, endpoint: string, status: number = 500, error: any = {}): Promise<void> {
    await page.route(`**/*${endpoint}*`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(error)
      });
    });
  }

  /**
   * Performance monitoring
   */
  static async measurePageLoadTime(page: Page, url: string): Promise<number> {
    const startTime = Date.now();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    return endTime - startTime;
  }

  static async measureActionTime(action: () => Promise<void>): Promise<number> {
    const startTime = Date.now();
    await action();
    const endTime = Date.now();
    return endTime - startTime;
  }

  /**
   * Memory usage monitoring
   */
  static async getMemoryUsage(page: Page): Promise<any> {
    return await page.evaluate(() => {
      return {
        // @ts-ignore
        usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
        // @ts-ignore
        totalJSHeapSize: performance.memory?.totalJSHeapSize || 0,
        // @ts-ignore
        jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0
      };
    });
  }

  /**
   * Generate test data sets
   */
  static generateLoginTestData() {
    return {
      validCredentials: TestDataFactory.createUser(),
      invalidCredentials: {
        username: 'invalid@test.com',
        password: 'wrongpassword'
      },
      emptyCredentials: {
        username: '',
        password: ''
      },
      specialCharacters: {
        username: 'test+user@example.com',
        password: 'Test@123!#$%^&*()'
      }
    };
  }

  static generatePumpTestData() {
    return {
      validPump: TestDataFactory.createPump(),
      invalidPump: TestDataFactory.createInvalidPump(),
      incompletePump: TestDataFactory.createIncompleteP(),
      boundaryPumps: TestDataFactory.createBoundaryTestPumps(),
      searchPumps: TestDataFactory.createSearchTestPumps(),
      filterPumps: TestDataFactory.createFilterTestPumps()
    };
  }

  /**
   * File operations
   */
  static async downloadFile(page: Page, downloadSelector: string): Promise<string> {
    const downloadPromise = page.waitForEvent('download');
    await page.click(downloadSelector);
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    await download.saveAs(`downloads/${filename}`);
    return filename;
  }

  static async uploadFile(page: Page, inputSelector: string, filePath: string): Promise<void> {
    const fileInput = page.locator(inputSelector);
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Database operations (for API testing)
   */
  static async cleanupTestData(apiHelper: any, testPrefix: string = 'Test'): Promise<void> {
    try {
      // This would be implemented based on your API structure
      // Example: Delete all pumps with names starting with testPrefix
      console.log(`Cleaning up test data with prefix: ${testPrefix}`);
      await apiHelper.cleanup();
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }

  /**
   * Random data generators
   */
  static getRandomEmail(): string {
    return `test${Date.now()}@example.com`;
  }

  static getRandomString(length: number = 10): string {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }

  static getRandomNumber(min: number = 1, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomDate(yearsBack: number = 5): string {
    const start = new Date();
    start.setFullYear(start.getFullYear() - yearsBack);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  }

  /**
   * Validation helpers
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date) && !isNaN(Date.parse(date));
  }

  /**
   * Retry mechanism
   */
  static async retry<T>(action: () => Promise<T>, maxAttempts: number = 3, delay: number = 1000): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxAttempts) {
          throw lastError;
        }
        await this.wait(delay * attempt); // Exponential backoff
      }
    }

    throw lastError!;
  }

  /**
   * Wait utility
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Browser context utilities
   */
  static async createCleanContext(browser: Browser): Promise<BrowserContext> {
    const context = await browser.newContext({
      // Clear permissions and storage
      permissions: [],
      storageState: undefined
    });

    return context;
  }

  /**
   * Environment detection
   */
  static isCI(): boolean {
    return !!process.env.CI;
  }

  static getEnvironment(): string {
    return process.env.NODE_ENV || 'development';
  }

  static isHeadless(): boolean {
    return process.env.HEADLESS === 'true' || this.isCI();
  }

  /**
   * Logging utilities
   */
  static log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  /**
   * Test metadata
   */
  static getTestMetadata() {
    return {
      timestamp: new Date().toISOString(),
      environment: this.getEnvironment(),
      isCI: this.isCI(),
      isHeadless: this.isHeadless(),
      nodeVersion: process.version,
      platform: process.platform
    };
  }
}
