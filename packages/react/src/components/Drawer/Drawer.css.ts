import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { fadeIn, fadeOut, reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.zIndex.overlay,
  backgroundColor: vars.color.bg.overlay,
  selectors: {
    '&[data-state="open"]': { animation: `${fadeIn} ${vars.duration.normal} ease-out` },
    '&[data-state="closed"]': { animation: `${fadeOut} ${vars.duration.fast} ease-in` },
  },
  '@media': { [reducedMotion]: { animation: 'none !important' } },
});

// 화면 밖(가장자리 너머)에서 제자리로 미끄러져 들어온다
const offscreen = {
  right: 'translateX(100%)',
  left: 'translateX(-100%)',
  top: 'translateY(-100%)',
  bottom: 'translateY(100%)',
} as const;

type Side = keyof typeof offscreen;

function slide(side: Side) {
  const slideIn = keyframes({ from: { transform: offscreen[side] }, to: { transform: 'none' } });
  const slideOut = keyframes({ from: { transform: 'none' }, to: { transform: offscreen[side] } });
  return {
    selectors: {
      '&[data-state="open"]': { animation: `${slideIn} ${vars.duration.slow} cubic-bezier(0.32, 0.72, 0, 1)` },
      '&[data-state="closed"]': { animation: `${slideOut} ${vars.duration.normal} ease-in` },
    },
  };
}

const vertical = { top: 0, bottom: 0, height: '100%', maxWidth: '100vw' };
const horizontal = { left: 0, right: 0, width: '100%', maxHeight: '100vh' };

export const content = recipe({
  base: {
    position: 'fixed',
    zIndex: vars.zIndex.modal,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: vars.color.bg.default,
    boxShadow: vars.shadow.lg,
    outline: 'none',
    '@media': { [reducedMotion]: { animation: 'none !important' } },
  },
  variants: {
    side: {
      right: { ...vertical, right: 0, borderLeft: `1px solid ${vars.color.border.default}`, ...slide('right') },
      left: { ...vertical, left: 0, borderRight: `1px solid ${vars.color.border.default}`, ...slide('left') },
      top: { ...horizontal, top: 0, borderBottom: `1px solid ${vars.color.border.default}`, ...slide('top') },
      bottom: {
        ...horizontal,
        bottom: 0,
        borderTop: `1px solid ${vars.color.border.default}`,
        borderTopLeftRadius: vars.radius.lg,
        borderTopRightRadius: vars.radius.lg,
        ...slide('bottom'),
      },
    },
    size: { sm: {}, md: {}, lg: {} },
  },
  // 좌우 패널은 너비, 위아래 패널은 높이를 정한다
  compoundVariants: [
    { variants: { side: 'right', size: 'sm' }, style: { width: '320px' } },
    { variants: { side: 'right', size: 'md' }, style: { width: '420px' } },
    { variants: { side: 'right', size: 'lg' }, style: { width: '640px' } },
    { variants: { side: 'left', size: 'sm' }, style: { width: '320px' } },
    { variants: { side: 'left', size: 'md' }, style: { width: '420px' } },
    { variants: { side: 'left', size: 'lg' }, style: { width: '640px' } },
    { variants: { side: 'top', size: 'sm' }, style: { height: '30vh' } },
    { variants: { side: 'top', size: 'md' }, style: { height: '50vh' } },
    { variants: { side: 'top', size: 'lg' }, style: { height: '80vh' } },
    { variants: { side: 'bottom', size: 'sm' }, style: { height: '30vh' } },
    { variants: { side: 'bottom', size: 'md' }, style: { height: '50vh' } },
    { variants: { side: 'bottom', size: 'lg' }, style: { height: '80vh' } },
  ],
  defaultVariants: { side: 'right', size: 'md' },
});

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[4],
  padding: `${vars.space[5]} ${vars.space[6]}`,
  borderBottom: `1px solid ${vars.color.border.default}`,
});

export const headings = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const title = style({
  margin: 0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
});

export const description = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.fg.muted,
});

export const closeButton = style({
  marginTop: '-4px',
  marginRight: '-8px',
});

export const body = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: vars.space[6],
  fontSize: vars.font.size.sm,
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space[2],
  padding: `${vars.space[4]} ${vars.space[6]}`,
  borderTop: `1px solid ${vars.color.border.default}`,
});
