import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// 모든 스토리를 실제 브라우저(Chromium)에서 렌더링하고, play 함수와 axe 접근성 검사(preview 의 a11y.test: 'error')를 실행한다.
// 로컬에서는 브라우저 다운로드 없이 시스템 Chrome 을 쓴다. CI 는 `playwright install chromium` 으로 받은 Chromium 을 쓴다.
// 다른 채널을 쓰려면 PLAYWRIGHT_CHANNEL 을 지정한다 (빈 문자열이면 Playwright 기본 Chromium).
const channel = process.env.PLAYWRIGHT_CHANNEL ?? (process.env.CI ? '' : 'chrome');

export default defineConfig({
  plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions: channel ? { channel } : {} }),
      instances: [{ browser: 'chromium' }],
    },
  },
});
