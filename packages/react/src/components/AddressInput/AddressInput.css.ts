import { style } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

export const fieldset = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 'none',
  fontFamily: vars.font.family.sans,
});

export const legend = style({
  marginBottom: vars.space[1],
  padding: 0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg.default,
});

export const row = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: vars.space[2],
});

export const zonecode = style({
  width: '120px',
  flexShrink: 0,
});

// 검색 화면(공급자가 그리는 iframe 등)이 들어갈 자리
export const searchArea = style({
  position: 'relative',
  height: 'min(460px, 60vh)',
  minHeight: '400px',
  overflow: 'hidden',
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border.default}`,
});

export const searchStatus = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  padding: vars.space[4],
  textAlign: 'center',
  fontSize: vars.font.size.sm,
  color: vars.color.fg.muted,
});
