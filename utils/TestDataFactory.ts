/**
 * Test Data Factory for Pump Master Application
 * Provides methods to generate test data for different test scenarios
 */

export interface TestUser {
  username: string;
  password: string;
  email: string;
  tenantId: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface TestPump {
  name: string;
  type: 'Centrifugal' | 'Submersible' | 'Positive Displacement' | 'Turbine';
  area: string;
  latitude: number;
  longitude: number;
  flowRate: string;
  offset: number;
  currentPressure: number;
  minPressure: number;
  maxPressure: number;
  status?: 'Active' | 'Inactive' | 'Maintenance' | 'Decommissioned';
}

export class TestDataFactory {
  private static userCounter = 0;
  private static pumpCounter = 0;

  /**
   * Generate unique test users
   */
  static createUser(overrides: Partial<TestUser> = {}): TestUser {
    this.userCounter++;
    return {
      username: `testuser${this.userCounter}@pumpmaster.com`,
      password: 'Test@123',
      email: `testuser${this.userCounter}@pumpmaster.com`,
      tenantId: `tenant-${this.userCounter}`,
      role: 'user',
      ...overrides
    };
  }

  /**
   * Generate admin user
   */
  static createAdminUser(overrides: Partial<TestUser> = {}): TestUser {
    return this.createUser({
      role: 'admin',
      username: 'admin@pumpmaster.com',
      email: 'admin@pumpmaster.com',
      ...overrides
    });
  }

  /**
   * Generate viewer user
   */
  static createViewerUser(overrides: Partial<TestUser> = {}): TestUser {
    return this.createUser({
      role: 'viewer',
      username: 'viewer@pumpmaster.com',
      email: 'viewer@pumpmaster.com',
      ...overrides
    });
  }

  /**
   * Generate test pump data
   */
  static createPump(overrides: Partial<TestPump> = {}): TestPump {
    this.pumpCounter++;
    const types: TestPump['type'][] = ['Centrifugal', 'Submersible', 'Positive Displacement', 'Turbine'];
    const statuses: TestPump['status'][] = ['Active', 'Inactive', 'Maintenance', 'Decommissioned'];
    const manufacturers = ['Grundfos', 'Xylem', 'Pentair', 'KSB', 'Flowserve'];

    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      name: `Test Pump ${this.pumpCounter}`,
      type: randomType,
      status: randomStatus,
      area: `Building ${String.fromCharCode(65 + (this.pumpCounter % 26))} - Room ${100 + this.pumpCounter}`,
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1, // Random latitude around NYC
      longitude: -74.006 + (Math.random() - 0.5) * 0.1, // Random longitude around NYC
      flowRate: `${Math.floor(Math.random() * 5000) + 500} GPM`,
      offset: Math.floor(Math.random() * 10), // Random offset 0-10
      currentPressure: Math.floor(Math.random() * 100) + 100, // Random pressure 100-200
      minPressure: Math.floor(Math.random() * 50) + 50, // Random min pressure 50-100
      maxPressure: Math.floor(Math.random() * 100) + 200, // Random max pressure 200-300
      ...overrides
    };
  }

  /**
   * Generate multiple pumps
   */
  static createPumps(count: number, overrides: Partial<TestPump> = {}): TestPump[] {
    return Array.from({ length: count }, () => this.createPump(overrides));
  }

  /**
   * Generate pumps by type
   */
  static createPumpsByType(type: TestPump['type'], count: number = 1): TestPump[] {
    return Array.from({ length: count }, () => this.createPump({ type }));
  }

  /**
   * Generate pumps by status
   */
  static createPumpsByStatus(status: TestPump['status'], count: number = 1): TestPump[] {
    return Array.from({ length: count }, () => this.createPump({ status }));
  }

  /**
   * Generate centrifugal pumps specifically
   */
  static createCentrifugalPumps(count: number = 1): TestPump[] {
    return this.createPumpsByType('Centrifugal', count);
  }

  /**
   * Generate submersible pumps specifically
   */
  static createSubmersiblePumps(count: number = 1): TestPump[] {
    return this.createPumpsByType('Submersible', count);
  }

  /**
   * Generate active pumps specifically
   */
  static createActivePumps(count: number = 1): TestPump[] {
    return this.createPumpsByStatus('Active', count);
  }

  /**
   * Generate inactive pumps specifically
   */
  static createInactivePumps(count: number = 1): TestPump[] {
    return this.createPumpsByStatus('Inactive', count);
  }

  /**
   * Generate pumps for search testing
   */
  static createSearchTestPumps(): TestPump[] {
    return [
      this.createPump({ name: 'High Efficiency Centrifugal Pump', type: 'Centrifugal' }),
      this.createPump({ name: 'Submersible Water Pump', type: 'Submersible' }),
      this.createPump({ name: 'Industrial Centrifugal System', type: 'Centrifugal' }),
      this.createPump({ name: 'Deep Well Submersible Unit', type: 'Submersible' }),
      this.createPump({ name: 'Positive Displacement Pump', type: 'Positive Displacement' })
    ];
  }

