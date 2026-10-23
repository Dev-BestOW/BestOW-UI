import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// 반응형 구간(media — tokens breakpoint 를 em 으로)이 실제 화면 폭에서 맞게 바뀌는지. 첫 페이지(서버 컴포넌트)의 Card Grid:
// columns={{ base: 1, md: 3 }} — 768px 미만 1열, 이상 3열. Container 는 최대 1024px 에 좌우 여백 16px(md 부터 24px).
const cardTops = (page: Page) =>
  page
    .locator('article')
    .evaluateAll((cards) => cards.slice(0, 3).map((card) => Math.round(card.getBoundingClientRect().top)));

for (const { width, columns } of [
  { width: 767, columns: 1 },
  { width: 768, columns: 3 },
  { width: 1280, columns: 3 },
]) {
  test(`${width}px — Grid 가 ${columns}열이다`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const tops = await cardTops(page);
    expect(new Set(tops).size).toBe(columns === 1 ? 3 : 1);
  });
}

test('Container — 1280px 에서 본문은 최대 1024px 로 가운데, 좁은 화면은 좌우 여백 16px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const main = page.locator('main');
  let box = (await main.boundingBox())!;
  expect(Math.round(box.width)).toBe(1024);
  expect(Math.round(box.x)).toBe(128);

  await page.setViewportSize({ width: 375, height: 800 });
  box = (await main.boundingBox())!;
  expect(Math.round(box.width)).toBe(375);
  expect(await main.evaluate((el) => getComputedStyle(el).paddingLeft)).toBe('16px');
});
