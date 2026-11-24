import { readFileSync } from 'node:fs';
import { KEY } from '../../../scripts/indexnow.mjs';
import { descriptionLimit, ogImagePath, titleLimit } from '../app/seo';
import { axeViolations, expect, jsonLd, test } from './fixtures';

const HOME = '/';

test('첫 화면: 제목·한국어 lang·링크 미리보기 태그', async ({ page }) => {
  await page.goto(HOME);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    '한국 서비스의 입력 칸, 이제 처음부터 만들지 마세요',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page).toHaveTitle(/BestOW UI/);
  // 미리보기 이미지는 절대 주소여야 카카오톡·슬랙에서 뜬다
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://bestow-ui.com/og.png');
  // Search Console 소유 확인 — 빠지면 확인이 풀린다
  await expect(page.locator('meta[name="google-site-verification"]')).toHaveAttribute(
    'content',
    'fjhHTSTn5cz8gnw_LCEgdNw4vawqPE4__ZqF4UQp9lo',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bestow-ui.com/');
  // 파비콘 — 같은 rel 하나, 절대 주소, PNG(구글 형식 목록에 SVG 가 없음)
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'https://bestow-ui.com/icon-96.png');
  await expect(page.locator('link[rel="shortcut icon"]')).toHaveCount(0);
  // 구조화 데이터 — 사이트 이름(구글), 저장소·라이선스를 검색 엔진에 알린다
  expect(await jsonLd(page)).toEqual([
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'BestOW UI', url: 'https://bestow-ui.com/' },
    expect.objectContaining({
      '@type': 'SoftwareSourceCode',
      url: 'https://bestow-ui.com/',
      codeRepository: 'https://github.com/Dev-BestOW/BestOW-UI',
    }),
  ]);
  // 방문 통계는 배포 빌드에만(토큰 CF_WEB_ANALYTICS_TOKEN) — 테스트·로컬 빌드에 들어가면 가짜 방문이 쌓인다
  await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
  // 문서 링크는 Storybook 의 새 자리(/storybook/)로
  await expect(page.getByRole('link', { name: '시작하기 문서 보기' })).toHaveAttribute(
    'href',
    '/storybook/?path=/docs/introduction--docs',
  );
  // 한국 키트 소개에서 컴포넌트 문서 목록(정적 HTML)으로
  await expect(page.getByRole('link', { name: '한국 입력 컴포넌트 문서' })).toHaveAttribute('href', '/components/');
});

test('og.png·파비콘·sitemap.xml·robots.txt·iframe.html 이 사이트 루트에 있다', async ({ request }) => {
  for (const path of ['og.png', 'icon-96.png', 'favicon.ico', 'sitemap.xml', 'robots.txt', 'iframe.html']) {
    expect((await request.get(`${HOME}${path}`)).status(), path).toBe(200);
  }
  // robots.txt 는 호스트 루트에서만 읽힌다 — 사용자 도메인이라 둘 수 있다. sitemap 위치를 알린다
  expect(await (await request.get(`${HOME}robots.txt`)).text()).toContain('Sitemap: https://bestow-ui.com/sitemap.xml');
});

// sitemap lastmod = 쪽의 "마지막 수정"(JSON-LD dateModified) — IndexNow(scripts/indexnow.mjs)가 이 값이 바뀐 주소만 알린다.
// 날짜 없는 목록 쪽에는 lastmod 를 달지 않는다(빌드 날짜를 달면 구글이 lastmod 를 믿지 않고, IndexNow 가 매번 모든 쪽을 보낸다)
test('sitemap.xml 의 lastmod 가 문서 쪽의 dateModified 와 같다', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    path: new URL(/<loc>([^<]+)<\/loc>/.exec(body!)![1]!).pathname,
    lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(body!)?.[1],
  }));
  const dated = entries.filter((entry) => entry.lastmod);
  // 함수 문서·한국 키트 문서·비교·변경 기록
  expect(dated.length).toBeGreaterThan(20);
  for (const path of ['/', '/components/', '/korean-utils/', '/storybook/']) {
    expect(entries.find((entry) => entry.path === path)?.lastmod, path).toBeUndefined();
  }
  for (const { path, lastmod } of dated) {
    await page.goto(path);
    const article = (await jsonLd(page)).find((data) => data['@type'] === 'TechArticle');
    expect(String(article?.dateModified).slice(0, 10), path).toBe(lastmod);
  }
});

// 문서 쪽마다 다른 링크 미리보기 이미지(네이버: 되풀이되는 이미지는 대표 이미지로 안 쓰일 수 있음). scripts/generate-og.mjs 가 찍을 때의
// h1 을 og-manifest.json 에 남긴다 — 제목을 바꾸거나 쪽을 더했는데 다시 찍지 않으면 여기서 실패한다
test('문서 쪽마다 자기 OG 이미지가 있고 지금 제목으로 찍혀 있다', async ({ page, request }) => {
  const manifest = JSON.parse(readFileSync(new URL('../og-manifest.json', import.meta.url), 'utf8')) as Record<
    string,
    string
  >;
  const xml = await (await request.get('/sitemap.xml')).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, loc]) => new URL(loc!).pathname)
    .filter((path) => path !== '/' && path !== '/storybook/');
  expect(Object.keys(manifest).sort(), '다시 찍기: pnpm build-site && node scripts/generate-og.mjs pages').toEqual(
    [...paths].sort(),
  );
  const images = new Set<string>();
  for (const path of paths) {
    await page.goto(path);
    const h1 = (await page.getByRole('heading', { level: 1 }).textContent())?.trim();
    expect(manifest[path], `${path} 제목이 바뀌었어요 — pnpm build-site && node scripts/generate-og.mjs pages`).toBe(
      h1,
    );
    const image = `https://bestow-ui.com/${ogImagePath(path)}`;
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', image);
    images.add(image);
    // 네이버 대표 이미지 조건: 5,000바이트 이상(크기 1200×630 은 seo.ts 가 적는다)
    const response = await request.get(`/${ogImagePath(path)}`);
    expect(response.status(), path).toBe(200);
    expect((await response.body()).length, path).toBeGreaterThan(5000);
  }
  expect(images.size).toBe(paths.length);
});

