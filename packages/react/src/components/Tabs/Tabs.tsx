import * as RadixTabs from '@radix-ui/react-tabs';
import { createContext, forwardRef, useContext, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Tabs.css';

type TabsStyle = { variant: 'line' | 'soft'; size: 'sm' | 'md' };
const TabsStyleContext = /* @__PURE__ */ createContext<TabsStyle>({ variant: 'line', size: 'md' });

export interface TabsProps extends ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  /** 시각적 스타일. line 은 밑줄, soft 는 배경이 있는 세그먼트 */
  variant?: 'line' | 'soft';
  /** 크기 */
  size?: 'sm' | 'md';
  /** 선택된 탭 (제어 모드) */
  value?: string;
  /** 처음 선택된 탭 (비제어 모드) */
  defaultValue?: string;
  /** 선택된 탭이 바뀔 때 호출된다 */
  onValueChange?: (value: string) => void;
  /**
   * automatic(기본): 방향키로 포커스를 옮기면 바로 선택된다.
   * manual: 방향키로 포커스만 옮기고 Enter/Space 로 선택한다 (탭 전환 비용이 클 때).
   */
  activationMode?: 'automatic' | 'manual';
  /**
   * horizontal(기본): 탭 목록이 위, ←/→ 로 이동.
   * vertical: 탭 목록이 왼쪽(내용은 오른쪽), ↑/↓ 로 이동. 탭이 많거나 이름이 길 때(설정 화면 등).
   */
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant = 'line', size = 'md', className, ...props },
  ref,
) {
  // value 를 넘기면 undefined 여도 제어 모드로 둔다 (uncontrolled → controlled 경고 방지)
  const controlled = 'value' in props ? { value: props.value ?? '' } : {};
  return (
    <TabsStyleContext.Provider value={{ variant, size }}>
      <RadixTabs.Root ref={ref} className={cx(styles.root, className)} {...props} {...controlled} />
    </TabsStyleContext.Provider>
  );
});

export type TabsListProps = ComponentPropsWithoutRef<typeof RadixTabs.List>;

/** 탭 버튼 목록 (role="tablist"). 접근 가능한 이름이 필요하면 aria-label 을 준다 */
export const TabsList = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, ...rest },
  ref,
) {
  const { variant } = useContext(TabsStyleContext);
  return <RadixTabs.List ref={ref} className={cx(styles.list({ variant }), className)} {...rest} />;
});

export interface TabsTriggerProps extends ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  /** 이 탭의 값. 같은 값을 가진 TabsContent 와 연결된다 */
  value: string;
}

export const TabsTrigger = /* @__PURE__ */ forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { className, ...rest },
  ref,
) {
  const { variant, size } = useContext(TabsStyleContext);
  return <RadixTabs.Trigger ref={ref} className={cx(styles.trigger({ variant, size }), className)} {...rest} />;
});

export interface TabsContentProps extends ComponentPropsWithoutRef<typeof RadixTabs.Content> {
  /** 연결할 TabsTrigger 의 값 */
  value: string;
}

export const TabsContent = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { className, ...rest },
  ref,
) {
  return <RadixTabs.Content ref={ref} className={cx(styles.content, className)} {...rest} />;
});
