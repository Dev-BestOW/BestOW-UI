import {
  darkColors,
  duration,
  fontFamily,
  fontSize,
  fontWeight,
  lightColors,
  lineHeight,
  radius,
  shadow,
  space,
  zIndex,
} from '@bestow-ui/tokens';
import { createGlobalTheme, createTheme, createThemeContract } from '@vanilla-extract/css';

const baseTokens = {
  space,
  radius,
  font: { family: fontFamily, size: fontSize, weight: fontWeight, lineHeight },
  shadow,
  duration,
  zIndex,
};

const lightTokens = { ...baseTokens, color: lightColors };
const darkTokens = { ...baseTokens, color: darkColors };

type Contract<T> = { [K in keyof T]: T[K] extends string ? null : Contract<T[K]> };

function toContract<T extends object>(tokens: T): Contract<T> {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [key, typeof value === 'string' ? null : toContract(value)]),
  ) as Contract<T>;
}

/** 컴포넌트 스타일은 반드시 vars 를 통해 토큰을 참조한다. */
export const vars = createThemeContract(toContract(lightTokens));

// ThemeProvider 없이 사용해도 라이트 테마 값이 적용되도록 :root 에 기본값을 둔다.
createGlobalTheme(':root', vars, lightTokens);

export const themeClass = {
  light: createTheme(vars, lightTokens),
  dark: createTheme(vars, darkTokens),
};

export type ThemeName = keyof typeof themeClass;
