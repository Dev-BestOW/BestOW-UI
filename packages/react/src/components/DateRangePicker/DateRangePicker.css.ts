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
  padding: 0,
  marginBottom: vars.space[1],
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg.default,
});

export const fields = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space[2],
});

// 좁은 화면에서는 두 칸을 위아래로 쌓고 "~" 를 숨긴다 — 줄바꿈되면 "~" 가 한 칸 옆에 홀로 남아 어색했다(390px 확인)
const narrow = 'screen and (max-width: 30rem)';

export const field = style({
  flex: '1 1 10rem',
  minWidth: 0,
  '@media': { [narrow]: { flexBasis: '100%' } },
});

// "~" 는 두 입력창 사이 시각 표시(레이블 높이만큼 내려 입력창 가운데에 맞춤)
export const separator = style({
  alignSelf: 'center',
  paddingTop: vars.space[6],
  color: vars.color.fg.subtle,
  '@media': { [narrow]: { display: 'none' } },
});

export const presets = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[1],
});
