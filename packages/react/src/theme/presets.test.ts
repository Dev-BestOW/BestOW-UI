import { darkColors, lightColors, palette } from '@bestow-ui/tokens';
import { contrastRatio } from './color';
import { vars } from './contract.css';
import { createTheme, themeToStyle } from './createTheme';
import { strongInputBorders } from './presets';

describe('strongInputBorders', () => {
  const modes = [
    ['light', lightColors],
    ['dark', darkColors],
  ] as const;

  it.each(modes)(
    '%s: 입력 테두리·hover·체크 컨트롤이 bg.default·bg.subtle 과 3:1 이상이다 (WCAG 1.4.11)',
    (mode, colors) => {
      const border = strongInputBorders[mode]!.color!.border!;
      for (const color of [border.input!, border.inputHover!, border.control!]) {
        expect(contrastRatio(color, colors.bg.default)).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(color, colors.bg.subtle)).toBeGreaterThanOrEqual(3);
      }
    },
  );

  it.each(modes)('%s: hover 는 테두리보다 배경과 대비가 더 크다 (hover 하면 흐려지지 않게)', (mode, colors) => {
    const border = strongInputBorders[mode]!.color!.border!;
    expect(contrastRatio(border.inputHover!, colors.bg.default)).toBeGreaterThan(
      contrastRatio(border.input!, colors.bg.default),
    );
  });

  it('기본 테두리는 3:1 미만이다 — 이 묶음이 필요한 이유 (2.0 에서 기본값을 바꾸면 이 테스트를 뒤집는다)', () => {
    expect(contrastRatio(lightColors.border.default, lightColors.bg.default)).toBeLessThan(3);
    expect(contrastRatio(lightColors.border.strong, lightColors.bg.default)).toBeLessThan(3);
  });

  it('palette 의 회색과 같은 값이다 (번들 크기 때문에 값으로 적어 둠)', () => {
    expect(strongInputBorders.light!.color!.border).toEqual({
      input: palette.gray[600],
      inputHover: palette.gray[700],
      control: palette.gray[600],
    });
    expect(strongInputBorders.dark!.color!.border).toEqual({
      input: palette.gray[500],
      inputHover: palette.gray[300],
      control: palette.gray[500],
    });
  });

  it('선택 토큰 CSS 변수로 펼쳐진다', () => {
    const style = themeToStyle(createTheme(strongInputBorders), 'light')!;
    const name = (ref: string) => ref.replace(/^var\((--[^)]+)\)$/, '$1');
    expect(style[name(vars.color.border.input)]).toBe(strongInputBorders.light!.color!.border!.input);
    expect(style[name(vars.color.border.inputHover)]).toBe(strongInputBorders.light!.color!.border!.inputHover);
    expect(style[name(vars.color.border.control)]).toBe(strongInputBorders.light!.color!.border!.control);
  });
});
