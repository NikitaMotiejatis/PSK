import { test, expect, Page } from '@playwright/test';
import { count } from 'node:console';


test.describe('Exercise 1.2', () => {
  test('Lab1-01EX - shopping workflow', async ({ page }) => {
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
    await page.locator('a[href="/computers"]').first().click();
    await page.locator('a[href="/desktops"]').first().click();

    //14-16 First Expensive Item
    await addItemBiggerThan(page, 900, usedProducts);
    
    //17 Second Expensive item
    await page.locator('a[href="/computers"]').first().click();
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

    // 21. Verification 2 - arithmetic 
    // unitPrice * qty == line subtotal
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

    await page.locator('#billing-buttons-container input.button-1').click();

    // 27. Confirm Shipping Address
    await page.locator('#shipping-buttons-container input.button-1').waitFor({ state: 'visible' });
    await page.locator('#shipping-buttons-container input.button-1').click();

    // 28. Shipping method
    await page.locator('#shipping-method-buttons-container input.button-1').waitFor({ state: 'visible' });
    await page.locator('#shipping-method-buttons-container input.button-1').click();

    // 29. Payment method (Cash On Delivery)
    await page.locator('#paymentmethod_0').waitFor({ state: 'visible' });
    await page.locator('#paymentmethod_0').check();
    await page.locator('#payment-method-buttons-container input.button-1').click();

    // 30. Payment information
    await page.locator('#payment-info-buttons-container input.button-1').waitFor({ state: 'visible' });
    await page.locator('#payment-info-buttons-container input.button-1').click();
    
    // 31. Verification #4 – items visible on confirmation page
    const confirmButton = page.locator('#confirm-order-buttons-container .button-1.confirm-order-next-step-button');
    await confirmButton.waitFor({ state: 'visible' });

    // 32. Confirm order
    await confirmButton.click();

    // 33. Verification #5 – success message
    await expect(
      page.getByText('Your order has been successfully processed!')
    ).toBeVisible();

    // 34. My account → Orders
    await page.goto('https://demowebshop.tricentis.com/customer/orders', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/customer\/orders/);
    await expect(page.locator('.order-list')).toBeVisible();
        
    // 35. Open most recent order
    const firstOrderDetailsButton = page.locator('.order-list .order-item .order-details-button').first();
    await firstOrderDetailsButton.waitFor({ state: 'visible' });
    await firstOrderDetailsButton.click();
    await expect(page).toHaveURL(/\/orderdetails\//);
    
    // 36. Log out
    await page.getByRole('link', { name: 'Log out' }).click();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();

  });
 
});


export async function logoutIfLoggedIn(page: Page) {

  const logoutLink = page.locator('a[href="/logout"]');

  if (await logoutLink.count() > 0 && await logoutLink.first().isVisible()) {
    await logoutLink.first().click();
  }
}


async function addItemBiggerThan(page: Page, value: number, usedProducts: Set<string>) {

  const products = page.locator('.product-item');

  const beforeText =
    await page.locator('#topcartlink .cart-qty').innerText();

  const before = Number(beforeText.replace(/[^\d]/g, ''));

  const count = await products.count();

  let added = false;

  for (let i = 0; i < count; i++) {

    const product = products.nth(i);

    const title = (await product
      .locator('.product-title a')
      .innerText()).trim();

    const priceText =
      await product.locator('.prices').innerText();

    const price = Number(
      priceText.replace(/[^0-9.]/g, '')
    );

    // Excluded because requre to select options before adding to cart
    const excluded =
      title.toLowerCase().includes('simple computer') ||
      usedProducts.has(title);

    // Step 14 + decision
    if (price > value && !excluded) {

      // Step 15
      await product.locator('.product-title a').click();

      if (title.toLowerCase().includes('build your own')) {
        await page.getByRole('radio', { name: '320 GB' }).check();
      }

      // Step 16
      await page.locator('input[id^="add-to-cart-button-"]').click();

      const bar = page.locator('.bar-notification.success');
      await expect(bar).toBeVisible();

      const afterText =
        await page.locator('#topcartlink .cart-qty').innerText();

      const after = Number(afterText.replace(/[^\d]/g, ''));

      expect(after).toBe(before + 1);

      usedProducts.add(title); // Add selected item to exclusion

      added = true;      
      break;
    }
  }

  expect(added).toBeTruthy();
}
