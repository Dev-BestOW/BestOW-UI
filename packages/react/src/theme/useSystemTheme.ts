import { useSyncExternalStore } from 'react';
import type { ThemeName } from './contract.css';

const query = '(prefers-color-scheme: dark)';

const getMediaQuery = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query) : undefined);

function subscribe(onChange: () => void) {
  const mql = getMediaQuery();
  mql?.addEventListener('change', onChange);
  return () => mql?.removeEventListener('change', onChange);
}

const noopSubscribe = () => () => {};
const getSnapshot = (): ThemeName => (getMediaQuery()?.matches ? 'dark' : 'light');
const getLight = (): ThemeName => 'light';
// 서버는 OS 설정을 모른다 — null 이면 ThemeProvider 가 CSS 미디어쿼리로 그린다(systemThemeClass)
const getServerSnapshot = () => null;

/**
 * OS 의 라이트·다크 설정. 서버 렌더링과 hydration 첫 렌더에서는 null(그 뒤 바로 실제 값으로 다시 렌더링 — hydration 불일치 없음),
 * OS 설정을 바꾸면 따라 바뀐다. `enabled` 가 false 면 구독하지 않고 'light'.
 */
export function useSystemTheme(enabled: boolean): ThemeName | null {
  return useSyncExternalStore(
    enabled ? subscribe : noopSubscribe,
    enabled ? getSnapshot : getLight,
    enabled ? getServerSnapshot : getLight,
  );
}
