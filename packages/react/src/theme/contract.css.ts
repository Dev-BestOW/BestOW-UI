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
/**
 * 기본값이 없는 선택 토큰 — CSS 변수를 정의하지 않고, 쓰는 곳에서 `fallbackVar` 로 기존 토큰을 따른다.
 * 그래서 넣지 않으면 화면이 그대로이고, 기존 토큰(border.default 등)을 덮어쓴 사용자 설정도 계속 따른다(하위 영역의 CSS 덮어쓰기 포함).
 * - `color.border.input`·`inputHover` (1.x 추가): 입력 칸(Input·Select·Combobox·Textarea·인증번호 칸 등) 테두리. 기본은 border.default·border.strong.
 *   흰 배경과 1.3:1 인 기본 테두리를 3:1 이상으로 올리려면 `strongInputBorders` 를 쓴다(2.0 에서 기본값이 될 예정).
 * - `color.border.control` (1.x 추가): Checkbox·Radio 테두리, 꺼진 Switch 트랙, Stepper 의 예정 단계. 기본은 border.strong(라이트 2.07:1).
 */
const optionalTokens = { color: { border: { input: '', inputHover: '', control: '' } } };

export type ThemeTokens = Widen<typeof lightTokens> & Widen<typeof optionalTokens>;

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
const varName = (_value: string | null, path: string[]) => `bestow-${path.map(kebab).join('-')}`;
const requiredVars = createGlobalThemeContract(toContract(lightTokens), varName);
const optionalVars = createGlobalThemeContract(toContract(optionalTokens), varName);

export const vars = {
  ...requiredVars,
  color: { ...requiredVars.color, border: { ...requiredVars.color.border, ...optionalVars.color.border } },
};

// ThemeProvider 없이 사용해도 라이트 테마 값이 적용되도록 :root 에 기본값을 둔다. (선택 토큰은 정의하지 않는다 — 위 optionalTokens)
createGlobalTheme(':root', requiredVars, lightTokens);

export const themeClass = {
  light: createTheme(requiredVars, lightTokens),
  dark: createTheme(requiredVars, darkTokens),
};

export type ThemeName = keyof typeof themeClass;
