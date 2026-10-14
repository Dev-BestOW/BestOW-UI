import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  // Next.js App Router 등 RSC 환경에서 클라이언트 컴포넌트로 인식되도록 한다.
  banner: { js: '"use client";' },
  esbuildPlugins: [vanillaExtractPlugin({ identifiers: 'short' })],
});
