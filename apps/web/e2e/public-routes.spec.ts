import { test, expect } from '@playwright/test';

test.describe('Public Marketing Pages', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    // Check for a generic element that should be on the home page, like the main header
    await expect(page).toHaveTitle(/HoopMaster/i);
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    const loginButton = page.getByRole('button', { name: /Sign In|Log In/i });
    await expect(loginButton).toBeVisible();
  });
  
  test('services page loads', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
