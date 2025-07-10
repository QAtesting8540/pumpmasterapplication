Feature: Pump Overview Management
  As a pump master user
  I want to view and manage pump overview
  So that I can monitor all pumps in the system

  Background:
    Given I am logged into the pump master application
    And I am on the pumps overview page

  @web @overview
  Scenario: View pumps overview page
    Then I should see the new pump button
    And I should see the search input field
    And I should see the pumps list
    And I should see pagination controls

  @web @overview
  Scenario: Create new pump using the new pump button
    When I click the new pump button
    Then the pump edit modal should open
    And I should see the pump creation form

  @web @overview
  Scenario: Search for pumps by name
    Given there are existing pumps in the system
    When I enter "Centrifugal" in the search field
    And I press Enter
    Then I should see only pumps containing "Centrifugal" in their name or description
    And the search results should be highlighted

  @web @overview
  Scenario: Filter pumps by type
    Given there are pumps of different types in the system
    When I select "Centrifugal" from the filter dropdown
    Then I should see only centrifugal pumps
    And the total count should reflect the filtered results

  @web @overview
  Scenario: Sort pumps by name
    Given there are multiple pumps in the system
    When I select "Name (A-Z)" from the sort dropdown
    Then the pumps should be displayed in alphabetical order by name

  @web @overview
  Scenario: Pagination functionality
    Given there are more than 10 pumps in the system
    When I am on the first page
    And I click the next page button
    Then I should see the next set of pumps
    And the page number should increment

  @web @overview
  Scenario: Change items per page
    Given there are multiple pumps in the system
    When I select "25" from the items per page dropdown
    Then I should see up to 25 pumps per page
    And the pagination should adjust accordingly

  @web @overview
  Scenario: Refresh pumps list
    When I click the refresh button
    Then the pumps list should be updated
    And I should see a loading indicator briefly

  @web @overview
  Scenario: Export pumps data
    Given there are pumps in the system
    When I click the export button
    Then I should be able to download the pumps data
    And the file should contain all visible pump information

  @mobile @overview
  Scenario: Mobile pumps overview navigation
    Given I am using a mobile device
    When I view the pumps overview page
    Then I should see mobile-optimized pump cards
    And I should be able to scroll through pumps
    And the mobile filter and sort toggles should be visible

  @mobile @overview
  Scenario: Mobile pull-to-refresh
    Given I am using a mobile device
    When I pull down on the pumps list
    Then the list should refresh
    And I should see the pull-to-refresh indicator

  @tablet @overview
  Scenario: Tablet pumps overview layout
    Given I am using a tablet device
    When I view the pumps overview page
    Then the pumps should be displayed in a grid layout optimized for tablet
    And I should see 2-3 pumps per row

  @web @overview @performance
  Scenario: Large dataset handling
    Given there are 1000+ pumps in the system
    When I load the pumps overview page
    Then the page should load within 3 seconds
    And pagination should handle the large dataset efficiently

  @web @overview @responsive
  Scenario: Responsive design verification
    When I resize the browser window
    Then the pump cards should adapt to the new screen size
    And all functionality should remain accessible
    And no horizontal scrolling should be required
