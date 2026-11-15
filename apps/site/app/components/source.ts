// 컴포넌트 문서 쪽이 빌드 때 저장소 소스에서 읽어 오는 것 — 서버 컴포넌트(정적 export)에서만 부른다(fs).
// 글과 코드가 어긋나지 않게 props 는 react 소스, 키보드·스크린리더는 componentA11y.ts, 선택 기준은 choosing.ts 에서 가져온다.
// 찾지 못하면 빈 절을 배포하지 않도록 throw 해 빌드를 멈춘다(source.test.ts).
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { publicTypes } from '../../../../scripts/lib/public-types.mjs';
import { componentA11y, type ComponentA11y } from '../../../storybook/stories/accessibility/componentA11y';
import { choosing } from '../../../storybook/stories/guides/choosing';

/** 저장소 루트(pnpm-workspace.yaml 이 있는 곳) — next build·vitest 모두 apps/site 에서 실행된다 */
function repoRoot(): string {
  let dir = process.cwd();
  while (!existsSync(join(dir, 'pnpm-workspace.yaml'))) {
    const parent = dirname(dir);
    if (parent === dir) throw new Error('저장소 루트(pnpm-workspace.yaml)를 찾지 못했어요');
    dir = parent;
  }
  return dir;
}

/** `packages/react/src/components/<name>/<name>.tsx` 의 공개 타입(JSDoc 포함). `<name>Props` 가 없으면 throw */
export function componentProps(name: string): string {
  const path = join(repoRoot(), 'packages/react/src/components', name, `${name}.tsx`);
  if (!existsSync(path)) throw new Error(`${name}: 소스 파일이 없어요 (${path})`);
  const types = publicTypes(readFileSync(path, 'utf8'));
  if (!types.includes(`export interface ${name}Props`)) {
    throw new Error(`${name}: ${path} 에 export interface ${name}Props 가 없어요`);
  }
  return types;
}

/** componentA11y.ts 에서 이름이 낱말로 정확히 같은 항목('A · B · C' 묶음은 나눠서 비교). 없으면 throw */
export function componentA11yFor(name: string): ComponentA11y {
  for (const group of componentA11y) {
    const item = group.items.find((entry) => entry.name.split(' · ').includes(name));
    if (item) return item;
  }
  throw new Error(`${name}: componentA11y.ts 에 항목이 없어요`);
}

/** choosing.ts("언제 무엇을 쓰나")의 선택 기준 — 없는 컴포넌트도 있다 */
export function choosingFor(name: string): { when: string; avoid?: string } | undefined {
  for (const group of choosing) {
    const item = group.items.find((entry) => entry.name === name);
    if (item) return { when: item.when, avoid: item.avoid };
  }
  return undefined;
}
