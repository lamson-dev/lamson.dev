# GitHub Actions Workflows

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows

### PR Checks (`pr-checks.yml`)

Runs on every pull request and push to any branch. This workflow ensures code quality and functionality before merging.

**Jobs:**

1. **Lint and Type Check**
   - Runs ESLint to check code style and quality
   - Runs Astro type checking to catch TypeScript errors
   - Fails fast if there are linting or type errors

2. **Build**
   - Builds the Astro site with Jampack optimization
   - Ensures the site can be built successfully
   - Uploads build artifacts for the test job

3. **E2E Tests**
   - Downloads the built site from the build job
   - Uses browser caching to speed up Playwright installation
   - Installs Playwright Chromium browser (cached between runs)
   - Runs the full Playwright test suite against the preview server
   - Uploads test reports (available for 7 days)
   - **Performance**: Browsers are cached to avoid repeated downloads

**Requirements for merging:**

- All three jobs must pass
- ESLint must report no errors
- TypeScript checks must pass
- Build must complete successfully
- All Playwright tests must pass

### Deploy (`deploy.yml`)

Runs on pushes to the `master` branch. Automatically deploys the site to GitHub Pages.

**Jobs:**

1. **Build**
   - Uses the official Astro GitHub Action
   - Builds and optimizes the site
   - Uploads artifacts for deployment

2. **Deploy**
   - Deploys the built site to GitHub Pages
   - Only runs after a successful build

## Local Testing

Before pushing, you can run the same checks locally:

```bash
# Linting
npm run lint

# Type checking
npm run sync && npx astro check

# Build
npm run build

# E2E tests (requires Playwright browsers)
npx playwright install chromium
npm test
```

## Performance Optimizations

### Browser Caching

The workflow uses GitHub Actions cache to store Playwright browsers between runs:

- **First run**: Downloads and caches Chromium browser (~200MB, ~2-3 minutes)
- **Subsequent runs**: Restores browser from cache (~10-20 seconds)
- **Cache key**: Based on Playwright version and OS (`playwright-Linux-1.57.0`)
- **Cache invalidation**: Automatic when Playwright version changes in package.json

**How it works**:

1. Workflow checks if cached browser exists for current Playwright version
2. If cache hit: Restores browser and only installs system dependencies
3. If cache miss: Downloads browser, installs deps, and caches for next time

This significantly speeds up test execution and reduces network usage.

## Troubleshooting

### Playwright Tests Failing

If Playwright tests fail in CI:

1. **Check test failures in the HTML report**:
   - Download the `playwright-report` artifact from the workflow run
   - Open `index.html` in a browser to see detailed test results

2. **Run tests locally for debugging**:

   ```bash
   npm run build
   npm run test:ui  # Interactive UI mode
   ```

3. **Common issues**:
   - Preview server not starting: Check if dist folder exists
   - Tests timing out: May need to increase timeout in playwright.config.ts
   - Browser crashes: Check system resources in CI logs

### Build Failures

If the build fails:

1. Check for TypeScript errors with `npm run sync && npx astro check`
2. Verify all dependencies are installed correctly
3. Check the build logs for specific error messages

### Lint Failures

If ESLint fails:

1. Run `npm run lint` locally to see errors
2. Many issues can be auto-fixed with `npm run format`
3. Check `eslint.config.mjs` for rule configurations

## Node.js Version

All workflows use **Node.js 20**. Ensure your local environment matches this version for consistent behavior.