  /**
   * Generate pumps for filter testing
   */
  static createFilterTestPumps(): TestPump[] {
    return [
      ...this.createCentrifugalPumps(3),
      ...this.createSubmersiblePumps(2),
      ...this.createActivePumps(4),
      ...this.createInactivePumps(3)
    ];
  }

  /**
   * Generate invalid pump data for validation testing
   */
  static createInvalidPump(): Partial<TestPump> {
    return {
      name: '', // Invalid: empty name
      type: 'InvalidType' as any, // Invalid: not in allowed types
      area: '', // Invalid: empty area
      latitude: 'invalid' as any, // Invalid: not numeric
      longitude: 'invalid' as any, // Invalid: not numeric
      flowRate: 'invalid capacity', // Invalid: not numeric
      offset: 'invalid' as any, // Invalid: not numeric
      currentPressure: 'invalid' as any, // Invalid: not numeric
      minPressure: 'invalid' as any, // Invalid: not numeric
      maxPressure: 'invalid' as any // Invalid: not numeric
    };
  }

  /**
   * Generate pump with missing required fields
   */
  static createIncompleteP(): Partial<TestPump> {
    return {
      area: 'Test Area with missing required fields'
    };
  }

  /**
   * Generate pump data for performance testing
   */
  static createLargeDataset(count: number = 1000): TestPump[] {
    return Array.from({ length: count }, (_, index) => this.createPump({ name: `Performance Test Pump ${index + 1}` }));
  }

  /**
   * Generate pump data for boundary testing
   */
  static createBoundaryTestPumps(): TestPump[] {
    return [
      // Minimum values
      this.createPump({
        name: 'A', // Minimum name length (if validation exists)
        flowRate: '1 GPM', // Minimum flow rate
        offset: 0, // Minimum offset
        minPressure: 1, // Minimum pressure
        maxPressure: 2 // Just above minimum
      }),
      // Maximum values
      this.createPump({
        name: 'A'.repeat(255), // Maximum name length
        flowRate: '99999 GPM', // Maximum flow rate
        offset: 100, // Maximum offset
        currentPressure: 500, // High pressure
        minPressure: 400, // High min pressure
        maxPressure: 600 // Maximum pressure
      }),
      // Edge cases
      this.createPump({
        name: 'Pump with Special Characters !@#$%^&*()',
        flowRate: '1000.5 GPM', // Decimal flow rate
        area: 'Area with Unicode: 测试位置',
        latitude: 90.0, // Maximum latitude
        longitude: 180.0 // Maximum longitude
      })
    ];
  }

  /**
   * Generate pump update data
   */
  static createPumpUpdateData(): Partial<TestPump> {
    return {
      name: `Updated Pump ${Date.now()}`,
      status: 'Maintenance',
      area: 'Updated area for testing purposes',
      currentPressure: 175, // Updated pressure
      offset: 5 // Updated offset
    };
  }

  /**
   * Generate random date within the last 5 years
   */
  private static getRandomDate(): string {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 5);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  }

  /**
   * Reset counters (useful for test isolation)
   */
  static resetCounters(): void {
    this.userCounter = 0;
    this.pumpCounter = 0;
  }

  /**
   * Generate test credentials for different environments
   */
  static getEnvironmentCredentials(environment: 'dev' | 'staging' | 'prod' = 'dev'): TestUser {
    const credentials = {
      dev: {
        username: 'dev.user@pumpmaster.com',
        password: 'DevTest@123'
      },
      staging: {
        username: 'staging.user@pumpmaster.com',
        password: 'StagingTest@123'
      },
      prod: {
        username: 'prod.user@pumpmaster.com',
        password: 'ProdTest@123'
      }
    };

    return this.createUser(credentials[environment]);
  }

  /**
   * Generate test data for specific test scenarios
   */
  static getScenarioData(scenario: string): any {
    const scenarios = {
      'login-success': {
        user: this.createUser(),
        expectedUrl: '/pumps'
      },
      'login-failure': {
        user: { username: 'invalid@test.com', password: 'wrongpassword' },
        expectedError: 'Invalid username or password'
      },
      'pump-creation': {
        pump: this.createPump(),
        expectedSuccess: 'Pump created successfully'
      },
      'pump-validation': {
        pump: this.createInvalidPump(),
        expectedErrors: ['Name is required', 'Invalid pump type']
      },
      'search-results': {
        pumps: this.createSearchTestPumps(),
        searchTerm: 'Centrifugal'
      },
      'filter-results': {
        pumps: this.createFilterTestPumps(),
        filterType: 'Centrifugal'
      }
    };

    return scenarios[scenario as keyof typeof scenarios] || {};
  }
}
