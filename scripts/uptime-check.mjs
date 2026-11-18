// 배포된 사이트 감시 — .github/workflows/uptime.yml 이 6시간마다 돌린다. 하나라도 실패하면 exit 1 → GitHub 가 메일로 알린다.
// 로컬: node scripts/uptime-check.mjs  (의존성 없음, Node 22 내장 fetch·tls)
//   - 주요 주소가 200 이고 내용이 비지 않았는지 (Pages 가 빈 쪽이나 404 를 내면 잡는다)
//   - 옛 주소·http·www 가 https://bestow-ui.com 으로 301 하는지 (npm README·블로그에 남은 링크)
//   - 인증서가 14일 넘게 남았는지 (GitHub Pages 가 Let's Encrypt 로 자동 갱신 — 갱신이 멈추면 잡는다)
//   - /.well-known/security.txt 의 Expires 가 30일 넘게 남았는지 (원본 apps/site/public/.well-known/security.txt)
import { connect } from 'node:tls';

const ORIGIN = 'https://bestow-ui.com';
const HOST = 'bestow-ui.com';
const DAY = 86_400_000;
export const CERT_MIN_DAYS = 14;
export const SECURITY_TXT_MIN_DAYS = 30;

/** [경로, 응답에 들어 있어야 할 글자] */
const pages = [
  ['/', 'BestOW UI'],
  ['/storybook/', 'storybook'],
  ['/playground/', 'BestOW'],
  ['/components/', 'BestOW UI'],
  ['/korean-utils/', 'BestOW UI'],
  ['/sitemap.xml', '<urlset'],
  ['/robots.txt', 'Sitemap:'],
  ['/llms.txt', 'BestOW UI'],
  ['/.well-known/security.txt', 'Contact:'],
];

/** [요청 주소, 넘겨받아야 할 주소] */
const redirects = [
  ['http://bestow-ui.com/', `${ORIGIN}/`],
  ['https://www.bestow-ui.com/', `${ORIGIN}/`],
  ['https://dev-bestow.github.io/BestOW-UI/', `${ORIGIN}/`],
];

/** 잠깐의 네트워크 오류로 알림이 오지 않게 세 번까지 다시 시도한다 */
async function retry(task) {
  let error;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await task();
    } catch (caught) {
      error = caught;
      await new Promise((resolve) => setTimeout(resolve, 5_000 * (attempt + 1)));
    }
  }
  throw error;
}

const fetchWithTimeout = (url, init = {}) => fetch(url, { ...init, signal: AbortSignal.timeout(20_000) });

async function checkPage([path, marker]) {
  return retry(async () => {
    const response = await fetchWithTimeout(`${ORIGIN}${path}`);
    if (response.status !== 200) throw new Error(`${path} → ${response.status}`);
    const text = await response.text();
    if (!text.includes(marker)) throw new Error(`${path} 에 "${marker}" 가 없음 (${text.length}자)`);
    return `${path} 200`;
  });
}

async function checkRedirect([from, to]) {
  return retry(async () => {
    const response = await fetchWithTimeout(from, { redirect: 'manual' });
    const location = response.headers.get('location');
    if (response.status !== 301 || location !== to) {
      throw new Error(`${from} → ${response.status} ${location ?? '(location 없음)'} (기대: 301 ${to})`);
    }
    return `${from} → 301 ${to}`;
  });
}

/** 인증서 만료까지 남은 날 */
export function daysUntil(date, now = Date.now()) {
  return (new Date(date).getTime() - now) / DAY;
}

async function checkCertificate() {
  return retry(
    () =>
      new Promise((resolve, reject) => {
        const socket = connect({ host: HOST, port: 443, servername: HOST, timeout: 20_000 }, () => {
          const { valid_to: validTo, subjectaltname: names = '' } = socket.getPeerCertificate();
          socket.end();
          const days = daysUntil(validTo);
          if (!names.split(', ').includes(`DNS:${HOST}`)) reject(new Error(`인증서에 ${HOST} 가 없음 (${names})`));
          else if (days < CERT_MIN_DAYS) reject(new Error(`인증서가 ${days.toFixed(1)}일 남음 (${validTo})`));
          else resolve(`인증서 ${days.toFixed(0)}일 남음 (${validTo})`);
        });
        socket.on('error', reject);
        socket.on('timeout', () => socket.destroy(new Error('TLS 연결 시간 초과')));
      }),
  );
}

/** security.txt 의 Expires 값 (없으면 null) */
export function securityTxtExpires(text) {
  return /^Expires: (.+)$/m.exec(text)?.[1]?.trim() ?? null;
}

async function checkSecurityTxt() {
  return retry(async () => {
    const response = await fetchWithTimeout(`${ORIGIN}/.well-known/security.txt`);
    const expires = securityTxtExpires(await response.text());
    if (!expires) throw new Error('security.txt 에 Expires 가 없음');
    const days = daysUntil(expires);
    if (!(days >= SECURITY_TXT_MIN_DAYS)) {
      throw new Error(
        `security.txt 만료까지 ${days.toFixed(1)}일 (${expires}) — apps/site/public/.well-known/security.txt 의 Expires 를 1년 안쪽으로 고쳐 주세요`,
      );
    }
    return `security.txt ${days.toFixed(0)}일 남음`;
  });
}

async function main() {
  const checks = [
    ...pages.map((page) => [`쪽 ${page[0]}`, () => checkPage(page)]),
    ...redirects.map((redirect) => [`넘겨주기 ${redirect[0]}`, () => checkRedirect(redirect)]),
    ['인증서', checkCertificate],
    ['security.txt 만료', checkSecurityTxt],
  ];
  const results = await Promise.all(
    checks.map(async ([name, run]) => {
      try {
        return { name, ok: true, detail: await run() };
      } catch (error) {
        return { name, ok: false, detail: error instanceof Error ? error.message : String(error) };
      }
    }),
  );
  for (const { ok, detail } of results) {
    console.log(ok ? `✓ ${detail}` : `::error::${detail}`);
  }
  const failed = results.filter((result) => !result.ok);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFileSync } = await import('node:fs');
    const rows = results.map(({ name, ok, detail }) => `| ${ok ? '✅' : '❌'} | ${name} | ${detail} |`).join('\n');
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## 사이트 감시\n\n| | 항목 | 결과 |\n|---|---|---|\n${rows}\n`);
  }
  console.log(failed.length ? `\n${failed.length}개 실패` : `\n모두 정상 (${results.length}개)`);
  process.exitCode = failed.length ? 1 : 0;
}

// 테스트에서 import 할 때는 실행하지 않는다
if (import.meta.url === `file://${process.argv[1]}`) await main();
