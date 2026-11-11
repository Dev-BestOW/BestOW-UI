import type { NextConfig } from 'next';

// 소개 사이트 — GitHub Pages 루트(https://dev-bestow.github.io/BestOW-UI/)에 정적 export 한다.
// Storybook 은 /storybook/, 예제 앱은 /playground/ 에 함께 올린다(.github/workflows/storybook.yml).
// basePath 는 Pages 와 같게 기본 /BestOW-UI — E2E(e2e/serve.mjs)도 같은 경로로 띄워 실제 주소 구조로 확인한다.
const basePath = process.env.SITE_BASE_PATH ?? '/BestOW-UI';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true, // 정적 호스팅에서 /korean-utils/ → korean-utils/index.html 로 찾도록
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
