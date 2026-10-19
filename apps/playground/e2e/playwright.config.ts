import { defineConfig, devices } from '@playwright/test';

// playground E2E: 실제 설치와 같은 조건(패키지 dist)으로 빌드한 Next.js 앱을 브라우저로 열어
// 콘솔·hydration 오류, axe 접근성(라이트·다크·브랜드), portal 테마, 키보드 시나리오를 확인한다.
// 먼저 `pnpm build && pnpm build-playground` 가 필요하다. 사용자의 dev 서버(3000)와 겹치지 않게 3107 을 쓴다.
const PORT = 3107;
// 브라우저는 E2E_BROWSERS(쉼표 구분: chromium,webkit,firefox)로 고른다. 기본 chromium — CI 는 브라우저마다 job 을 나눈다.
const browsers = (process.env.E2E_BROWSERS ?? 'chromium').split(',').map((name) => name.trim());
const desktop = { chromium: 'Desktop Chrome', webkit: 'Desktop Safari', firefox: 'Desktop Firefox' } as const;
// 모바일(터치·좁은 화면) 프로젝트 — mobile.spec.ts 만 돈다. Playwright 는 Firefox 모바일 에뮬레이션을 지원하지 않는다
const mobile = { chromium: 'Pixel 7', webkit: 'iPhone 15' } as const;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // CI 의 github reporter 는 실패한 테스트·오류를 annotation 으로 남긴다 — 로그는 인증이 필요하지만 annotation 은 공개 API 로 읽힌다
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: browsers.flatMap((browser) => {
    // Chromium 은 로컬에서 시스템 Chrome, CI 는 `playwright install` 로 받은 Chromium
    const channel =
      browser === 'chromium' && !process.env.CI ? (process.env.PLAYWRIGHT_CHANNEL ?? 'chrome') : undefined;
    const projects = [
      {
        name: browser,
        testIgnore: /mobile\.spec\.ts/,
        use: { ...devices[desktop[browser as keyof typeof desktop]], viewport: { width: 1280, height: 900 }, channel },
      },
    ];
    const device = mobile[browser as keyof typeof mobile];
    if (device)
      projects.push({
        name: `${browser}-mobile`,
        testMatch: /mobile\.spec\.ts/,
        use: { ...devices[device], channel },
      } as never);
    return projects;
  }),
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    cwd: '..',
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
