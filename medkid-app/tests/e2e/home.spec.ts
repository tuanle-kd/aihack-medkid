import { expect, test } from '@playwright/test';

test('home page renders the parent and doctor workspaces', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('header').getByText('MediKid-AI')).toBeVisible();
  await expect(page.getByText('Phụ huynh (Mobile View)')).toBeVisible();
  await expect(page.getByText('Bác sĩ (Desktop View)')).toBeVisible();
});
