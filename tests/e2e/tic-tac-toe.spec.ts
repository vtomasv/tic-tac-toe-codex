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

test('AC-US4-INTERACCION-002 activa una celda vacía mediante toque', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('button', { name: 'Fila 1, columna 1, vacía' }).tap();
  await expect(page.getByRole('button', { name: 'Fila 1, columna 1, X' })).toBeVisible();
  await context.close();
});

test('AC-US4-TECLADO-016 reinicia mediante Enter y Espacio', async ({ page }) => {
  await page.goto('/');
  const first = page.getByRole('button', { name: 'Fila 1, columna 1, vacía' });
  await first.focus();
  await page.keyboard.press('Enter');
  const restart = page.getByRole('button', { name: 'Reiniciar partida' });
  await restart.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Fila 1, columna 1, vacía' })).toBeVisible();
  const second = page.getByRole('button', { name: 'Fila 1, columna 2, vacía' });
  await second.focus();
  await page.keyboard.press('Space');
  await restart.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Fila 1, columna 2, vacía' })).toBeVisible();
});

test('AC-US4-RESPONSIVE-012 evita desplazamiento horizontal entre 320 y 1920 píxeles', async ({ page }) => {
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    await page.getByRole('button', { name: 'Fila 1, columna 1, vacía' }).click();
    await expect(page.getByRole('button', { name: 'Fila 1, columna 1, X' })).toBeVisible();
    await page.getByRole('button', { name: 'Reiniciar partida' }).click();
    await expect(page.getByRole('button', { name: 'Fila 1, columna 1, vacía' })).toBeVisible();
  }
});
