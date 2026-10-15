import { useRef } from 'react';

/**
 * Radix Dialog 는 닫힐 때 포커스를 Trigger 로 돌려보내는데, Trigger 없이 open 으로 제어하면 갈 곳이 없어
 * 포커스가 body 로 사라진다(키보드 사용자가 위치를 잃는다). 열릴 때 포커스가 있던 요소를 기억해 두고,
 * Trigger 가 없으면 닫힐 때 그 요소로 돌려보낸다. 사용하는 쪽의 onCloseAutoFocus 가 preventDefault 하면 그쪽이 우선한다.
 */
export function useReturnFocus(hasTrigger: boolean, onCloseAutoFocus?: (event: Event) => void) {
  const returnTo = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: () => {
      // FocusScope 가 안쪽으로 포커스를 옮기기 직전이라 아직 연 요소에 포커스가 있다
      returnTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    },
    onCloseAutoFocus: (event: Event) => {
      onCloseAutoFocus?.(event);
      if (event.defaultPrevented || hasTrigger) return;
      const target = returnTo.current;
      if (target && target.isConnected && target !== document.body) {
        event.preventDefault();
        target.focus();
      }
    },
  };
}
