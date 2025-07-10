import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { PumpsOverviewPage } from '../../pages/PumpsOverviewPage';
import { PumpEditModalPage } from '../../pages/PumpEditModalPage';

test.describe('Pump Overview Management', () => {
  let loginPage: LoginPage;
  let pumpsOverviewPage: PumpsOverviewPage;
  let pumpEditModal: PumpEditModalPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pumpsOverviewPage = new PumpsOverviewPage(page);
    pumpEditModal = new PumpEditModalPage(page);

    // Login before each test
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.TEST_USERNAME || 'testuser@pumpmaster.com',
      process.env.TEST_PASSWORD || 'Test@123'
    );
    await pumpsOverviewPage.navigateToPumpsOverview();
  });

  test('should display pumps overview page correctly @web @overview', async () => {
    // Then I should see the new pump button
    await pumpsOverviewPage.verifyPumpsOverviewPageLoaded();

    // And I should see the search input field
    await expect(pumpsOverviewPage['searchInput']).toBeVisible();

    // And I should see the pumps list
    await expect(pumpsOverviewPage['pumpsList']).toBeVisible();

    // And I should see pagination controls
    await expect(pumpsOverviewPage['paginationContainer']).toBeVisible();
  });

  test('should open pump creation modal when new pump button is clicked @web @overview', async () => {
    // When I click the new pump button
    await pumpsOverviewPage.clickNewPumpButton();

    // Then the pump edit modal should open
    await pumpEditModal.verifyModalOpened();

    // And I should see the pump creation form
    await pumpEditModal.verifyModalTitle('Create New Pump');
  });

  test('should search for pumps by name @web @overview', async () => {
    // Given there are existing pumps in the system (test data setup would be here)

    // When I enter "Centrifugal" in the search field
    await pumpsOverviewPage.searchPumps('Centrifugal');

    // Then I should see only pumps containing "Centrifugal" in their name or description
    const searchResults = await pumpsOverviewPage.getAllPumpNames();
    searchResults.forEach(name => {
      expect(name.toLowerCase()).toContain('centrifugal');
    });
  });

  test('should filter pumps by type @web @overview', async () => {
    // Given there are pumps of different types in the system

    // When I select "Centrifugal" from the filter dropdown
    await pumpsOverviewPage.filterPumpsByType('Centrifugal');

    // Then I should see only centrifugal pumps
    // And the total count should reflect the filtered results
    const totalCount = await pumpsOverviewPage.getTotalItemsCount();
    expect(totalCount).toContain('filtered');
  });

  test('should sort pumps by name @web @overview', async () => {
    // Given there are multiple pumps in the system

    // When I select "Name (A-Z)" from the sort dropdown
    await pumpsOverviewPage.sortPumps('name-asc');

    // Then the pumps should be displayed in alphabetical order by name
    const pumpNames = await pumpsOverviewPage.getAllPumpNames();
    const sortedNames = [...pumpNames].sort();
    expect(pumpNames).toEqual(sortedNames);
  });

  test('should navigate through pages @web @overview', async () => {
    // Given there are more than 10 pumps in the system (test data dependent)

    // When I am on the first page and I click the next page button
    await pumpsOverviewPage.goToNextPage();

    // Then I should see the next set of pumps
    // And the page number should increment
    // This would need actual implementation based on pagination design
  });

  test('should change items per page @web @overview', async () => {
    // Given there are multiple pumps in the system

    // When I select "25" from the items per page dropdown
    await pumpsOverviewPage.changeItemsPerPage('25');

    // Then I should see up to 25 pumps per page
    const pumpCount = await pumpsOverviewPage.getPumpCount();
    expect(pumpCount).toBeLessThanOrEqual(25);
  });

  test('should refresh pumps list @web @overview', async () => {
    // When I click the refresh button
    await pumpsOverviewPage.refreshPumpsList();

    // Then the pumps list should be updated
    await pumpsOverviewPage.verifyPumpsOverviewPageLoaded();
  });

  test('should support mobile layout @mobile @overview', async ({ page }) => {
    // Given I am using a mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    // When I view the pumps overview page
    await pumpsOverviewPage.verifyMobileLayout();

    // Then I should see mobile-optimized pump cards
    // And the mobile filter and sort toggles should be visible
    await expect(pumpsOverviewPage['mobileFilterToggle']).toBeVisible();
    await expect(pumpsOverviewPage['mobileSortToggle']).toBeVisible();
  });

  test('should support pull-to-refresh on mobile @mobile @overview', async ({ page }) => {
    // Given I am using a mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    // When I pull down on the pumps list
    await pumpsOverviewPage.pullToRefresh();

    // Then the list should refresh
    await pumpsOverviewPage.verifyPumpsOverviewPageLoaded();
  });

  test('should support tablet layout @tablet @overview', async ({ page }) => {
    // Given I am using a tablet device
    await page.setViewportSize({ width: 768, height: 1024 });

    // Then the pumps should be displayed in a grid layout optimized for tablet
    // This verification would depend on the actual responsive design
  });

  test('should handle large datasets efficiently @web @overview @performance', async () => {
    // This test would require test data setup with 1000+ pumps
    // When I load the pumps overview page with large dataset
    const startTime = Date.now();
    await pumpsOverviewPage.navigateToPumpsOverview();
    const loadTime = Date.now() - startTime;

    // Then the page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should clear search filter @web @overview', async () => {
    // Given I have applied a search filter
    await pumpsOverviewPage.searchPumps('Test');

    // When I clear the search
    await pumpsOverviewPage.clearSearch();

    // Then all pumps should be visible again
    const searchValue = await pumpsOverviewPage.getSearchInputValue();
    expect(searchValue).toBe('');
  });

  test('should show no data message when no pumps match filter @web @overview', async () => {
    // When I search for non-existent pump
    await pumpsOverviewPage.searchPumps('NonExistentPump123456');

    // Then I should see no data message
    await pumpsOverviewPage.verifyNoDataMessage();
  });

  test('should edit pump from overview page @web @overview', async () => {
    // Given there is an existing pump (test data dependent)
    const testPumpName = 'Test Pump for Edit';

    // When I click the edit button for the pump
    await pumpsOverviewPage.clickEditPump(testPumpName);

    // Then the pump edit modal should open with existing data
    await pumpEditModal.verifyModalOpened();
    await pumpEditModal.verifyModalTitle('Edit Pump');
  });

  test('should delete pump from overview page @web @overview', async () => {
    // Given there is an existing pump (test data dependent)
    const testPumpName = 'Test Pump for Delete';

    // When I click the delete button for the pump
    await pumpsOverviewPage.clickDeletePump(testPumpName);

    // And I confirm the deletion (confirmation dialog handling)
    // This would depend on the actual delete confirmation implementation

    // Then the pump should no longer appear in the list
    await pumpsOverviewPage.verifyPumpDoesNotExist(testPumpName);
  });
});
