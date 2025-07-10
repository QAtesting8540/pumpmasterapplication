# Pump Master Automation Framework

A comprehensive Playwright TypeScript automation framework for the Pump Master
application, implementing Page Object Model (POM) and Behavior-Driven
Development (BDD) principles for web (multi-browser), mobile, and API testing.

## 🚀 Features

- **Multi-Browser Support**: Chrome, Firefox, Safari, Edge
- **Mobile & Tablet Testing**: iOS, Android, iPad testing capabilities
- **API Automation**: Complete REST API testing framework
- **Page Object Model**: Maintainable and scalable test architecture
- **BDD Style**: Behavior-driven test scenarios using Gherkin-style features
- **CI/CD Ready**: Azure DevOps pipeline configuration included
- **Comprehensive Reporting**: HTML, Allure, and JUnit reports
- **Cross-Platform**: Runs on Windows, macOS, and Linux

## 📁 Project Structure

```
pump-master-automation/
├── features/                    # BDD feature files
│   ├── login.feature
│   ├── pump-overview.feature
│   ├── pump-management.feature
│   ├── api-auth.feature
│   └── api-pump-management.feature
├── pages/                       # Page Object Model classes
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── PumpsOverviewPage.ts
│   └── PumpEditModalPage.ts
├── tests/                       # Test files
│   ├── web/                     # Web UI tests
│   │   ├── login.spec.ts
│   │   ├── pump-overview.spec.ts
│   │   └── pump-management.spec.ts
│   └── api/                     # API tests
│       ├── auth.spec.ts
│       └── pump-management.spec.ts
├── utils/                       # Utility classes
│   └── ApiHelper.ts
├── steps/                       # BDD step definitions
│   └── loginSteps.ts
├── playwright.config.ts         # Playwright configuration
├── azure-pipelines.yml         # Azure DevOps pipeline
├── test-template.yml           # Reusable test template
└── package.json               # Dependencies and scripts
```

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pump-master-automation
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Playwright browsers**

   ```bash
   npx playwright install
   npx playwright install-deps
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🏃‍♂️ Running Tests

### Web Tests

```bash
# Run all web tests
npm run test:web

# Run tests on specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run tests in headed mode
npm run test:headed

# Run with UI mode
npm run test:ui
```

### Mobile Tests

```bash
# Run mobile tests
npm run test:mobile
```

### API Tests

```bash
# Run API tests
npm run test:api
```

### All Tests

```bash
# Run all tests
npm test
```

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug
```

## 📊 Test Reporting

### Generate Reports

```bash
# Generate Allure report
npm run allure:generate
npm run allure:open

# View Playwright HTML report
npm run test:report
```

### Available Reports

- **Playwright HTML Report**: Interactive test results with screenshots and
  videos
- **Allure Report**: Detailed test execution reports with trends and analytics
- **JUnit XML**: For CI/CD integration

## 🎯 Test Categories

### Functional Testing

- **Login & Authentication**: Secure tenancy login with various scenarios
- **Pump Overview**: Search, filter, pagination, and data management
- **Pump Management**: CRUD operations for pump entities
- **Responsive Design**: Mobile, tablet, and desktop layouts

### API Testing

- **Authentication**: JWT token management and security
- **CRUD Operations**: Complete pump management via REST API
- **Data Validation**: Input validation and error handling
- **Performance**: Response time and concurrent request testing

### Cross-Browser Testing

- **Desktop Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: Mobile Chrome, Mobile Safari
- **Tablet Support**: iPad, Android tablets

## 🔧 Configuration

### Environment Variables

```bash
# Application URLs
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api

# Test Credentials
TEST_USERNAME=testuser@pumpmaster.com
TEST_PASSWORD=Test@123

# Azure DevOps (for CI/CD)
AZURE_DEVOPS_TOKEN=your_token_here
AZURE_DEVOPS_ORG=your_org
AZURE_DEVOPS_PROJECT=pump-master
```

### Playwright Configuration

The `playwright.config.ts` file contains:

- Browser configurations for different devices
- Test timeouts and retry settings
- Reporter configurations
- Base URL and navigation settings

## 🚀 Azure DevOps CI/CD

### Pipeline Features

- **Multi-stage pipeline**: Build, Test, Report, Deploy
- **Parallel execution**: Tests run across multiple browsers simultaneously
- **Artifact management**: Test results, screenshots, and reports
- **Notifications**: Teams/Slack integration for build results
- **Report deployment**: Automatic deployment of test reports to Azure Storage

