import { style } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

export const row = style({ display: 'flex', alignItems: 'center', gap: vars.space[2] });

// 칸 폭은 자릿수에 맞춘다(rem — 기본 글꼴 크기를 따라 커진다). 320px 화면에서도 한 줄에 들어간다
export const front = style({ width: '7rem', flex: 'none' });
export const back = style({ width: '8rem', flex: 'none' });
export const backOne = style({ width: '3rem', flex: 'none' });

export const separator = style({ color: vars.color.fg.muted });

// 앞 7자리만 받을 때 나머지 6자리 자리 표시 (장식)
export const hiddenDigits = style({ color: vars.color.fg.muted, letterSpacing: '0.1em' });
