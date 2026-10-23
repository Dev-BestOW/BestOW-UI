import { axeViolations, backgroundOf, expect, test } from './fixtures';

// playground 는 ThemeProvider theme="system" 으로 시작한다 — OS 설정을 따르고, 헤더 토글을 누르면 그 모드로 고정
const isDark = ([r, g, b]: number[]) => r! + g! + b! < 150;
const root = '[data-theme]';

test.describe('OS 가 다크 모드', () => {
  test.use({ colorScheme: 'dark' });

  test('처음부터 다크 테마로 그리고 axe 위반이 없다', async ({ page }) => {
    await page.goto('/interactive');
    await expect(page.locator(root).first()).toHaveAttribute('data-theme', 'dark');
    expect(isDark(await backgroundOf(page.locator('main')))).toBe(true);
    await expect(page.getByRole('button', { name: '라이트 모드로 전환' })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test('JS 가 실행되기 전(서버 HTML)에도 다크로 그린다 — 깜빡임 없음', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      colorScheme: 'dark',
      baseURL: test.info().project.use.baseURL,
    });
    const page = await context.newPage();
    await page.goto('/interactive');
    await expect(page.locator(root).first()).toHaveAttribute('data-theme', 'system');
    expect(isDark(await backgroundOf(page.locator('main')))).toBe(true);
    await context.close();
  });
});

test('OS 설정을 바꾸면 바로 따르고, 토글로 고르면 그 모드로 고정된다', async ({ page }) => {
  await page.goto('/interactive');
  const main = page.locator('main');
  expect(isDark(await backgroundOf(main))).toBe(false);

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator(root).first()).toHaveAttribute('data-theme', 'dark');
  expect(isDark(await backgroundOf(main))).toBe(true);

  await page.getByRole('button', { name: '라이트 모드로 전환' }).click();
  await expect(page.locator(root).first()).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator(root).first()).toHaveAttribute('data-theme', 'light');
  expect(isDark(await backgroundOf(main))).toBe(false);
});
