import { CSS_LAYER, LAYER_PRELUDE_LINES, wrapInLayer } from './cssLayer';

describe('wrapInLayer', () => {
  it('레이어 순서를 먼저 선언하고 CSS 전체를 @layer bestow 로 감싼다', () => {
    expect(CSS_LAYER).toBe('bestow');
    expect(wrapInLayer('.a { color: red; }\n')).toBe('@layer base, bestow;\n@layer bestow {\n.a { color: red; }\n}\n');
  });

  it('sourceMappingURL 주석은 레이어 밖 맨 끝에 남긴다', () => {
    expect(wrapInLayer('.a {}\n/*# sourceMappingURL=index.css.map */')).toBe(
      '@layer base, bestow;\n@layer bestow {\n.a {}\n}\n/*# sourceMappingURL=index.css.map */\n',
    );
  });

  it('앞에 넣은 줄 수만큼 원래 줄이 밀린다 (소스맵 보정 값)', () => {
    const lines = wrapInLayer('.first {}').split('\n');
    expect(lines.indexOf('.first {}')).toBe(LAYER_PRELUDE_LINES);
  });
});
