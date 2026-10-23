import { breakpoint } from '@bestow-ui/tokens';
import { media, responsiveVars } from './responsive';

describe('media', () => {
  it('tokens 의 breakpoint 를 em(16px 기준)으로 바꾼 min-width 미디어쿼리다', () => {
    expect(Object.keys(media)).toEqual(Object.keys(breakpoint));
    for (const key of Object.keys(breakpoint) as (keyof typeof breakpoint)[]) {
      expect(media[key]).toBe(`(min-width: ${parseFloat(breakpoint[key]) / 16}em)`);
    }
  });
});

describe('responsiveVars', () => {
  const vars = (value: Parameters<typeof responsiveVars<string>>[2]) => {
    const out: Record<string, string> = {};
    responsiveVars(out, 'x', value, (v) => `<${v}>`);
    return out;
  };

  it('한 값은 모든 구간에 같은 값을 넣는다', () => {
    expect(vars('a')).toEqual({
      '--bestow-x-base': '<a>',
      '--bestow-x-sm': '<a>',
      '--bestow-x-md': '<a>',
      '--bestow-x-lg': '<a>',
      '--bestow-x-xl': '<a>',
    });
  });

  it('주지 않은 구간은 앞(좁은) 구간 값을 이어받는다', () => {
    expect(vars({ base: 'a', md: 'b', xl: 'c' })).toEqual({
      '--bestow-x-base': '<a>',
      '--bestow-x-sm': '<a>',
      '--bestow-x-md': '<b>',
      '--bestow-x-lg': '<b>',
      '--bestow-x-xl': '<c>',
    });
  });

  it('base 가 없으면 처음 준 구간부터 넣는다 (그 앞은 CSS 의 initial — 브라우저 기본값)', () => {
    expect(vars({ lg: 'a' })).toEqual({ '--bestow-x-lg': '<a>', '--bestow-x-xl': '<a>' });
    expect(vars(undefined)).toEqual({});
  });
});
