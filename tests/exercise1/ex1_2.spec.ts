import { test, expect } from '@playwright/test';

test('Exercise 1.2 - open Demo Web Shop home page', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/');

  // Basic verification that home page loaded
  await expect(page).toHaveTitle(/Demo Web Shop/i);
  await expect(page.getByRole('link', { name: /Register/i })).toBeVisible();



});
