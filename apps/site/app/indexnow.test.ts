import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// 배포 워크플로가 부르는 스크립트(저장소 루트 scripts/) — 바뀐 쪽만 골라 보내는지 여기서 확인한다
import { changedUrls, KEY, parseSitemap } from '../../../scripts/indexnow.mjs';

const sitemap = (entries: [string, string?][]) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(([loc, lastmod]) => `<url>\n<loc>${loc}</loc>\n${lastmod ? `<lastmod>${lastmod}</lastmod>\n` : ''}</url>`)
    .join('\n')}\n</urlset>`;

const a = 'https://bestow-ui.com/components/amount-input/';
const b = 'https://bestow-ui.com/components/calendar/';
const home = 'https://bestow-ui.com/';

describe('IndexNow 로 알릴 주소', () => {
  it('sitemap 의 loc·lastmod 를 읽는다', () => {
    expect([...parseSitemap(sitemap([[home], [a, '2026-11-18']]))]).toEqual([
      [home, null],
      [a, '2026-11-18'],
    ]);
  });

  it('lastmod 가 바뀐 주소만 — 그대로인 쪽·날짜 없는 쪽은 보내지 않는다', () => {
    const before = sitemap([[home], [a, '2026-11-18'], [b, '2026-11-17']]);
    const after = sitemap([[home], [a, '2026-11-25'], [b, '2026-11-17']]);
    expect(changedUrls(before, after)).toEqual([a]);
  });

  it('새로 생긴 주소와 없어진 주소도 보낸다', () => {
    const before = sitemap([[home], [a, '2026-11-18']]);
    const after = sitemap([[home], [b, '2026-11-17']]);
    expect(changedUrls(before, after)).toEqual([b, a]);
  });

  it('옛 sitemap 에 lastmod 가 없던 주소는 바뀌었는지 몰라 보내지 않는다(도입 첫 배포)', () => {
    expect(changedUrls(sitemap([[home], [a]]), sitemap([[home], [a, '2026-11-18']]))).toEqual([]);
  });

  it('다른 호스트 주소는 보내지 않는다(422)', () => {
    expect(changedUrls(sitemap([]), sitemap([['https://example.com/x/']]))).toEqual([]);
  });

  it('키 파일이 public 에 있고 내용이 키와 같다 — 검색엔진이 이 파일로 소유를 확인한다', () => {
    expect(KEY).toMatch(/^[0-9a-f]{8,128}$/);
    expect(readFileSync(new URL(`../public/${KEY}.txt`, import.meta.url), 'utf8').trim()).toBe(KEY);
  });
});
