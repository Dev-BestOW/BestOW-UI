import { createContext, forwardRef, useContext, useId, useMemo, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { systemThemeClass, themeClass, type ThemeMode, type ThemeName } from './contract.css';
import { mergeThemes, themeToStyle, type BestowTheme } from './createTheme';
import * as styles from './ThemeProvider.css';
import { useSystemTheme } from './useSystemTheme';

interface ThemeContextValue {
  /** 요청한 모드 (중첩 ThemeProvider 가 이어받는 값) */
  mode: ThemeMode;
  /** 실제 적용 중인 모드. pending 이면 'light' */
  theme: ThemeName;
  /** `'system'` 인데 아직 OS 설정을 모름 (서버 렌더링·hydration 첫 렌더) — CSS 미디어쿼리로 그린다 */
  pending: boolean;
  overrides?: BestowTheme;
  /** 현재 모드의 오버라이드를 인라인 CSS 변수로 바꾼 값 (portal 에 다시 적용) */
  style?: CSSProperties;
}

const ThemeContext = /* @__PURE__ */ createContext<ThemeContextValue>({
  mode: 'light',
  theme: 'light',
  pending: false,
});

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 라이트/다크 모드. `'system'` 은 OS 설정을 따르고 바뀌면 바로 반영한다 — 서버 렌더링에서도 CSS 미디어쿼리로 그려
   * 첫 화면이 깜빡이지 않는다. 생략하면 바깥 ThemeProvider 의 모드를 이어받는다 (최상위는 light).
   */
  theme?: ThemeMode;
  /**
   * createTheme 으로 만든 브랜드 테마. 모드를 바꿔도 유지되고, 중첩된 ThemeProvider 는 바깥 값을 이어받는다
   * (안쪽에서 준 값이 우선).
   */
  overrides?: BestowTheme;
}

const declarations = (style: Record<string, string> | undefined) =>
  // 값은 개발자가 준 테마지만 </style> 로 태그가 끝나지 않게 < 를 CSS 이스케이프로 바꾼다
  Object.entries(style ?? {})
    .map(([name, value]) => `${name}:${value.replace(/</g, '\\3c ')}`)
    .join(';');

/** OS 설정을 모르는 동안 오버라이드를 라이트·다크 둘 다 CSS 로 적는다 — 인라인 style 은 미디어쿼리를 못 쓴다. */
function pendingOverridesCss(selector: string, theme: BestowTheme | undefined) {
  const light = declarations(themeToStyle(theme, 'light'));
  const dark = declarations(themeToStyle(theme, 'dark'));
  if (!light && !dark) return undefined;
  return `${selector}{${light}}@media (prefers-color-scheme: dark){${selector}{${dark}}}`;
}

export const ThemeProvider = /* @__PURE__ */ forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider(
  { theme: themeProp, overrides, className, style, children, ...rest },
  ref,
) {
  const parent = useContext(ThemeContext);
  const mode = themeProp ?? parent.mode;
  const system = useSystemTheme(mode === 'system');
  const pending = mode === 'system' && system === null;
  const theme: ThemeName = mode === 'system' ? (system ?? 'light') : mode;
  const merged = useMemo(() => mergeThemes(parent.overrides, overrides), [parent.overrides, overrides]);
  const value = useMemo<ThemeContextValue>(
    () => ({ mode, theme, pending, overrides: merged, style: pending ? undefined : themeToStyle(merged, theme) }),
    [mode, theme, pending, merged],
  );
  const id = useId();
  // 선택자에 systemThemeClass 를 함께 넣어 기본값(같은 요소의 그 클래스)보다 구체적으로 — 스타일시트 순서와 무관하게 이긴다.
  // pending 은 hydration 첫 렌더뿐이라 memo 하지 않는다
  const pendingCss = pending && pendingOverridesCss(`.${systemThemeClass}[data-bestow-theme-id="${id}"]`, merged);

  return (
    <ThemeContext.Provider value={value}>
      <div
        ref={ref}
        data-theme={pending ? 'system' : theme}
        data-bestow-theme-id={pendingCss ? id : undefined}
        className={cx(pending ? systemThemeClass : themeClass[theme], styles.root, className)}
        style={value.style ? { ...value.style, ...style } : style}
        {...rest}
      >
        {/* 글자 자식의 서버 렌더링 이스케이프는 React 버전마다 달라 그대로 넣는다(< 는 위 declarations 가 이스케이프) */}
        {pendingCss && <style dangerouslySetInnerHTML={{ __html: pendingCss }} />}
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

/**
 * 현재 적용 중인 모드(light/dark)를 반환한다. `theme="system"` 이면 OS 설정에 따른 값이다 —
 * 단, 서버 렌더링과 hydration 첫 렌더에서는 OS 설정을 몰라 'light' 이고, 그 직후 실제 값으로 다시 렌더링된다.
 */
export function useTheme(): ThemeName {
  return useContext(ThemeContext).theme;
}

/**
 * Portal 로 ThemeProvider 바깥(body)에 렌더링되는 요소에 펼쳐 넣을 props.
 * 현재 모드의 CSS 변수, 브랜드 오버라이드, 기본 글꼴을 다시 적용한다.
 *
 * @example const portal = usePortalProps(); <Content className={cx(portal.className, styles.content)} style={portal.style} />
 */
export function usePortalProps(): { className: string; style?: CSSProperties } {
  const { theme, pending, style } = useContext(ThemeContext);
  // OS 설정을 모르는 잠깐 동안은 미디어쿼리로 고르는 클래스(브랜드 오버라이드는 그 뒤 렌더링부터)
  return { className: cx(pending ? systemThemeClass : themeClass[theme], styles.portal), style };
}
