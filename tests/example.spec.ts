import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.amazon.com/');
  // Click different Image button to skip the "robot check" (sometimes it shows and sometimes it doesnt)
  const skip = await page.locator('//a[text()="Try different image"]')
  if (await skip.isVisible()) {
    await page.locator('//a[text()="Try different image"]').click();
  }
  
  // Select the option for the webSite to be in English (sometimes it automatically translates to spanish)
  await page.locator('//div[@id="icp-nav-flyout"]/button').click();
  await page.locator('//div[@id="nav-flyout-icp"]//a[@lang="en-US"]').click();
});

test('stock_validation', async ({ page }) => {
  await page.locator('input[id="twotabsearchtextbox"]').fill('wireless headphones');
  await page.keyboard.press('Enter');
  
  await expect(page.locator('//h2[text()="Results"]')).toBeVisible();

  await page.getByLabel('Sort by:').selectOption('price-asc-rank');

  await page.locator('//div[@role="listitem"][4]//h2').dblclick();
  
  await expect(page.locator('//div[@id="availability"]')).toContainText('In Stock');	
});

test('cart_validation', async ({ page }) => {
  await page.locator('input[id="twotabsearchtextbox"]').fill('mirror');
  await page.keyboard.press('Enter');

  await page.locator('//div[@role="listitem"][1]//h2').dblclick();

  await page.getByLabel('Quantity:').selectOption('1');

  const expectedName = await page.locator('//h1[@id="title"]').innerText();
  const expectedQuantity = 1;
  const price = await page.locator('//div[@id="corePrice_feature_div"]//span[@class="a-offscreen"]').innerText();
  const expectedPrice = parseFloat(price.replace('$', '')) * expectedQuantity

  const navigationPromise = page.waitForNavigation();
  await page.locator('//input[@id="add-to-cart-button"]').click();  
  await navigationPromise;

  await expect(page.locator('//h1[contains(text(), "Added to cart")]')).toBeVisible();
  const navigationPromise2 = page.waitForNavigation();
  await page.locator('//div[@id="sw-atc-buy-box"]//a[contains(text(), "Go to Cart")]').click();
  await navigationPromise2;
  
  const actualName = await page.locator('//span[@class="a-size-base-plus a-color-base sc-product-title sc-grid-item-product-title"]//span[@class="a-truncate-full a-offscreen"]').innerText();
  const actualPrice = parseFloat(
    (await page.locator
      ('//div[@class="a-row a-spacing-mini sc-subtotal sc-subtotal-activecart sc-java-remote-feature"]//span[@class="a-size-medium a-color-base sc-price sc-white-space-nowrap"]')
      .innerText())
      .replace('$', ''));
  const actualQuantity = await page.locator('//div[@class="a-declarative"]//div[@class="a-declarative"]').innerText();

  expect(actualName).toEqual(expectedName)
  expect(parseInt(actualQuantity)).toEqual(expectedQuantity)
  expect(actualPrice).toEqual(expectedPrice)  

});