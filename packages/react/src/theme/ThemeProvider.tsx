import { createContext, forwardRef, useContext, useMemo, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { themeClass, type ThemeName } from './contract.css';
import { mergeThemes, themeToStyle, type BestowTheme } from './createTheme';
import * as styles from './ThemeProvider.css';

interface ThemeContextValue {
  theme: ThemeName;
  overrides?: BestowTheme;
  /** 현재 모드의 오버라이드를 인라인 CSS 변수로 바꾼 값 (portal 에 다시 적용) */
  style?: CSSProperties;
}

const ThemeContext = /* @__PURE__ */ createContext<ThemeContextValue>({ theme: 'light' });

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** 라이트/다크 모드. 생략하면 바깥 ThemeProvider 의 모드를 이어받는다 (최상위는 light). */
  theme?: ThemeName;
  /**
   * createTheme 으로 만든 브랜드 테마. 모드를 바꿔도 유지되고, 중첩된 ThemeProvider 는 바깥 값을 이어받는다
   * (안쪽에서 준 값이 우선).
   */
  overrides?: BestowTheme;
}

export const ThemeProvider = /* @__PURE__ */ forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider(
  { theme: themeProp, overrides, className, style, children, ...rest },
  ref,
) {
  const parent = useContext(ThemeContext);
  const theme = themeProp ?? parent.theme;
  const merged = useMemo(() => mergeThemes(parent.overrides, overrides), [parent.overrides, overrides]);
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, overrides: merged, style: themeToStyle(merged, theme) }),
    [theme, merged],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        ref={ref}
        data-theme={theme}
        className={cx(themeClass[theme], styles.root, className)}
        style={value.style ? { ...value.style, ...style } : style}
        {...rest}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

/** 현재 적용 중인 모드(light/dark)를 반환한다. */
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
  const { theme, style } = useContext(ThemeContext);
  return { className: cx(themeClass[theme], styles.portal), style };
}

/**
 * @deprecated usePortalProps() 를 쓰세요. className 만으로는 overrides(브랜드 테마)가 portal 에 적용되지 않습니다.
 */
export function usePortalClassName(): string {
  return usePortalProps().className;
}
