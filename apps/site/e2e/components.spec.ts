import { kitPages } from '../app/components/kit';
import { axeViolations, expect, test } from './fixtures';

const LIST = '/components/';
const pages = kitPages.map(({ slug }) => `${LIST}${slug}/`);

test('컴포넌트 문서: 제목·설명·canonical·미리보기 태그·props·Storybook 링크', async ({ page }) => {
  for (const kit of kitPages) {
    await page.goto(`${LIST}${kit.slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(kit.title);
    await expect(page).toHaveTitle(`${kit.title} — BestOW UI`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', kit.summary);
    const url = `https://bestow-ui.com${LIST}${kit.slug}/`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', url);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://bestow-ui.com/og.png');
    // props 는 빌드 때 소스에서 읽어 온다
    await expect(page.getByRole('region', { name: `${kit.name} props 타입 정의` })).toContainText(
      `export interface ${kit.name}Props`,
    );
    await expect(page.getByRole('link', { name: 'Storybook 에서 조작해 보기' })).toHaveAttribute(
      'href',
      `/storybook/?path=${kit.storybookPath}`,
    );
    if (kit.utilsSlug) {
      await expect(page.getByRole('link', { name: /같은 서식 함수/ })).toHaveAttribute(
        'href',
        `/korean-utils/${kit.utilsSlug}/`,
      );
    }
  }
});

test('PhoneNumberInput 데모: 입력하는 대로 하이픈, 값은 숫자만', async ({ page }) => {
  await page.goto(`${LIST}phone-number-input/`);
  const demo = page.getByRole('region', { name: '직접 입력해 보세요' });
  const input = demo.getByRole('textbox', { name: '휴대폰 번호' });
  await input.pressSequentially('01012345678');
  await expect(input).toHaveValue('010-1234-5678');
  await expect(demo.getByRole('definition')).toHaveText("'01012345678'");
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

// KWCAG 1.4.10 리플로 — props·코드는 pre 안에서만 스크롤된다
for (const width of [320, 390]) {
  test(`${width}px 에서 가로 스크롤 없음`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const path of pages) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBeLessThanOrEqual(width);
    }
  });
}
