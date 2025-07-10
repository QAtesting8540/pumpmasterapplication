import { APIRequestContext, expect } from '@playwright/test';

export interface PumpData {
  id?: string;
  name: string;
  type: string;
  area: string;
  latitude: number;
  longitude: number;
  flowRate: string;
  offset: number;
  currentPressure: number;
  minPressure: number;
  maxPressure: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    tenantId: string;
  };
  expiresIn: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiHelper {
  private request: APIRequestContext;
  private baseURL: string;
  private authToken: string | null = null;

  constructor(request: APIRequestContext, baseURL: string = process.env.API_BASE_URL || 'http://localhost:3000/api') {
    this.request = request;
    this.baseURL = baseURL;
  }

  // Authentication APIs
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request.post(`${this.baseURL}/auth/login`, {
      data: credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const authData = (await response.json()) as AuthResponse;
    this.authToken = authData.token;
    return authData;
  }

  async logout(): Promise<void> {
    const response = await this.request.post(`${this.baseURL}/auth/logout`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    this.authToken = null;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.request.post(`${this.baseURL}/auth/refresh`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    const authData = (await response.json()) as AuthResponse;
    this.authToken = authData.token;
    return authData;
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await this.request.get(`${this.baseURL}/auth/validate`, {
        headers: this.getAuthHeaders()
      });
      return response.status() === 200;
    } catch {
      return false;
    }
  }

  // Pump Management APIs
  async createPump(pumpData: PumpData): Promise<PumpData> {
    const response = await this.request.post(`${this.baseURL}/pumps`, {
      data: pumpData,
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(201);
    return (await response.json()) as PumpData;
  }

  async getPump(pumpId: string): Promise<PumpData> {
    const response = await this.request.get(`${this.baseURL}/pumps/${pumpId}`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    return (await response.json()) as PumpData;
  }

  async updatePump(pumpId: string, pumpData: Partial<PumpData>): Promise<PumpData> {
    const response = await this.request.put(`${this.baseURL}/pumps/${pumpId}`, {
      data: pumpData,
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    return (await response.json()) as PumpData;
  }

  async deletePump(pumpId: string): Promise<void> {
    const response = await this.request.delete(`${this.baseURL}/pumps/${pumpId}`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(204);
  }

  async getAllPumps(page: number = 1, limit: number = 10): Promise<PaginatedResponse<PumpData>> {
    const response = await this.request.get(`${this.baseURL}/pumps?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    return (await response.json()) as PaginatedResponse<PumpData>;
  }

  async searchPumps(searchTerm: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<PumpData>> {
    const response = await this.request.get(
      `${this.baseURL}/pumps/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`,
      {
        headers: this.getAuthHeaders()
      }
    );

    expect(response.status()).toBe(200);
    return (await response.json()) as PaginatedResponse<PumpData>;
  }

  async filterPumpsByType(
    pumpType: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<PumpData>> {
    const response = await this.request.get(
      `${this.baseURL}/pumps/filter?type=${encodeURIComponent(pumpType)}&page=${page}&limit=${limit}`,
      {
        headers: this.getAuthHeaders()
      }
    );

    expect(response.status()).toBe(200);
    return (await response.json()) as PaginatedResponse<PumpData>;
  }

  async filterPumpsByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<PumpData>> {
    const response = await this.request.get(
      `${this.baseURL}/pumps/filter?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`,
      {
        headers: this.getAuthHeaders()
      }
    );

    expect(response.status()).toBe(200);
    return (await response.json()) as PaginatedResponse<PumpData>;
  }

  // Validation and Error Testing APIs
  async createPumpWithInvalidData(pumpData: any): Promise<{ status: number; error: any }> {
    const response = await this.request.post(`${this.baseURL}/pumps`, {
      data: pumpData,
      headers: this.getAuthHeaders()
    });

    return {
      status: response.status(),
      error: await response.json()
    };
  }

  async updatePumpWithInvalidData(pumpId: string, pumpData: any): Promise<{ status: number; error: any }> {
    const response = await this.request.put(`${this.baseURL}/pumps/${pumpId}`, {
      data: pumpData,
      headers: this.getAuthHeaders()
    });

    return {
      status: response.status(),
      error: await response.json()
    };
  }

  async accessProtectedEndpointWithoutAuth(): Promise<number> {
    const response = await this.request.get(`${this.baseURL}/pumps`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.status();
  }

  async accessProtectedEndpointWithInvalidAuth(): Promise<number> {
    const response = await this.request.get(`${this.baseURL}/pumps`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid-token'
      }
    });

    return response.status();
  }

  // Bulk Operations APIs
  async bulkCreatePumps(pumpsData: PumpData[]): Promise<PumpData[]> {
    const response = await this.request.post(`${this.baseURL}/pumps/bulk`, {
      data: { pumps: pumpsData },
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(201);
    return (await response.json()) as PumpData[];
  }

  async bulkUpdatePumps(updates: { id: string; data: Partial<PumpData> }[]): Promise<PumpData[]> {
    const response = await this.request.put(`${this.baseURL}/pumps/bulk`, {
      data: { updates },
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    return (await response.json()) as PumpData[];
  }

  async bulkDeletePumps(pumpIds: string[]): Promise<void> {
    const response = await this.request.delete(`${this.baseURL}/pumps/bulk`, {
      data: { ids: pumpIds },
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(204);
  }

  // Export/Import APIs
  async exportPumps(format: 'csv' | 'json' | 'xlsx' = 'json'): Promise<any> {
    const response = await this.request.get(`${this.baseURL}/pumps/export?format=${format}`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);

    if (format === 'json') {
      return await response.json();
    } else {
      return await response.body();
    }
  }

  async importPumps(file: Buffer, format: 'csv' | 'json' | 'xlsx'): Promise<{ imported: number; errors: any[] }> {
    const response = await this.request.post(`${this.baseURL}/pumps/import`, {
      multipart: {
        file: {
          name: `pumps.${format}`,
          mimeType: this.getMimeType(format),
          buffer: file
        },
        format: format
      },
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    });

    expect(response.status()).toBe(200);
    return await response.json();
  }

  // Statistics and Analytics APIs
  async getPumpStatistics(): Promise<any> {
    const response = await this.request.get(`${this.baseURL}/pumps/statistics`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    return await response.json();
  }

  async getPumpsByStatusCount(): Promise<{ [status: string]: number }> {
    const response = await this.request.get(`${this.baseURL}/pumps/statistics/status`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    return await response.json();
  }

  async getPumpsByTypeCount(): Promise<{ [type: string]: number }> {
    const response = await this.request.get(`${this.baseURL}/pumps/statistics/type`, {
      headers: this.getAuthHeaders()
    });

    expect(response.status()).toBe(200);
    return await response.json();
  }

  // Helper Methods
  private getAuthHeaders(): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'csv':
        return 'text/csv';
      case 'json':
        return 'application/json';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return 'application/octet-stream';
    }
  }

  // Test Data Factory Methods
  createTestPumpData(overrides: Partial<PumpData> = {}): PumpData {
    return {
      name: 'Test Pump',
      type: 'Centrifugal',
      area: 'Building A - Room 101',
      latitude: 40.7128,
      longitude: -74.006,
      flowRate: '1000 GPM',
      offset: 0,
      currentPressure: 150,
      minPressure: 100,
      maxPressure: 200,
      ...overrides
    };
  }

  createInvalidPumpData(): any {
    return {
      name: '', // Invalid: empty name
      type: 'InvalidType', // Invalid: not in allowed types
      area: '', // Invalid: empty area
      latitude: 'invalid', // Invalid: not numeric
      longitude: 'invalid', // Invalid: not numeric
      flowRate: 'invalid capacity', // Invalid: not numeric
      offset: 'invalid', // Invalid: not numeric
      currentPressure: 'invalid', // Invalid: not numeric
      minPressure: 'invalid', // Invalid: not numeric
      maxPressure: 'invalid' // Invalid: not numeric
    };
  }

  createTestLoginCredentials(): LoginCredentials {
    return {
      username: process.env.TEST_USERNAME || 'testuser@pumpmaster.com',
      password: process.env.TEST_PASSWORD || 'Test@123'
    };
  }

  createInvalidLoginCredentials(): LoginCredentials {
    return {
      username: 'invalid@example.com',
      password: 'wrongpassword'
    };
  }

  // Assertion Helper Methods
  async assertPumpExists(pumpId: string): Promise<void> {
    const pump = await this.getPump(pumpId);
    expect(pump).toBeDefined();
    expect(pump.id).toBe(pumpId);
  }

  async assertPumpDoesNotExist(pumpId: string): Promise<void> {
    try {
      await this.getPump(pumpId);
      throw new Error(`Pump ${pumpId} should not exist`);
    } catch (error: any) {
      expect(error.message).toContain('404');
    }
  }

  assertPumpData(actual: PumpData, expected: Partial<PumpData>): void {
    Object.keys(expected).forEach(key => {
      expect(actual[key as keyof PumpData]).toBe(expected[key as keyof PumpData]);
    });
  }

  assertPaginatedResponse<T>(response: PaginatedResponse<T>, expectedTotal?: number, expectedPage?: number): void {
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('total');
    expect(response).toHaveProperty('page');
    expect(response).toHaveProperty('limit');
    expect(response).toHaveProperty('totalPages');
    expect(Array.isArray(response.data)).toBe(true);

    if (expectedTotal !== undefined) {
      expect(response.total).toBe(expectedTotal);
    }

    if (expectedPage !== undefined) {
      expect(response.page).toBe(expectedPage);
    }
  }

  // Cleanup Methods
  async cleanup(): Promise<void> {
    // Clean up any test data created during tests
    try {
      const pumps = await this.getAllPumps(1, 1000);
      const testPumps = pumps.data.filter(
        pump => pump.name.includes('Test') || pump.area.includes('test') || pump.area.includes('automation')
      );

      for (const pump of testPumps) {
        if (pump.id) {
          await this.deletePump(pump.id);
        }
      }
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }
}
