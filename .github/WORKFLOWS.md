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
   - Installs Playwright browsers (Chromium only for speed)
   - Runs the full Playwright test suite
   - Uploads test reports (available for 7 days)

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

## Troubleshooting

### Playwright Tests Failing

If Playwright tests fail in CI:

1. Check the test report artifact uploaded to the workflow run
2. Run tests locally with `npm run test:ui` to debug interactively
3. Ensure the preview server is running correctly

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
