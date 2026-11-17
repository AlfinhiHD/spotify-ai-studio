import { test, expect } from '@playwright/test';

test.describe('Sepotifi Studio End-to-End Tests', () => {
  test('should render workspace and generate real Pop Punk playlist without hardcoded defaults', async ({ page }) => {
    // 1. Visit the running application
    await page.goto('http://127.0.0.1:5173');

    // 2. Verify branding and navigation
    await expect(page.getByText('Sepotifi Studio').first()).toBeVisible();
    await expect(page.getByText('AI Creator (Buat Baru)').first()).toBeVisible();
    await expect(page.getByText('AI Library Studio').first()).toBeVisible();

    // 3. Test prompt input with user requested prompt
    const promptInput = page.locator('textarea').first();
    await expect(promptInput).toBeVisible();
    await promptInput.fill('bikinin playlist pop punk seru di sore hari');

    // 4. Click Generate AI Mix button
    const generateBtn = page.getByRole('button', { name: /Generate AI Mix/i });
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // 5. Wait for generation to complete
    await expect(page.getByText('Sedang Meracik Mix...')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Sedang Meracik Mix...')).not.toBeVisible({ timeout: 35000 });
    await page.waitForTimeout(1000);

    // 6. Verify that the generated playlist contains genuine Pop Punk artists!
    const tracklistSection = page.locator('section').last();
    const tracklistText = await tracklistSection.textContent();
    console.log('Generated Tracklist Snippet:', tracklistText?.slice(0, 500));

    // Pop Punk icons that should be present from Gemini or Pop Punk curation:
    const popPunkKeywords = [
      'blink-182',
      'paramore',
      'all time low',
      'green day',
      'sum 41',
      'neck deep',
      'fall out boy',
      'yellowcard',
      'state champs',
    ];

    const lowerContent = (tracklistText || '').toLowerCase();
    const matchedPopPunk = popPunkKeywords.filter((k) => lowerContent.includes(k));
    console.log('Matched Pop Punk Artists:', matchedPopPunk);

    expect(matchedPopPunk.length).toBeGreaterThanOrEqual(3);

    // Verify that the old hardcoded seeds (Men I Trust, wave to earth, keshi) are NOT in the tracklist!
    expect(lowerContent).not.toContain('men i trust');
    expect(lowerContent).not.toContain('wave to earth');
  });

  test('should switch between AI Creator and AI Library Studio', async ({ page }) => {
    await page.goto('http://127.0.0.1:5173');

    // Switch to Library Studio
    await page.getByText('AI Library Studio').first().click();
    await expect(
      page.getByText(/Koleksi Playlist Spotify Kamu|Hubungkan Akun Spotify Kamu/i).first()
    ).toBeVisible();

    // Switch back to AI Creator
    await page.getByText('AI Creator (Buat Baru)').first().click();
    await expect(page.getByText('AI DJ Composer Deck').first()).toBeVisible();
  });

  test('should adjust track count slider and taste blend modes', async ({ page }) => {
    await page.goto('http://127.0.0.1:5173');
    await expect(page.getByText('AI DJ Composer Deck').first()).toBeVisible();

    // Verify track count badge
    await expect(page.getByText('20 Lagu').first()).toBeVisible();

    // Click 15 EP preset
    await page.getByRole('button', { name: '15 EP' }).click();
    await expect(page.getByText('15 Lagu').first()).toBeVisible();

    // Click 40 Long preset
    await page.getByRole('button', { name: /40 Long/i }).click();
    await expect(page.getByText('40 Lagu').first()).toBeVisible();

    // Toggle taste mode between Campur Seimbang and Eksplorasi Baru
    await page.getByRole('button', { name: /Eksplorasi Baru/i }).click();
    await expect(page.getByRole('button', { name: /Eksplorasi Baru/i })).toHaveClass(/bg-\[#1ED760\]/);

    await page.getByRole('button', { name: /Campur Seimbang/i }).click();
    await expect(page.getByRole('button', { name: /Campur Seimbang/i })).toHaveClass(/bg-\[#1ED760\]/);
  });
});
