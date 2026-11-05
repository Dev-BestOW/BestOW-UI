import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const root = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginInline: 'auto',
    maxWidth: '28rem',
    color: vars.color.fg.default,
    fontFamily: vars.font.family.sans,
  },
  variants: {
    size: {
      sm: { gap: vars.space[2], paddingBlock: vars.space[4] },
      md: { gap: vars.space[3], paddingBlock: vars.space[8] },
    },
  },
  defaultVariants: { size: 'md' },
});

/** 아이콘 자리 — 연한 원 안에 둔다(장식용) */
export const icon = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.bg.muted,
    color: vars.color.fg.muted,
  },
  variants: {
    size: {
      sm: { width: '40px', height: '40px' },
      md: { width: '56px', height: '56px' },
    },
  },
  defaultVariants: { size: 'md' },
});

export const title = recipe({
  base: {
    margin: 0,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.tight,
    color: vars.color.fg.default,
    textWrap: 'balance',
  },
  variants: {
    size: {
      sm: { fontSize: vars.font.size.sm },
      md: { fontSize: vars.font.size.lg },
    },
  },
  defaultVariants: { size: 'md' },
});

export const description = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.fg.muted,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: vars.space[2],
  marginTop: vars.space[1],
});
