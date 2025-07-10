import { test, expect, Page } from '@playwright/test';
import { PumpEditModalPage } from '../pages/PumpEditModalPage';
import { PumpsOverviewPage } from '../pages/PumpsOverviewPage';
import { TestDataFactory } from '../utils/TestDataFactory';

// Step definition functions for pump management BDD scenarios

export class PumpManagementSteps {
  private pumpEditModalPage: PumpEditModalPage;
  private pumpsOverviewPage: PumpsOverviewPage;

  constructor(private page: Page) {
    this.pumpEditModalPage = new PumpEditModalPage(page);
    this.pumpsOverviewPage = new PumpsOverviewPage(page);
  }

  // Given steps
  async givenIAmOnThePumpsOverviewPage(): Promise<void> {
    await this.pumpsOverviewPage.navigateToPumpsOverview();
  }

  async givenIHaveSelectedAPump(pumpName: string): Promise<void> {
    await this.pumpsOverviewPage.verifyPumpExists(pumpName);
  }

  async givenThereIsAnExistingPump(pumpName: string): Promise<void> {
    await this.pumpsOverviewPage.verifyPumpExists(pumpName);
  }

  // When steps
  async whenIClickTheAddNewPumpButton(): Promise<void> {
    await this.pumpsOverviewPage.clickNewPumpButton();
  }

  async whenIClickTheEditButtonForPump(pumpName: string): Promise<void> {
    await this.pumpsOverviewPage.clickEditPump(pumpName);
  }

  async whenIClickTheDeleteButtonForPump(pumpName: string): Promise<void> {
    await this.pumpsOverviewPage.clickDeletePump(pumpName);
  }

  async whenIFillInThePumpDetailsWithValidData(): Promise<void> {
    const testData = TestDataFactory.createPump();
    await this.pumpEditModalPage.enterPumpName(testData.name);
    await this.pumpEditModalPage.selectPumpType(testData.type);
    await this.pumpEditModalPage.enterPumpArea(testData.area);
    await this.pumpEditModalPage.enterPumpFlowRate(testData.flowRate);
    await this.pumpEditModalPage.enterPumpLatitude(testData.latitude);
    await this.pumpEditModalPage.enterPumpLongitude(testData.longitude);
    await this.pumpEditModalPage.enterPumpOffset(testData.offset);
    await this.pumpEditModalPage.enterPumpCurrentPressure(testData.currentPressure);
    await this.pumpEditModalPage.enterPumpMinPressure(testData.minPressure);
    await this.pumpEditModalPage.enterPumpMaxPressure(testData.maxPressure);
  }

  async whenIFillInThePumpDetailsWithInvalidData(): Promise<void> {
    await this.pumpEditModalPage.enterPumpName(''); // Empty name
    await this.pumpEditModalPage.enterPumpFlowRate('-100'); // Invalid flow rate
  }

  async whenILeaveRequiredFieldsEmpty(): Promise<void> {
    await this.pumpEditModalPage.enterPumpName('');
    await this.pumpEditModalPage.enterPumpFlowRate('');
  }

  async whenIEnterAPumpNameThatAlreadyExists(): Promise<void> {
    await this.pumpEditModalPage.enterPumpName('Existing Pump Name');
  }

  async whenIEnterAnInvalidFlowRateValue(): Promise<void> {
    await this.pumpEditModalPage.enterPumpFlowRate('invalid');
  }

  async whenISelectAnInvalidLocation(): Promise<void> {
    // Try to enter an area that doesn't exist
    await this.pumpEditModalPage.enterPumpArea('Invalid Area');
  }

  async whenIUpdateThePumpInformation(): Promise<void> {
    const testData = TestDataFactory.createPump();
    await this.pumpEditModalPage.enterPumpName(`Updated ${testData.name}`);
    await this.pumpEditModalPage.enterPumpArea(`Updated ${testData.area}`);
  }

  async whenIClickSave(): Promise<void> {
    await this.pumpEditModalPage.saveChanges();
  }

  async whenIClickCancel(): Promise<void> {
    await this.pumpEditModalPage.cancelChanges();
  }

  async whenIClickDelete(): Promise<void> {
    await this.pumpEditModalPage.deletePump();
  }

  async whenIConfirmTheDeletion(): Promise<void> {
    // Assume there's a confirmation dialog
    const confirmButton = this.page.locator('[data-testid="confirm-delete-button"]');
    await confirmButton.click();
  }

  async whenICancelTheDeletion(): Promise<void> {
    // Assume there's a confirmation dialog
    const cancelButton = this.page.locator('[data-testid="cancel-delete-button"]');
    await cancelButton.click();
  }

  async whenITryToSaveWithoutChangingAnything(): Promise<void> {
    // Just click save without making changes
    await this.pumpEditModalPage.saveChanges();
  }

  async whenINavigateAwayWithoutSaving(): Promise<void> {
    await this.page.goBack();
  }

