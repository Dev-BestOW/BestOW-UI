import { readFileSync } from 'node:fs';
import { axeViolations, expect, expectVisibleDates, jsonLd, test } from './fixtures';

const PATH = '/changelog/';
// 지금 react 의 최신 버전 — 화면 제목·id 와 비교한다(버전이 올라가도 따라온다)
const reactVersion = JSON.parse(readFileSync(new URL('../../../packages/react/package.json', import.meta.url), 'utf8'))
  .version as string;

test('변경 기록: 제목·날짜·패키지 버전·항목, 커밋 해시·Updated dependencies 없음', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('변경 기록');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://bestow-ui.com${PATH}`);
  const [article, breadcrumb] = await jsonLd(page);
  await expectVisibleDates(page, article);
  expect(article).toMatchObject({ '@type': 'TechArticle', url: `https://bestow-ui.com${PATH}` });
  expect(breadcrumb).toMatchObject({ '@type': 'BreadcrumbList' });

  // 배포 날짜(h2)는 '2026년 11월 19일' 형식, 최근 것이 위
  const days = await page
    .getByRole('heading', { level: 2 })
    .locator('time')
    .evaluateAll((els) => els.map((el) => el.getAttribute('datetime') ?? ''));
  expect(days.length).toBeGreaterThan(5);
  expect([...days].sort().reverse()).toEqual(days);
  for (const day of days) expect(day).toMatch(/^\d{4}-\d{2}-\d{2}$/);

  // 최신 react 버전 제목과 바로 가는 id
  const latest = page.locator(`[id="react-${reactVersion}"]`);
  await expect(latest).toHaveText(`@bestow-ui/react ${reactVersion}`);
  await expect(page.getByRole('heading', { level: 3, name: '@bestow-ui/korean-utils 0.1.0' })).toBeVisible();

  // changesets 의 커밋 해시와 의존성 갱신 줄은 독자에게 의미가 없어 뺀다
  const text = await page.locator('article').innerText();
  expect(text).not.toMatch(/\b[0-9a-f]{7}: /);
  expect(text).not.toContain('Updated dependencies');
  // 마크다운 문법이 글자로 남지 않는다(코드·링크로 그려짐). 별표는 주민번호 가림 예시(900101-1******)처럼 내용이라 보지 않는다
  expect(text).not.toMatch(/`|\]\(/);
  await expect(page.locator('article strong').first()).toBeVisible();
});

test('첫 화면·sitemap 에서 들어온다', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: '변경 기록' })).toHaveAttribute('href', PATH);
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain(`<loc>https://bestow-ui.com${PATH}</loc>`);
});

for (const mode of ['light', 'dark'] as const) {
  test(`axe 위반 0 — ${mode}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: mode });
    await page.goto(PATH);
    expect(await axeViolations(page)).toEqual([]);
  });
}

// 긴 코드 이름(`hasAllRequiredAgreements` 등)이 많아 좁은 화면에서 넘치기 쉽다
for (const width of [320, 390]) {
  test(`${width}px 에서 가로 스크롤 없음`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(PATH);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
