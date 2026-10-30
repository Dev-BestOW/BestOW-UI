import { useEffect, useRef, type RefObject } from 'react';

/**
 * 감싸는 form 이 reset 될 때 onReset 을 부른다. 안에서 상태로 값을 드는 컴포넌트는 네이티브 reset 이 닿지 않는다.
 * 비제어 모드는 처음 값으로 돌아가고, 제어 모드는 값을 건드리지 않는다 — react-hook-form 의 reset() 도 form.reset() 을 부르므로
 * 제어 모드에서 옛 값을 알리면 새 값을 덮어쓴다.
 */
export function useFormReset(ref: RefObject<Element | null>, onReset: () => void) {
  // form 은 마운트 때 한 번 찾으므로 최신 함수를 ref 로 부른다
  const latest = useRef(onReset);
  useEffect(() => {
    latest.current = onReset;
  });

  useEffect(() => {
    const form = ref.current?.closest('form');
    if (!form) return;
    const handleReset = () => latest.current();
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [ref]);
}
