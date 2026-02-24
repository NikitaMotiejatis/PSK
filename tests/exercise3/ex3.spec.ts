import { test, expect, Page } from '@playwright/test';

test.describe('Excercise 3', () => {

    test('LAB-EX3-1 - Progress Bar', async ({ page }) => {

    await page.goto('https://demoqa.com/');
    await page.getByText('Widgets').click();
    const progressBarLink = page.locator('.left-pannel').getByText('Progress Bar');
    await progressBarLink.waitFor({ state: 'visible' });
    await progressBarLink.scrollIntoViewIfNeeded();
    await progressBarLink.click({ force: true });

    const progressBar = page.locator('#progressBar');
    const startButton = page.getByRole('button', { name: 'Start' });

    // Verification 1: Initial value is 0%
    await expect(progressBar).toHaveText('0%');

    await startButton.click();

    // Verification 2: Progress increases above 0%
    await expect.poll(async () => {
      const text = await progressBar.textContent();
      return Number(text?.replace('%', '') || 0);
    }).toBeGreaterThan(0);

    // Verification 3: Wait until progress reaches 100%
    await expect(progressBar).toHaveText('100%', { timeout: 15000 });

    // Verification 4: Reset button appears
    const resetButton = page.getByRole('button', { name: 'Reset' });
    await expect(resetButton).toBeVisible();

    await resetButton.click();

    // Verification 5: Progress resets to 0%
    await expect(progressBar).toHaveText('0%');

    });


    test('LAB1-EX3-2 - Dynamic Properties', async ({ page }) => {

    await page.goto('https://demoqa.com/dynamic-properties');

    const enableAfterBtn = page.locator('#enableAfter');
    const colorChangeBtn = page.locator('#colorChange');
    const visibleAfterBtn = page.locator('#visibleAfter');

    // Verification 1: Enable After button is initially disabled
    await expect(enableAfterBtn).toBeDisabled();

    // Verification 2: Wait until it becomes enabled
    await expect(enableAfterBtn).toBeEnabled({ timeout: 10000 });

    // Verification 3: Color Change button changes CSS class
    await expect.poll(async () => {
      return await colorChangeBtn.getAttribute('class');
    }).toContain('text-danger');

    // Verification 4: Visible After button becomes visible
    await expect(visibleAfterBtn).toBeVisible({ timeout: 10000 });

  });

});