// IndexNow 키 파일 — 검색엔진이 이 파일로 소유를 확인한다(없으면 403). 키는 scripts/indexnow.mjs 의 KEY
test('IndexNow 키 파일이 사이트 루트에 있다', async ({ request }) => {
  const response = await request.get(`/${KEY}.txt`);
  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe(KEY);
});

// 보안 연락처(RFC 9116) — Pages 배포는 숨김 폴더를 빼므로 storybook.yml 의 include-hidden-files 와 함께 지킨다
test('/.well-known/security.txt: 연락처·정책·canonical, 만료가 30일 넘게 남음', async ({ request }) => {
  const response = await request.get('/.well-known/security.txt');
  expect(response.status()).toBe(200);
  const text = await response.text();
  const field = (name: string) => new RegExp(`^${name}: (.+)$`, 'm').exec(text)?.[1];
  expect(field('Contact')).toBe('https://github.com/Dev-BestOW/BestOW-UI/security/advisories/new');
  expect(field('Policy')).toBe('https://github.com/Dev-BestOW/BestOW-UI/blob/main/SECURITY.md');
  expect(field('Canonical')).toBe('https://bestow-ui.com/.well-known/security.txt');
  expect(field('Preferred-Languages')).toBe('ko, en');
  const daysLeft = (Date.parse(field('Expires') ?? '') - Date.now()) / 86_400_000;
  expect(daysLeft, 'Expires 를 1년 안쪽의 새 날짜로 바꿔 주세요').toBeGreaterThan(30);
  expect(daysLeft, 'RFC 9116 은 1년 이내를 권한다').toBeLessThanOrEqual(366);
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

  // 은행은 초성으로 찾는다 — ㄱㅁ → KB국민은행(목록은 portal 이라 page 에서 찾는다)
  const bank = demo.getByRole('combobox', { name: '정산 은행' });
  await bank.fill('ㄱㅁ');
  await page.getByRole('option', { name: 'KB국민은행' }).click();
  await expect(bank).toHaveValue('KB국민은행');

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
  const response = await request.get('/google0b0babb132369702.html');
  expect(response.status()).toBe(200);
  expect(await response.text()).toBe('google-site-verification: google0b0babb132369702.html');
});

// 네이버 서치어드바이저 소유 확인 파일(https://bestow-ui.com) — 받은 그대로 루트에서 열려야 확인이 유지된다.
// 옛 주소(dev-bestow.github.io)의 확인 파일은 조직 루트 저장소에 있다
test('네이버 소유 확인 파일', async ({ request }) => {
  const response = await request.get('/naverdbb94071b934e2519ccd47042ba23ee1.html');
  expect(response.status()).toBe(200);
  expect(await response.text()).toBe('naver-site-verification: naverdbb94071b934e2519ccd47042ba23ee1.html');
});

// KWCAG 1.4.10 리플로 — 대표색 버튼·설치 명령·데모 칸이 좁은 화면에서 가로 스크롤을 만들었던 적이 있다
for (const width of [320, 390]) {
  test(`${width}px 폭에서 가로 스크롤 없음`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(HOME);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

// 네이버 서치어드바이저 권장 길이 — 넘으면 검색 결과에서 잘린다. sitemap 의 이 사이트 쪽 전부 + 404
test('모든 쪽의 제목 40자·설명 80자 이내(OG 포함)', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const paths = [...xml.matchAll(/<loc>https:\/\/bestow-ui\.com(\/[^<]*)<\/loc>/g)]
    .map(([, path]) => path)
    .filter((path) => !path.startsWith('/storybook/') && !path.startsWith('/playground/'));
  expect(paths.length).toBeGreaterThan(20);
  for (const path of [...paths, '/404.html']) {
    await page.goto(path);
    const meta = await page.evaluate(() => {
      const content = (selector: string) => document.querySelector(selector)?.getAttribute('content') ?? '';
      return {
        title: document.title,
        description: content('meta[name="description"]'),
        ogTitle: content('meta[property="og:title"]'),
        ogDescription: content('meta[property="og:description"]'),
      };
    });
    expect(meta.title.length, `${path} 제목: ${meta.title}`).toBeLessThanOrEqual(titleLimit);
    expect(meta.ogTitle.length, `${path} OG 제목: ${meta.ogTitle}`).toBeLessThanOrEqual(titleLimit);
    expect(meta.description.length, `${path} 설명: ${meta.description}`).toBeLessThanOrEqual(descriptionLimit);
    expect(meta.description.length, `${path} 설명 없음`).toBeGreaterThan(20);
    expect(meta.ogDescription.length, `${path} OG 설명: ${meta.ogDescription}`).toBeLessThanOrEqual(descriptionLimit);
  }
});
