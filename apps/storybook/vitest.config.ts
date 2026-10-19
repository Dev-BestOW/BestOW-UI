import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// 모든 스토리를 실제 브라우저에서 렌더링하고, play 함수와 axe 접근성 검사(preview 의 a11y.test: 'error')를 실행한다.
// 라이트·다크 테마를 각각 하나의 project 로 돌린다 (툴바 theme global 을 project 마다 고정) — 다크 색 대비도 axe 가 검사한다.
// 브라우저는 STORYBOOK_BROWSERS(쉼표 구분: chromium,webkit,firefox)로 고른다. 기본 chromium — CI 는 브라우저마다 job 을 나눈다.
// Chromium 은 로컬에서 브라우저 다운로드 없이 시스템 Chrome 을 쓴다. CI 는 `playwright install` 로 받은 브라우저를 쓴다.
// 다른 채널을 쓰려면 PLAYWRIGHT_CHANNEL 을 지정한다 (빈 문자열이면 Playwright 기본 Chromium). WebKit·Firefox 는 채널이 없다.
const channel = process.env.PLAYWRIGHT_CHANNEL ?? (process.env.CI ? '' : 'chrome');
const browsers = (process.env.STORYBOOK_BROWSERS ?? 'chromium').split(',').map((name) => name.trim()) as Array<
  'chromium' | 'webkit' | 'firefox'
>;

const themes = ['light', 'dark'] as const;

export default defineConfig({
  test: {
    setupFiles: [path.join(dirname, '.storybook/vitest.setup.ts')],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: browsers.map((browser) => ({
        browser,
        provider: playwright({ launchOptions: browser === 'chromium' && channel ? { channel } : {} }),
      })),
    },
    projects: themes.map((theme) => ({
      extends: true,
      plugins: [storybookTest({ configDir: path.join(dirname, '.storybook'), initialGlobals: { theme } })],
      test: { name: `storybook-${theme}` },
    })),
  },
});
