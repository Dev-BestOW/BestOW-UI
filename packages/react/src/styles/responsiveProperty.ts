import { style, type StyleRule } from '@vanilla-extract/css';
import { media } from '../utils/responsive';

// .css.ts 에서만 부른다(style() 은 빌드 때 실행) — .css.ts 는 함수를 export 할 수 없어 따로 둔다

/**
 * CSS 속성 하나를 구간마다 CSS 변수(`--bestow-<name>-<구간>`, utils/responsive.ts 의 responsiveVars 가 인라인으로 넣음)로 정한다.
 * 구간마다 클래스를 만들면 값 × 구간 수만큼 CSS·JS 가 늘어 이 방식을 쓴다. 변수는 initial 로 초기화한다 —
 * 그러지 않으면 넣지 않은 구간이 바깥 요소(중첩한 Stack 등)의 변수를 이어받는다.
 */
export function responsiveProperty(name: string, property: string) {
  const at = (key: string) => `var(--bestow-${name}-${key})`;
  return style({
    vars: {
      [`--bestow-${name}-base`]: 'initial',
      [`--bestow-${name}-sm`]: 'initial',
      [`--bestow-${name}-md`]: 'initial',
      [`--bestow-${name}-lg`]: 'initial',
      [`--bestow-${name}-xl`]: 'initial',
    },
    [property]: at('base'),
    '@media': {
      [media.sm]: { [property]: at('sm') },
      [media.md]: { [property]: at('md') },
      [media.lg]: { [property]: at('lg') },
      [media.xl]: { [property]: at('xl') },
    },
  } as StyleRule);
}
