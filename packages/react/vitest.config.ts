import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      // 스타일은 실행 코드가 아니고, 스토리는 브라우저 테스트(test:stories)가 맡는다
      exclude: ['src/**/*.css.ts', 'src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}', 'src/test/**'],
    },
  },
});
