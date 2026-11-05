import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { forcedColors, systemHighlight } from '../../styles/forcedColors.css';
import { vars } from '../../theme/contract.css';

// color variant 가 채우고 variant 가 쓰는 로컬 변수 (Badge 와 같은 방식)
const accent = { solid: createVar(), subtle: createVar(), text: createVar() };

function accentFrom(
  intent: keyof Pick<typeof vars.color, 'primary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info'>,
) {
  const c = vars.color[intent];
  return { vars: { [accent.solid]: c.solid, [accent.subtle]: c.subtle, [accent.text]: c.text } };
}

export const tag = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    maxWidth: '100%',
    border: '1px solid transparent',
    borderRadius: vars.radius.full,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    verticalAlign: 'middle',
  },
  variants: {
    variant: {
      soft: { backgroundColor: accent.subtle, color: accent.text },
      outline: { backgroundColor: 'transparent', borderColor: accent.solid, color: accent.text },
    },
    color: {
      primary: accentFrom('primary'),
      neutral: accentFrom('neutral'),
      danger: accentFrom('danger'),
      success: accentFrom('success'),
      warning: accentFrom('warning'),
      info: accentFrom('info'),
    },
    size: {
      sm: { minHeight: '24px', paddingInline: vars.space[2], fontSize: vars.font.size.xs },
      md: { minHeight: '32px', paddingInline: vars.space[3], fontSize: vars.font.size.sm },
    },
  },
  defaultVariants: { variant: 'soft', color: 'neutral', size: 'md' },
});

/** 고르는 칩(button). 꺼짐은 테두리만, 켜짐은 의미 색 배경 + 체크 아이콘 — 색만으로 상태를 보이지 않는다 */
export const toggle = style({
  cursor: 'pointer',
  backgroundColor: vars.color.bg.default,
  borderColor: vars.color.border.control,
  color: vars.color.fg.default,
  transition: `background-color ${vars.duration.fast}, border-color ${vars.duration.fast}`,
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: vars.color.bg.muted },
    '&[aria-pressed="true"]': { backgroundColor: accent.subtle, borderColor: accent.solid, color: accent.text },
    '&[aria-pressed="true"]:hover:not(:disabled)': { backgroundColor: accent.subtle },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
    '&:disabled': { cursor: 'not-allowed', opacity: vars.opacity.disabled },
  },
  '@media': {
    [forcedColors]: {
      borderColor: 'CanvasText',
      selectors: {
        '&[aria-pressed="true"], &[aria-pressed="true"]:hover:not(:disabled)': systemHighlight,
      },
    },
  },
});

export const label = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const icon = style({ display: 'inline-flex', flexShrink: 0 });

/** 삭제 버튼 — 글자 크기와 상관없이 24px 누를 자리(WCAG 2.5.8). 오른쪽 안쪽 여백을 조금 당겨 원 안에 둔다 */
export const remove = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '24px',
  height: '24px',
  margin: `0 calc(-1 * ${vars.space[2]}) 0 calc(-1 * ${vars.space[1]})`,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.full,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: vars.color.bg.muted },
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '1px' },
    // 삭제 태그의 글자는 버튼이 아니라 대비 예외가 없어 흐리게 하지 않는다 — 누를 수 없는 삭제 버튼만 흐리게
    '&:disabled': { cursor: 'not-allowed', opacity: vars.opacity.disabled },
  },
});

/** TagGroup 의 목록 — 줄바꿈되는 가로 나열 */
export const group = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  selectors: {
    '&:focus-visible': { outline: `2px solid ${vars.color.border.focus}`, outlineOffset: '2px' },
  },
});

export const groupItem = style({ display: 'inline-flex', maxWidth: '100%' });
