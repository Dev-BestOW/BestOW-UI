import { defineConfig, devices } from '@playwright/test';

// 시각 회귀 테스트: 빌드된 Storybook(storybook-static)의 모든 스토리를 라이트·다크로 찍어 기준 이미지와 비교한다.
// 글꼴·안티앨리어싱이 OS 마다 달라 기준 이미지는 Linux(Playwright 공식 Docker 이미지)에서만 만든다 → __screenshots__/linux.
// 다른 OS 에서 실행하면 그 OS 폴더에 따로 저장된다(커밋하지 않음, .gitignore).
const PORT = 6007;

export default defineConfig({
  testDir: '.',
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  // github reporter: 바뀐 스토리 이름이 annotation 으로 남아 인증 없이 공개 API 로 확인할 수 있다
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    // 로컬은 시스템 Chrome, CI(Docker)는 이미지에 들어 있는 Chromium
    channel: process.env.CI ? undefined : (process.env.PLAYWRIGHT_CHANNEL ?? 'chrome'),
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.001 },
  },
  webServer: {
    command: `pnpm exec vite preview --outDir storybook-static --port ${PORT} --strictPort`,
    cwd: '..',
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
