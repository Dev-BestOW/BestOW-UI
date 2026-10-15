import {
  darkColors,
  darkShadow,
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
import { createGlobalTheme, createGlobalThemeContract, createTheme } from '@vanilla-extract/css';

const baseTokens = {
  space,
  radius,
  font: { family: fontFamily, size: fontSize, weight: fontWeight, lineHeight },
  duration,
  zIndex,
};

// 색과 그림자는 모드마다 다르다 (CSS 변수 이름은 같다: --bestow-shadow-md …)
const lightTokens = { ...baseTokens, color: lightColors, shadow };
const darkTokens = { ...baseTokens, color: darkColors, shadow: darkShadow };

type Contract<T> = { [K in keyof T]: T[K] extends string ? null : Contract<T[K]> };

/** 토큰 값의 리터럴 타입을 string 으로 넓힌 테마 토큰 구조 */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type ThemeTokens = Widen<typeof lightTokens>;

function toContract<T extends object>(tokens: T): Contract<T> {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [key, typeof value === 'string' ? null : toContract(value)]),
  ) as Contract<T>;
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * 컴포넌트 스타일은 반드시 vars 를 통해 토큰을 참조한다.
 * CSS 변수 이름은 공개 API 다: `--bestow-color-primary-solid`, `--bestow-space-4`, `--bestow-font-line-height-normal` …
 */
export const vars = createGlobalThemeContract(
  toContract(lightTokens),
  (_value, path) => `bestow-${path.map(kebab).join('-')}`,
);

// ThemeProvider 없이 사용해도 라이트 테마 값이 적용되도록 :root 에 기본값을 둔다.
createGlobalTheme(':root', vars, lightTokens);

export const themeClass = {
  light: createTheme(vars, lightTokens),
  dark: createTheme(vars, darkTokens),
};

export type ThemeName = keyof typeof themeClass;
