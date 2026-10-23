import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';
import { responsiveProperty } from '../../styles/responsiveProperty';

export { responsiveGap } from '../../styles/responsive.css';

type SpaceKey = keyof typeof vars.space;

const gap = Object.fromEntries(Object.entries(vars.space).map(([key, value]) => [key, { gap: value }])) as Record<
  SpaceKey,
  { gap: string }
>;

export const stack = recipe({
  base: {
    display: 'flex',
    minWidth: 0,
  },
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
      'row-reverse': { flexDirection: 'row-reverse' },
      'column-reverse': { flexDirection: 'column-reverse' },
    },
    gap,
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },
    wrap: {
      true: { flexWrap: 'wrap' },
    },
  },
});

// 반응형 값({ base, md, … })을 받았을 때 — 위 recipe 대신 이 클래스 + 인라인 CSS 변수(Stack.tsx). 기본 방향 column 은 Stack.tsx 가 정한다
export const responsiveDirection = responsiveProperty('stack-direction', 'flexDirection');
export const responsiveAlign = responsiveProperty('stack-align', 'alignItems');
export const responsiveJustify = responsiveProperty('stack-justify', 'justifyContent');
