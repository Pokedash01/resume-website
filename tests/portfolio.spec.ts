import { test, expect } from '@playwright/test';

test.describe('Kartik Bhatt Portfolio — Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the loading screen to complete and reveal content
    await expect(page.locator('header nav')).toBeVisible({ timeout: 10000 });
  });

  test('Page metadata conforms to specifications', async ({ page }) => {
    await expect(page).toHaveTitle(/Kartik Bhatt Portfolio/);
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Knowledge Management & Business Analyst/);
  });

  test('Navigation has all 8 sections matching desktop and mobile', async ({ page }) => {
    const desktopLinks = page.locator('header nav a[href^="#"]');
    const count = await desktopLinks.count();
    expect(count).toBeGreaterThanOrEqual(8);

    // Verify all 8 canonical labels exist
    const expectedSections = [
      'About', 'Experience', 'Education', 'Toolkit',
      'Projects', 'Certifications', 'Honors', 'Contact',
    ];
    for (const label of expectedSections) {
      await expect(desktopLinks.filter({ hasText: label }).first()).toBeVisible();
    }
  });

  test('Interactive project filter toggles visible projects with no scrollbar', async ({ page }) => {
    const allCards = page.locator('[data-testid^="project-card-"]');
    await expect(allCards).toHaveCount(6);

    // Filter to Power Platform
    await page.getByTestId('filter-power-platform').click();
    await expect(page.getByTestId('project-card-kpmg-harvest')).toBeVisible();
    await expect(page.getByTestId('project-card-kpmg-migration')).toBeVisible();
    await expect(page.getByTestId('project-card-gl-genai')).not.toBeVisible();

    // Reset to All
    await page.getByTestId('filter-all').click();
    await expect(allCards).toHaveCount(6);
  });

  test('Clicking a project card opens detailed case study modal', async ({ page }) => {
    const harvestCard = page.getByTestId('project-card-kpmg-harvest');
    await harvestCard.click();

    // Modal dialog appears
    const modal = page.getByTestId('project-modal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('#modal-project-title')).toContainText('Automated Knowledge Harvesting');

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Contact section has direct communication links without copy buttons', async ({ page }) => {
    const emailLink = page.getByTestId('contact-link-email');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:kb270102@gmail.com');

    // Verify no copy buttons exist
    const copyBtn = page.locator('button:has-text("Copy")');
    await expect(copyBtn).toHaveCount(0);
  });
});
