import { createContext, forwardRef, useContext, type HTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { themeClass, type ThemeName } from './contract.css';
import * as styles from './ThemeProvider.css';

const ThemeContext = createContext<ThemeName>('light');

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** 적용할 테마. 중첩해서 일부 영역만 다른 테마를 적용할 수도 있다. */
  theme?: ThemeName;
}

export const ThemeProvider = forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider(
  { theme = 'light', className, children, ...rest },
  ref,
) {
  return (
    <ThemeContext.Provider value={theme}>
      <div ref={ref} data-theme={theme} className={cx(themeClass[theme], styles.root, className)} {...rest}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

/** 현재 적용 중인 테마 이름을 반환한다. */
export function useTheme(): ThemeName {
  return useContext(ThemeContext);
}
