import type { Locator } from '@playwright/test';
import { expect, test } from './fixtures';

// Windows 고대비(강제 색상) 모드: 브라우저가 배경색·그림자를 지우므로, 상태를 배경색으로만 보여 주던 요소는
// styles/forcedColors.css.ts 의 시스템 색(Highlight 등)으로 다시 그린다. 그 요소에 배경이 남아 있는지 본다.
// Playwright 의 forcedColors 에뮬레이션은 Chromium 에서만 실제 강제 색상을 적용한다.
test.use({ forcedColors: 'active' });
test.skip(({ browserName }) => browserName !== 'chromium', 'forced-colors 에뮬레이션은 Chromium 만');

/**
 * 배경이 시스템 강조색(Highlight)이다 = 고대비에서 상태가 보인다.
 * "투명이 아니다" 만 보면 안 된다 — 버튼은 고대비에서 브라우저가 ButtonFace 로 칠해, 상태 표시가 없어도 통과해 버린다.
 */
async function expectSystemHighlight(locator: Locator) {
  const [fill, highlight] = await locator.evaluate((el) => {
    const probe = document.createElement('div');
    probe.style.cssText = 'forced-color-adjust:none;background:Highlight;position:absolute;width:1px;height:1px';
    document.body.append(probe);
    const highlight = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return [getComputedStyle(el).backgroundColor, highlight];
  });
  expect(fill, '고대비에서 상태가 시스템 강조색으로 보여야 한다').toBe(highlight);
}

test('고대비: Switch 켜짐·선택된 탭·SegmentedControl·현재 페이지가 보인다', async ({ page }) => {
  await page.goto('/navigation');
  await expectSystemHighlight(page.getByRole('tablist', { name: '기간' }).getByRole('tab', { selected: true }));
  await expectSystemHighlight(page.getByRole('radiogroup', { name: '정렬' }).getByRole('radio', { checked: true }));
  await expectSystemHighlight(page.getByRole('navigation', { name: '페이지 탐색' }).locator('[aria-current="page"]'));

  await page.goto('/interactive');
  const toggle = page.getByRole('switch', { name: '마케팅 알림 받기' });
  await toggle.click();
  await expect(toggle).toBeChecked();
  await expectSystemHighlight(toggle);
});

test('고대비: 키보드로 연 메뉴의 강조 항목이 보인다', async ({ page }) => {
  await page.goto('/navigation');
  await page.getByRole('button', { name: '문서 메뉴' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: '편집' })).toBeFocused();
  await expectSystemHighlight(page.getByRole('menuitem', { name: '편집' }));
});

test('고대비: Slider 의 채워진 범위가 보인다', async ({ page }) => {
  await page.goto('/interactive');
  const range = page.locator('[data-orientation="horizontal"] > span > span').first();
  await expectSystemHighlight(range);
});
