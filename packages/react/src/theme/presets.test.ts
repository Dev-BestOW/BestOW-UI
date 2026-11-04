import { darkColors, lightColors, palette } from '@bestow-ui/tokens';
import { contrastRatio } from './color';
import { strongInputBorders } from './presets';

const modes = [
  ['light', lightColors],
  ['dark', darkColors],
] as const;

describe('기본 입력 칸·체크 컨트롤 테두리 (2.0)', () => {
  it.each(modes)(
    '%s: 입력 테두리·hover·체크 컨트롤이 bg.default·bg.subtle 과 3:1 이상이다 (WCAG 1.4.11)',
    (_mode, colors) => {
      const { input, inputHover, control } = colors.border;
      for (const color of [input, inputHover, control]) {
        expect(contrastRatio(color, colors.bg.default)).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(color, colors.bg.subtle)).toBeGreaterThanOrEqual(3);
      }
    },
  );

  it.each(modes)('%s: hover 는 테두리보다 배경과 대비가 더 크다 (hover 하면 흐려지지 않게)', (_mode, colors) => {
    expect(contrastRatio(colors.border.inputHover, colors.bg.default)).toBeGreaterThan(
      contrastRatio(colors.border.input, colors.bg.default),
    );
  });

  it('카드·구분선 테두리(border.default)는 그대로 옅다 — 입력 칸만 진해졌다', () => {
    expect(lightColors.border.default).toBe(palette.gray[300]);
    expect(darkColors.border.default).toBe(palette.gray[700]);
  });
});

describe('strongInputBorders (deprecated)', () => {
  it.each(modes)('%s: 2.0 기본값과 같다 — 남아 있는 사용자 코드의 화면이 바뀌지 않는다', (mode, colors) => {
    const { input, inputHover, control } = colors.border;
    expect(strongInputBorders[mode]!.color!.border).toEqual({ input, inputHover, control });
  });
});
