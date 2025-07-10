import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PumpsOverviewPage extends BasePage {
  // Page Elements (Mock-up 2 references)
  private readonly newPumpButton: Locator;
  private readonly searchInput: Locator;
  private readonly filterDropdown: Locator;
  private readonly pumpsList: Locator;
  private readonly pumpCard: Locator;
  private readonly sortDropdown: Locator;
  private readonly refreshButton: Locator;

  private readonly paginationContainer: Locator;
  private readonly previousPageButton: Locator;
  private readonly nextPageButton: Locator;
  private readonly itemsPerPageDropdown: Locator;
  private readonly totalItemsCount: Locator;
  private readonly loadingSpinner: Locator;
  private readonly noDataMessage: Locator;

  // Mobile-specific elements
  private readonly mobileFilterToggle: Locator;
  private readonly mobileSortToggle: Locator;
  private readonly pullToRefreshIndicator: Locator;

  // Individual pump card elements - Updated for new fields
  private readonly pumpName: Locator;
  private readonly pumpType: Locator;
  private readonly pumpArea: Locator;
  private readonly pumpLatitude: Locator;
  private readonly pumpLongitude: Locator;
  private readonly pumpFlowRate: Locator;
  private readonly pumpOffset: Locator;
  private readonly pumpCurrentPressure: Locator;
  private readonly pumpMinPressure: Locator;
  private readonly pumpMaxPressure: Locator;
  private readonly editPumpButton: Locator;
  private readonly deletePumpButton: Locator;
  private readonly viewPumpDetailsButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators based on Mock-up 2
    this.newPumpButton = page.locator('[data-testid="new-pump-button"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]');
    this.pumpsList = page.locator('[data-testid="pumps-list"]');
    this.pumpCard = page.locator('[data-testid="pump-card"]');
    this.sortDropdown = page.locator('[data-testid="sort-dropdown"]');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');

    this.paginationContainer = page.locator('[data-testid="pagination-container"]');
    this.previousPageButton = page.locator('[data-testid="previous-page-button"]');
    this.nextPageButton = page.locator('[data-testid="next-page-button"]');
    this.itemsPerPageDropdown = page.locator('[data-testid="items-per-page-dropdown"]');
    this.totalItemsCount = page.locator('[data-testid="total-items-count"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');

    // Mobile-specific elements
    this.mobileFilterToggle = page.locator('[data-testid="mobile-filter-toggle"]');
    this.mobileSortToggle = page.locator('[data-testid="mobile-sort-toggle"]');
    this.pullToRefreshIndicator = page.locator('[data-testid="pull-to-refresh-indicator"]');

    // Individual pump card elements - Updated for new fields
    this.pumpName = page.locator('[data-testid="pump-name"]');
    this.pumpType = page.locator('[data-testid="pump-type"]');
    this.pumpArea = page.locator('[data-testid="pump-area"]');
    this.pumpLatitude = page.locator('[data-testid="pump-latitude"]');
    this.pumpLongitude = page.locator('[data-testid="pump-longitude"]');
    this.pumpFlowRate = page.locator('[data-testid="pump-flow-rate"]');
    this.pumpOffset = page.locator('[data-testid="pump-offset"]');
    this.pumpCurrentPressure = page.locator('[data-testid="pump-current-pressure"]');
    this.pumpMinPressure = page.locator('[data-testid="pump-min-pressure"]');
    this.pumpMaxPressure = page.locator('[data-testid="pump-max-pressure"]');
    this.editPumpButton = page.locator('[data-testid="edit-pump-button"]');
    this.deletePumpButton = page.locator('[data-testid="delete-pump-button"]');
    this.viewPumpDetailsButton = page.locator('[data-testid="view-pump-details-button"]');
  }

  // Navigation
  async navigateToPumpsOverview(): Promise<void> {
    await this.navigate('/pumps');
    await this.waitForPageLoad();
    await this.verifyElementVisible(this.pumpsList);
  }

  // Main Actions
  async clickNewPumpButton(): Promise<void> {
    await this.clickElement(this.newPumpButton);
  }

  async searchPumps(searchTerm: string): Promise<void> {
    await this.fillInput(this.searchInput, searchTerm);
    await this.pressKey('Enter');
    await this.waitForSearchResults();
  }

  async clearSearch(): Promise<void> {
    await this.fillInput(this.searchInput, '');
    await this.pressKey('Enter');
    await this.waitForSearchResults();
  }

  async filterPumpsByType(pumpType: string): Promise<void> {
    await this.selectDropdownOption(this.filterDropdown, pumpType);
    await this.waitForSearchResults();
  }

  async sortPumps(sortOption: string): Promise<void> {
    await this.selectDropdownOption(this.sortDropdown, sortOption);
    await this.waitForSearchResults();
  }

  async refreshPumpsList(): Promise<void> {
    await this.clickElement(this.refreshButton);
    await this.waitForSearchResults();
  }

  // Mobile-specific actions
  async toggleMobileFilter(): Promise<void> {
    if (this.isMobile()) {
      await this.clickElement(this.mobileFilterToggle);
    }
  }

  async toggleMobileSort(): Promise<void> {
    if (this.isMobile()) {
      await this.clickElement(this.mobileSortToggle);
    }
  }

  async pullToRefresh(): Promise<void> {
    if (this.isMobile()) {
      // Simulate pull-to-refresh gesture
      const viewport = this.page.viewportSize();
      if (viewport) {
        await this.page.mouse.move(viewport.width / 2, 100);
        await this.page.mouse.down();
        await this.page.mouse.move(viewport.width / 2, viewport.height / 2, { steps: 10 });
        await this.page.mouse.up();
        await this.waitForSearchResults();
      }
    }
  }

  // Pump Card Actions
  async clickEditPump(pumpName: string): Promise<void> {
    const pumpCard = this.getPumpCardByName(pumpName);
    const editButton = pumpCard.locator('[data-testid="edit-pump-button"]');
    await this.clickElement(editButton);
  }

  async clickDeletePump(pumpName: string): Promise<void> {
    const pumpCard = this.getPumpCardByName(pumpName);
    const deleteButton = pumpCard.locator('[data-testid="delete-pump-button"]');
    await this.clickElement(deleteButton);
  }

  async clickViewPumpDetails(pumpName: string): Promise<void> {
    const pumpCard = this.getPumpCardByName(pumpName);
    const viewButton = pumpCard.locator('[data-testid="view-pump-details-button"]');
    await this.clickElement(viewButton);
  }

  // Pagination Actions
  async goToNextPage(): Promise<void> {
    if (await this.isElementEnabled(this.nextPageButton)) {
      await this.clickElement(this.nextPageButton);
      await this.waitForSearchResults();
    }
  }

  async goToPreviousPage(): Promise<void> {
    if (await this.isElementEnabled(this.previousPageButton)) {
      await this.clickElement(this.previousPageButton);
      await this.waitForSearchResults();
    }
  }

  async changeItemsPerPage(itemsPerPage: string): Promise<void> {
    await this.selectDropdownOption(this.itemsPerPageDropdown, itemsPerPage);
    await this.waitForSearchResults();
  }

  // Helper Methods
  private getPumpCardByName(pumpName: string): Locator {
    return this.page.locator(`[data-testid="pump-card"]:has-text("${pumpName}")`);
  }

  private async waitForSearchResults(): Promise<void> {
    // Wait for loading spinner to disappear
    await this.page.waitForFunction(() => {
      const spinner = document.querySelector('[data-testid="loading-spinner"]');
      return !spinner || spinner.getAttribute('style')?.includes('display: none');
    });
  }

  // Verification Methods
  async verifyPumpsOverviewPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.newPumpButton);
    await this.verifyElementVisible(this.searchInput);
    await this.verifyElementVisible(this.pumpsList);
  }

  async verifyPumpExists(pumpName: string): Promise<void> {
    const pumpCard = this.getPumpCardByName(pumpName);
    await this.verifyElementVisible(pumpCard);
  }

  async verifyPumpDoesNotExist(pumpName: string): Promise<void> {
    const pumpCard = this.getPumpCardByName(pumpName);
    await this.verifyElementHidden(pumpCard);
  }

  async verifySearchResults(expectedCount: number): Promise<void> {
    const actualCount = await this.pumpCard.count();
    if (actualCount !== expectedCount) {
      throw new Error(`Expected ${expectedCount} pump cards, but found ${actualCount}`);
    }
  }

  async verifyNoDataMessage(): Promise<void> {
    await this.verifyElementVisible(this.noDataMessage);
  }

  async verifyPumpDetails(pumpName: string, expectedType: string, expectedStatus: string): Promise<void> {
    const pumpCard = this.getPumpCardByName(pumpName);
    const typeElement = pumpCard.locator('[data-testid="pump-type"]');
    const statusElement = pumpCard.locator('[data-testid="pump-status"]');

    await this.verifyElementContainsText(typeElement, expectedType);
    await this.verifyElementContainsText(statusElement, expectedStatus);
  }

  // Get Methods for test data validation
  async getPumpCount(): Promise<number> {
    return await this.pumpCard.count();
  }

  async getTotalItemsCount(): Promise<string> {
    return await this.getText(this.totalItemsCount);
  }

  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  async getCurrentFilterValue(): Promise<string> {
    return await this.filterDropdown.inputValue();
  }

  async getCurrentSortValue(): Promise<string> {
    return await this.sortDropdown.inputValue();
  }

  async getAllPumpNames(): Promise<string[]> {
    const pumpNameElements = await this.pumpName.all();
    const names: string[] = [];
    for (const element of pumpNameElements) {
      const name = await element.textContent();
      if (name) names.push(name);
    }
    return names;
  }

  // Responsive design verification
  async verifyMobileLayout(): Promise<void> {
    if (this.isMobile()) {
      await this.verifyElementVisible(this.mobileFilterToggle);
      await this.verifyElementVisible(this.mobileSortToggle);
      // Verify mobile-specific layout
      const pumpCard = this.pumpCard.first();
      const cardWidth = await pumpCard.boundingBox();
      const viewport = this.page.viewportSize();
      if (cardWidth && viewport && cardWidth.width > viewport.width * 0.95) {
        throw new Error('Pump card is too wide for mobile layout');
      }
    }
  }
}
