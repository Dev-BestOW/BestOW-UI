// E2E 용 정적 서버 — GitHub Pages(https://bestow-ui.com/)와 같은 주소 구조로 띄운다.
//   /            → apps/site/out (next build 결과)
//   /storybook/  → e2e/fixtures/storybook (옛 주소 넘겨주기 확인용 가짜 Storybook)
// next start 는 output: 'export' 를 띄우지 못하고, 서버 리다이렉트가 없는 정적 호스팅을 그대로 흉내 내려고 직접 만든다.
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.argv[2] ?? 3108);
const here = fileURLToPath(new URL('.', import.meta.url));
const roots = [
  { prefix: '/storybook/', dir: join(here, 'fixtures/storybook') },
  { prefix: '/', dir: join(here, '../out') },
];
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

function findFile(dir, relative) {
  const candidates = [relative, join(relative, 'index.html'), `${relative}.html`];
  for (const candidate of candidates) {
    const path = normalize(join(dir, candidate));
    if (!path.startsWith(dir)) return null; // ../ 로 폴더 밖을 읽지 않게
    try {
      if (statSync(path).isFile()) return path;
    } catch {
      // 다음 후보
    }
  }
  return null;
}

createServer((request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  const root = roots.find(({ prefix }) => pathname.startsWith(prefix));
  const file = root && findFile(root.dir, decodeURIComponent(pathname.slice(root.prefix.length)));
  if (!file) {
    response.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
    return;
  }
  response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
}).listen(port, () => console.log(`site e2e server http://localhost:${port}/`));
