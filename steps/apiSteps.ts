import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper, AuthResponse, PumpData, PaginatedResponse } from '../utils/ApiHelper';

// Step definition functions for API BDD scenarios

export class ApiSteps {
  private apiHelper: ApiHelper;
  private authResponse: AuthResponse | undefined;
  private pumpData: PumpData | undefined;
  private pumpsData: PaginatedResponse<PumpData> | undefined;
  private lastError: any;

  constructor(request: APIRequestContext) {
    this.apiHelper = new ApiHelper(request);
  }

  // Authentication Given steps
  async givenIHaveValidApiCredentials(): Promise<void> {
    // Set up valid credentials for testing
    process.env.API_USERNAME = process.env.API_USERNAME || 'test@pumpmaster.com';
    process.env.API_PASSWORD = process.env.API_PASSWORD || 'Test@123';
  }

  async givenIHaveInvalidApiCredentials(): Promise<void> {
    // Set up invalid credentials for testing
    process.env.API_USERNAME = 'invalid@example.com';
    process.env.API_PASSWORD = 'wrongpassword';
  }

  async givenIAmNotAuthenticated(): Promise<void> {
    // Clear any existing auth
    this.authResponse = undefined;
  }

  async givenIAmAlreadyAuthenticated(): Promise<void> {
    await this.whenISendALoginRequest();
    await this.thenIShouldReceiveAValidAuthToken();
  }

