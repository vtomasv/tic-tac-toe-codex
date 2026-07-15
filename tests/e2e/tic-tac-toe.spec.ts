import { expect, test } from '@playwright/test';

test('AC-US4-FOCO-006 muestra un contorno continuo en el control enfocado', async ({ page }) => {
  await page.goto('/');
  const firstCell = page.getByRole('button', { name: 'Fila 1, columna 1, vacía' });
  await firstCell.focus();
  const outline = await firstCell.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThan(0);
});
