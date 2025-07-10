import { test, expect } from '@playwright/test';
import { ApiHelper, PumpData } from '../../utils/ApiHelper';

test.describe('API Pump Management', () => {
  let apiHelper: ApiHelper;
  let createdPumpIds: string[] = [];

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);

    // Authenticate before each test
    const credentials = apiHelper.createTestLoginCredentials();
    await apiHelper.login(credentials);
  });

  test.afterEach(async () => {
    // Cleanup created pumps
    for (const pumpId of createdPumpIds) {
      try {
        await apiHelper.deletePump(pumpId);
      } catch (error) {
        console.warn(`Failed to cleanup pump ${pumpId}:`, error);
      }
    }
    createdPumpIds = [];

    await apiHelper.cleanup();
  });

  test('should create pump via API @api @crud', async () => {
    // When I send a POST request to "/pumps" with valid pump data
    const pumpData = apiHelper.createTestPumpData();
    const createdPump = await apiHelper.createPump(pumpData);

    if (createdPump.id) {
      createdPumpIds.push(createdPump.id);
    }

    // Then I should receive a 201 Created status (handled by ApiHelper)
    // And the response should contain the created pump with ID
    expect(createdPump.id).toBeDefined();
    expect(createdPump.name).toBe(pumpData.name);
    expect(createdPump.type).toBe(pumpData.type);
    expect(createdPump.status).toBe(pumpData.status);

    // And the pump should be retrievable via GET request
    const retrievedPump = await apiHelper.getPump(createdPump.id!);
    apiHelper.assertPumpData(retrievedPump, pumpData);
  });

  test('should retrieve pump by ID via API @api @crud', async () => {
    // Given there is an existing pump in the system
    const pumpData = apiHelper.createTestPumpData({ name: 'Test Pump for Retrieval' });
    const createdPump = await apiHelper.createPump(pumpData);

    if (createdPump.id) {
      createdPumpIds.push(createdPump.id);
    }

    // When I send a GET request to "/pumps/{id}"
    const retrievedPump = await apiHelper.getPump(createdPump.id!);

    // Then I should receive a 200 OK status (handled by ApiHelper)
    // And the response should contain the pump details
    expect(retrievedPump.id).toBe(createdPump.id);
    apiHelper.assertPumpData(retrievedPump, pumpData);
  });

  test('should update pump via API @api @crud', async () => {
    // Given there is an existing pump in the system
    const pumpData = apiHelper.createTestPumpData({ name: 'Test Pump for Update' });
    const createdPump = await apiHelper.createPump(pumpData);

    if (createdPump.id) {
      createdPumpIds.push(createdPump.id);
    }

    // When I send a PUT request to "/pumps/{id}" with updated data
    const updateData = {
      name: 'Updated Test Pump',
      status: 'Maintenance' as const,
      flowRate: '2000 GPM'
    };

    const updatedPump = await apiHelper.updatePump(createdPump.id!, updateData);

    // Then I should receive a 200 OK status (handled by ApiHelper)
    // And the response should contain the updated pump details
    expect(updatedPump.name).toBe(updateData.name);
    expect(updatedPump.status).toBe(updateData.status);
    expect(updatedPump.flowRate).toBe(updateData.flowRate);

    // And the pump should be updated in the system
    const retrievedPump = await apiHelper.getPump(createdPump.id!);
    apiHelper.assertPumpData(retrievedPump, updateData);
  });

  test('should delete pump via API @api @crud', async () => {
    // Given there is an existing pump in the system
    const pumpData = apiHelper.createTestPumpData({ name: 'Test Pump for Deletion' });
    const createdPump = await apiHelper.createPump(pumpData);

    // When I send a DELETE request to "/pumps/{id}"
    await apiHelper.deletePump(createdPump.id!);

    // Then I should receive a 204 No Content status (handled by ApiHelper)
    // And the pump should no longer exist in the system
    await expect(async () => {
      await apiHelper.getPump(createdPump.id!);
    }).rejects.toThrow();
  });

  test('should get all pumps via API @api @crud', async () => {
    // Given there are multiple pumps in the system
    const pump1 = await apiHelper.createPump(apiHelper.createTestPumpData({ name: 'Test Pump 1' }));
    const pump2 = await apiHelper.createPump(apiHelper.createTestPumpData({ name: 'Test Pump 2' }));

    if (pump1.id) createdPumpIds.push(pump1.id);
    if (pump2.id) createdPumpIds.push(pump2.id);

    // When I send a GET request to "/pumps"
    const response = await apiHelper.getAllPumps();

    // Then I should receive a 200 OK status (handled by ApiHelper)
    // And the response should contain a paginated list of pumps
    apiHelper.assertPaginatedResponse(response);
    expect(response.data.length).toBeGreaterThanOrEqual(2);

    // And the response should include pagination metadata
    expect(response.total).toBeGreaterThanOrEqual(2);
    expect(response.page).toBe(1);
    expect(response.limit).toBe(10);
  });

  test('should search pumps via API @api @search', async () => {
    // Given there are pumps with various names in the system
    const centrifugalPump = await apiHelper.createPump(
      apiHelper.createTestPumpData({ name: 'Centrifugal Test Pump', type: 'Centrifugal' })
    );
    const submersiblePump = await apiHelper.createPump(
      apiHelper.createTestPumpData({ name: 'Submersible Test Pump', type: 'Submersible' })
    );

    if (centrifugalPump.id) createdPumpIds.push(centrifugalPump.id);
    if (submersiblePump.id) createdPumpIds.push(submersiblePump.id);

    // When I send a GET request to "/pumps/search?q=centrifugal"
    const searchResults = await apiHelper.searchPumps('centrifugal');

    // Then I should receive a 200 OK status (handled by ApiHelper)
    // And the response should contain only pumps matching the search term
    apiHelper.assertPaginatedResponse(searchResults);
    expect(searchResults.data.length).toBeGreaterThanOrEqual(1);

    const foundCentrifugalPump = searchResults.data.find(pump => pump.name.includes('Centrifugal'));
    expect(foundCentrifugalPump).toBeDefined();
  });

  test('should filter pumps by type via API @api @filter', async () => {
    // Given there are pumps of different types in the system
    const centrifugalPump = await apiHelper.createPump(
      apiHelper.createTestPumpData({ name: 'Filter Test Centrifugal', type: 'Centrifugal' })
    );
    const submersiblePump = await apiHelper.createPump(
      apiHelper.createTestPumpData({ name: 'Filter Test Submersible', type: 'Submersible' })
    );

    if (centrifugalPump.id) createdPumpIds.push(centrifugalPump.id);
    if (submersiblePump.id) createdPumpIds.push(submersiblePump.id);

    // When I send a GET request to "/pumps/filter?type=centrifugal"
    const filterResults = await apiHelper.filterPumpsByType('Centrifugal');

    // Then I should receive a 200 OK status (handled by ApiHelper)
    // And the response should contain only centrifugal pumps
    apiHelper.assertPaginatedResponse(filterResults);
    filterResults.data.forEach(pump => {
      expect(pump.type).toBe('Centrifugal');
    });
  });

  test('should filter pumps by status via API @api @filter', async () => {
    // Given there are pumps with different statuses in the system
    const activePump = await apiHelper.createPump(
      apiHelper.createTestPumpData({ name: 'Active Filter Test', status: 'Active' })
    );
    const inactivePump = await apiHelper.createPump(
      apiHelper.createTestPumpData({ name: 'Inactive Filter Test', status: 'Inactive' })
    );

    if (activePump.id) createdPumpIds.push(activePump.id);
    if (inactivePump.id) createdPumpIds.push(inactivePump.id);

    // When I send a GET request to "/pumps/filter?status=active"
    const filterResults = await apiHelper.filterPumpsByStatus('Active');

    // Then I should receive a 200 OK status (handled by ApiHelper)
    // And the response should contain only active pumps
    apiHelper.assertPaginatedResponse(filterResults);
    filterResults.data.forEach(pump => {
      expect(pump.status).toBe('Active');
    });
  });

  test('should support API pagination @api @pagination', async () => {
    // Given there are multiple pumps in the system
    const pumpsToCreate = 15;
    const createdPumps: PumpData[] = [];

    for (let i = 1; i <= pumpsToCreate; i++) {
      const pump = await apiHelper.createPump(apiHelper.createTestPumpData({ name: `Pagination Test Pump ${i}` }));
      createdPumps.push(pump);
      if (pump.id) createdPumpIds.push(pump.id);
    }

    // When I send a GET request to "/pumps?page=2&limit=10"
    const response = await apiHelper.getAllPumps(2, 10);

    // Then I should receive a 200 OK status (handled by ApiHelper)
    // And the response should contain 10 pumps (or remaining pumps if less)
    apiHelper.assertPaginatedResponse(response, undefined, 2);
    expect(response.data.length).toBeLessThanOrEqual(10);

    // And the pagination metadata should indicate page 2
    expect(response.page).toBe(2);
    expect(response.limit).toBe(10);
  });

  test('should validate required fields via API @api @validation', async () => {
    // When I send a POST request to "/pumps" with missing required fields
    const invalidData = { description: 'Missing required fields' };
    const result = await apiHelper.createPumpWithInvalidData(invalidData);

    // Then I should receive a 400 Bad Request status
    expect(result.status).toBe(400);

    // And the response should contain validation error details
    expect(result.error).toBeDefined();
    expect(result.error.message || result.error.errors).toBeDefined();
  });

  test('should validate data types via API @api @validation', async () => {
    // When I send a POST request to "/pumps" with invalid data types
    const invalidData = apiHelper.createInvalidPumpData();
    const result = await apiHelper.createPumpWithInvalidData(invalidData);

    // Then I should receive a 400 Bad Request status
    expect(result.status).toBe(400);

    // And the response should contain data type validation errors
    expect(result.error).toBeDefined();
  });

  test('should handle non-existent pump ID @api @error', async () => {
    // When I send a GET request to "/pumps/non-existent-id"
    await expect(async () => {
      await apiHelper.getPump('non-existent-id');
    }).rejects.toThrow();

    // Then I should receive a 404 Not Found status
    // (This is handled by the ApiHelper's expect statements)
  });

  test('should handle concurrent API requests @api @performance', async () => {
    // Test concurrent requests to ensure API handles them properly
    const concurrentRequests = Array(10)
      .fill(null)
      .map(async (_, index) => {
        const pumpData = apiHelper.createTestPumpData({ name: `Concurrent Test Pump ${index}` });
        return await apiHelper.createPump(pumpData);
      });

    const results = await Promise.all(concurrentRequests);

    // All requests should succeed
    expect(results.length).toBe(10);
    results.forEach((pump, index) => {
      expect(pump.id).toBeDefined();
      expect(pump.name).toBe(`Concurrent Test Pump ${index}`);
      if (pump.id) createdPumpIds.push(pump.id);
    });
  });

  test('should get pump statistics via API @api @statistics', async () => {
    // Given there are pumps with various types and statuses
    const testPumps = [
      { name: 'Stats Test 1', type: 'Centrifugal', status: 'Active' },
      { name: 'Stats Test 2', type: 'Centrifugal', status: 'Inactive' },
      { name: 'Stats Test 3', type: 'Submersible', status: 'Active' }
    ];

    for (const pumpData of testPumps) {
      const pump = await apiHelper.createPump(apiHelper.createTestPumpData(pumpData));
      if (pump.id) createdPumpIds.push(pump.id);
    }

    // When I send a GET request to "/pumps/statistics"
    const statistics = await apiHelper.getPumpStatistics();

    // Then I should receive a 200 OK status (handled by ApiHelper)
    // And the response should contain pump statistics
    expect(statistics).toBeDefined();
    expect(typeof statistics).toBe('object');
  });

  test('should validate pump creation with comprehensive data @api @crud', async () => {
    // Test with all possible valid combinations
    const comprehensiveData = apiHelper.createTestPumpData({
      name: 'API Comprehensive Test Pump',
      type: 'Submersible',
      area: 'API Test Location - Building C',
      latitude: 40.6892,
      longitude: -74.0445,
      flowRate: '3000 GPM',
      offset: 10,
      currentPressure: 200,
      minPressure: 150,
      maxPressure: 300
    });

    const createdPump = await apiHelper.createPump(comprehensiveData);
    if (createdPump.id) createdPumpIds.push(createdPump.id);

    // Verify all fields are correctly saved and retrievable
    apiHelper.assertPumpData(createdPump, comprehensiveData);

    const retrievedPump = await apiHelper.getPump(createdPump.id!);
    apiHelper.assertPumpData(retrievedPump, comprehensiveData);
  });
});
