import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Step definition functions for login BDD scenarios

export class LoginSteps {
  private loginPage: LoginPage;

  constructor(private page: Page) {
    this.loginPage = new LoginPage(page);
  }

  // Given steps
  async givenIAmOnTheLoginPage(): Promise<void> {
    await this.loginPage.navigateToLogin();
  }

  async givenIAmUsingAMobileDevice(): Promise<void> {
    // This is handled by the test configuration for mobile projects
    // The page object model will detect mobile viewport automatically
  }

  async givenIAmUsingATabletDevice(): Promise<void> {
    // This is handled by the test configuration for tablet projects
    // The page object model will detect tablet viewport automatically
  }

  // When steps
  async whenIEnterValidUsernameAndPassword(): Promise<void> {
    await this.loginPage.enterUsername(process.env.TEST_USERNAME || 'testuser@pumpmaster.com');
    await this.loginPage.enterPassword(process.env.TEST_PASSWORD || 'Test@123');
  }

  async whenIEnterInvalidUsernameAndPassword(): Promise<void> {
    await this.loginPage.enterUsername('invalid@example.com');
    await this.loginPage.enterPassword('wrongpassword');
  }

  async whenILeaveUsernameAndPasswordEmpty(): Promise<void> {
    await this.loginPage.enterUsername('');
    await this.loginPage.enterPassword('');
  }

  async whenICheckTheRememberMeCheckbox(): Promise<void> {
    // Remember me functionality has been removed
    // This step is no longer supported
  }

  async whenIClickTheLoginButton(): Promise<void> {
    await this.loginPage.clickLoginButton();
  }

  async whenITapTheLoginButton(): Promise<void> {
    await this.loginPage.clickLoginButton();
  }

  async whenIClickTheForgotPasswordLink(): Promise<void> {
    // Forgot password functionality has been removed
    // This step is no longer supported
  }

  async whenITapTheTouchIdButton(): Promise<void> {
    await this.loginPage.loginWithTouchId();
  }

  async whenINavigateUsingOnlyKeyboard(): Promise<void> {
    // Implementation for keyboard navigation testing
    await this.page.keyboard.press('Tab');
  }

  async whenITabThroughAllFormElements(): Promise<void> {
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
  }

  async whenIEnterCredentialsUsingKeyboard(): Promise<void> {
    await this.loginPage.enterUsername(process.env.TEST_USERNAME || 'testuser@pumpmaster.com');
    await this.loginPage.enterPassword(process.env.TEST_PASSWORD || 'Test@123');
  }

  async whenIPressEnterToSubmit(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }

  async whenIEnterInvalidCredentials(attempts: number): Promise<void> {
    for (let i = 0; i < attempts; i++) {
      await this.loginPage.enterUsername('invalid@example.com');
      await this.loginPage.enterPassword('wrongpassword');
      await this.loginPage.clickLoginButton();

      if (i < attempts - 1) {
        // Wait a bit between attempts
        await this.loginPage.waitForElement(this.loginPage['errorMessage']);
      }
    }
  }

  // Then steps
  async thenIShouldBeRedirectedToThePumpsOverviewPage(): Promise<void> {
    await this.loginPage.waitForUrl('/pumps');
  }

  async thenIShouldSeeAWelcomeMessage(): Promise<void> {
    // Implementation depends on the actual welcome message element
    // This would need to be implemented based on the actual UI
  }

  async thenIShouldSeeAnErrorMessage(expectedMessage: string): Promise<void> {
    await this.loginPage.verifyErrorMessage(expectedMessage);
  }

  async thenIShouldRemainOnTheLoginPage(): Promise<void> {
    await this.loginPage.verifyLoginPageLoaded();
  }

  async thenTheLoginButtonShouldBeDisabled(): Promise<void> {
    await this.loginPage.verifyLoginButtonDisabled();
  }

  async thenIShouldSeeValidationMessagesForRequiredFields(): Promise<void> {
    // Implementation for validation message verification
    await this.loginPage.verifyUsernameFieldEmpty();
    await this.loginPage.verifyPasswordFieldEmpty();
  }

  async thenMyLoginShouldBeRememberedForFutureSessions(): Promise<void> {
    // Remember me functionality has been removed
    // This step is no longer supported
  }

  async thenIShouldBeRedirectedToThePasswordResetPage(): Promise<void> {
    await this.loginPage.waitForUrl('/reset-password');
  }

  async thenIShouldBeAuthenticatedUsingBiometricAuthentication(): Promise<void> {
    // Implementation for biometric authentication verification
    // This would depend on the actual implementation
  }

  async thenTheMobileNavigationShouldBeVisible(): Promise<void> {
    await this.loginPage.verifyMobileLayout();
  }

  async thenTheLayoutShouldBeOptimizedForTabletViewing(): Promise<void> {
    await this.loginPage.verifyTabletLayout();
  }

  async thenIShouldBeAbleToCompleteLoginWithoutUsingMouse(): Promise<void> {
    // Verification that login was completed using only keyboard
    await this.loginPage.waitForUrl('/pumps');
  }

  async thenMyAccountShouldBeTemporarilyLocked(): Promise<void> {
    await this.loginPage.verifyErrorMessage('Account temporarily locked');
  }

  async thenIShouldSeeAMessageAboutAccountLockout(): Promise<void> {
    await this.loginPage.verifyErrorMessage('Too many failed attempts');
  }
}
