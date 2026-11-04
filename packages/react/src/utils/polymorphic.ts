import type { ComponentPropsWithRef, ElementType, HTMLAttributes, ReactElement, RefAttributes } from 'react';

/**
 * `as` 로 다른 요소·컴포넌트를 그리는 컴포넌트(Stack·Card·Grid·Typography·Container·VisuallyHidden)의 타입.
 * - `as` 가 있으면 그 요소·컴포넌트의 props 와 ref 를 따른다 — `as="time"` 의 `dateTime`, `as="a"` 의 `href`, `as={Link}` 의 `href`.
 * - 맞지 않으면 1.x 와 같은 타입(`Props` + `Ref<RefElement>`)으로 한 번 더 확인한다. 그래서 1.x 에서 통과하던 코드
 *   (`useRef<HTMLElement>` 를 `as="ul"` 에 넘기기, 필수 props 를 빠뜨린 `as={Link}` 등)는 계속 통과한다.
 * 마지막 시그니처가 1.x 타입이라 `ComponentProps<typeof Stack>`·`ComponentRef<typeof Stack>` 도 1.x 와 같다
 * (TypeScript 는 겹친 시그니처 중 마지막 것으로 추론한다).
 *
 * `Base` 는 `Props` 가 물려받은 HTML 속성 타입 — 이것을 뺀 나머지가 컴포넌트 고유 props 이고, `as` 의 props 보다 우선한다
 * (Typography 의 `color` 처럼 HTML 속성과 이름이 겹치는 고유 prop 이 있으면 Base 에서 그 이름을 뺀다).
 */
export interface PolymorphicComponent<Props, RefElement, Base = HTMLAttributes<HTMLElement>> {
  <C extends ElementType>(
    props: { as: C } & Omit<Props, keyof Base | 'as'> &
      Omit<ComponentPropsWithRef<C>, Exclude<keyof Props, keyof Base>>,
  ): ReactElement | null;
  (props: Props & RefAttributes<RefElement>): ReactElement | null;
  displayName?: string;
}
