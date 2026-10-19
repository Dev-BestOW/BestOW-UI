import { style } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

export const root = style({
  width: '100%',
});

export const dropzone = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[2],
  padding: vars.space[5],
  // 점선 테두리는 3:1 이상(fg.subtle) — 끌어다 놓을 영역의 경계가 보이게
  border: `1.5px dashed ${vars.color.fg.subtle}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.subtle,
  textAlign: 'center',
  transition: `border-color ${vars.duration.fast}, background-color ${vars.duration.fast}`,
  selectors: {
    '&[data-dragging]': { borderColor: vars.color.primary.solid, backgroundColor: vars.color.primary.subtle },
    '&[data-invalid]': { borderColor: vars.color.danger.solid },
    // 영역 전체를 흐리게 하면 안내 글자 대비가 4.5:1 밑으로 떨어진다 — 비활성은 버튼(자체 비활성 스타일)과 테두리로만 보인다
    '&[data-disabled]': { borderColor: vars.color.border.default, cursor: 'not-allowed' },
  },
});

export const dropIcon = style({
  display: 'inline-flex',
  color: vars.color.fg.subtle,
});

export const dropHint = style({
  fontSize: vars.font.size.xs,
  color: vars.color.fg.subtle,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minHeight: '40px',
  paddingInlineStart: vars.space[3],
  paddingInlineEnd: vars.space[1],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  color: vars.color.fg.default,
});

export const fileIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: vars.color.fg.subtle,
});

export const fileName = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const fileSize = style({
  flexShrink: 0,
  fontSize: vars.font.size.xs,
  color: vars.color.fg.subtle,
  fontVariantNumeric: 'tabular-nums',
});

export const errors = style({
  margin: 0,
  paddingInlineStart: 0,
  listStyle: 'none',
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.danger.text,
});
