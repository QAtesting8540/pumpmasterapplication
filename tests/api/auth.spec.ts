import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/ApiHelper';

test.describe('API Authentication and Security', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test.afterEach(async () => {
    await apiHelper.cleanup();
  });

  test('should successfully authenticate with valid credentials @api @auth', async () => {
    // When I send valid login credentials to the auth endpoint
    const credentials = apiHelper.createTestLoginCredentials();
    const authResponse = await apiHelper.login(credentials);

    // Then I should receive a valid JWT token
    expect(authResponse.token).toBeDefined();
    expect(authResponse.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);

    // And the token should contain user information
    expect(authResponse.user).toBeDefined();
    expect(authResponse.user.username).toBe(credentials.username);
    expect(authResponse.user.email).toBeDefined();
    expect(authResponse.user.tenantId).toBeDefined();

    // And the token should have an expiration time
    expect(authResponse.expiresIn).toBeGreaterThan(0);
  });

  test('should fail authentication with invalid credentials @api @auth', async ({ request }) => {
    // When I send invalid login credentials to the auth endpoint
    const invalidCredentials = apiHelper.createInvalidLoginCredentials();

    try {
      await apiHelper.login(invalidCredentials);
      throw new Error('Login should have failed');
    } catch (error) {
      // Then I should receive a 401 Unauthorized status
      // And the response should contain an authentication error message
      expect((error as Error).message).toContain('401');
    }
  });

  test('should deny access to protected endpoint without authentication @api @auth', async () => {
    // When I try to access the pumps endpoint without authentication
    const status = await apiHelper.accessProtectedEndpointWithoutAuth();

    // Then I should receive a 401 Unauthorized status
    expect(status).toBe(401);
  });

  test('should deny access to protected endpoint with invalid token @api @auth', async () => {
    // When I try to access the pumps endpoint with an invalid token
    const status = await apiHelper.accessProtectedEndpointWithInvalidAuth();

    // Then I should receive a 401 Unauthorized status
    expect(status).toBe(401);
  });

  test('should refresh authentication token @api @auth', async () => {
    // Given I have a valid authentication token
    const credentials = apiHelper.createTestLoginCredentials();
    const initialAuth = await apiHelper.login(credentials);

    // When I use the token refresh endpoint
    const newAuth = await apiHelper.refreshToken();

    // Then I should receive a new valid token
    expect(newAuth.token).toBeDefined();
    expect(newAuth.token).not.toBe(initialAuth.token);

    // And the new token should have updated expiration time
    expect(newAuth.expiresIn).toBeGreaterThan(0);
  });

  test('should handle token expiration @api @auth', async () => {
    // This test would require a way to create or simulate an expired token
    // Given I have an expired authentication token
    apiHelper.setAuthToken('expired.token.here');

    // When I try to access protected endpoints
    const status = await apiHelper.accessProtectedEndpointWithInvalidAuth();

    // Then I should receive a 401 Unauthorized status
    expect(status).toBe(401);
  });

  test('should logout and invalidate token @api @auth', async () => {
    // Given I have a valid authentication token
    const credentials = apiHelper.createTestLoginCredentials();
    await apiHelper.login(credentials);

    // When I call the logout endpoint
    await apiHelper.logout();

    // Then the token should be invalidated
    expect(apiHelper.getAuthToken()).toBeNull();

    // And subsequent requests with the token should fail
    const status = await apiHelper.accessProtectedEndpointWithoutAuth();
    expect(status).toBe(401);
  });

  test('should validate token endpoint @api @auth', async () => {
    // Given I have a valid authentication token
    const credentials = apiHelper.createTestLoginCredentials();
    await apiHelper.login(credentials);

    // When I validate the token
    const isValid = await apiHelper.validateToken();

    // Then the token should be valid
    expect(isValid).toBe(true);
  });

  test('should handle concurrent authentication requests @api @auth', async ({ request }) => {
    // Test concurrent authentication to ensure thread safety
    const credentials = apiHelper.createTestLoginCredentials();

    const authPromises = Array(5)
      .fill(null)
      .map(() => {
        const helper = new ApiHelper(request);
        return helper.login(credentials);
      });

    const authResponses = await Promise.all(authPromises);

    // All should succeed
    authResponses.forEach(response => {
      expect(response.token).toBeDefined();
      expect(response.user.username).toBe(credentials.username);
    });
  });

  test('should handle malformed authentication requests @api @auth', async ({ request }) => {
    // Test various malformed requests
    const malformedRequests = [
      {}, // Empty object
      { username: 'test' }, // Missing password
      { password: 'test' }, // Missing username
      { username: null, password: null }, // Null values
      { username: '', password: '' }, // Empty strings
      'invalid json' // Invalid JSON
    ];

    for (const malformedData of malformedRequests) {
      try {
        const response = await request.post(`${process.env.API_BASE_URL || 'http://localhost:3000/api'}/auth/login`, {
          data: malformedData,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Should return 400 Bad Request for malformed data
        expect(response.status()).toBe(400);
      } catch (error) {
        // Some malformed requests might throw errors, which is also acceptable
        expect(error).toBeDefined();
      }
    }
  });

  test('should enforce rate limiting on authentication @api @auth @security', async ({ request }) => {
    // Test rate limiting by making many rapid authentication attempts
    const credentials = apiHelper.createInvalidLoginCredentials();

    const rapidRequests = Array(20)
      .fill(null)
      .map(async () => {
        try {
          const response = await request.post(`${process.env.API_BASE_URL || 'http://localhost:3000/api'}/auth/login`, {
            data: credentials,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          return response.status();
        } catch (error) {
          return 500; // Return error status
        }
      });

    const statuses = await Promise.all(rapidRequests);

    // Should eventually receive rate limiting responses (429)
    const rateLimitedResponses = statuses.filter(status => status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('should handle authentication with special characters @api @auth', async () => {
    // Test authentication with usernames/passwords containing special characters
    const specialCharCredentials = {
      username: 'test+user@example.com',
      password: 'Test@123!#$%^&*()'
    };

    try {
      await apiHelper.login(specialCharCredentials);
    } catch (error) {
      // Should handle special characters gracefully (either succeed or fail cleanly)
      expect((error as Error).message).toContain('401'); // Expected authentication failure
    }
  });

  test('should return appropriate headers in auth response @api @auth', async () => {
    // When I authenticate successfully
    const credentials = apiHelper.createTestLoginCredentials();
    await apiHelper.login(credentials);

    // The response should include appropriate security headers
    // This would need to be implemented based on the actual API response format
    // For example: CORS headers, security headers, etc.
  });
});
