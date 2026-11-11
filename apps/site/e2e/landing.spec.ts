import { axeViolations, expect, test } from './fixtures';

const HOME = '/BestOW-UI/';

test('첫 화면: 제목·한국어 lang·링크 미리보기 태그', async ({ page }) => {
  await page.goto(HOME);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    '한국 서비스의 입력 칸, 이제 처음부터 만들지 마세요',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page).toHaveTitle(/BestOW UI/);
  // 미리보기 이미지는 절대 주소여야 카카오톡·슬랙에서 뜬다
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://dev-bestow.github.io/BestOW-UI/og.png',
  );
  // Search Console 소유 확인 — 빠지면 확인이 풀린다
  await expect(page.locator('meta[name="google-site-verification"]')).toHaveAttribute(
    'content',
    'fjhHTSTn5cz8gnw_LCEgdNw4vawqPE4__ZqF4UQp9lo',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://dev-bestow.github.io/BestOW-UI/',
  );
  // 문서 링크는 Storybook 의 새 자리(/storybook/)로
  await expect(page.getByRole('link', { name: '시작하기 문서 보기' })).toHaveAttribute(
    'href',
    '/BestOW-UI/storybook/?path=/docs/introduction--docs',
  );
});

test('og.png·sitemap.xml·iframe.html 이 사이트 루트에 있다', async ({ request }) => {
  for (const path of ['og.png', 'sitemap.xml', 'iframe.html']) {
    expect((await request.get(`${HOME}${path}`)).status(), path).toBe(200);
  }
});

for (const mode of ['light', 'dark'] as const) {
  test(`axe 위반 0 — ${mode}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: mode });
    await page.goto(HOME);
    expect(await axeViolations(page)).toEqual([]);
  });
}

test('데모: 입력 서식, 대표색 바꾸기, 필수 약관 안내', async ({ page }) => {
  await page.goto(HOME);
  const demo = page.getByRole('region', { name: '직접 입력해 보세요' });

  const phone = demo.getByRole('textbox', { name: '휴대폰 번호' });
  await phone.pressSequentially('01012345678');
  await expect(phone).toHaveValue('010-1234-5678');

  const amount = demo.getByRole('textbox', { name: '결제 금액' });
  await amount.pressSequentially('125000');
  await expect(amount).toHaveValue('125,000');
  await expect(demo.getByText('12만 5,000원')).toBeVisible();

  // 대표색을 보라로 → 가입하기 버튼 배경이 바뀐다
  const submit = demo.getByRole('button', { name: '가입하기' });
  const before = await submit.evaluate((el) => getComputedStyle(el).backgroundColor);
  await demo.getByRole('radio', { name: '보라' }).click();
  await expect.poll(() => submit.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(before);
  await expect(demo.getByText(/버튼 글자 대비는 라이트 [\d.]+:1, 다크 [\d.]+:1/)).toBeVisible();

  // 필수 약관 없이 누르면 안내, 전체 동의 후 누르면 Toast
  await submit.click();
  await expect(demo.getByText('필수 약관에 모두 동의해 주세요.')).toBeVisible();
  await demo.getByRole('checkbox', { name: '전체 동의' }).check();
  await expect(demo.getByText('필수 약관에 모두 동의해 주세요.')).toBeHidden();
  await submit.click();
  await expect(page.getByText('가입 버튼을 눌렀어요', { exact: true })).toBeVisible();
});

test('다크 모드 토글', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(HOME);
  await page.getByRole('button', { name: '다크 모드로 전환' }).click();
  await expect(page.getByRole('button', { name: '라이트 모드로 전환' })).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
});

// Search Console 소유 확인 파일 — 받은 그대로 루트에서 열려야 확인이 유지된다(태그 확인과 둘 중 하나만 있어도 되지만 둘 다 둠)
test('Google 소유 확인 파일', async ({ request }) => {
  const response = await request.get('/BestOW-UI/google0b0babb132369702.html');
  expect(response.status()).toBe(200);
  expect(await response.text()).toBe('google-site-verification: google0b0babb132369702.html');
});

// KWCAG 1.4.10 리플로 — 대표색 버튼·설치 명령·데모 칸이 좁은 화면에서 가로 스크롤을 만들었던 적이 있다
for (const width of [320, 390]) {
  test(`${width}px 폭에서 가로 스크롤 없음`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(HOME);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
