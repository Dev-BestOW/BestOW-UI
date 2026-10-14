import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

const { size, weight, lineHeight } = vars.font;

export const typography = recipe({
  base: {
    margin: 0,
    fontFamily: vars.font.family.sans,
  },
  variants: {
    variant: {
      display: { fontSize: size['4xl'], fontWeight: weight.bold, lineHeight: lineHeight.tight, letterSpacing: '-0.02em' },
      h1: { fontSize: size['3xl'], fontWeight: weight.bold, lineHeight: lineHeight.tight, letterSpacing: '-0.02em' },
      h2: { fontSize: size['2xl'], fontWeight: weight.bold, lineHeight: lineHeight.tight, letterSpacing: '-0.01em' },
      h3: { fontSize: size.xl, fontWeight: weight.semibold, lineHeight: lineHeight.tight },
      h4: { fontSize: size.lg, fontWeight: weight.semibold, lineHeight: lineHeight.tight },
      'body-lg': { fontSize: size.lg, fontWeight: weight.regular, lineHeight: lineHeight.relaxed },
      body: { fontSize: size.md, fontWeight: weight.regular, lineHeight: lineHeight.normal },
      'body-sm': { fontSize: size.sm, fontWeight: weight.regular, lineHeight: lineHeight.normal },
      caption: { fontSize: size.xs, fontWeight: weight.regular, lineHeight: lineHeight.normal },
    },
    color: {
      default: { color: vars.color.fg.default },
      muted: { color: vars.color.fg.muted },
      subtle: { color: vars.color.fg.subtle },
      primary: { color: vars.color.primary.text },
      danger: { color: vars.color.danger.text },
      success: { color: vars.color.success.text },
      inherit: { color: 'inherit' },
    },
    weight: {
      regular: { fontWeight: weight.regular },
      medium: { fontWeight: weight.medium },
      semibold: { fontWeight: weight.semibold },
      bold: { fontWeight: weight.bold },
    },
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
    truncate: {
      true: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
  },
});
