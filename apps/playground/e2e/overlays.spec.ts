import { backgroundOf, expect, luminance, test, useDarkBrand } from './fixtures';

// Radix 의 portal 콘텐츠는 ThemeProvider 밖(body)에 그려진다 — usePortalProps 가 빠지면 다크·브랜드 테마가 깨진다.
test.describe('다크 + 브랜드에서 portal 콘텐츠도 테마를 따른다', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/navigation');
    await useDarkBrand(page);
  });

  const isDark = (rgb: number[]) => luminance(rgb) < 0.05;

  test('DropdownMenu', async ({ page }) => {
    await page.getByRole('button', { name: '문서 메뉴' }).click();
    expect(isDark(await backgroundOf(page.getByRole('menu')))).toBe(true);
  });

  test('Popover — 안의 primary 버튼이 브랜드(보라)색', async ({ page }) => {
    await page.getByRole('button', { name: '공유', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: '공유 설정' });
    expect(isDark(await backgroundOf(dialog))).toBe(true);
    const invite = dialog.getByRole('button', { name: '초대' });
    const [r, g, b] = await backgroundOf(invite);
    // 보라: 빨강·파랑이 초록보다 확실히 크다 (기본 파랑이면 r 이 작다)
    expect(r! > g! + 40 && b! > g! + 40).toBe(true);
  });

  test('Drawer', async ({ page }) => {
    await page.getByRole('button', { name: '필터' }).click();
    expect(isDark(await backgroundOf(page.getByRole('dialog', { name: '필터' })))).toBe(true);
  });
});

test('다크: Select 목록과 Modal 도 어두운 배경', async ({ page }) => {
  await page.goto('/interactive');
  await useDarkBrand(page);
  await page.getByRole('combobox', { name: '플랜' }).click();
  expect(luminance(await backgroundOf(page.getByRole('listbox')))).toBeLessThan(0.05);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '삭제', exact: true }).click();
  expect(luminance(await backgroundOf(page.getByRole('dialog', { name: '프로젝트 삭제' })))).toBeLessThan(0.05);
});
