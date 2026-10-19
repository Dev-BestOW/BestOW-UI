import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const termWidth = createVar();

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  vars: { [termWidth]: '30%' },
});

export const item = recipe({
  base: { minWidth: 0 },
  variants: {
    layout: {
      horizontal: {
        display: 'grid',
        gridTemplateColumns: `${termWidth} minmax(0, 1fr)`,
        columnGap: vars.space[4],
        paddingBlock: vars.space[2],
      },
      vertical: {
        display: 'flex',
        flexDirection: 'column',
        gap: vars.space[1],
        paddingBlock: vars.space[2],
      },
    },
    divided: {
      true: {
        selectors: { '&:not(:last-child)': { borderBottom: `1px solid ${vars.color.border.default}` } },
      },
    },
  },
  defaultVariants: { layout: 'horizontal' },
});

export const term = style({
  margin: 0,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg.muted,
  overflowWrap: 'anywhere',
});

export const description = style({
  margin: 0,
  color: vars.color.fg.default,
  overflowWrap: 'anywhere',
});
