import { test, expect } from '@playwright/test';

test.describe('Dashboard Authentication Guards', () => {
  test('unauthenticated users are redirected to login when accessing /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // The ProtectedRoute component should redirect to /login
    await page.waitForURL('**/login*');
    
    // Verify we are on the login page by checking for the sign in button
    const loginButton = page.getByRole('button', { name: /Sign In|Log In/i });
    await expect(loginButton).toBeVisible();
  });

  test('unauthenticated users are redirected to login when accessing /coach', async ({ page }) => {
    await page.goto('/coach');
    
    // The ProtectedRoute component should redirect to /login
    await page.waitForURL('**/login*');
  });

  test('unauthenticated users are redirected to login when accessing /admin', async ({ page }) => {
    await page.goto('/admin');
    
    // The ProtectedRoute component should redirect to /login
    await page.waitForURL('**/login*');
  });
  
  test('unauthenticated users are redirected when accessing deep dashboard links', async ({ page }) => {
    await page.goto('/dashboard/profile/optimizer');
    await page.waitForURL('**/login*');
  });
});
