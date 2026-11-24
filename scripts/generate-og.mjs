// 링크 미리보기용 OG 이미지(1200×630)를 시스템 Chrome 으로 찍는다. 두 가지:
//   - apps/site/public/og.png — 첫 화면(Storybook·playground 도 씀). scripts/og-image.html(문구 + docs/images/hero.png)
//   - apps/site/public/og/<경로>.png — 문서 쪽마다 하나. scripts/og-page.html 에 그 쪽의 h1·이동 경로를 넣어 찍는다.
//     네이버 웹마스터 가이드: 여러 쪽에 되풀이되는 이미지는 대표 이미지로 쓰이지 않을 수 있다.
//     글은 빌드된 쪽(apps/site/out)에서 읽으므로 **먼저 `pnpm build-site`**. 무엇으로 찍었는지 apps/site/og-manifest.json 에 남기고,
//     site E2E 가 지금 쪽의 h1 과 비교한다 — 제목을 바꾸거나 쪽을 더하면 다시 실행해 PNG·manifest 를 커밋한다.
//
//   node scripts/generate-og.mjs          둘 다
//   node scripts/generate-og.mjs pages    문서 쪽만 (제목을 고쳤을 때)
//   node scripts/generate-og.mjs home     첫 화면만 (히어로 이미지·소개 문구가 바뀌었을 때)
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const fromRoot = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
// playwright 는 storybook 앱의 의존성이라 그쪽에서 찾는다.
const { chromium } = createRequire(fromRoot('apps/storybook/package.json'))('@playwright/test');

/** 쪽 경로 → 이미지 경로. apps/site/app/seo.ts 의 ogImagePath 와 같은 규칙 */
export const ogImageFile = (path) => `og/${path.replace(/^\/|\/$/g, '').replaceAll('/', '-')}.png`;

/** sitemap 의 쪽 가운데 이미지를 따로 두지 않는 쪽 — 첫 화면은 og.png, Storybook 은 이 앱 밖 */
const skip = new Set(['/', '/storybook/']);

const decode = (text) =>
  text
    .replace(/<[^>]+>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .trim();

/** 빌드된 쪽에서 이미지에 넣을 글 — h1(" — " 뒤는 부제), 이동 경로 가운데 이름, 패키지·컴포넌트 이름 */
function pageText(path) {
  const html = readFileSync(fromRoot(`apps/site/out${path}index.html`), 'utf8');
  const h1 = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '');
  if (!h1) throw new Error(`${path}: h1 을 찾지 못했어요`);
  const crumbs =
    [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(([, json]) => JSON.parse(json))
      .find((data) => data['@type'] === 'BreadcrumbList')
      ?.itemListElement.map((item) => item.name) ?? [];
  const [title, sub] = h1.split(' — ');
  const middle = crumbs.slice(1, -1);
  const kicker = middle.length ? middle.join(' · ') : '한국 서비스를 위한 React 디자인 시스템';
  const chip = path.startsWith('/korean-utils/')
    ? '@bestow-ui/korean-utils'
    : path === '/components/'
      ? '@bestow-ui/react'
      : path.startsWith('/components/')
        ? crumbs.at(-1)
        : undefined;
  return { h1, render: { kicker, chip, title, sub } };
}

async function home(browser) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(new URL('./og-image.html', import.meta.url).href);
  await page.waitForTimeout(300);
  await page.screenshot({ path: fromRoot('apps/site/public/og.png') });
  await page.close();
}

async function pages(browser) {
  const sitemap = fromRoot('apps/site/out/sitemap.xml');
  if (!existsSync(sitemap)) throw new Error('apps/site/out 이 없어요 — 먼저 pnpm build-site');
  const paths = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, loc]) => new URL(loc).pathname)
    .filter((path) => !skip.has(path));
  const dir = fromRoot('apps/site/public/og');
  rmSync(dir, { recursive: true, force: true }); // 없어진 쪽의 이미지를 남기지 않는다
  mkdirSync(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(new URL('./og-page.html', import.meta.url).href);
  const manifest = {};
  for (const path of paths) {
    const { h1, render } = pageText(path);
    await page.evaluate((data) => window.render(data), render);
    await page.evaluate(() => document.fonts.ready);
    // 제목이 넘쳐 잘리면 찍지 않는다 — 글자를 줄이거나 템플릿을 고친다
    const overflow = await page.evaluate(() => {
      const body = document.querySelector('.body');
      return body.scrollHeight > body.clientHeight + 1;
    });
    if (overflow) throw new Error(`${path}: 제목이 이미지 칸을 넘쳐요 — scripts/og-page.html 확인`);
    await page.screenshot({ path: fromRoot(`apps/site/public/${ogImageFile(path)}`) });
    manifest[path] = h1;
    console.log(`${ogImageFile(path)}  ${h1}`);
  }
  await page.close();
  writeFileSync(fromRoot('apps/site/og-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

const target = process.argv[2] ?? 'all';
const browser = await chromium.launch({ channel: 'chrome' });
try {
  if (target === 'all' || target === 'home') await home(browser);
  if (target === 'all' || target === 'pages') await pages(browser);
} finally {
  await browser.close();
}
