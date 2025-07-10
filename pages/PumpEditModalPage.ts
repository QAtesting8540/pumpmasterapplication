import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PumpEditModalPage extends BasePage {
  // Page Elements (Mock-up 3 references)
  private readonly modal: Locator;
  private readonly modalTitle: Locator;
  private readonly closeButton: Locator;
  private readonly pumpNameInput: Locator;
  private readonly pumpTypeDropdown: Locator;
  private readonly pumpAreaDropdown: Locator;
  private readonly pumpLatitudeInput: Locator;
  private readonly pumpLongitudeInput: Locator;
  private readonly pumpFlowRateInput: Locator;
  private readonly pumpOffsetInput: Locator;
  private readonly pumpCurrentPressureInput: Locator;
  private readonly pumpMinPressureInput: Locator;
  private readonly pumpMaxPressureInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly deleteButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly loadingSpinner: Locator;

  // Form validation elements
  private readonly nameValidationError: Locator;
  private readonly typeValidationError: Locator;
  private readonly areaValidationError: Locator;
  private readonly latitudeValidationError: Locator;
  private readonly longitudeValidationError: Locator;
  private readonly flowRateValidationError: Locator;
  private readonly offsetValidationError: Locator;
  private readonly pressureValidationError: Locator;
  private readonly requiredFieldIndicator: Locator;

  // Mobile-specific elements
  private readonly mobileModalOverlay: Locator;
  private readonly mobileCloseButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators based on new pump fields
    this.modal = page.locator('[data-testid="pump-edit-modal"]');
    this.modalTitle = page.locator('[data-testid="modal-title"]');
    this.closeButton = page.locator('[data-testid="close-button"]');
    this.pumpNameInput = page.locator('[data-testid="pump-name-input"]');
    this.pumpTypeDropdown = page.locator('[data-testid="pump-type-dropdown"]');
    this.pumpAreaDropdown = page.locator('[data-testid="pump-area-dropdown"]');
    this.pumpLatitudeInput = page.locator('[data-testid="pump-latitude-input"]');
    this.pumpLongitudeInput = page.locator('[data-testid="pump-longitude-input"]');
    this.pumpFlowRateInput = page.locator('[data-testid="pump-flow-rate-input"]');
    this.pumpOffsetInput = page.locator('[data-testid="pump-offset-input"]');
    this.pumpCurrentPressureInput = page.locator('[data-testid="pump-current-pressure-input"]');
    this.pumpMinPressureInput = page.locator('[data-testid="pump-min-pressure-input"]');
    this.pumpMaxPressureInput = page.locator('[data-testid="pump-max-pressure-input"]');
    this.saveButton = page.locator('[data-testid="save-button"]');
    this.cancelButton = page.locator('[data-testid="cancel-button"]');
    this.deleteButton = page.locator('[data-testid="delete-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');

    // Form validation elements
    this.nameValidationError = page.locator('[data-testid="name-validation-error"]');
    this.typeValidationError = page.locator('[data-testid="type-validation-error"]');
    this.areaValidationError = page.locator('[data-testid="area-validation-error"]');
    this.latitudeValidationError = page.locator('[data-testid="latitude-validation-error"]');
    this.longitudeValidationError = page.locator('[data-testid="longitude-validation-error"]');
    this.flowRateValidationError = page.locator('[data-testid="flow-rate-validation-error"]');
    this.offsetValidationError = page.locator('[data-testid="offset-validation-error"]');
    this.pressureValidationError = page.locator('[data-testid="pressure-validation-error"]');
    this.requiredFieldIndicator = page.locator('[data-testid="required-field-indicator"]');

    // Mobile-specific elements
    this.mobileModalOverlay = page.locator('[data-testid="mobile-modal-overlay"]');
    this.mobileCloseButton = page.locator('[data-testid="mobile-close-button"]');
  }

  // Modal Actions
  async waitForModalToOpen(): Promise<void> {
    await this.verifyElementVisible(this.modal);
    await this.waitForElement(this.pumpNameInput);
  }

  async closeModal(): Promise<void> {
    if (this.isMobile()) {
      await this.clickElement(this.mobileCloseButton);
    } else {
      await this.clickElement(this.closeButton);
    }
    await this.waitForModalToClose();
  }

  async closeModalWithOverlay(): Promise<void> {
    if (this.isMobile()) {
      await this.clickElement(this.mobileModalOverlay);
    } else {
      // Click outside the modal
      await this.page.mouse.click(50, 50);
    }
    await this.waitForModalToClose();
  }

  private async waitForModalToClose(): Promise<void> {
    await this.verifyElementHidden(this.modal);
  }

  // Form Input Actions
  async enterPumpName(name: string): Promise<void> {
    await this.fillInput(this.pumpNameInput, name);
  }

  async selectPumpType(type: string): Promise<void> {
    await this.selectDropdownOption(this.pumpTypeDropdown, type);
  }

  async enterPumpArea(area: string): Promise<void> {
    await this.selectDropdownOption(this.pumpAreaDropdown, area);
  }

  async enterPumpLatitude(latitude: number): Promise<void> {
    await this.fillInput(this.pumpLatitudeInput, latitude.toString());
  }

  async enterPumpLongitude(longitude: number): Promise<void> {
    await this.fillInput(this.pumpLongitudeInput, longitude.toString());
  }

  async enterPumpFlowRate(flowRate: string): Promise<void> {
    await this.fillInput(this.pumpFlowRateInput, flowRate);
  }

  async enterPumpOffset(offset: number): Promise<void> {
    await this.fillInput(this.pumpOffsetInput, offset.toString());
  }

  async enterPumpCurrentPressure(pressure: number): Promise<void> {
    await this.fillInput(this.pumpCurrentPressureInput, pressure.toString());
  }

  async enterPumpMinPressure(pressure: number): Promise<void> {
    await this.fillInput(this.pumpMinPressureInput, pressure.toString());
  }

  async enterPumpMaxPressure(pressure: number): Promise<void> {
    await this.fillInput(this.pumpMaxPressureInput, pressure.toString());
  }

  // Form Actions
  async saveChanges(): Promise<void> {
    await this.clickElement(this.saveButton);
    await this.waitForSaveToComplete();
  }

  async cancelChanges(): Promise<void> {
    await this.clickElement(this.cancelButton);
    await this.waitForModalToClose();
  }

  async deletePump(): Promise<void> {
    await this.clickElement(this.deleteButton);
  }

  private async waitForSaveToComplete(): Promise<void> {
    // Wait for loading spinner to appear and then disappear
    await this.verifyElementVisible(this.loadingSpinner);
    await this.verifyElementHidden(this.loadingSpinner);
  }

  // Complete Form Filling
  async fillPumpForm(pumpData: {
    name: string;
    type: string;
    area: string;
    latitude: number;
    longitude: number;
    flowRate: string;
    offset: number;
    currentPressure: number;
    minPressure: number;
    maxPressure: number;
  }): Promise<void> {
    await this.enterPumpName(pumpData.name);
    await this.selectPumpType(pumpData.type);
    await this.enterPumpArea(pumpData.area);
    await this.enterPumpLatitude(pumpData.latitude);
    await this.enterPumpLongitude(pumpData.longitude);
    await this.enterPumpFlowRate(pumpData.flowRate);
    await this.enterPumpOffset(pumpData.offset);
    await this.enterPumpCurrentPressure(pumpData.currentPressure);
    await this.enterPumpMinPressure(pumpData.minPressure);
    await this.enterPumpMaxPressure(pumpData.maxPressure);
  }

  async createNewPump(pumpData: {
    name: string;
    type: string;
    area: string;
    latitude: number;
    longitude: number;
    flowRate: string;
    offset: number;
    currentPressure: number;
    minPressure: number;
    maxPressure: number;
  }): Promise<void> {
    await this.waitForModalToOpen();
    await this.fillPumpForm(pumpData);
    await this.saveChanges();
  }

  async editExistingPump(pumpData: {
    name?: string;
    type?: string;
    area?: string;
    latitude?: number;
    longitude?: number;
    flowRate?: string;
    offset?: number;
    currentPressure?: number;
    minPressure?: number;
    maxPressure?: number;
  }): Promise<void> {
    await this.waitForModalToOpen();

    if (pumpData.name) await this.enterPumpName(pumpData.name);
    if (pumpData.type) await this.selectPumpType(pumpData.type);
    if (pumpData.area) await this.enterPumpArea(pumpData.area);
    if (pumpData.latitude) await this.enterPumpLatitude(pumpData.latitude);
    if (pumpData.longitude) await this.enterPumpLongitude(pumpData.longitude);
    if (pumpData.flowRate) await this.enterPumpFlowRate(pumpData.flowRate);
    if (pumpData.offset) await this.enterPumpOffset(pumpData.offset);
    if (pumpData.currentPressure) await this.enterPumpCurrentPressure(pumpData.currentPressure);
    if (pumpData.minPressure) await this.enterPumpMinPressure(pumpData.minPressure);
    if (pumpData.maxPressure) await this.enterPumpMaxPressure(pumpData.maxPressure);

    await this.saveChanges();
  }

  // Verification Methods
  async verifyModalOpened(): Promise<void> {
    await this.verifyElementVisible(this.modal);
    await this.verifyElementVisible(this.pumpNameInput);
    await this.verifyElementVisible(this.saveButton);
    await this.verifyElementVisible(this.cancelButton);
  }

  async verifyModalClosed(): Promise<void> {
    await this.verifyElementHidden(this.modal);
  }

  async verifyModalTitle(expectedTitle: string): Promise<void> {
    await this.verifyElementContainsText(this.modalTitle, expectedTitle);
  }

  async verifySaveButtonEnabled(): Promise<void> {
    await this.verifyElementEnabled(this.saveButton);
  }

  async verifySaveButtonDisabled(): Promise<void> {
    await this.verifyElementDisabled(this.saveButton);
  }

  async verifySuccessMessage(expectedMessage: string): Promise<void> {
    await this.verifyElementVisible(this.successMessage);
    await this.verifyElementContainsText(this.successMessage, expectedMessage);
  }

  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage);
    await this.verifyElementContainsText(this.errorMessage, expectedMessage);
  }

  async verifyValidationError(field: string, expectedError: string): Promise<void> {
    let validationLocator: Locator;

    switch (field.toLowerCase()) {
      case 'name':
        validationLocator = this.nameValidationError;
        break;
      case 'type':
        validationLocator = this.typeValidationError;
        break;
      case 'flowRate':
        validationLocator = this.flowRateValidationError;
        break;
      default:
        throw new Error(`Unknown field: ${field}`);
    }

    await this.verifyElementVisible(validationLocator);
    await this.verifyElementContainsText(validationLocator, expectedError);
  }

  async verifyRequiredFields(): Promise<void> {
    const requiredFields = await this.requiredFieldIndicator.all();
    for (const field of requiredFields) {
      await this.verifyElementVisible(field);
    }
  }

  // Get Methods for test data validation
  async getPumpNameValue(): Promise<string> {
    return await this.pumpNameInput.inputValue();
  }

  async getPumpTypeValue(): Promise<string> {
    return await this.pumpTypeDropdown.inputValue();
  }

  async getPumpAreaValue(): Promise<string> {
    return await this.pumpAreaDropdown.inputValue();
  }

  async getPumpLatitudeValue(): Promise<string> {
    return await this.pumpLatitudeInput.inputValue();
  }

  async getPumpLongitudeValue(): Promise<string> {
    return await this.pumpLongitudeInput.inputValue();
  }

  async getPumpFlowRateValue(): Promise<string> {
    return await this.pumpFlowRateInput.inputValue();
  }

  async getPumpOffsetValue(): Promise<string> {
    return await this.pumpOffsetInput.inputValue();
  }

  async getPumpCurrentPressureValue(): Promise<string> {
    return await this.pumpCurrentPressureInput.inputValue();
  }

  async getPumpMinPressureValue(): Promise<string> {
    return await this.pumpMinPressureInput.inputValue();
  }

  async getPumpMaxPressureValue(): Promise<string> {
    return await this.pumpMaxPressureInput.inputValue();
  }

  async getModalTitleText(): Promise<string> {
    return await this.getText(this.modalTitle);
  }

  // Responsive design verification
  async verifyMobileLayout(): Promise<void> {
    if (this.isMobile()) {
      await this.verifyElementVisible(this.mobileModalOverlay);
      // Verify modal takes full screen on mobile
      const modalBox = await this.modal.boundingBox();
      const viewport = this.page.viewportSize();
      if (modalBox && viewport) {
        if (modalBox.width < viewport.width * 0.9 || modalBox.height < viewport.height * 0.8) {
          throw new Error('Modal should be nearly full screen on mobile');
        }
      }
    }
  }

  async verifyTabletLayout(): Promise<void> {
    if (this.isTablet()) {
      // Verify modal is centered and appropriately sized for tablet
      const modalBox = await this.modal.boundingBox();
      const viewport = this.page.viewportSize();
      if (modalBox && viewport) {
        if (modalBox.width > viewport.width * 0.8 || modalBox.width < viewport.width * 0.6) {
          throw new Error('Modal width is not appropriate for tablet layout');
        }
      }
    }
  }

  async verifyDesktopLayout(): Promise<void> {
    if (this.isDesktop()) {
      await this.verifyElementVisible(this.deleteButton);
      // Verify modal is properly centered and sized for desktop
      const modalBox = await this.modal.boundingBox();
      const viewport = this.page.viewportSize();
      if (modalBox && viewport) {
        if (modalBox.width > viewport.width * 0.6 || modalBox.width < viewport.width * 0.4) {
          throw new Error('Modal width is not appropriate for desktop layout');
        }
      }
    }
  }

  // Keyboard navigation
  async navigateWithTab(): Promise<void> {
    await this.pressKey('Tab');
  }

  async submitWithEnter(): Promise<void> {
    await this.pressKey('Enter');
  }

  async cancelWithEscape(): Promise<void> {
    await this.pressKey('Escape');
    await this.waitForModalToClose();
  }
}
