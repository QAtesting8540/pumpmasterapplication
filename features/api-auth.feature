Feature: API Authentication and Security
  As an API consumer
  I want to authenticate securely
  So that I can access protected pump management endpoints

  @api @auth
  Scenario: Successful API authentication
    When I send valid login credentials to the auth endpoint
    Then I should receive a valid JWT token
    And the token should contain user information
    And the token should have an expiration time

  @api @auth
  Scenario: Failed API authentication with invalid credentials
    When I send invalid login credentials to the auth endpoint
    Then I should receive a 401 Unauthorized status
    And the response should contain an authentication error message

  @api @auth
  Scenario: Access protected endpoint without authentication
    When I try to access the pumps endpoint without authentication
    Then I should receive a 401 Unauthorized status
    And the response should indicate missing authentication

  @api @auth
  Scenario: Access protected endpoint with invalid token
    When I try to access the pumps endpoint with an invalid token
    Then I should receive a 401 Unauthorized status
    And the response should indicate invalid authentication

  @api @auth
  Scenario: Token refresh functionality
    Given I have a valid authentication token
    When I use the token refresh endpoint
    Then I should receive a new valid token
    And the new token should have updated expiration time

  @api @auth
  Scenario: Token expiration handling
    Given I have an expired authentication token
    When I try to access protected endpoints
    Then I should receive a 401 Unauthorized status
    And the response should indicate token expiration

  @api @auth
  Scenario: Logout functionality
    Given I have a valid authentication token
    When I call the logout endpoint
    Then the token should be invalidated
    And subsequent requests with the token should fail
