import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// 2.0: dist/index.css(styles.css)는 모든 스타일을 @layer bestow 로 감싼다(packages/react/src/styles/cssLayer.ts).
// 실제 설치(dist)를 쓰는 playground 에서 우선순위를 확인한다 — 같은 설정이 Storybook 에도 들어 있다(.storybook/main.ts).
const radiusOf = (page: Page) =>
  page.getByRole('button', { name: '가입' }).evaluate((element) => getComputedStyle(element).borderTopLeftRadius);

test.beforeEach(async ({ page }) => {
  await page.goto('/signup');
  expect(await radiusOf(page)).not.toBe('0px');
});

test('컴포넌트 스타일은 @layer bestow 안에 있다', async ({ page }) => {
  const layers = await page.evaluate(() =>
    [...document.styleSheets].flatMap((sheet) =>
      [...sheet.cssRules]
        .filter((rule) => rule instanceof CSSLayerBlockRule)
        .map((rule) => (rule as CSSLayerBlockRule).name),
    ),
  );
  expect(layers).toContain('bestow');
});

test('레이어 밖의 사용자 CSS 는 선택자가 더 약해도 컴포넌트를 이긴다', async ({ page }) => {
  await page.addStyleTag({ content: 'button { border-radius: 0 }' });
  expect(await radiusOf(page)).toBe('0px');
});

test('base 레이어의 리셋(Tailwind v4 preflight 자리)은 나중에 불러와도 컴포넌트를 이기지 못한다', async ({ page }) => {
  await page.addStyleTag({
    content: '@layer theme, base, components, utilities; @layer base { button { border-radius: 0 } }',
  });
  expect(await radiusOf(page)).not.toBe('0px');
});
