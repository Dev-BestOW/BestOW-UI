import { useSyncExternalStore } from 'react';

const subscribeNothing = () => () => {};

/**
 * 서버 렌더링과 hydration 중에는 false, 그 뒤(그리고 처음부터 브라우저에서 그릴 때)는 true.
 * 서버와 브라우저가 다른 값을 내는 것(현재 날짜 등)을 hydration 이 끝난 뒤에만 쓰게 할 때 쓴다.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}
