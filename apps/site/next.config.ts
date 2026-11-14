import type { NextConfig } from 'next';

// 소개 사이트 — GitHub Pages 루트(사용자 도메인 https://bestow-ui.com/)에 정적 export 한다.
// Storybook 은 /storybook/, 예제 앱은 /playground/ 에 함께 올린다(.github/workflows/storybook.yml).
// basePath 는 Pages 와 같게 기본 ''(도메인 루트) — E2E(e2e/serve.mjs)도 같은 경로로 띄워 실제 주소 구조로 확인한다.
// 배포 때는 storybook.yml 이 configure-pages 의 base_path 를 넘긴다(사용자 도메인이면 '', 없으면 /BestOW-UI).
const basePath = process.env.SITE_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true, // 정적 호스팅에서 /korean-utils/ → korean-utils/index.html 로 찾도록
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
