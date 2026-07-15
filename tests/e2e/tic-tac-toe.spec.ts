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

test('AC-US4-RESPONSIVE-013 evita superposición de controles con ampliación del 200 por ciento', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto('/');
  await page.evaluate(() => {
    document.body.style.zoom = '2';
  });
  const controls = page.getByRole('button');
  await expect(controls).toHaveCount(10);
  const boxes = await controls.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    }),
  );
  for (let left = 0; left < boxes.length; left += 1) {
    for (let right = left + 1; right < boxes.length; right += 1) {
      const a = boxes[left];
      const b = boxes[right];
      expect(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top).toBe(true);
    }
  }
});

test('AC-US4-VISUAL-017 muestra un contorno al apuntar una celda vacía', async ({ page }) => {
  await page.goto('/');
  const firstCell = page.getByRole('button', { name: 'Fila 1, columna 1, vacía' });
  await firstCell.hover();
  const outline = await firstCell.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThan(0);
});
