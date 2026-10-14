import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars, type ThemeName, type ThemeTokens } from './contract.css';

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]> };

export type ThemeOverrides = DeepPartial<ThemeTokens>;

/** createTheme 에 넘기는 입력. common 은 라이트·다크 공통, light/dark 는 모드별 값 (common 보다 우선). */
export interface ThemeInput {
  common?: ThemeOverrides;
  light?: ThemeOverrides;
  dark?: ThemeOverrides;
}

/** createTheme 의 결과. ThemeProvider 의 overrides 로 넘긴다. */
export interface BestowTheme {
  readonly light: ThemeOverrides;
  readonly dark: ThemeOverrides;
}

type Tree = { [key: string]: string | Tree };

function deepMerge(target: Tree, source: Tree | undefined): Tree {
  if (!source) return target;
  const out: Tree = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    const prev = out[key];
    out[key] = typeof value === 'object' && typeof prev === 'object' ? deepMerge(prev, value) : value;
  }
  return out;
}

/**
 * 브랜드 테마를 만든다. 여러 입력을 넘기면 순서대로 깊게 병합한다 (뒤가 우선).
 *
 * @example
 * const brand = createTheme(
 *   createIntentColors('primary', '#7c3aed'),
 *   { common: { radius: { md: '6px' }, font: { family: { sans: 'Inter, sans-serif' } } } },
 * );
 * <ThemeProvider theme="dark" overrides={brand}>…</ThemeProvider>
 */
export function createTheme(...inputs: ThemeInput[]): BestowTheme {
  let light: Tree = {};
  let dark: Tree = {};
  for (const input of inputs) {
    light = deepMerge(deepMerge(light, input.common as Tree), input.light as Tree);
    dark = deepMerge(deepMerge(dark, input.common as Tree), input.dark as Tree);
  }
  return Object.freeze({ light, dark }) as BestowTheme;
}

/** 두 테마를 병합한다 (b 가 우선). 중첩 ThemeProvider 가 바깥 테마를 이어받을 때 쓴다. */
export function mergeThemes(a: BestowTheme | undefined, b: BestowTheme | undefined): BestowTheme | undefined {
  if (!a) return b;
  if (!b) return a;
  return createTheme(a, b);
}

/** 부분 토큰을 { 'var(--bestow-…)': 값 } 으로 펼친다. 알 수 없는 키는 무시한다. */
function flatten(partial: Tree, contract: Tree, out: Record<string, string>) {
  for (const [key, value] of Object.entries(partial)) {
    const target = contract[key];
    if (target === undefined) continue;
    if (typeof target === 'string' && typeof value === 'string') out[target] = value;
    else if (typeof target === 'object' && typeof value === 'object') flatten(value, target, out);
  }
  return out;
}

/** 현재 모드의 오버라이드를 인라인 style 로 바꾼다. */
export function themeToStyle(theme: BestowTheme | undefined, mode: ThemeName): Record<string, string> | undefined {
  if (!theme) return undefined;
  const map = flatten(theme[mode] as Tree, vars as unknown as Tree, {});
  return Object.keys(map).length ? assignInlineVars(map) : undefined;
}
