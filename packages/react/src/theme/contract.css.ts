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

/**
 * 글자 크기는 rem 으로 낸다 — 사용자가 브라우저 기본 글꼴 크기를 키우면 따라 커진다(저시력 사용자). 16px 기준이라
 * 기본 설정에서는 px 와 같다. `@bestow-ui/tokens` 의 값(px)은 그대로 두고 CSS 변수(--bestow-font-size-*)만 rem.
 * 글자가 커져도 잘리지 않게 글자가 든 컨트롤은 height 대신 minHeight 를 쓴다(Button·Tabs·Badge 등 — 한 줄 Input 은
 * 200% 에서도 안에 들어가 고정 높이 유지, Input.css.ts 참고).
 */
const pxToRem = (value: string) => (value.endsWith('px') ? `${parseFloat(value) / 16}rem` : value);
const fontSizeRem = Object.fromEntries(Object.entries(fontSize).map(([key, value]) => [key, pxToRem(value)])) as {
  [K in keyof typeof fontSize]: string;
};

const baseTokens = {
  space,
  radius,
  font: { family: fontFamily, size: fontSizeRem, weight: fontWeight, lineHeight },
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
