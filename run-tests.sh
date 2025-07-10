#!/bin/bash

# Pump Master Automation Test Suite
# This script demonstrates how to run the test suite

echo "🚀 Pump Master Automation Test Suite"
echo "====================================="

echo ""
echo "📋 Available Test Commands:"
echo ""
echo "Web Tests (Multi-browser):"
echo "  npm run test:web          # Run all web tests"
echo "  npm run test:chrome       # Chrome only"
echo "  npm run test:firefox      # Firefox only"
echo "  npm run test:webkit       # Safari/WebKit only"
echo ""
echo "Mobile/Tablet Tests:"
echo "  npm run test:mobile       # Mobile tests"
echo "  npm test -- --project=tablet  # Tablet tests"
echo ""
echo "API Tests:"
echo "  npm run test:api          # All API tests"
echo ""
echo "Specific Test Examples:"
echo "  npm test -- tests/web/login.spec.ts"
echo "  npm test -- tests/api/auth.spec.ts"
echo "  npm test -- --grep '@smoke'"
echo ""
echo "Test Execution Options:"
echo "  npm run test:headed       # Run with browser UI visible"
echo "  npm run test:debug        # Run in debug mode"
echo "  npm run test:ui           # Run with Playwright UI mode"
echo ""
echo "Reports:"
echo "  npm run test:report       # Open HTML test report"
echo "  npm run allure:generate   # Generate Allure report"
echo "  npm run allure:open       # Open Allure report"
echo ""
echo "🔧 Setup Commands:"
echo "  npm run install:browsers  # Install Playwright browsers"
echo "  npm run install:deps      # Install browser dependencies"
echo ""

# Example: Run a quick smoke test
echo "🔥 Running a quick smoke test example..."
echo ""

# Check if browsers are installed
if [ ! -d "node_modules/@playwright/test" ]; then
    echo "❌ Playwright not installed. Run: npm install"
    exit 1
fi

# Run TypeScript check
echo "🔍 Checking TypeScript compilation..."
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

echo ""
echo "🎯 To run tests, use any of the commands listed above."
echo "📚 Check README.md for detailed documentation."
echo ""
echo "Example to get started:"
echo "  npm test -- --grep '@smoke' --headed"
echo ""
