import { style } from '@vanilla-extract/css';
import { reducedMotion } from '../../styles/animations.css';
import { vars } from '../../theme/contract.css';

/**
 * 평소에는 화면 위로 밀어 두고(스크린리더·Tab 으로는 닿는다) 포커스를 받으면 왼쪽 위에 나타난다.
 * display:none·visibility:hidden 으로 숨기면 Tab 으로 닿지 않으므로 위치로만 숨긴다.
 */
export const skipLink = style({
  position: 'fixed',
  top: vars.space[2],
  left: vars.space[2],
  zIndex: vars.zIndex.tooltip,
  padding: `${vars.space[2]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.primary.solid,
  color: vars.color.primary.contrast,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.normal,
  textDecoration: 'none',
  boxShadow: vars.shadow.md,
  transform: `translateY(calc(-100% - ${vars.space[4]}))`,
  transition: `transform ${vars.duration.fast} ease-out`,
  selectors: {
    '&:focus, &:focus-visible': {
      transform: 'translateY(0)',
      outline: `2px solid ${vars.color.border.focus}`,
      outlineOffset: '2px',
    },
  },
  '@media': { [reducedMotion]: { transition: 'none' } },
});
