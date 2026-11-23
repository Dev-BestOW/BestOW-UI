import { comparedLibraries } from '../app/compare/data';
import { axeViolations, expect, expectVisibleDates, jsonLd, test } from './fixtures';

const PATH = '/compare/';

test('비교: 제목·표·라이브러리 열·근거 링크·조사한 날짜', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('한국 서비스용 React UI 라이브러리 비교');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://bestow-ui.com${PATH}`);
  const [article] = await jsonLd(page);
  await expectVisibleDates(page, article);
  expect(article).toMatchObject({ '@type': 'TechArticle', url: `https://bestow-ui.com${PATH}` });

  const table = page.getByRole('table', { name: 'BestOW UI·Vapor UI·HANUI·shadcn/ui·MUI 비교' });
  const headers = table.getByRole('columnheader');
  await expect(headers).toHaveText(['항목', 'BestOW UI', 'Vapor UI', 'HANUI', 'shadcn/ui', 'MUI']);
  expect(comparedLibraries.map(({ name }) => name)).toEqual(['BestOW UI', 'Vapor UI', 'HANUI', 'shadcn/ui', 'MUI']);

  // 다른 라이브러리 칸의 근거는 그 라이브러리의 공식 문서(절대 주소)
  for (const library of comparedLibraries.slice(1)) {
    for (const cell of Object.values(library.cells)) {
      if (cell.source) expect(cell.source.href, `${library.name} ${cell.text}`).toMatch(/^https:\/\//);
    }
  }
  const links = await table.getByRole('link').evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
  expect(links.length).toBeGreaterThan(10);
  for (const href of links) expect(href).toMatch(/^(https:\/\/|\/)/);

  // 조사한 날짜와 "바뀌었을 수 있음" 안내, 다른 선택지 안내
  await expect(page.getByText(/2026-11-17 에 각 공식 문서/)).toBeVisible();
  await expect(page.getByText(/공공 웹사이트라 KRDS 를 따라야 하면 HANUI/)).toBeVisible();
});

test('머리글·sitemap 에서 들어온다', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: '사이트' }).getByRole('link', { name: '비교' })).toHaveAttribute(
    'href',
    PATH,
  );
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

// KWCAG 1.4.10 리플로 — 표는 가로 스크롤 영역 안에서만 넘친다
for (const width of [320, 390]) {
  test(`${width}px 에서 가로 스크롤 없음`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(PATH);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
