import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { mergeConfig } from 'vite';

const fromRoot = (path: string) => fileURLToPath(new URL(`../../../${path}`, import.meta.url));

const config: StorybookConfig = {
  stories: ['../../../packages/*/src/**/*.mdx', '../../../packages/*/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [vanillaExtractPlugin()],
      // 빌드 결과물(dist)이 아닌 소스를 바로 보도록 워크스페이스 패키지를 src 로 연결한다.
      resolve: {
        alias: {
          '@bestow/react': fromRoot('packages/react/src/index.ts'),
          '@bestow/tokens': fromRoot('packages/tokens/src/index.ts'),
        },
      },
    }),
};

export default config;
