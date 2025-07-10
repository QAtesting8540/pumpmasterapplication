import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Page Elements (Mock-up 1 references)
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly loginForm: Locator;
  private readonly pageTitle: Locator;

  // Mobile-specific elements
  private readonly mobileMenuToggle: Locator;
  private readonly touchIdButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators based on Mock-up 1
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.loginForm = page.locator('[data-testid="login-form"]');
    this.pageTitle = page.locator('h1');

    // Mobile-specific elements
    this.mobileMenuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    this.touchIdButton = page.locator('[data-testid="touch-id-button"]');
  }

  // Page Actions
  async navigateToLogin(): Promise<void> {
    await this.navigate('/login');
    await this.verifyElementVisible(this.loginForm);
  }

  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  // Mobile-specific actions
  async loginWithTouchId(): Promise<void> {
    if (this.isMobile()) {
      await this.clickElement(this.touchIdButton);
    }
  }

  async toggleMobileMenu(): Promise<void> {
    if (this.isMobile()) {
      await this.clickElement(this.mobileMenuToggle);
    }
  }

  // Verification methods
  async verifyLoginPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.loginForm);
    await this.verifyElementVisible(this.usernameInput);
    await this.verifyElementVisible(this.passwordInput);
    await this.verifyElementVisible(this.loginButton);
  }

  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage);
    await this.verifyElementContainsText(this.errorMessage, expectedMessage);
  }

  async verifyLoginButtonEnabled(): Promise<void> {
    await this.verifyElementEnabled(this.loginButton);
  }

  async verifyLoginButtonDisabled(): Promise<void> {
    await this.verifyElementDisabled(this.loginButton);
  }

  async verifyUsernameFieldEmpty(): Promise<void> {
    const value = await this.usernameInput.inputValue();
    if (value !== '') {
      throw new Error('Username field is not empty');
    }
  }

  async verifyPasswordFieldEmpty(): Promise<void> {
    const value = await this.passwordInput.inputValue();
    if (value !== '') {
      throw new Error('Password field is not empty');
    }
  }

  // Get methods for test data validation
  async getErrorMessageText(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async getUsernameValue(): Promise<string> {
    return await this.usernameInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  // Responsive design verification
  async verifyMobileLayout(): Promise<void> {
    if (this.isMobile()) {
      await this.verifyElementVisible(this.mobileMenuToggle);
      // Verify mobile-specific layout elements
      const loginFormWidth = await this.loginForm.boundingBox();
      if (loginFormWidth && loginFormWidth.width > 400) {
        throw new Error('Login form is too wide for mobile layout');
      }
    }
  }

  async verifyTabletLayout(): Promise<void> {
    if (this.isTablet()) {
      // Verify tablet-specific layout elements
      const loginFormWidth = await this.loginForm.boundingBox();
      if (loginFormWidth && (loginFormWidth.width < 400 || loginFormWidth.width > 600)) {
        throw new Error('Login form width is not appropriate for tablet layout');
      }
    }
  }

  async verifyDesktopLayout(): Promise<void> {
    if (this.isDesktop()) {
      // Verify desktop-specific layout elements
      const loginFormWidth = await this.loginForm.boundingBox();
      if (loginFormWidth && loginFormWidth.width < 400) {
        throw new Error('Login form is too narrow for desktop layout');
      }
    }
  }
}
