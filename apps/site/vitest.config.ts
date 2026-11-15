import { defineConfig } from 'vitest/config';

// 빌드 때 소스를 읽는 서버 전용 코드(app/components/source.ts)의 단위 테스트. 화면은 e2e/ 의 Playwright 가 본다.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['app/**/*.test.ts'],
  },
});
