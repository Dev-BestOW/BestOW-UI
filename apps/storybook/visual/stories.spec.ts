import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
  tags?: string[];
}

// build-storybook 결과의 스토리 목록. 먼저 `pnpm build-storybook` 이 필요하다.
const indexPath = fileURLToPath(new URL('../storybook-static/index.json', import.meta.url));
const { entries } = JSON.parse(readFileSync(indexPath, 'utf8')) as { entries: Record<string, IndexEntry> };

// 스크린샷에서 뺄 스토리는 tags: ['!visual'] 로 표시한다.
const stories = Object.values(entries).filter((entry) => entry.type === 'story' && !entry.tags?.includes('!visual'));

for (const theme of ['light', 'dark'] as const) {
  test.describe(theme, () => {
    for (const story of stories) {
      test(`${story.title} / ${story.name}`, async ({ page }) => {
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);
        await page.locator('#storybook-root').waitFor();
        // play 가 있는 스토리(목록·대화상자를 연 상태)는 play 가 끝난 뒤 찍는다
        await page.waitForFunction(() => {
          const preview = (window as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } })
            .__STORYBOOK_PREVIEW__;
          return ['finished', 'errored', 'aborted'].includes(preview?.currentRender?.phase ?? '');
        });
        // 글꼴·이미지 로딩이 끝난 뒤 찍는다
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            Array.from(document.images)
              .filter((img) => !img.complete)
              .map((img) => new Promise((resolve) => img.addEventListener('loadend', resolve, { once: true }))),
          );
        });
        await expect(page).toHaveScreenshot(`${story.id}--${theme}.png`, { fullPage: true });
      });
    }
  });
}
