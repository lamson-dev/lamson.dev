import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to search page', async ({ page }) => {
    await page.goto('/');

    // Click on search link
    await page.click('a[href="/search/"]');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Check that we're on the search page
    await expect(page).toHaveURL(/\/search/);
    await expect(page.locator('h1')).toContainText(/search/i);

    // Check for search input
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('should navigate to whoami page', async ({ page }) => {
    await page.goto('/');

    // Click on whoami link
    await page.click('a[href="/whoami/"]');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Check that we're on the whoami page
    await expect(page).toHaveURL(/\/whoami/);
  });

  test('should navigate to posts page', async ({ page }) => {
    await page.goto('/');

    // Click on posts link
    await page.click('a[href="/posts/"]');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Check that we're on the posts page
    await expect(page).toHaveURL(/\/posts/);
  });

  test('should navigate to tags page', async ({ page }) => {
    await page.goto('/');

    // Click on tags link
    await page.click('a[href="/tags/"]');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Check that we're on the tags page
    await expect(page).toHaveURL(/\/tags/);
  });

  test('should navigate back to homepage from logo', async ({ page }) => {
    await page.goto('/posts/');

    // Click on logo or site title
    const homeLink = page.locator('header a[href="/"]').first();
    await homeLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Check that we're back on the homepage
    await expect(page).toHaveURL('/');
  });
});
