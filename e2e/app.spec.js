const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
    console.log('Navigating to the page...');

  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/React Demo App/);
});

test('has React Demo App in the body', async ({ page }) => {
  await page.goto('/');

  const isVisible = await page.locator('a:has-text("React Demo App")').isVisible();
  expect(isVisible).toBeTruthy();
});

// test('has expected app version', async ({ page }) => {
//   await page.goto('/');

//   const expectedAppVersion = process.env.REACT_APP_VERSION ? process.env.REACT_APP_VERSION : '1';

//   console.log(expectedAppVersion);

//   const isVisible = await page.locator(`p:has-text("Application version: ${expectedAppVersion}")`).isVisible();
//   expect(isVisible).toBeTruthy();
// });