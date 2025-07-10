import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common methods for all pages
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  async fillInput(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  async selectDropdownOption(locator: Locator, option: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption(option);
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) || '';
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isElementEnabled(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isEnabled();
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async waitForUrl(url: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  async verifyElementText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  async verifyElementContainsText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async verifyElementHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  async verifyElementEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  async verifyElementDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  // Mobile-specific methods
  async swipeLeft(): Promise<void> {
    const viewport = this.page.viewportSize();
    if (viewport) {
      await this.page.mouse.move(viewport.width * 0.8, viewport.height * 0.5);
      await this.page.mouse.down();
      await this.page.mouse.move(viewport.width * 0.2, viewport.height * 0.5);
      await this.page.mouse.up();
    }
  }

  async swipeRight(): Promise<void> {
    const viewport = this.page.viewportSize();
    if (viewport) {
      await this.page.mouse.move(viewport.width * 0.2, viewport.height * 0.5);
      await this.page.mouse.down();
      await this.page.mouse.move(viewport.width * 0.8, viewport.height * 0.5);
      await this.page.mouse.up();
    }
  }

  async pinchZoom(scale: number = 2): Promise<void> {
    await this.page.evaluate(scale => {
      // Simulate pinch zoom on mobile
      const event = new WheelEvent('wheel', {
        deltaY: scale > 1 ? -100 : 100,
        ctrlKey: true
      });
      document.dispatchEvent(event);
    }, scale);
  }

  // Device detection
  isMobile(): boolean {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width < 768 : false;
  }

  isTablet(): boolean {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width >= 768 && viewport.width < 1024 : false;
  }

  isDesktop(): boolean {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width >= 1024 : false;
  }
}
