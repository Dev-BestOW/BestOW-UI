import { expect, test } from './fixtures';

// 2026-11 까지 Pages 루트가 Storybook 이었다 — README·npm·블로그·GeekNews 에 남은 옛 주소가 계속 동작해야 한다.
const cases = [
  '?path=/docs/introduction--docs',
  '?path=/docs/accessibility-kwcag-2-2-%EB%8C%80%EC%9D%91--docs',
  '?path=/story/foundations-theme-builder--builder&globals=theme:dark',
  '?path=/docs/korean-kit-agreementgroup--docs#anchor',
];

for (const query of cases) {
  test(`옛 Storybook 주소 ${query} → /storybook/ 로 쿼리·해시 그대로`, async ({ page }) => {
    await page.goto(`/${query}`);
    await expect(page).toHaveURL(`/storybook/${query}`);
    await expect(page.getByRole('heading', { name: '가짜 Storybook' })).toBeVisible();
  });
}

test('옛 스토리 단독 주소 iframe.html?id=… → /storybook/iframe.html', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--playground&viewMode=story');
  await expect(page).toHaveURL('/storybook/iframe.html?id=components-button--playground&viewMode=story');
  await expect(page.getByRole('heading', { name: '가짜 Storybook 스토리' })).toBeVisible();
});

test('쿼리가 없거나 상관없는 쿼리면 넘기지 않는다', async ({ page }) => {
  for (const url of ['/', '/?utm_source=geeknews']) {
    await page.goto(url);
    await expect(page).toHaveURL(url);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});