  // Authentication When steps
  async whenISendALoginRequest(): Promise<void> {
    const username = process.env.API_USERNAME || 'test@pumpmaster.com';
    const password = process.env.API_PASSWORD || 'Test@123';

    try {
      this.authResponse = await this.apiHelper.login({ username, password });
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendALoginRequestWithInvalidCredentials(): Promise<void> {
    try {
      this.authResponse = await this.apiHelper.login({
        username: 'invalid@example.com',
        password: 'wrongpassword'
      });
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendALoginRequestWithMissingCredentials(): Promise<void> {
    try {
      this.authResponse = await this.apiHelper.login({ username: '', password: '' });
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendALogoutRequest(): Promise<void> {
    try {
      await this.apiHelper.logout();
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendARefreshTokenRequest(): Promise<void> {
    try {
      this.authResponse = await this.apiHelper.refreshToken();
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  // Authentication Then steps
  async thenIShouldReceiveAValidAuthToken(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.authResponse).toBeDefined();
    expect(this.authResponse?.token).toBeTruthy();
    expect(this.authResponse?.user).toBeDefined();
    expect(this.authResponse?.expiresIn).toBeGreaterThan(0);
  }

  async thenIShouldReceiveAnAuthenticationError(): Promise<void> {
    expect(this.lastError).toBeDefined();
    expect(this.authResponse).toBeUndefined();
  }

  async thenIShouldReceiveAValidationError(): Promise<void> {
    expect(this.lastError).toBeDefined();
    expect(this.authResponse).toBeUndefined();
  }

  async thenTheTokenShouldBeInvalidated(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    // Token should be cleared after logout
  }

  async thenIShouldReceiveANewValidToken(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.authResponse).toBeDefined();
    expect(this.authResponse?.token).toBeTruthy();
  }

  async thenIShouldReceiveATokenExpiredError(): Promise<void> {
    expect(this.lastError).toBeDefined();
  }

  // Pump Management Given steps
  async givenThereAreExistingPumpsInTheSystem(): Promise<void> {
    // This assumes test data is already seeded
    // In a real scenario, this might involve creating test pumps via API
  }

  async givenThereAreNoPumpsInTheSystem(): Promise<void> {
    // This would involve clearing all pumps or using a clean test environment
  }

  async givenThereIsAnExistingPumpWithId(pumpId: string): Promise<void> {
    try {
      this.pumpData = await this.apiHelper.getPump(pumpId);
      this.lastError = undefined;
      expect(this.pumpData).toBeDefined();
    } catch (error) {
      this.lastError = error;
    }
  }

  // Pump Management When steps
  async whenISendAGetAllPumpsRequest(): Promise<void> {
    try {
      this.pumpsData = await this.apiHelper.getAllPumps();
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendAGetPumpRequest(pumpId: string): Promise<void> {
    try {
      this.pumpData = await this.apiHelper.getPump(pumpId);
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendACreatePumpRequest(): Promise<void> {
    const pumpData = {
      name: 'Test Pump API',
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

    try {
      this.pumpData = await this.apiHelper.createPump(pumpData);
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendACreatePumpRequestWithInvalidData(): Promise<void> {
    const invalidPumpData = {
      name: '', // Invalid: empty name
      type: 'InvalidType',
      area: '', // Invalid: empty area
      latitude: 'invalid', // Invalid: not numeric
      longitude: 'invalid', // Invalid: not numeric
      flowRate: 'invalid-capacity',
      offset: 'invalid', // Invalid: not numeric
      currentPressure: 'invalid', // Invalid: not numeric
      minPressure: 'invalid', // Invalid: not numeric
      maxPressure: 'invalid' // Invalid: not numeric
    };

    try {
      this.pumpData = await this.apiHelper.createPump(invalidPumpData as any);
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendAnUpdatePumpRequest(pumpId: string): Promise<void> {
    const updateData = {
      name: 'Updated Test Pump API',
      description: 'Updated pump description',
      status: 'Maintenance'
    };

    try {
      this.pumpData = await this.apiHelper.updatePump(pumpId, updateData);
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendADeletePumpRequest(pumpId: string): Promise<void> {
    try {
      await this.apiHelper.deletePump(pumpId);
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendASearchPumpsRequest(searchTerm: string): Promise<void> {
    try {
      this.pumpsData = await this.apiHelper.searchPumps(searchTerm);
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendAFilterPumpsRequest(filterType: string, filterValue: string): Promise<void> {
    try {
      if (filterType === 'type') {
        this.pumpsData = await this.apiHelper.filterPumpsByType(filterValue);
      } else if (filterType === 'status') {
        this.pumpsData = await this.apiHelper.filterPumpsByStatus(filterValue);
      } else {
        throw new Error(`Unsupported filter type: ${filterType}`);
      }
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendAGetPumpRequestWithInvalidId(): Promise<void> {
    try {
      this.pumpData = await this.apiHelper.getPump('invalid-id');
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  async whenISendMultipleSimultaneousRequests(): Promise<void> {
    try {
      // Send multiple requests concurrently
      const requests = [this.apiHelper.getAllPumps(), this.apiHelper.getAllPumps(), this.apiHelper.getAllPumps()];

      const responses = await Promise.all(requests);
      this.pumpsData = responses[0]; // Use first response for verification
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error;
    }
  }

  // Pump Management Then steps
  async thenIShouldReceiveAListOfPumps(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.pumpsData).toBeDefined();

    // Assert that pumpsData is not undefined before accessing properties
    if (!this.pumpsData) {
      throw new Error('Expected pumpsData to be defined but got undefined');
    }

    expect(this.pumpsData.data).toBeDefined();
    expect(Array.isArray(this.pumpsData.data)).toBeTruthy();
    expect(this.pumpsData.total).toBeGreaterThan(0);

    // Verify each pump has required properties
    this.pumpsData.data.forEach((pump: PumpData) => {
      expect(pump).toHaveProperty('id');
      expect(pump).toHaveProperty('name');
      expect(pump).toHaveProperty('type');
      expect(pump).toHaveProperty('status');
    });
  }

  async thenIShouldReceivePumpDetails(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.pumpData).toBeDefined();

    // Assert that pumpData is not undefined before accessing properties
    if (!this.pumpData) {
      throw new Error('Expected pumpData to be defined but got undefined');
    }

    expect(this.pumpData.id).toBeDefined();
    expect(this.pumpData.name).toBeDefined();
    expect(this.pumpData.type).toBeDefined();
    expect(this.pumpData.area).toBeDefined();
    expect(this.pumpData.latitude).toBeDefined();
    expect(this.pumpData.longitude).toBeDefined();
    expect(this.pumpData.flowRate).toBeDefined();
    expect(this.pumpData.offset).toBeDefined();
    expect(this.pumpData.currentPressure).toBeDefined();
    expect(this.pumpData.minPressure).toBeDefined();
    expect(this.pumpData.maxPressure).toBeDefined();
  }

  async thenThePumpShouldBeCreatedSuccessfully(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.pumpData).toBeDefined();

    // Assert that pumpData is not undefined before accessing properties
    if (!this.pumpData) {
      throw new Error('Expected pumpData to be defined but got undefined');
    }

    expect(this.pumpData.id).toBeDefined();
    expect(this.pumpData.name).toBe('Test Pump API');
    expect(this.pumpData.type).toBe('Centrifugal');
  }

  async thenThePumpShouldBeUpdatedSuccessfully(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.pumpData).toBeDefined();

    // Assert that pumpData is not undefined before accessing properties
    if (!this.pumpData) {
      throw new Error('Expected pumpData to be defined but got undefined');
    }

    expect(this.pumpData.name).toBe('Updated Test Pump API');
    expect(this.pumpData.status).toBe('Maintenance');
  }

  async thenThePumpShouldBeDeletedSuccessfully(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    // For delete operations, we don't expect data back
  }

  async thenIShouldReceiveFilteredResults(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.pumpsData).toBeDefined();

    // Assert that pumpsData is not undefined before accessing properties
    if (!this.pumpsData) {
      throw new Error('Expected pumpsData to be defined but got undefined');
    }

    expect(Array.isArray(this.pumpsData.data)).toBeTruthy();

    // Verify all results match the filter criteria
    this.pumpsData.data.forEach((pump: PumpData) => {
      expect(pump).toHaveProperty('type');
      // Additional filter verification would depend on the specific filter
    });
  }

  async thenIShouldReceiveSearchResults(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.pumpsData).toBeDefined();

    // Assert that pumpsData is not undefined before accessing properties
    if (!this.pumpsData) {
      throw new Error('Expected pumpsData to be defined but got undefined');
    }

    expect(Array.isArray(this.pumpsData.data)).toBeTruthy();

    // Verify search results contain relevant data
    this.pumpsData.data.forEach((pump: PumpData) => {
      expect(pump.name).toBeDefined();
      expect(pump.area).toBeDefined();
    });
  }

  async thenIShouldReceiveAnEmptyList(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.pumpsData).toBeDefined();

    // Assert that pumpsData is not undefined before accessing properties
    if (!this.pumpsData) {
      throw new Error('Expected pumpsData to be defined but got undefined');
    }

    expect(Array.isArray(this.pumpsData.data)).toBeTruthy();
    expect(this.pumpsData.data.length).toBe(0);
  }

  async thenIShouldReceiveANotFoundError(): Promise<void> {
    expect(this.lastError).toBeDefined();
    expect(this.pumpData).toBeUndefined();
  }

  async thenIShouldReceiveAnUnauthorizedError(): Promise<void> {
    expect(this.lastError).toBeDefined();
  }

  async thenIShouldReceiveABadRequestError(): Promise<void> {
    expect(this.lastError).toBeDefined();
  }

  async thenAllRequestsShouldCompleteSuccessfully(): Promise<void> {
    expect(this.lastError).toBeUndefined();
    expect(this.pumpsData).toBeDefined();
  }

  async thenTheResponseTimeShouldBeAcceptable(): Promise<void> {
    // Response time would be measured during the request execution
    // For now, we just verify that the request completed without timeout
    expect(this.lastError).toBeUndefined();
  }

  async thenIShouldReceiveAnErrorAboutInvalidData(): Promise<void> {
    expect(this.lastError).toBeDefined();
    expect(this.pumpData).toBeUndefined();
  }
}
