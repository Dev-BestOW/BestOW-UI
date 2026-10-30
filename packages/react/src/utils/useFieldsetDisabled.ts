import { useSyncExternalStore, type RefObject } from 'react';

const noSubscribe = () => () => undefined;

/**
 * 감싸는 fieldset 이 disabled 인지 알려 준다. 네이티브 입력은 저절로 막히지만 span 으로 그린 컨트롤(Radix Slider)과
 * 끌어다 놓기는 막히지 않는다. fieldset 이 바뀌어도 알림이 없어 렌더링할 때마다 다시 읽는다.
 */
export function useFieldsetDisabled(ref: RefObject<Element | null>) {
  return useSyncExternalStore(
    noSubscribe,
    () => !!ref.current?.matches('fieldset:disabled *'),
    () => false,
  );
}
