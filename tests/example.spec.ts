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
  
});