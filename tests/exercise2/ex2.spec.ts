import { test, expect, Page } from '@playwright/test';
import { logoutIfLoggedIn, addItemBiggerThan } from '../utils/shopHelpers.ts';


test.describe('Exercise 2', () => {

  test('Lab1-EX2-1 - shopping workflow', async ({ page }) => {

    const email = `LAB1_auto+${Date.now()}@mail.com`;
    const password = 'Test123';
    const country = 'Lithuania';
    const city = 'Vilnius';
    const address = 'Jono g. 7';
    const zipCode = 'LT10322';
    const phoneNumber = '+37060350030';
    const usedProducts = new Set<string>();

    // 1-3 Open site 
    await page.goto('https://demowebshop.tricentis.com/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('button', { name: 'Register' }).click();
    await logoutIfLoggedIn(page);

    // 4-9 Registration
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('textbox', { name: 'First name:' }).fill('Smart');
    await page.getByRole('textbox', { name: 'Last name:' }).fill('Bot');
    
    await page.getByRole('textbox', { name: 'Email:' }).fill(email);
    await page.locator('input[name="Password"]').fill(password);
    await page.locator('input[name="ConfirmPassword"]').fill(password);
    await page.getByRole('button', { name:'Register' }).click();

    await expect(page.getByText('Your registration completed')).toBeVisible();


    // 10-12 Login
    await page.getByRole('link', { name: 'Log out' }).click();

    await page.getByRole('link', { name: 'Log in' }).click();

    await page.getByRole('textbox', { name: 'Email:' }).fill(email);
    await page.getByRole('textbox', { name: 'Password:' }).fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.locator('a[href="/logout"]')).toBeVisible();

    // 13 Navigate to category
    await page.locator('a[href="/computers"]').first().hover();
    await page.locator('a[href="/desktops"]').first().click();

    //14-16 First Expensive Item
    await addItemBiggerThan(page, 900, usedProducts);
    
    // 17 Second Expensive item
    await page.locator('a[href="/computers"]').first().hover();
    await page.locator('a[href="/desktops"]').first().click();

    await addItemBiggerThan(page, 900, usedProducts);

    // 18 Open Cart
    await page.locator('a[href="/cart"]').first().click();

    // 19 Verification 1 two items
    const cartRows = page.locator('.cart-item-row');
    await expect(cartRows).toHaveCount(2);

    // 20 CRUD (update) - set qty = 2 for first item
    const firstQtyInput = cartRows
      .first()
      .locator('input.qty-input');
    await firstQtyInput.fill('2');

    await page.getByRole('button', { name: 'Update Shopping cart' }).click();
    await page.waitForLoadState('load');

    // 21. Verification 2 - arithmetic sum 
    // Total sum = unitPrice * qty
    const firstRow = cartRows.first();

    const unitPriceText =
      await firstRow.locator('.product-unit-price').innerText();

    const subtotalText =
      await firstRow.locator('.product-subtotal').innerText();

    const unitPrice = Number(unitPriceText.replace(/[^0-9.]/g, ''));
    const subtotal = Number(subtotalText.replace(/[^0-9.]/g, ''));

    expect(subtotal).toBeCloseTo(unitPrice * 2, 2);

    // 22. CRUD (detele) - remove one item
    await firstRow.locator('input[type="checkbox"][name^="removefromcart"]').check();
    await page.getByRole('button', { name: 'Update shopping cart' }).click();

    // 23. 21. Verification 3 - item removed
    await expect(cartRows).toHaveCount(1);

    // 24. Accept terms of service
    await page.locator('#termsofservice').check();

    // 25. Checkout 
    await page.getByRole('button', { name: 'Checkout' }).click();
    
    // 26. Billing address
    await page.getByRole('combobox', { name: 'Country:' }).selectOption(country);
    await page.getByRole('textbox', { name: 'City:' }).fill(city);
    await page.getByRole('textbox', { name: 'Address 1:' }).fill(address);
    await page.getByRole('textbox', { name: 'Zip / postal code:' }).fill(zipCode);
    await page.getByRole('textbox', { name: 'Phone number:' }).fill(phoneNumber);

    await page.locator('#billing-buttons-container input.button-1').click({ force: true });

    // 27. Confirm Shipping Address
    await page.locator('#shipping-buttons-container input.button-1').waitFor({ state: 'visible' });
    await page.locator('#shipping-buttons-container input.button-1').click({ force: true });

    // 28. Shipping method
    await page.locator('#shipping-method-buttons-container input.button-1').waitFor({ state: 'visible' });
    await page.locator('#shipping-method-buttons-container input.button-1').click({ force: true });

    // 29. Payment method (Cash On Delivery)
    await page.locator('#paymentmethod_0').waitFor({ state: 'visible' });
    await page.locator('#paymentmethod_0').check();
    await page.locator('#payment-method-buttons-container input.button-1').click({ force: true });

    // 30. Payment information
    await page.locator('#payment-info-buttons-container input.button-1').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('#payment-info-buttons-container input.button-1').click({ force: true });

    // 31. Verification #4 – items visible on confirmation page
    const confirmButton = page.locator('#confirm-order-buttons-container .button-1.confirm-order-next-step-button');
    await confirmButton.waitFor({ state: 'visible' });

    // 32. Confirm order
    await confirmButton.click({ force: true });

    // 33. Verification #5 – success message
    await expect(
      page.getByText('Your order has been successfully processed!')
    ).toBeVisible();

    // 34. My account → Orders
    await page.goto('https://demowebshop.tricentis.com/customer/orders', { waitUntil: 'commit' });
    await expect(page.locator('.order-list')).toBeVisible();
        
    // 35. Open most recent order
    const firstOrderDetailsButton = page.locator('.order-list .order-item .order-details-button').first();
    await firstOrderDetailsButton.waitFor({ state: 'visible' });
    await firstOrderDetailsButton.click();
    
    // 36. Log out
    await page.getByRole('link', { name: 'Log out' }).click();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();

  });


  test('Lab1-EX2-2 - pagination', async ({ page }) => {   

  await page.goto('https://demoqa.com/');
  await page.getByRole('link', { name: 'Elements' }).click();
  await page.getByRole('link', { name: 'Web Tables' }).click();

  const deleteButtons = page.locator('[title="Delete"]');
  let currentRecords = await deleteButtons.count();
  const targetRecords = 11;

  
  while (currentRecords > targetRecords) {
    await deleteButtons.first().click();
    currentRecords = await deleteButtons.count();
  }

  const recordsToAdd = Math.max(0, targetRecords - currentRecords);

  for (let i = 0; i < recordsToAdd; i++) {
    await page.getByRole('button', { name: 'Add' }).click();

    const firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    await firstNameInput.waitFor({ state: 'visible' });
    await firstNameInput.fill(`John${i}`);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(`Doe${i}`);
    await page.getByRole('textbox', { name: 'name@example.com' }).fill(`john${i}@mail.com`);
    await page.getByRole('textbox', { name: 'Age' }).fill('42');
    await page.getByRole('textbox', { name: 'Salary' }).fill('0');
    await page.getByRole('textbox', { name: 'Department' }).fill('Testing');

    await page.getByRole('button', { name: 'Submit' }).click({ force: true });
  }

  const nextButton = page.getByRole('button', { name: 'Next' });
  const pageInfo = page.getByText(/Page\s*\d+\s*of\s*\d+/).first();

  await expect(nextButton).toBeEnabled();
  await nextButton.scrollIntoViewIfNeeded();
  await nextButton.click();

  await expect(pageInfo).toContainText('2 of 2');

  await deleteButtons.first().click();

  await expect(pageInfo).toContainText('1 of 1');
  await expect(nextButton).toBeDisabled();

  });
 
});



