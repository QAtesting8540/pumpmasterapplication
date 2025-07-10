Feature: API Pump Management
  As an API consumer
  I want to manage pumps via REST API
  So that I can integrate with external systems

  Background:
    Given I am authenticated with valid API credentials

  @api @crud
  Scenario: Create pump via API
    When I send a POST request to "/pumps" with valid pump data
    Then I should receive a 201 Created status
    And the response should contain the created pump with ID
    And the pump should be retrievable via GET request

  @api @crud
  Scenario: Retrieve pump by ID via API
    Given there is an existing pump in the system
    When I send a GET request to "/pumps/{id}"
    Then I should receive a 200 OK status
    And the response should contain the pump details

  @api @crud
  Scenario: Update pump via API
    Given there is an existing pump in the system
    When I send a PUT request to "/pumps/{id}" with updated data
    Then I should receive a 200 OK status
    And the response should contain the updated pump details
    And the pump should be updated in the system

  @api @crud
  Scenario: Delete pump via API
    Given there is an existing pump in the system
    When I send a DELETE request to "/pumps/{id}"
    Then I should receive a 204 No Content status
    And the pump should no longer exist in the system

  @api @crud
  Scenario: Get all pumps via API
    Given there are multiple pumps in the system
    When I send a GET request to "/pumps"
    Then I should receive a 200 OK status
    And the response should contain a paginated list of pumps
    And the response should include pagination metadata

  @api @search
  Scenario: Search pumps via API
    Given there are pumps with various names in the system
    When I send a GET request to "/pumps/search?q=centrifugal"
    Then I should receive a 200 OK status
    And the response should contain only pumps matching the search term

  @api @filter
  Scenario: Filter pumps by type via API
    Given there are pumps of different types in the system
    When I send a GET request to "/pumps/filter?type=centrifugal"
    Then I should receive a 200 OK status
    And the response should contain only centrifugal pumps

  @api @filter
  Scenario: Filter pumps by status via API
    Given there are pumps with different statuses in the system
    When I send a GET request to "/pumps/filter?status=active"
    Then I should receive a 200 OK status
    And the response should contain only active pumps

  @api @pagination
  Scenario: API pagination functionality
    Given there are 25 pumps in the system
    When I send a GET request to "/pumps?page=2&limit=10"
    Then I should receive a 200 OK status
    And the response should contain 10 pumps
    And the pagination metadata should indicate page 2 of 3

  @api @validation
  Scenario: API validation for required fields
    When I send a POST request to "/pumps" with missing required fields
    Then I should receive a 400 Bad Request status
    And the response should contain validation error details
    And the response should specify which fields are missing

  @api @validation
  Scenario: API validation for invalid data types
    When I send a POST request to "/pumps" with invalid data types
    Then I should receive a 400 Bad Request status
    And the response should contain data type validation errors

  @api @validation
  Scenario: API validation for invalid pump type
    When I send a POST request to "/pumps" with an invalid pump type
    Then I should receive a 400 Bad Request status
    And the response should contain allowed pump types

  @api @statistics
  Scenario: Get pump statistics via API
    Given there are pumps with various types and statuses
    When I send a GET request to "/pumps/statistics"
    Then I should receive a 200 OK status
    And the response should contain pump count by type
    And the response should contain pump count by status
    And the response should contain total pump count

  @api @error
  Scenario: Handle non-existent pump ID
    When I send a GET request to "/pumps/non-existent-id"
    Then I should receive a 404 Not Found status
    And the response should contain an appropriate error message

  @api @error
  Scenario: Handle server errors gracefully
    When I send a request that causes a server error
    Then I should receive a 500 Internal Server Error status
    And the response should contain a generic error message
    And sensitive information should not be exposed

  @api @performance
  Scenario: API response time validation
    When I send a GET request to "/pumps"
    Then the response should be received within 2 seconds
    And the API should handle concurrent requests efficiently

  @api @security
  Scenario: API rate limiting
    When I send multiple rapid requests to the API
    Then I should receive appropriate rate limiting responses
    And the API should include rate limit headers
