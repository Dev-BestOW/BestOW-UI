import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test as base, type Page } from '@playwright/test';

const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

/**
 * playground E2E(apps/playground/e2e/fixtures.ts)와 같은 규칙:
 * 콘솔 경고·오류와 페이지 오류(hydration 불일치 포함)가 하나도 없어야 통과하고, page.goto 뒤에 hydration 을 기다린다.
 * 옛 주소 넘겨주기처럼 Storybook(/storybook/ — 이 앱 밖)으로 끝나는 이동은 hydration 을 기다리지 않는다.
 */
export const test = base.extend<{ problems: string[] }>({
  page: async ({ page }, provide) => {
    const goto = page.goto.bind(page);
    page.goto = async (...args) => {
      const response = await goto(...args);
      if (new URL(page.url()).pathname.includes('/storybook/')) return response;
      await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
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
      expect(problems, '콘솔 경고·오류가 없어야 한다').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** WCAG 2.2 A·AA 규칙으로 axe 를 돌려 위반 목록(규칙 id + 대상)을 돌려준다 */
export async function axeViolations(page: Page): Promise<string[]> {
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
