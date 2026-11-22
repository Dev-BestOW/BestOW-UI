import { describe, expect, test } from 'vitest';
import { koreanDay, parseChangelog } from './changelog';

const sample = `# @bestow-ui/react

## 2.2.0

### Minor Changes

- c28dc18: AgreementGroup 에 하위 항목을 추가했어요.
- 198897f: \`MultiCombobox\` 추가 — 여러 개를 고르는 선택 상자.
  
  - 고른 값은 칩으로 보인다.
  - \`maxSelected\` 를 넘으면
    나머지 항목이 비활성이 된다.

### Patch Changes

- a1fb2bd: 토요일 선택 색 수정.
- Updated dependencies [7a57c90]
  - @bestow-ui/tokens@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [b574862]
  - @bestow-ui/korean-utils@0.5.0
`;

describe('parseChangelog', () => {
  const releases = parseChangelog(sample);

  test('버전과 종류별 항목, 커밋 해시는 뺀다', () => {
    expect(releases.map((r) => r.version)).toEqual(['2.2.0', '2.1.1']);
    expect(releases[0]!.sections.map((s) => s.kind)).toEqual(['minor', 'patch']);
    expect(releases[0]!.sections[0]!.items[0]).toBe('AgreementGroup 에 하위 항목을 추가했어요.');
  });

  test('들여쓴 하위 목록은 그 항목에 붙는다', () => {
    const item = releases[0]!.sections[0]!.items[1]!;
    expect(item.split('\n')[0]).toBe('`MultiCombobox` 추가 — 여러 개를 고르는 선택 상자.');
    expect(item).toContain('- 고른 값은 칩으로 보인다.');
    expect(item).toContain('  나머지 항목이 비활성이 된다.');
  });

  test('"Updated dependencies" 는 빼고, 그것뿐인 버전은 항목이 없다', () => {
    expect(releases[0]!.sections[1]!.items).toEqual(['토요일 선택 색 수정.']);
    expect(releases[1]!.sections).toEqual([]);
  });

  test('모르는 제목은 빌드를 멈춘다', () => {
    expect(() => parseChangelog('## 1.0.0\n\n### Other\n\n- x')).toThrow(/Other/);
  });
});

test('koreanDay', () => {
  expect(koreanDay('2026-11-19')).toBe('2026년 11월 19일');
});

describe('Inline', async () => {
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { Inline } = await import('./Markdown');
  const html = (text: string) => renderToStaticMarkup(Inline({ text }));

  test('코드·굵게·링크, 굵게·링크 안의 코드', () => {
    expect(html('`a` **b** [c](https://x.dev/)')).toBe(
      '<code class="doc-inline-code">a</code> <strong>b</strong> <a href="https://x.dev/">c</a>',
    );
    expect(html('**`color`**')).toBe('<strong><code class="doc-inline-code">color</code></strong>');
    expect(html('[`@bestow-ui/korean-utils`](https://npm.im/x)')).toBe(
      '<a href="https://npm.im/x"><code class="doc-inline-code">@bestow-ui/korean-utils</code></a>',
    );
  });

  test('가림 예시의 별표는 굵게가 아니다', () => {
    expect(html('`mask`(010-****-5678)·`mask`(900101-1******)')).not.toContain('<strong>');
  });

  test('맨 주소는 링크, 괄호는 주소에 넣지 않는다', () => {
    expect(html('(https://bestow-ui.com/components/)로')).toBe(
      '(<a href="https://bestow-ui.com/components/">https://bestow-ui.com/components/</a>)로',
    );
  });
});
