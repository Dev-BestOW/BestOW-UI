import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

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
  defaultVariants: {
    direction: 'column',
  },
});
