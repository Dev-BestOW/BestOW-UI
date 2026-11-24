// IndexNow — 배포 뒤 바뀐 쪽을 검색엔진에 바로 알린다(.github/workflows/storybook.yml). 의존성 없음(Node 22 내장 fetch).
// 네이버 서치어드바이저와 api.indexnow.org(Bing 등)에 보낸다 — 프로토콜상 한 곳에 보내면 참여 검색엔진끼리 나누지만, 주 대상인 네이버에는 직접 보낸다.
// 색인을 보장하지 않고 사이트맵을 대신하지 않는다. **바뀐 주소만** 보낸다(자주·많이 보내면 429 — 스팸으로 볼 수 있음).
//
//   node scripts/indexnow.mjs changed <새 sitemap.xml>  배포 전(build job): 지금 배포된 sitemap 과 비교해 보낼 주소를 JSON 배열로 출력
//   INDEXNOW_URLS='[…]' node scripts/indexnow.mjs submit  배포 뒤(deploy job): 키 파일이 보일 때까지 기다렸다가 보낸다
//
// "바뀐 주소" = 새로 생긴 주소, 없어진 주소, lastmod 가 바뀐 주소. lastmod 는 쪽마다 실제로 고친 날(kit.ts·guides.ts 의 modified 등 —
// apps/site/app/sitemap.ts)이라 빌드할 때마다 달라지지 않는다. 옛 sitemap 에 lastmod 가 없던 주소는 바뀌었는지 알 수 없어 보내지 않는다.
// 키는 공개 값이다(검색엔진이 https://bestow-ui.com/<KEY>.txt 를 읽어 소유를 확인). 키를 바꾸면 apps/site/public 의 파일 이름·내용도 함께 바꾼다.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const ORIGIN = 'https://bestow-ui.com';
export const KEY = '6326583d6a16688a70dd461a4f9753ef';
export const ENDPOINTS = ['https://searchadvisor.naver.com/indexnow', 'https://api.indexnow.org/indexnow'];

/** sitemap.xml → Map(주소 → lastmod 또는 null) */
export function parseSitemap(xml) {
  const entries = new Map();
  for (const [, body] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = body.match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1];
    if (!loc) continue;
    entries.set(loc, body.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1] ?? null);
  }
  return entries;
}

/** 옛·새 sitemap 을 비교해 알릴 주소 — 새로 생김·없어짐·lastmod 바뀜(둘 다 있을 때만) */
export function changedUrls(oldXml, newXml) {
  const before = parseSitemap(oldXml);
  const after = parseSitemap(newXml);
  const urls = [];
  for (const [loc, lastmod] of after) {
    if (!before.has(loc)) urls.push(loc);
    else if (lastmod && before.get(loc) && lastmod !== before.get(loc)) urls.push(loc);
  }
  for (const loc of before.keys()) if (!after.has(loc)) urls.push(loc);
  return urls.filter((url) => url.startsWith(`${ORIGIN}/`));
}

async function changed(newFile) {
  const newXml = readFileSync(newFile, 'utf8');
  const response = await fetch(`${ORIGIN}/sitemap.xml`, { signal: AbortSignal.timeout(15_000) }).catch(
    (error) => error,
  );
  if (!(response instanceof Response) || !response.ok) {
    // 지금 사이트를 읽지 못하면 무엇이 바뀌었는지 모른다 — 아무것도 보내지 않는다(배포는 계속)
    console.error(
      `::warning::배포된 sitemap.xml 을 읽지 못해 IndexNow 를 건너뜁니다 (${response?.status ?? response})`,
    );
    console.log('[]');
    return;
  }
  console.log(JSON.stringify(changedUrls(await response.text(), newXml)));
}

/** Pages 배포가 CDN 에 퍼질 때까지 키 파일을 기다린다 — 없을 때 보내면 403(키 없음) */
async function waitForKeyFile() {
  for (let attempt = 1; attempt <= 20; attempt++) {
    const response = await fetch(`${ORIGIN}/${KEY}.txt`, { cache: 'no-store' }).catch(() => null);
    if (response?.ok && (await response.text()).trim() === KEY) return true;
    await new Promise((resolve) => setTimeout(resolve, 15_000));
  }
  return false;
}

async function submit() {
  const urls = JSON.parse(process.env.INDEXNOW_URLS || '[]');
  if (urls.length === 0) {
    console.log('IndexNow: 바뀐 쪽이 없어 보내지 않습니다');
    return;
  }
  console.log(`IndexNow: ${urls.length}개\n${urls.join('\n')}`);
  if (!(await waitForKeyFile())) {
    console.error(`::warning::${ORIGIN}/${KEY}.txt 가 5분 동안 보이지 않아 IndexNow 를 건너뜁니다`);
    return;
  }
  const body = JSON.stringify({
    host: new URL(ORIGIN).host,
    key: KEY,
    keyLocation: `${ORIGIN}/${KEY}.txt`,
    urlList: urls,
  });
  for (const endpoint of ENDPOINTS) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
      signal: AbortSignal.timeout(30_000),
    }).catch((error) => error);
    // 200 받음, 202 받음(키 확인 대기). 400 형식·403 키·422 주소/키 형식·429 너무 잦음 — 배포는 이미 끝났으니 실패로 만들지 않고 경고만
    if (response instanceof Response && (response.status === 200 || response.status === 202)) {
      console.log(`${endpoint}: ${response.status}`);
    } else {
      const detail = response instanceof Response ? `${response.status} ${await response.text()}` : String(response);
      console.error(`::warning::IndexNow ${endpoint}: ${detail.slice(0, 300)}`);
    }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [command, file] = process.argv.slice(2);
  if (command === 'changed' && file) await changed(file);
  else if (command === 'submit') await submit();
  else {
    console.error('usage: indexnow.mjs changed <sitemap.xml> | submit');
    process.exit(2);
  }
}
