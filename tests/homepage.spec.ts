import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loaded
    await expect(page).toHaveTitle(/lamSơn.*DEV/i);

    // Check for the hero section with typewriter effect
    await expect(page.locator('#typewriter-dev-D')).toBeVisible();
    await expect(page.locator('#typewriter-dev-E')).toBeVisible();
    await expect(page.locator('#typewriter-dev-V')).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for navigation elements
    await expect(page.locator('a[href="/posts/"]')).toBeVisible();
    await expect(page.locator('a[href="/tags/"]')).toBeVisible();
    await expect(page.locator('a[href="/whoami/"]')).toBeVisible();
    await expect(page.locator('a[href="/search/"]')).toBeVisible();
  });

  test('should display the profile image', async ({ page }) => {
    await page.goto('/');

    // Check for profile image
    const profileImage = page.locator('img[alt*="Son"]');
    await expect(profileImage).toBeVisible();
  });

  test('should have a footer with social links', async ({ page }) => {
    await page.goto('/');

    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