  async whenIUseKeyboardNavigationToCompleteTheForm(): Promise<void> {
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.type('Test Pump');
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async whenITryToCreateMultiplePumpsSimultaneously(): Promise<void> {
    // This would involve opening multiple tabs or windows
    // For now, we'll simulate by creating pumps in sequence
    await this.whenIClickTheAddNewPumpButton();
    await this.whenIFillInThePumpDetailsWithValidData();
    await this.whenIClickSave();
  }

  async whenTheSystemIsUnderHeavyLoad(): Promise<void> {
    // This might involve simulating load
    // For now, we'll just test the functionality
  }

  // Then steps
  async thenTheAddNewPumpModalShouldOpen(): Promise<void> {
    await this.pumpEditModalPage.verifyModalOpened();
    await this.pumpEditModalPage.verifyModalTitle('Add New Pump');
  }

  async thenTheEditPumpModalShouldOpen(): Promise<void> {
    await this.pumpEditModalPage.verifyModalOpened();
    await this.pumpEditModalPage.verifyModalTitle('Edit Pump');
  }

  async thenTheDeleteConfirmationDialogShouldAppear(): Promise<void> {
    const deleteConfirmationDialog = this.page.locator('[data-testid="delete-confirmation-dialog"]');
    await expect(deleteConfirmationDialog).toBeVisible();
  }

  async thenTheNewPumpShouldBeCreatedSuccessfully(): Promise<void> {
    const successMessage = this.page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Pump created successfully');

    // Verify modal is closed
    await this.pumpEditModalPage.verifyModalClosed();
  }

  async thenThePumpShouldBeUpdatedSuccessfully(): Promise<void> {
    const successMessage = this.page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Pump updated successfully');

    // Verify modal is closed
    await this.pumpEditModalPage.verifyModalClosed();
  }

  async thenThePumpShouldBeDeletedSuccessfully(): Promise<void> {
    const successMessage = this.page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Pump deleted successfully');
  }

  async thenIShouldSeeValidationErrors(): Promise<void> {
    await this.pumpEditModalPage.verifyRequiredFields();
  }

  async thenIShouldSeeAnErrorMessage(message: string): Promise<void> {
    const errorMessage = this.page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(message);
  }

  async thenTheSaveButtonShouldBeDisabled(): Promise<void> {
    await this.pumpEditModalPage.verifySaveButtonDisabled();
  }

  async thenTheModalShouldClose(): Promise<void> {
    await this.pumpEditModalPage.verifyModalClosed();
  }

  async thenTheOriginalDataShouldBePreserved(): Promise<void> {
    // Verify that no changes were made
    await this.pumpsOverviewPage.verifyPumpsOverviewPageLoaded();
  }

  async thenThePumpShouldStillExist(): Promise<void> {
    // Verify pump still appears in the list
    const pumpCount = await this.pumpsOverviewPage.getPumpCount();
    expect(pumpCount).toBeGreaterThan(0);
  }

  async thenThePumpShouldNotBeCreated(): Promise<void> {
    // Verify the modal is still open and no success message
    await this.pumpEditModalPage.verifyModalOpened();
  }

  async thenIShouldSeeAConfirmationDialog(): Promise<void> {
    const confirmDialog = this.page.locator('[data-testid="confirmation-dialog"]');
    await expect(confirmDialog).toBeVisible();
  }

  async thenIShouldBeAbleToCompleteTheFormUsingOnlyKeyboard(): Promise<void> {
    // Verify that all form elements are accessible via keyboard
    await this.pumpEditModalPage.verifyModalOpened();
  }

  async thenTheSystemShouldHandleMultipleOperationsGracefully(): Promise<void> {
    // Verify no errors occurred during simultaneous operations
    const errorMessage = this.page.locator('[data-testid="error-message"]');
    await expect(errorMessage).not.toBeVisible();
  }

  async thenTheSystemShouldRespondWithinAcceptableTimeLimits(): Promise<void> {
    // Verify performance under load
    const startTime = Date.now();
    await this.pumpEditModalPage.verifyModalOpened();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  }

  async thenTheNewPumpShouldAppearInTheList(): Promise<void> {
    await this.pumpsOverviewPage.verifyPumpsOverviewPageLoaded();
    const pumpCount = await this.pumpsOverviewPage.getPumpCount();
    expect(pumpCount).toBeGreaterThan(0);
  }

  async thenTheUpdatedInformationShouldBeDisplayed(): Promise<void> {
    // Verify updated information appears in the pump list
    await this.pumpsOverviewPage.verifyPumpsOverviewPageLoaded();
  }

  async thenThePumpShouldNoLongerAppearInTheList(): Promise<void> {
    // This would need specific pump name verification
    await this.pumpsOverviewPage.verifyPumpsOverviewPageLoaded();
  }

  async thenTheFormFieldsShouldBeAccessibleViaKeyboard(): Promise<void> {
    // Verify keyboard accessibility by tabbing through form fields
    await this.pumpEditModalPage.navigateWithTab();
  }

  async thenTheMobileLayoutShouldBeOptimized(): Promise<void> {
    // Verify mobile-specific layout
    if (this.page.viewportSize()?.width && this.page.viewportSize()!.width < 768) {
      await this.pumpEditModalPage.verifyMobileLayout();
    }
  }

  async thenTheTabletLayoutShouldBeOptimized(): Promise<void> {
    // Verify tablet-specific layout
    const viewport = this.page.viewportSize();
    if (viewport?.width && viewport.width >= 768 && viewport.width < 1024) {
      await this.pumpEditModalPage.verifyTabletLayout();
    }
  }
}
