import * as utils from '@bestow-ui/korean-utils';
import { guides } from '../app/korean-utils/guides';
import { axeViolations, expect, test } from './fixtures';

const LIST = '/korean-utils/';
const pages = [LIST, ...guides.map(({ slug }) => `${LIST}${slug}/`)];

test('목록: 모든 함수 문서로 가는 링크', async ({ page }) => {
  await page.goto(LIST);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('한국 서비스 서식·검증 함수');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bestow-ui.com/korean-utils/');
  const list = page.getByRole('region', { name: '무엇을 하려고 하나요' });
  for (const guide of guides) {
    await expect(list.getByRole('link', { name: guide.title })).toHaveAttribute('href', `${LIST}${guide.slug}/`);
  }
  // 헤더에서도 들어올 수 있다
  await expect(
    page.getByRole('navigation', { name: '사이트' }).getByRole('link', { name: '서식 함수' }),
  ).toHaveAttribute('href', LIST);
});

test('함수 문서: 제목·설명·canonical·미리보기 태그', async ({ page }) => {
  for (const guide of guides) {
    await page.goto(`${LIST}${guide.slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(guide.title);
    await expect(page).toHaveTitle(`${guide.title} — @bestow-ui/korean-utils`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', guide.summary);
    const url = `https://bestow-ui.com${LIST}${guide.slug}/`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', url);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://bestow-ui.com/og.png');
    if (guide.component) {
      await expect(page.getByRole('link', { name: `${guide.component.name} 문서 보기` })).toHaveAttribute(
        'href',
        `/storybook/?path=${guide.component.path}`,
      );
    }
  }
});

test('직접 입력하면 결과가 바로 바뀐다', async ({ page }) => {
  await page.goto(`${LIST}phone-number/`);
  const demo = page.getByRole('region', { name: '직접 입력해 보세요' });
  // 결과 칸(dd) 순서: formatPhoneNumber · phoneNumberDigits · phoneNumberMaxDigits
  const results = demo.getByRole('definition');
  const result = (call: 'format' | 'digits' | 'max') => results.nth(['format', 'digits', 'max'].indexOf(call));
  await expect(result('format')).toHaveText("'02-1234-5678'");
  const input = demo.getByRole('textbox', { name: '전화번호' });
  await input.fill('');
  await input.pressSequentially('01012345678');
  await expect(result('format')).toHaveText("'010-1234-5678'");
  await expect(result('max')).toHaveText('11');

  await page.goto(`${LIST}business-number/`);
  const business = page.getByRole('region', { name: '직접 입력해 보세요' });
  await expect(business.getByRole('definition').nth(1)).toHaveText('true');
  await business.getByRole('textbox', { name: '사업자등록번호' }).fill('1248100999');
  await expect(business.getByRole('definition').nth(1)).toHaveText('false');
});

test('은행 코드 표: KOREAN_BANKS 전부', async ({ page }) => {
  await page.goto(`${LIST}bank-account/`);
  const table = page.getByRole('table', { name: '국내 은행 코드(금융결제원)' });
  await expect(table.getByRole('row')).toHaveCount(utils.KOREAN_BANKS.length + 1);
  await expect(table.getByRole('row', { name: '090 카카오뱅크' })).toBeVisible();
});

test('sitemap.xml 에 모든 함수 문서가 있다', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const path of pages) expect(xml).toContain(`<loc>https://bestow-ui.com${path}</loc>`);
});

/**
 * 코드 예시의 `호출; // 결과` 줄을 실제로 계산해 결과 주석과 비교한다(브라우저 없이 node 에서).
 * 결과 뒤 괄호 설명(`'010-123-4' (입력 중인 값)`)은 뺀다. 여러 줄 예시는 대상이 아니다.
 */
test('코드 예시의 결과 주석이 실제 함수 결과와 같다', () => {
  const names = Object.keys(utils);
  const values = Object.values(utils);
  const evaluate = (source: string): unknown => new Function(...names, `return (${source});`)(...values);
  let checked = 0;
  for (const guide of guides) {
    for (const line of guide.code.split('\n')) {
      const match = /^(?!\/\/)(.+?);\s+\/\/ (.+?)(?:\s+\([^)]*\))?$/.exec(line);
      if (!match) continue;
      const [, call, expected] = match;
      expect(evaluate(call!), `${guide.slug}: ${line}`).toEqual(evaluate(expected!));
      checked += 1;
    }
  }
  expect(checked).toBeGreaterThanOrEqual(35);
});

for (const mode of ['light', 'dark'] as const) {
  test(`axe 위반 0 — ${mode}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: mode });
    for (const path of pages) {
      await page.goto(path);
      expect(await axeViolations(page), path).toEqual([]);
    }
  });
}

// KWCAG 1.4.10 리플로 — 긴 코드는 pre 안에서만 스크롤되고, 결과·표는 줄을 바꾼다
test('320px 에서 가로 스크롤 없음', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of pages) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBeLessThanOrEqual(320);
  }
});
