Feature: Secure Tenancy Login
  As a pump master user
  I want to securely log into the application
  So that I can access the pump management system

  Background:
    Given I am on the login page

  @web @login
  Scenario: Successful login with valid credentials
    When I enter valid username and password
    And I click the login button
    Then I should be redirected to the pumps overview page
    And I should see a welcome message

  @web @login
  Scenario: Failed login with invalid credentials
    When I enter invalid username and password
    And I click the login button
    Then I should see an error message "Invalid username or password"
    And I should remain on the login page

  @web @login
  Scenario: Login with empty credentials
    When I leave username and password empty
    And I click the login button
    Then the login button should be disabled
    And I should see validation messages for required fields

  @web @login
  Scenario: Login with remember me option
    When I enter valid username and password
    And I check the remember me checkbox
    And I click the login button
    Then I should be redirected to the pumps overview page
    And my login should be remembered for future sessions

  @web @login
  Scenario: Forgot password functionality
    When I click the forgot password link
    Then I should be redirected to the password reset page

  @mobile @login
  Scenario: Mobile login with touch ID
    Given I am using a mobile device
    When I tap the touch ID button
    Then I should be authenticated using biometric authentication
    And I should be redirected to the pumps overview page

  @mobile @login
  Scenario: Mobile login with standard credentials
    Given I am using a mobile device
    When I enter valid username and password
    And I tap the login button
    Then I should be redirected to the pumps overview page
    And the mobile navigation should be visible

  @tablet @login
  Scenario: Tablet login with optimized layout
    Given I am using a tablet device
    When I enter valid username and password
    And I click the login button
    Then I should be redirected to the pumps overview page
    And the layout should be optimized for tablet viewing

  @web @login @accessibility
  Scenario: Login accessibility with keyboard navigation
    When I navigate using only keyboard
    And I tab through all form elements
    And I enter credentials using keyboard
    And I press Enter to submit
    Then I should be able to complete login without using mouse

  @web @login @security
  Scenario: Login security - account lockout after multiple failed attempts
    When I enter invalid credentials 5 times
    Then my account should be temporarily locked
    And I should see a message about account lockout
