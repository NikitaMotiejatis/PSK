import { Page, expect } from '@playwright/test';


export async function logoutIfLoggedIn(page: Page) {

  const logoutLink = page.locator('a[href="/logout"]');

  if (await logoutLink.count() > 0 && await logoutLink.first().isVisible()) {
    await logoutLink.first().click();
  }
  
}


export async function addItemBiggerThan(page: Page, value: number, usedProducts: Set<string>) {

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

    const priceText = await product.locator('.prices').innerText();

    const price = Number(priceText.replace(/[^0-9.]/g, ''));

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