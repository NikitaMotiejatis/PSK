import { test, expect } from '@playwright/test';
import userData from './test-data/userData.json';
import { logoutIfLoggedIn, addItemBiggerThan } from '../utils/shopHelpers.ts';


test.describe('Exercise 4.1', () => {

  test('LAB1-EX4 - Data-Driven Testing & Test Orchestration', async ({ page }) => {

    const email = `LAB1_auto+${Date.now()}@mail.com`;
    const { user, address, priceThreshold } = userData;
    const genderValue = user.gender.toLowerCase();
    

    // =========================
    // PRECONDITIONS
    // =========================
    await page.goto('https://demowebshop.tricentis.com/');
    await logoutIfLoggedIn(page);

    // =========================
    // REGISTRATION
    // =========================
    await page.getByRole('link', { name: 'Register' }).click();

    // Gender selection based on test data
    if (genderValue === 'male') {
      await page.locator('#gender-male').check();
    } else if (genderValue === 'female') {
      await page.locator('#gender-female').check();
    } else {
      throw new Error(`Unsupported gender value: ${user.gender}`);
    }

    await page.getByRole('textbox', { name: 'First name:' }).fill(user.firstName);
    await page.getByRole('textbox', { name: 'Last name:' }).fill(user.lastName);
    await page.getByRole('textbox', { name: 'Email:' }).fill(email);
    await page.locator('input[name="Password"]').fill(user.password);
    await page.locator('input[name="ConfirmPassword"]').fill(user.password);
    await page.getByRole('button', { name:'Register' }).click();

    await expect(page.getByText('Your registration completed')).toBeVisible();

    // =========================
    // LOGIN
    // =========================
    await page.getByRole('link', { name: 'Log out' }).click();
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.getByRole('textbox', { name: 'Email:' }).fill(email);
    await page.getByRole('textbox', { name: 'Password:' }).fill(user.password);
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.locator('a[href="/logout"]')).toBeVisible();

    // =========================
    // ADD ITEMS > priceThreshold
    // =========================
    await page.locator('a[href="/computers"]').first().hover();
    await page.locator('a[href="/desktops"]').first().click();

    const usedProducts = new Set<string>();
    await addItemBiggerThan(page, priceThreshold, usedProducts);
    await page.goBack();
    await page.waitForLoadState('networkidle');
    await addItemBiggerThan(page, priceThreshold, usedProducts);

    // =========================
    // CHECKOUT
    // =========================
    await page.locator('a[href="/cart"]').first().click();
    await expect(page.locator('.cart-item-row')).toHaveCount(2);

    await page.locator('#termsofservice').check();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('combobox', { name: 'Country:' }).selectOption(address.country);
    await page.getByRole('textbox', { name: 'City:' }).fill(address.city);
    await page.getByRole('textbox', { name: 'Address 1:' }).fill(address.street);
    await page.getByRole('textbox', { name: 'Zip / postal code:' }).fill(address.zip);
    await page.getByRole('textbox', { name: 'Phone number:' }).fill(address.phone);

    await page.locator('#billing-buttons-container input.button-1').waitFor({ state: 'visible' });
    await page.locator('#billing-buttons-container input.button-1').click({ force: true });
    await page.waitForLoadState('networkidle');
    await page.locator('#shipping-buttons-container input.button-1').waitFor({ state: 'visible' });
    await page.locator('#shipping-buttons-container input.button-1').click({ force: true });
    await page.waitForLoadState('networkidle');
    await page.locator('#shipping-method-buttons-container input.button-1').waitFor({ state: 'visible' });
    await page.locator('#shipping-method-buttons-container input.button-1').click({ force: true });
    await page.waitForLoadState('networkidle');
    await page.locator('#paymentmethod_0').waitFor({ state: 'visible' });
    await page.locator('#paymentmethod_0').check();
    await page.locator('#payment-method-buttons-container input.button-1').click({ force: true });
    await page.waitForLoadState('networkidle');
    await page.locator('#payment-info-buttons-container input.button-1').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('#payment-info-buttons-container input.button-1').click({ force: true });
    await page.waitForLoadState('networkidle');
    await page.locator('.confirm-order-next-step-button').waitFor({ state: 'visible' });
    await page.locator('.confirm-order-next-step-button').click({ force: true });

    await expect(
      page.getByText('Your order has been successfully processed!')
    ).toBeVisible();

    // =========================
    // POSTCONDITIONS
    // =========================
    await page.goto('https://demowebshop.tricentis.com/cart');
    const rows = page.locator('.cart-item-row');
    if (await rows.count() > 0) {
      await page.locator('input[name^="removefromcart"]').check();
      await page.getByRole('button', { name: 'Update shopping cart' }).click();
    }

    await page.getByRole('link', { name: 'Log out' }).click();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();

  });

});