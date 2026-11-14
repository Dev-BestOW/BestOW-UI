import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { mergeConfig, type Plugin } from 'vite';
import { wrapInLayer } from '../../../packages/react/src/styles/cssLayer.ts';

const fromRoot = (path: string) => fileURLToPath(new URL(`../../../${path}`, import.meta.url));

/**
 * 배포하는 dist/index.css 처럼 vanilla-extract 가 만든 CSS 를 `@layer bestow` 로 감싼다 — Storybook·스토리 테스트·시각 회귀가
 * 실제 설치와 같은 우선순위로 그려지게(packages/react/src/styles/cssLayer.ts). vite:css 보다 먼저 CSS 그대로를 받으려고 pre.
 */
const bestowCssLayer: Plugin = {
  name: 'bestow-css-layer',
  enforce: 'pre',
  transform(code, id) {
    if (/\.vanilla\.css(\?|$)/.test(id)) return { code: wrapInLayer(code), map: null };
  },
};

// `title` 은 Storybook 타입에 없는 프리셋 값이다 — 없으면 package.json 의 name 을 써서 페이지 제목이 "storybook - Storybook" 이 된다
// (검색 결과·링크 미리보기에 그대로 보임). 빌드한 index.html 의 <title> 로 확인한다. 설명·OG 태그는 manager-head.html.
const config: StorybookConfig & { title: string } = {
  title: 'BestOW UI — 한국 서비스를 위한 접근성 검증 React 디자인 시스템',
  stories: [
    '../../../packages/*/src/**/*.mdx',
    '../../../packages/*/src/**/*.stories.@(ts|tsx)',
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
  ],
  // public/llms.txt(직접 작성)·llms-full.txt(빌드 때 scripts/generate-llms.mjs 가 생성) — AI 코딩 도구용 문서.
  // 배포 때 Pages 루트로도 복사한다(scripts/assemble-pages.sh). 링크 미리보기 이미지·sitemap 은 소개 사이트(apps/site/public)에.
  staticDirs: ['../public'],
  // 방문 통계(Cloudflare Web Analytics, 쿠키 없음) — 배포 빌드에서만 저장소 변수 CF_WEB_ANALYTICS_TOKEN 이 들어온다.
  // head 에는 manager-head.html 이 이미 들어 있다. 로컬·CI 빌드는 토큰이 없어 그대로(apps/site/app/analytics.tsx 와 같은 규칙)
  managerHead: (head: string | undefined = '') => {
    const token = process.env.CF_WEB_ANALYTICS_TOKEN;
    if (!token) return head;
    if (!/^[0-9a-f]{32}$/.test(token)) throw new Error('CF_WEB_ANALYTICS_TOKEN 형식이 아니에요(16진수 32자)');
    return `${head}\n<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${token}"}'></script>`;
  },
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [vanillaExtractPlugin(), bestowCssLayer],
      // 실행 중에 늦게 발견되는 의존성. 미리 최적화하지 않으면 Vite 가 페이지를 다시 불러와
      // 스토리 테스트(캐시 없는 CI 첫 실행)에서 그 시점의 테스트 파일이 실패한다.
      // recipes 는 react 패키지의 의존성이라 루트에서 바로 찾을 수 없어 'react 패키지 > 의존성' 형식으로 지정한다.
      optimizeDeps: {
        include: ['@bestow-ui/react > @vanilla-extract/recipes/createRuntimeFn', '@tanstack/react-table'],
      },
      // 빌드 결과물(dist)이 아닌 소스를 바로 보도록 워크스페이스 패키지를 src 로 연결한다.
      resolve: {
        alias: {
          '@bestow-ui/icons': fromRoot('packages/icons/src/index.ts'),
          '@bestow-ui/korean-utils': fromRoot('packages/korean-utils/src/index.ts'),
          '@bestow-ui/react': fromRoot('packages/react/src/index.ts'),
          '@bestow-ui/tokens': fromRoot('packages/tokens/src/index.ts'),
        },
      },
    }),
};

export default config;