### Setting Up Pipeline

1. Import `azure-pipelines.yml` into your Azure DevOps project
2. Create variable group `pump-master-test-variables` with required variables
3. Set up Azure Key Vault for secure credential management
4. Configure service connections for Azure resources

### Required Pipeline Variables

```yaml
# Variable Group: pump-master-test-variables
BASE_URL: 'https://your-app-url.com'
API_BASE_URL: 'https://your-api-url.com/api'
TEST_USERNAME: 'test@example.com'
TEST_PASSWORD: 'SecurePassword123'
AZURE_SUBSCRIPTION: 'your-azure-subscription'
KEY_VAULT_NAME: 'your-key-vault'
STORAGE_ACCOUNT_NAME: 'testreportsstorage'
TEAMS_WEBHOOK_URL: 'https://outlook.office.com/webhook/...'
```

## 📝 BDD Features

### Feature Files

Located in the `features/` directory, written in Gherkin syntax:

```gherkin
Feature: Secure Tenancy Login
  As a pump master user
  I want to securely log into the application
  So that I can access the pump management system

  @web @login
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid username and password
    And I click the login button
    Then I should be redirected to the pumps overview page
```

### Tags for Test Organization

- `@web` - Web UI tests
- `@mobile` - Mobile device tests
- `@tablet` - Tablet device tests
- `@api` - API tests
- `@login` - Login functionality
- `@management` - Pump management features
- `@overview` - Pump overview features
- `@auth` - Authentication tests
- `@crud` - Create, Read, Update, Delete operations

## 🎨 Page Object Model

### Base Page

All page objects extend `BasePage.ts` which provides:

- Common element interactions
- Wait strategies
- Mobile-specific actions
- Responsive design verification
- Screenshot and error handling

### Page Objects

- **LoginPage**: Authentication and login functionality
- **PumpsOverviewPage**: Pump listing, search, and filtering
- **PumpEditModalPage**: Pump creation and editing

### Example Usage

```typescript
const loginPage = new LoginPage(page);
await loginPage.navigateToLogin();
await loginPage.login(username, password);
await loginPage.verifyLoginSuccess();
```

## 🔍 API Testing

### API Helper Class

The `ApiHelper.ts` provides:

- Authentication management
- CRUD operations for pumps
- Request/response validation
- Error handling
- Test data factories

### Example API Test

```typescript
const apiHelper = new ApiHelper(request);
await apiHelper.login(credentials);
const pump = await apiHelper.createPump(pumpData);
await apiHelper.assertPumpExists(pump.id);
```

## 📱 Mobile & Responsive Testing

### Device Support

- **Mobile**: iPhone, Android phones, various screen sizes
- **Tablet**: iPad, Android tablets
- **Desktop**: Multiple resolutions and browsers

### Responsive Verification

- Layout adaptation to screen sizes
- Touch interactions
- Mobile navigation patterns
- Performance on different devices

## 🐛 Debugging

### Debug Options

```bash
# Run specific test in debug mode
npx playwright test login.spec.ts --debug

# Run with headed browser
npx playwright test --headed

# Generate trace files
npx playwright test --trace on
```

### Screenshots and Videos

- Automatic screenshots on test failure
- Video recording for failed tests
- Full page screenshots for mobile tests

## 🧪 Test Data Management

### Test Data Factories

```typescript
// Create test pump data
const pumpData = apiHelper.createTestPumpData({
  name: 'Custom Test Pump',
  type: 'Centrifugal',
  status: 'Active'
});
```

### Environment-Specific Data

- Different test data for staging/production
- Mock data for isolated testing
- Database seeding for API tests

## 📚 Best Practices

### Test Organization

- Group related tests in describe blocks
- Use meaningful test names
- Implement proper cleanup
- Use tags for test categorization

### Page Objects

- Keep page objects focused on single responsibility
- Use meaningful method names
- Implement proper wait strategies
- Handle different device types

### API Testing

- Test positive and negative scenarios
- Validate response schemas
- Test error conditions
- Implement proper authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests following the established patterns
4. Ensure all tests pass
5. Submit a pull request

### Code Quality

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive test documentation
- Implement proper error handling

## 📞 Support

For questions or issues:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Contact the QA team for urgent matters

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for
details.

---

**Happy Testing! 🎉**
