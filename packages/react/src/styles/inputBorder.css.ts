import { fallbackVar } from '@vanilla-extract/css';
import { vars } from '../theme/contract.css';

// 선택 토큰(contract.css.ts 의 optionalTokens) — 지정하지 않으면 기존 토큰을 따른다
// 입력 칸 테두리: border.input·inputHover → border.default·border.strong
export const inputBorderColor = fallbackVar(vars.color.border.input, vars.color.border.default);
export const inputBorderHoverColor = fallbackVar(vars.color.border.inputHover, vars.color.border.strong);
// 체크 컨트롤(Checkbox·Radio·Switch 꺼짐·Stepper 예정 단계): border.control → border.strong
export const controlBorderColor = fallbackVar(vars.color.border.control, vars.color.border.strong);
