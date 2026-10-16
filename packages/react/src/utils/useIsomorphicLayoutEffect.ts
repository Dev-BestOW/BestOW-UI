import { useEffect, useLayoutEffect } from 'react';

/**
 * 브라우저에서는 useLayoutEffect, 서버 렌더링에서는 useEffect.
 * React 18 은 서버에서 useLayoutEffect 를 부르면 "useLayoutEffect does nothing on the server" 경고를 남긴다.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
