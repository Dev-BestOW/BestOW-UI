import { axeViolations, backgroundOf, contrast, expect, test, useDarkBrand } from './fixtures';

const pages = [
  { path: '/', heading: '서버 컴포넌트 페이지' },
  { path: '/interactive', heading: '상호작용 페이지' },
  { path: '/navigation', heading: '탐색·오버레이 페이지' },
  { path: '/orders', heading: '주문 관리' },
];

for (const { path, heading } of pages) {
  test.describe(path, () => {
    test('라이트: 콘솔·hydration 오류 없음, axe 위반 없음', async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
    });

    test('다크 + 브랜드: axe 위반 없음', async ({ page }) => {
      await page.goto(path);
      await useDarkBrand(page);
      expect(await axeViolations(page)).toEqual([]);
    });
  });
}

test('서버 컴포넌트에서 부른 함수·값(createTheme·vars·서식 함수)이 그대로 렌더링된다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('125만원 · 010-1234-5678 · 2026년 10월 16일 금요일')).toBeVisible();
  const brand = page.getByRole('button', { name: '서버에서 만든 브랜드 테마' });
  const normal = page.getByRole('button', { name: '검색' });
  const brandBg = await backgroundOf(brand);
  expect(brandBg).not.toEqual(await backgroundOf(normal));
  const text = await brand.evaluate((el) => getComputedStyle(el).color.match(/\d+/g)!.slice(0, 3).map(Number));
  expect(contrast(brandBg, text)).toBeGreaterThanOrEqual(4.5);
});

test('hook 없는 표시용 컴포넌트는 서버 컴포넌트로 렌더링된다 — `as` 에 서버 함수를 넘길 수 있다', async ({ page }) => {
  await page.goto('/');
  // ServerSection(서버에서 정의한 함수)이 Card 의 요소로 그려졌다 — Card 가 클라이언트 컴포넌트였다면 빌드가 실패한다
  const card = page.getByRole('region', { name: '서버 렌더링 카드' });
  await expect(card).toHaveAttribute('data-rendered-on', 'server');
  await expect(card.getByRole('progressbar', { name: '서버에서 그린 진행률' })).toHaveAttribute('aria-valuenow', '60');
});
