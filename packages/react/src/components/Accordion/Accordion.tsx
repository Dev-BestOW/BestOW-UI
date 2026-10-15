import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@bestow-ui/icons';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Accordion.css';

/**
 * `type="single"`: 한 번에 하나만 열린다 (`value: string`). `collapsible` 이면 열린 항목을 다시 눌러 닫을 수 있다.
 * `type="multiple"`: 여러 개를 함께 열 수 있다 (`value: string[]`).
 */
export type AccordionProps = ComponentPropsWithoutRef<typeof RadixAccordion.Root>;

export const Accordion = /* @__PURE__ */ forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { className, ...props },
  ref,
) {
  // collapsible 은 single 전용이다. multiple 에 섞여 들어오면 Radix 가 DOM 까지 넘겨 React 경고가 나므로 뺀다
  // (single ↔ multiple 을 바꾸며 props 를 펼쳐 넘기는 경우, 예: Storybook args 병합)
  const { collapsible, ...multipleProps } = props as AccordionProps & { collapsible?: boolean };
  const typedProps = props.type === 'multiple' ? multipleProps : { ...multipleProps, collapsible };
  // value 를 넘기면 undefined 여도 제어 모드로 둔다 (uncontrolled → controlled 경고 방지)
  const rootProps = (
    'value' in props ? { ...typedProps, value: props.value ?? (props.type === 'multiple' ? [] : '') } : typedProps
  ) as AccordionProps;
  return <RadixAccordion.Root ref={ref} className={cx(styles.root, className)} {...rootProps} />;
});

export interface AccordionItemProps extends Omit<ComponentPropsWithoutRef<typeof RadixAccordion.Item>, 'title'> {
  /** 항목 값. Accordion 의 value 와 비교한다 */
  value: string;
  /** 항목 제목 (펼침 버튼의 이름) */
  title: ReactNode;
  /** 제목을 감싸는 heading 수준. 페이지의 heading 구조에 맞춘다 (기본 3) */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** 펼쳤을 때 보이는 내용 */
  children?: ReactNode;
}

export const AccordionItem = /* @__PURE__ */ forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { title, headingLevel = 3, className, children, ...rest },
  ref,
) {
  const Heading = `h${headingLevel}` as const;
  return (
    <RadixAccordion.Item ref={ref} className={cx(styles.item, className)} {...rest}>
      <RadixAccordion.Header asChild>
        <Heading className={styles.header}>
          <RadixAccordion.Trigger className={styles.trigger}>
            {title}
            <ChevronDownIcon size={18} className={styles.chevron} />
          </RadixAccordion.Trigger>
        </Heading>
      </RadixAccordion.Header>
      <RadixAccordion.Content className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
});
