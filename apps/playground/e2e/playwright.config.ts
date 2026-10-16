import { defineConfig, devices } from '@playwright/test';

// playground E2E: 실제 설치와 같은 조건(패키지 dist)으로 빌드한 Next.js 앱을 브라우저로 열어
// 콘솔·hydration 오류, axe 접근성(라이트·다크·브랜드), portal 테마, 키보드 시나리오를 확인한다.
// 먼저 `pnpm build && pnpm build-playground` 가 필요하다. 사용자의 dev 서버(3000)와 겹치지 않게 3107 을 쓴다.
const PORT = 3107;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    // 로컬은 시스템 Chrome, CI 는 `playwright install chromium` 으로 받은 Chromium
    channel: process.env.CI ? undefined : (process.env.PLAYWRIGHT_CHANNEL ?? 'chrome'),
  },
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    cwd: '..',
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
