import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// 확대·리플로(WCAG 1.4.10)와 글자 간격(1.4.12) — 데스크톱 프로젝트에서 창 폭만 줄여 확인한다.
// 320px = 1280px 화면을 400% 확대한 것과 같다. 표(Table)처럼 2차원 배치가 꼭 필요한 내용은 1.4.10 예외라 표 안의 가로 스크롤은 허용한다.
const PAGES = ['/', '/interactive', '/navigation', '/orders'];

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

for (const path of PAGES) {
  test(`${path} — 320px 폭에서 페이지 가로 스크롤이 없다 (리플로)`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(path);
    // 1px 는 브라우저의 소수점 픽셀 반올림 차이(CI Firefox 에서 /navigation 이 1px)라 허용한다 — 실제 넘침(인증번호 칸 32px)은 잡힌다
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });
}

test('320px 폭에서 Modal·Drawer 가 화면 안에 들어온다', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/interactive');
  await page.getByRole('button', { name: '삭제', exact: true }).click();
  const modal = page.getByRole('dialog', { name: '프로젝트 삭제' });
  await expect(modal).toBeVisible();
  let box = (await modal.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  await page.keyboard.press('Escape');

  await page.goto('/navigation');
  await page.getByRole('button', { name: '필터' }).click();
  const drawer = page.getByRole('dialog', { name: '필터' });
  await expect(drawer).toBeVisible();
  box = (await drawer.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
});

/** overflow 가 숨김·잘림인데 내용이 넘치는 요소 = 글자가 잘린다. 말줄임(…)을 일부러 쓰는 요소는 제외 */
async function clippedText(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('body *'))
      .filter((el) => {
        const style = getComputedStyle(el);
        if (!/(hidden|clip)/.test(style.overflowX + style.overflowY)) return false;
        if (style.textOverflow === 'ellipsis' || !el.textContent?.trim()) return false;
        if (el.closest('[aria-hidden="true"], [hidden]')) return false;
        const rect = el.getBoundingClientRect();
        if (rect.width <= 1 || rect.height <= 1) return false; // visually hidden 텍스트
        return el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      })
      .map((el) => `${el.tagName.toLowerCase()} "${el.textContent!.trim().slice(0, 30)}"`),
  );
}

// WCAG 1.4.12 의 최소 간격: 줄 높이 1.5배, 문단 뒤 2배, 글자 0.12배, 단어 0.16배
const TEXT_SPACING = `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
p { margin-bottom: 2em !important; }`;

for (const path of PAGES) {
  test(`${path} — 글자 간격을 넓혀도 잘리는 글자가 없다 (1.4.12)`, async ({ page }) => {
    await page.goto(path);
    await page.addStyleTag({ content: TEXT_SPACING });
    const clipped = await clippedText(page);
    expect(clipped).toEqual([]);
  });
}

// 브라우저 설정에서 기본 글꼴 크기를 2배(32px)로 키운 사용자 — 글자 크기를 rem 으로 내므로 따라 커지고(1.4.4), 잘리지 않아야 한다
for (const path of PAGES) {
  test(`${path} — 기본 글꼴 크기 2배에서 글자가 커지고 잘리지 않는다`, async ({ page }) => {
    await page.goto(path);
    const before = await page
      .getByRole('button')
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });
    const after = await page
      .getByRole('button')
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(after).toBeCloseTo(before * 2, 0);
    expect(await clippedText(page)).toEqual([]);
  });
}
