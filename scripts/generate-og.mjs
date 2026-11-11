// 링크 미리보기용 OG 이미지(apps/site/public/og.png, 1200×630)를 다시 만든다. 소개 사이트·Storybook·playground 가 함께 쓴다.
// scripts/og-image.html(문구 + docs/images/hero.png)을 시스템 Chrome 으로 찍는다 — 히어로 이미지나 소개 문구가 바뀌면 실행:
//   node scripts/generate-og.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const fromRoot = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
// playwright 는 storybook 앱의 의존성이라 그쪽에서 찾는다.
const { chromium } = createRequire(fromRoot('apps/storybook/package.json'))('@playwright/test');

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(new URL('./og-image.html', import.meta.url).href);
await page.waitForTimeout(300);
await page.screenshot({ path: fromRoot('apps/site/public/og.png') });
await browser.close();
