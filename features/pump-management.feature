Feature: Pump Management
  As a pump master user
  I want to create, edit, and delete pumps
  So that I can maintain accurate pump information

  Background:
    Given I am logged into the pump master application
    And I am on the pumps overview page

  @web @management
  Scenario: Create a new pump with all required fields
    When I click the new pump button
    And the pump edit modal opens
    And I fill in the pump name as "New Test Pump"
    And I select "Centrifugal" from the pump type dropdown
    And I select "Active" from the pump status dropdown
    And I enter "Building A - Room 101" as the location
    And I enter "Test pump for automation" as the description
    And I enter "1000 GPM" as the flow rate
    And I enter "Test Manufacturer" as the manufacturer
    And I enter "TP-1000" as the model
    And I select "2024-01-15" as the installation date
    And I enter "90 days" as the maintenance interval
    And I click the save button
    Then the pump should be created successfully
    And I should see a success message
    And the modal should close
    And the new pump should appear in the pumps list

  @web @management
  Scenario: Edit an existing pump
    Given there is an existing pump named "Test Pump"
    When I click the edit button for "Test Pump"
    And the pump edit modal opens with existing data
    And I change the pump name to "Updated Test Pump"
    And I change the status to "Maintenance"
    And I click the save button
    Then the pump should be updated successfully
    And I should see a success message
    And the modal should close
    And the pump should show updated information in the list

  @web @management
  Scenario: Delete a pump
    Given there is an existing pump named "Test Pump to Delete"
    When I click the delete button for "Test Pump to Delete"
    And I confirm the deletion
    Then the pump should be deleted successfully
    And I should see a success message
    And the pump should no longer appear in the pumps list

  @web @management
  Scenario: Create pump with validation errors
    When I click the new pump button
    And the pump edit modal opens
    And I leave the pump name empty
    And I select an invalid pump type
    And I enter invalid flow rate data
    And I click the save button
    Then I should see validation error messages
    And the save button should remain disabled
    And the modal should stay open

  @web @management
  Scenario: Cancel pump creation
    When I click the new pump button
    And the pump edit modal opens
    And I fill in some pump data
    And I click the cancel button
    Then the modal should close
    And no new pump should be created
    And any entered data should be discarded

  @web @management
  Scenario: Close modal with escape key
    When I click the new pump button
    And the pump edit modal opens
    And I press the Escape key
    Then the modal should close
    And no changes should be saved

  @web @management
  Scenario: Modal keyboard navigation
    When I click the new pump button
    And the pump edit modal opens
    And I navigate through fields using Tab key
    Then I should be able to reach all form elements
    And the focus should be properly visible
    And I should be able to submit using Enter key

  @mobile @management
  Scenario: Create pump on mobile device
    Given I am using a mobile device
    When I tap the new pump button
    And the mobile pump edit modal opens
    And I fill in all required pump information using touch input
    And I tap the save button
    Then the pump should be created successfully
    And the mobile modal should close
    And I should see the new pump in the mobile-optimized list

  @mobile @management
  Scenario: Edit pump on mobile device
    Given I am using a mobile device
    And there is an existing pump
    When I tap the edit button for the pump
    And the mobile pump edit modal opens
    And I modify the pump information using touch input
    And I tap the save button
    Then the pump should be updated successfully
    And the mobile modal should close

  @tablet @management
  Scenario: Pump management on tablet
    Given I am using a tablet device
    When I perform pump creation and editing operations
    Then all functionality should work properly on tablet
    And the modal should be appropriately sized for tablet screen
    And touch interactions should be responsive

  @web @management @validation
  Scenario Outline: Field validation testing
    When I click the new pump button
    And I enter "<field_value>" in the "<field_name>" field
    And I click the save button
    Then I should see the validation message "<validation_message>"

    Examples:
      | field_name    | field_value | validation_message           |
      | name          |             | Name is required             |
      | name          | A           | Name must be at least 2 characters |
      | flowRate      | invalid     | Flow Rate must be a valid number |
      | flowRate      | -100        | Flow Rate must be positive    |

  @web @management @bulk
  Scenario: Bulk operations
    Given there are multiple pumps selected
    When I perform a bulk status update to "Maintenance"
    Then all selected pumps should have their status updated
    And I should see a bulk operation success message

  @api @management
  Scenario: API pump creation
    When I create a pump via API with valid data
    Then the pump should be created successfully
    And the API should return the pump with generated ID
    And the pump should be retrievable via API

  @api @management
  Scenario: API pump validation
    When I create a pump via API with invalid data
    Then the API should return a 400 Bad Request status
    And the response should contain validation error details
