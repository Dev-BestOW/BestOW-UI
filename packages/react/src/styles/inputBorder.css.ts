import { fallbackVar } from '@vanilla-extract/css';
import { vars } from '../theme/contract.css';

// 입력 칸 테두리 — 선택 토큰 border.input·inputHover 가 없으면 기존 border.default·border.strong (contract.css.ts 의 optionalTokens)
export const inputBorderColor = fallbackVar(vars.color.border.input, vars.color.border.default);
export const inputBorderHoverColor = fallbackVar(vars.color.border.inputHover, vars.color.border.strong);
