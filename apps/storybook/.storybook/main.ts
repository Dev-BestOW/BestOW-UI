import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { mergeConfig } from 'vite';

const fromRoot = (path: string) => fileURLToPath(new URL(`../../../${path}`, import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../../../packages/*/src/**/*.mdx',
    '../../../packages/*/src/**/*.stories.@(ts|tsx)',
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [vanillaExtractPlugin()],
      // 실행 중에 늦게 발견되는 의존성. 미리 최적화하지 않으면 Vite 가 페이지를 다시 불러와
      // 스토리 테스트(캐시 없는 CI 첫 실행)에서 그 시점의 테스트 파일이 실패한다.
      // recipes 는 react 패키지의 의존성이라 루트에서 바로 찾을 수 없어 'react 패키지 > 의존성' 형식으로 지정한다.
      optimizeDeps: { include: ['@bestow-ui/react > @vanilla-extract/recipes/createRuntimeFn'] },
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
