import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test as base, type Locator, type Page } from '@playwright/test';

const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

// 일부러 실패시키는 리소스 (Avatar 의 이미지 실패 → 이니셜 대체 예시)
const EXPECTED_FAILURES = [/no-such-image\.png/];
// 브라우저의 성능 안내라 기능 문제가 아닌 경고 — Firefox 는 스크롤에 맞춰 위치를 바꾸는 팝업(Radix·floating-ui)에 이 안내를 남긴다
const BROWSER_ADVISORIES = [/scroll-linked positioning effect/];

/**
 * 모든 테스트에서 콘솔 경고·오류와 페이지 오류(hydration 불일치 포함)를 모아, 테스트가 끝날 때 하나도 없어야 통과한다.
 * React 19 운영 빌드는 hydration 불일치를 콘솔 오류나 reportError(pageerror)로 알린다.
 */
export const test = base.extend<{ problems: string[] }>({
  problems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('console', (message) => {
        if (message.type() !== 'error' && message.type() !== 'warning') return;
        const url = message.location().url;
        if (message.text().startsWith('Failed to load resource') && EXPECTED_FAILURES.some((re) => re.test(url)))
          return;
        if (BROWSER_ADVISORIES.some((re) => re.test(message.text()))) return;
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

/** WCAG 2.2 A·AA 규칙으로 axe 를 돌려 위반 목록(규칙 id + 첫 대상)을 돌려준다 */
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

/** 헤더의 토글로 다크 모드·보라 브랜드 테마로 바꾼다 */
export async function useDarkBrand(page: Page) {
  await page.getByRole('button', { name: '다크 모드로 전환' }).click();
  await page.getByRole('button', { name: '브랜드: 기본' }).click();
  await expect(page.getByRole('button', { name: '라이트 모드로 전환' })).toBeVisible();
}

/** 요소(또는 배경이 있는 가장 가까운 조상)의 배경색 [r, g, b] */
export async function backgroundOf(locator: Locator): Promise<number[]> {
  return locator.evaluate((element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const color = getComputedStyle(node).backgroundColor;
      const [r, g, b, a = 1] = color.match(/[\d.]+/g)!.map(Number);
      if (a > 0) return [r!, g!, b!];
    }
    return [255, 255, 255];
  });
}

/** WCAG 상대 휘도 */
export function luminance([r, g, b]: number[]): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!);
}

export function contrast(a: number[], b: number[]): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
}
