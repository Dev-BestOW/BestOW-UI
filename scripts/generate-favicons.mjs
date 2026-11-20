// 소개 사이트 파비콘(apps/site/public/icon.svg)을 PNG·ICO 로 만든다 — 구글이 받는 파비콘 형식 목록에 SVG 가 없어서
// (korean-seo 스킬, 2026-11-20). icon.svg 를 시스템 Chrome 으로 찍는다 — 아이콘 모양이 바뀌면 실행:
//   node scripts/generate-favicons.mjs
// - icon-96.png: layout.tsx 의 `<link rel="icon">`(구글 권장 48px 넘게, 네이버 권장 32px 이상)
// - favicon.ico: link 를 못 읽는 도구가 찾는 /favicon.ico (32·48px PNG 를 담은 ICO)
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const fromRoot = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
// playwright 는 storybook 앱의 의존성이라 그쪽에서 찾는다(generate-og.mjs 와 같음).
const { chromium } = createRequire(fromRoot('apps/storybook/package.json'))('@playwright/test');

const svg = readFileSync(fromRoot('apps/site/public/icon.svg'), 'utf8');
const browser = await chromium.launch({ channel: 'chrome' });

async function png(size) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  );
  const buffer = await page.screenshot({ omitBackground: true });
  await page.close();
  return buffer;
}

/** PNG 를 그대로 담은 ICO(Windows Vista 이후·모든 브라우저가 읽음) */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // 예약
  header.writeUInt16LE(1, 2); // 1 = 아이콘
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // 색 팔레트 없음
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4); // 색 평면
    entry.writeUInt16LE(32, 6); // 픽셀당 비트
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

writeFileSync(fromRoot('apps/site/public/icon-96.png'), await png(96));
writeFileSync(
  fromRoot('apps/site/public/favicon.ico'),
  ico([
    { size: 32, data: await png(32) },
    { size: 48, data: await png(48) },
  ]),
);
await browser.close();
