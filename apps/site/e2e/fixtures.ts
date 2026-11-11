import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test as base, type Page } from '@playwright/test';

const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

/**
 * playground E2E(apps/playground/e2e/fixtures.ts)와 같은 규칙:
 * 콘솔 경고·오류와 페이지 오류(hydration 불일치 포함)가 하나도 없어야 통과하고, page.goto 뒤에 hydration 을 기다린다.
 * 옛 주소 넘겨주기처럼 Storybook(/storybook/ — 이 앱 밖)으로 끝나는 이동은 hydration 을 기다리지 않는다.
 * WebKit 은 넘겨주기 스크립트가 돌기 전에 goto 가 끝나 주소가 아직 루트다 — 그래서 "hydration" 과 "/storybook/ 도착" 중 먼저 오는 것을 기다린다.
 */
const STORYBOOK = /\/storybook\//;

/**
 * 브라우저가 우리 코드와 상관없이 남기는 경고. 넘겨주기 테스트(Firefox)에서만 나왔다.
 * - bounce tracker: 사용자 조작 없이 곧바로 다른 주소로 넘기는 페이지에 Firefox 가 붙이는 개인정보 보호 안내
 * - Loading failed for the <script>: 넘겨주는 순간 아직 받던 루트 페이지의 스크립트가 끊김(/storybook/ 에 도착했을 때만 무시)
 */
function isBrowserNoise(text: string, finalUrl: string) {
  if (text.includes('has been classified as a bounce tracker')) return true;
  return text.includes('Loading failed for the <script>') && STORYBOOK.test(new URL(finalUrl).pathname);
}

export const test = base.extend<{ problems: string[] }>({
  page: async ({ page }, provide) => {
    const goto = page.goto.bind(page);
    page.goto = async (...args) => {
      const response = await goto(...args);
      if (STORYBOOK.test(new URL(page.url()).pathname)) return response;
      const hydrated = page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
      const redirected = page.waitForURL((url) => STORYBOOK.test(url.pathname));
      // 진 쪽은 페이지가 닫힐 때 거부된다 — 처리되지 않은 거부로 테스트가 깨지지 않게
      hydrated.catch(() => {});
      redirected.catch(() => {});
      await Promise.race([hydrated, redirected]);
      return response;
    };
    await provide(page);
  },
  problems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('console', (message) => {
        if (message.type() !== 'error' && message.type() !== 'warning') return;
        problems.push(`${message.type()}: ${message.text()}`);
      });
      page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
      await use(problems);
      const finalUrl = page.url();
      expect(
        problems.filter((text) => !isBrowserNoise(text, finalUrl)),
        '콘솔 경고·오류가 없어야 한다',
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** WCAG 2.2 A·AA 규칙으로 axe 를 돌려 위반 목록(규칙 id + 대상)을 돌려준다 */
export async function axeViolations(page: Page): Promise<string[]> {
  // 색 전환(Link·Button 의 transition)이 도는 중에 재면 라이트·다크 중간색으로 대비가 모자라게 나온다 —
  // 다크 모드 토글 직후 CI WebKit 에서 color-contrast 로 실패했다. 끝나는 애니메이션만 기다린다(무한 반복 제외)
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => {})),
    ),
  );
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async () => {
    const result = await (
      window as unknown as {
        axe: {
          run: (
            context: Document,
            options: object,
          ) => Promise<{ violations: { id: string; nodes: { target: string[] }[] }[] }>;
        };
      }
    ).axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    });
    return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  });
}
