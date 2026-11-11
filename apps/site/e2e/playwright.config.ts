import { defineConfig, devices } from '@playwright/test';

// 소개 사이트 E2E: 정적 export 결과(out)를 Pages 와 같은 주소 구조(/BestOW-UI/…)로 띄워
// 콘솔·hydration 오류, axe(라이트·다크), 데모 입력, 옛 Storybook 주소 넘겨주기를 확인한다.
// 먼저 `pnpm build && pnpm build-site` 가 필요하다. playground E2E(3107)·사용자 dev 서버(3000)와 겹치지 않게 3108.
const PORT = 3108;
const browsers = (process.env.E2E_BROWSERS ?? 'chromium').split(',').map((name) => name.trim());
const desktop = { chromium: 'Desktop Chrome', webkit: 'Desktop Safari', firefox: 'Desktop Firefox' } as const;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: browsers.map((browser) => ({
    name: browser,
    use: {
      ...devices[desktop[browser as keyof typeof desktop]],
      viewport: { width: 1280, height: 900 },
      // Chromium 은 로컬에서 시스템 Chrome, CI 는 `playwright install` 로 받은 Chromium
      channel: browser === 'chromium' && !process.env.CI ? (process.env.PLAYWRIGHT_CHANNEL ?? 'chrome') : undefined,
    },
  })),
  webServer: {
    command: `node e2e/serve.mjs ${PORT}`,
    cwd: '..',
    url: `http://localhost:${PORT}/BestOW-UI/`,
    reuseExistingServer: !process.env.CI,
  },
});
