import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('should display blog posts page', async ({ page }) => {
    await page.goto('/posts/');

    // Check that the page loaded
    await expect(page).toHaveTitle(/posts/i);

    // Check for blog posts heading
    await expect(page.locator('h1')).toContainText(/posts/i);
  });

  test('should display individual blog post', async ({ page }) => {
    await page.goto('/posts/hello-world/');

    // Check that the post loaded
    await expect(page.locator('h1')).toBeVisible();

    // Check for post content
    await expect(page.locator('article')).toBeVisible();
  });

  test('should navigate from posts page to individual post', async ({ page }) => {
    await page.goto('/posts/');

    // Find and click on a post link (posts are in li > a structure)
    const postLink = page.locator('main ul li a').first();
    await expect(postLink).toBeVisible();

    await postLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Check that we're on a post page
    await expect(page.locator('article')).toBeVisible();
  });

  test('should display tags page', async ({ page }) => {
    await page.goto('/tags/');

    // Check that the page loaded
    await expect(page).toHaveTitle(/tags/i);

    // Check for tags heading
    await expect(page.locator('h1')).toContainText(/tags/i);
  });
});
