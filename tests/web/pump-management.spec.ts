import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { PumpsOverviewPage } from '../../pages/PumpsOverviewPage';
import { PumpEditModalPage } from '../../pages/PumpEditModalPage';

test.describe('Pump Management', () => {
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

  test('should create a new pump with all required fields @web @management', async () => {
    const testPumpData = {
      name: 'New Test Pump',
      type: 'Centrifugal',
      area: 'Building A - Room 101',
      latitude: 40.7128,
      longitude: -74.006,
      flowRate: '1000 GPM',
      offset: 0,
      currentPressure: 150,
      minPressure: 100,
      maxPressure: 200
    };

    // When I click the new pump button
    await pumpsOverviewPage.clickNewPumpButton();

    // And the pump edit modal opens
    await pumpEditModal.verifyModalOpened();

    // And I fill in all pump data
    await pumpEditModal.createNewPump(testPumpData);

    // Then the pump should be created successfully
    await pumpEditModal.verifySuccessMessage('Pump created successfully');

    // And the modal should close
    await pumpEditModal.verifyModalClosed();

    // And the new pump should appear in the pumps list
    await pumpsOverviewPage.verifyPumpExists(testPumpData.name);
  });

  test('should edit an existing pump @web @management', async () => {
    const testPumpName = 'Test Pump';
    const updatedData = {
      name: 'Updated Test Pump',
      status: 'Maintenance'
    };

    // Given there is an existing pump (this would need test data setup)

    // When I click the edit button for the pump
    await pumpsOverviewPage.clickEditPump(testPumpName);

    // And the pump edit modal opens with existing data
    await pumpEditModal.verifyModalOpened();
    await pumpEditModal.verifyModalTitle('Edit Pump');

    // And I change the pump data
    await pumpEditModal.editExistingPump(updatedData);

    // Then the pump should be updated successfully
    await pumpEditModal.verifySuccessMessage('Pump updated successfully');

    // And the modal should close
    await pumpEditModal.verifyModalClosed();

    // And the pump should show updated information
    await pumpsOverviewPage.verifyPumpExists(updatedData.name);
  });

  test('should delete a pump @web @management', async () => {
    const testPumpName = 'Test Pump to Delete';

    // Given there is an existing pump (this would need test data setup)

    // When I click the delete button for the pump
    await pumpsOverviewPage.clickDeletePump(testPumpName);

    // And I confirm the deletion (this would depend on confirmation dialog implementation)
    // For now, assuming the delete action is direct

    // Then the pump should be deleted successfully
    // And the pump should no longer appear in the pumps list
    await pumpsOverviewPage.verifyPumpDoesNotExist(testPumpName);
  });

  test('should show validation errors for invalid pump data @web @management', async () => {
    // When I click the new pump button
    await pumpsOverviewPage.clickNewPumpButton();

    // And the pump edit modal opens
    await pumpEditModal.verifyModalOpened();

    // And I leave the pump name empty
    await pumpEditModal.enterPumpName('');

    // And I enter invalid flow rate data
    await pumpEditModal.enterPumpFlowRate('invalid capacity');

    // And I click the save button
    await pumpEditModal.saveChanges();

    // Then I should see validation error messages
    await pumpEditModal.verifyValidationError('name', 'Name is required');
    await pumpEditModal.verifyValidationError('flowRate', 'Flow Rate must be a valid number');

    // And the save button should remain disabled
    await pumpEditModal.verifySaveButtonDisabled();

    // And the modal should stay open
    await pumpEditModal.verifyModalOpened();
  });

  test('should cancel pump creation @web @management', async () => {
    const testData = {
      name: 'Test Pump to Cancel',
      type: 'Centrifugal'
    };

    // When I click the new pump button
    await pumpsOverviewPage.clickNewPumpButton();

    // And the pump edit modal opens
    await pumpEditModal.verifyModalOpened();

    // And I fill in some pump data
    await pumpEditModal.enterPumpName(testData.name);
    await pumpEditModal.selectPumpType(testData.type);

    // And I click the cancel button
    await pumpEditModal.cancelChanges();

    // Then the modal should close
    await pumpEditModal.verifyModalClosed();

    // And no new pump should be created
    await pumpsOverviewPage.verifyPumpDoesNotExist(testData.name);
  });

  test('should close modal with escape key @web @management', async () => {
    // When I click the new pump button
    await pumpsOverviewPage.clickNewPumpButton();

    // And the pump edit modal opens
    await pumpEditModal.verifyModalOpened();

    // And I press the Escape key
    await pumpEditModal.cancelWithEscape();

    // Then the modal should close
    await pumpEditModal.verifyModalClosed();
  });

  test('should support keyboard navigation in modal @web @management', async () => {
    // When I click the new pump button
    await pumpsOverviewPage.clickNewPumpButton();

    // And the pump edit modal opens
    await pumpEditModal.verifyModalOpened();

    // And I navigate through fields using Tab key
    await pumpEditModal.navigateWithTab();
    await pumpEditModal.navigateWithTab();
    await pumpEditModal.navigateWithTab();

    // Then I should be able to reach all form elements
    // And the focus should be properly visible
    // And I should be able to submit using Enter key
    await pumpEditModal.submitWithEnter();
  });

  test('should create pump on mobile device @mobile @management', async ({ page }) => {
    // Given I am using a mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    const testPumpData = {
      name: 'Mobile Test Pump',
      type: 'Centrifugal',
      area: 'Building A - Room 101',
      latitude: 40.7128,
      longitude: -74.006,
      flowRate: '1000 GPM',
      offset: 0,
      currentPressure: 150,
      minPressure: 100,
      maxPressure: 200
    };

    // When I tap the new pump button
    await pumpsOverviewPage.clickNewPumpButton();

    // And the mobile pump edit modal opens
    await pumpEditModal.verifyModalOpened();
    await pumpEditModal.verifyMobileLayout();

    // And I fill in all required pump information
    await pumpEditModal.createNewPump(testPumpData);

    // Then the pump should be created successfully
    await pumpEditModal.verifySuccessMessage('Pump created successfully');

    // And the mobile modal should close
    await pumpEditModal.verifyModalClosed();

    // And I should see the new pump in the mobile-optimized list
    await pumpsOverviewPage.verifyPumpExists(testPumpData.name);
  });

  test('should edit pump on mobile device @mobile @management', async ({ page }) => {
    // Given I am using a mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    const testPumpName = 'Mobile Test Pump';
    const updatedData = {
      name: 'Updated Mobile Test Pump',
      status: 'Maintenance'
    };

    // When I tap the edit button for the pump
    await pumpsOverviewPage.clickEditPump(testPumpName);

    // And the mobile pump edit modal opens
    await pumpEditModal.verifyModalOpened();
    await pumpEditModal.verifyMobileLayout();

    // And I modify the pump information
    await pumpEditModal.editExistingPump(updatedData);

    // Then the pump should be updated successfully
    await pumpEditModal.verifySuccessMessage('Pump updated successfully');

    // And the mobile modal should close
    await pumpEditModal.verifyModalClosed();
  });

  test('should support tablet layout for pump management @tablet @management', async ({ page }) => {
    // Given I am using a tablet device
    await page.setViewportSize({ width: 768, height: 1024 });

    // When I perform pump creation operations
    await pumpsOverviewPage.clickNewPumpButton();

    // Then all functionality should work properly on tablet
    await pumpEditModal.verifyModalOpened();
    await pumpEditModal.verifyTabletLayout();

    // And the modal should be appropriately sized for tablet screen
    // And touch interactions should be responsive
    await pumpEditModal.closeModal();
  });

  test.describe('Field validation testing', () => {
    const validationTestCases = [
      { field: 'name', value: '', message: 'Name is required' },
      { field: 'name', value: 'A', message: 'Name must be at least 2 characters' },
      { field: 'flowRate', value: 'invalid', message: 'Flow Rate must be a valid number' },
      { field: 'flowRate', value: '-100', message: 'Flow Rate must be positive' }
    ];

    validationTestCases.forEach(({ field, value, message }) => {
      test(`should validate ${field} field with value "${value}" @web @management @validation`, async () => {
        // When I click the new pump button
        await pumpsOverviewPage.clickNewPumpButton();

        // And I enter invalid value in the field
        if (field === 'name') {
          await pumpEditModal.enterPumpName(value);
        } else if (field === 'flowRate') {
          await pumpEditModal.enterPumpFlowRate(value);
        }

        // And I click the save button
        await pumpEditModal.saveChanges();

        // Then I should see the validation message
        await pumpEditModal.verifyValidationError(field, message);
      });
    });
  });

  test('should handle pump creation with all field types @web @management', async () => {
    const comprehensiveTestData = {
      name: 'Comprehensive Test Pump',
      type: 'Submersible',
      area: 'Building B - Basement',
      latitude: 40.6892,
      longitude: -74.0445,
      flowRate: '2500 GPM',
      offset: 5,
      currentPressure: 175,
      minPressure: 120,
      maxPressure: 250
    };

    // Create pump with all possible field combinations
    await pumpsOverviewPage.clickNewPumpButton();
    await pumpEditModal.verifyModalOpened();
    await pumpEditModal.createNewPump(comprehensiveTestData);

    // Verify all data was saved correctly
    await pumpEditModal.verifySuccessMessage('Pump created successfully');
    await pumpEditModal.verifyModalClosed();
    await pumpsOverviewPage.verifyPumpExists(comprehensiveTestData.name);

    // Verify the pump details are correct
    await pumpsOverviewPage.verifyPumpDetails(
      comprehensiveTestData.name,
      comprehensiveTestData.type,
      comprehensiveTestData.area
    );
  });

  test('should support required field indicators @web @management', async () => {
    // When I open the pump creation modal
    await pumpsOverviewPage.clickNewPumpButton();
    await pumpEditModal.verifyModalOpened();

    // Then I should see required field indicators
    await pumpEditModal.verifyRequiredFields();
  });
});
