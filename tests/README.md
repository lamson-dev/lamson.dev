# Playwright Tests

This directory contains end-to-end tests for lamson.dev using Playwright.

## Setup

First, install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

```bash
# Run all tests in headless mode
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see the browser)
npm run test:headed
```

## Test Structure

- `homepage.spec.ts` - Tests for the homepage and hero section
- `blog.spec.ts` - Tests for blog posts and blog listing pages
- `navigation.spec.ts` - Tests for site navigation and routing

## Configuration

Tests are configured in `playwright.config.ts`. The tests will automatically:

1. Build the site (`npm run build`)
2. Start a preview server (`npm run preview`)
3. Run tests against http://localhost:4321
4. Shut down the server when done

## CI/CD

Tests are configured to run with retries and single worker on CI for stability.
