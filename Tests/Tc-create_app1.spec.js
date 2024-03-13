import { test, expect } from('@playwright/test');

test('Verify app loading', async ({ page }) => {
    await page.goto('/home/jesni/Git/tc-create-offline-poc/index.html');
   // await page.waitForSelector('#app-loaded'); // Wait for some indicator that your app has loaded
    const title = await page.title();
    expect(title).toBe('Tc Create Offline Poc');
});
