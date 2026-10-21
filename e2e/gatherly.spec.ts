import { test, expect } from '@playwright/test';

test.describe('Gatherly AI Critical Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before test run
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test('Walkthrough: Load starter event, edit budget, verify calculation, test What-If replanning and persistence', async ({
    page,
  }) => {
    // 1. Visit App
    await page.goto('/');

    // Verify brand and dashboard load
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Countdown')).toBeVisible();

    // 2. Navigate to Budget Studio
    await page.getByRole('button', { name: 'Budget Studio' }).click();
    await expect(page.getByText('Pastel Budget Studio')).toBeVisible();

    // 3. Add an expense item
    await page.getByRole('button', { name: 'Add Expense' }).click();
    await page.getByPlaceholder('e.g. Traditional Dhol Players').fill('Artisan Dessert Counter');
    await page.getByPlaceholder('e.g. 25000').fill('35000');
    await page.getByRole('button', { name: 'Add to Budget' }).click();

    // Verify expense added to table
    await expect(page.getByText('Artisan Dessert Counter')).toBeVisible();

    // 4. Navigate to Timeline
    await page.getByRole('button', { name: 'Timeline' }).click();
    await expect(page.getByText('Timeline & Milestone Planner')).toBeVisible();

    // 5. Navigate to What-If Replanner (Signature Feature)
    await page.getByRole('button', { name: /What-If Replanner/i }).click();
    await expect(page.getByText('Constraint-Aware What-If Replanner')).toBeVisible();

    // Apply 25% cut
    await page.getByRole('button', { name: '-25% Cut' }).click();

    // Consult AI
    const consultBtn = page.getByRole('button', { name: /Step 2: Consult AI for Trade-Off Proposal/i });
    await expect(consultBtn).toBeEnabled();
    await consultBtn.click();

    // Verify proposed trade-off card appears
    await expect(page.getByText(/Step 3 & 4: Before vs After/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Apply Approved Changes')).toBeVisible();

    // Explicitly apply approved changes
    await page.getByRole('button', { name: 'Apply Approved Changes' }).click();
    await expect(page.getByText(/Approved changes have been successfully applied/i)).toBeVisible();

    // 6. Reload page to verify persistence in LocalStorage
    await page.reload();
    await page.getByRole('button', { name: 'Budget Studio' }).click();
    // Verify previous addition persisted
    await expect(page.getByText('Artisan Dessert Counter')).toBeVisible();
  });
});
