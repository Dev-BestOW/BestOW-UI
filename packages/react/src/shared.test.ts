import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as koreanUtils from '@bestow-ui/korean-utils';
import * as client from './client';
import * as shared from './shared';

// shared.ts 는 "use client" 없이 배포돼 서버 컴포넌트에서 실행된다(tsup.config.ts 참고).
// 그 import 그래프에 클라이언트 전용 코드가 섞이면 Next.js 서버 컴포넌트에서 렌더링·호출이 깨진다.
const srcDir = dirname(fileURLToPath(import.meta.url));

/** shared.ts 에서 상대 경로 import 를 따라가며 닿는 모든 소스 파일 */
function collectSharedGraph(): Map<string, string> {
  const files = new Map<string, string>();
  const visit = (file: string) => {
    if (files.has(file)) return;
    const code = readFileSync(file, 'utf8');
    files.set(file, code);
    // `import type` / `export type` 는 빌드에서 지워지므로 따라가지 않는다
    for (const [, spec] of code.matchAll(/^(?:import|export)(?!\s+type\s)[^'"]*?from\s+'(\.{1,2}\/[^']+)'/gm)) {
      const base = resolve(dirname(file), spec!);
      const target = ['.ts', '.tsx', '/index.ts'].map((ext) => base + ext).find((path) => existsSync(path));
      if (target) visit(target);
    }
  };
  visit(resolve(srcDir, 'shared.ts'));
  return files;
}

const CLIENT_ONLY: Array<[string, RegExp]> = [
  ["'use client'", /^['"]use client['"]/m],
  // useId 는 서버 컴포넌트에서도 된다. 나머지 hook 은 클라이언트 전용
  ['hook', /\buse(?!Id\b)[A-Z]\w*\(/],
  ['createContext', /\bcreateContext\(/],
  ['Radix', /from '@radix-ui\//],
  // 서버 컴포넌트는 함수를 요소 props 로 넘길 수 없다
  ['이벤트 핸들러', /\son[A-Z]\w*=\{/],
];

describe('shared 진입점 (서버 컴포넌트용)', () => {
  const graph = collectSharedGraph();

  it('import 그래프에 클라이언트 전용 코드(hook·Context·Radix·이벤트 핸들러·"use client")가 없다', () => {
    const violations = [...graph].flatMap(([file, code]) =>
      CLIENT_ONLY.filter(([, pattern]) => pattern.test(code.replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, ''))).map(
        ([what]) => `${file.slice(srcDir.length + 1)}: ${what}`,
      ),
    );
    expect(violations).toEqual([]);
  });

  it('표시용 컴포넌트는 shared 에서 export 한다', () => {
    expect(graph.has(resolve(srcDir, 'components/Card/Card.tsx'))).toBe(true);
    for (const name of [
      'Badge',
      'Card',
      'CardBody',
      'Container',
      'Divider',
      'FormField',
      'Grid',
      'Progress',
      'Skeleton',
      'Stack',
      'Typography',
    ]) {
      expect(shared).toHaveProperty(name);
    }
  });

  it('같은 이름을 shared 와 client 양쪽에서 export 하지 않는다 (Next.js 에서 이름이 모호해져 사라진다)', () => {
    expect(Object.keys(shared).filter((name) => name in client)).toEqual([]);
  });

  it('@bestow-ui/korean-utils 로 옮긴 함수를 예전 이름 그대로 export 한다 (1.5 이전 사용자 호환)', () => {
    for (const name of [
      'formatPhoneNumber',
      'formatBusinessNumber',
      'isValidBusinessNumber',
      'formatKoreanAmount',
      'formatKoreanDate',
      'composeExtraAddress',
    ] as const) {
      expect(shared[name]).toBe(koreanUtils[name]);
    }
  });
});
