import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';
import { useMessages } from '../../i18n/LocaleProvider';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { TagGroupContext, type TagGroupContextValue } from './Tag';
import * as styles from './Tag.css';

/** 포커스를 옮긴 뒤 알림을 넣기까지 — 포커스 이동과 같은 순간이면 VoiceOver 가 버린다(FileUpload 와 같은 값) */
const REMOVED_ANNOUNCE_DELAY = 500;
/** 삭제를 누른 뒤 이 시간 안에 목록이 줄어야 포커스를 옮긴다 (지우지 않았는데 나중에 엉뚱하게 옮기지 않게) */
const PENDING_TIMEOUT = 1000;

export interface TagGroupProps extends HTMLAttributes<HTMLUListElement> {
  /** Tag 들. 하나씩 목록 항목(li)으로 감싼다 */
  children?: ReactNode;
  /** 목록 이름 (스크린리더) — 예: "고른 필터". 화면에 제목이 있으면 aria-labelledby */
  'aria-label'?: string;
}

/**
 * Tag 목록. 줄바꿈되는 가로 나열(ul)이고, 안의 Tag 를 지우면 포커스를 그 자리의 다음 태그(없으면 앞 태그) 삭제 버튼으로
 * 옮긴 뒤 "… 삭제됨" 을 알린다. 마지막 태그까지 지우면 목록 자체(tabIndex -1)로 포커스를 둔다 — 포커스가 페이지 처음으로 사라지지 않게.
 */
export const TagGroup = /* @__PURE__ */ forwardRef<HTMLUListElement, TagGroupProps>(function TagGroup(
  { children, className, ...rest },
  ref,
) {
  const m = useMessages();
  const listRef = useRef<HTMLUListElement>(null);
  const pending = useRef<{ index: number; count: number; at: number } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const items = () => [...(listRef.current?.children ?? [])] as HTMLElement[];

  const context = useMemo<TagGroupContextValue>(
    () => ({
      beforeRemove: (element, label) => {
        const list = items();
        const index = list.findIndex((item) => item.contains(element));
        if (index < 0) return;
        pending.current = { index, count: list.length, at: Date.now() };
        clearTimeout(timer.current);
        setAnnouncement('');
        timer.current = setTimeout(
          () => setAnnouncement(m.tagRemoved?.(label) ?? `${label} 삭제됨`),
          REMOVED_ANNOUNCE_DELAY,
        );
      },
    }),
    [m],
  );

  // 지운 뒤 다시 그려졌을 때: 그 자리(다음 태그) → 앞 태그 → 목록 순서로 포커스
  useIsomorphicLayoutEffect(() => {
    const target = pending.current;
    if (!target) return;
    if (Date.now() - target.at > PENDING_TIMEOUT) {
      pending.current = null;
      return;
    }
    const list = items();
    if (list.length >= target.count) return;
    pending.current = null;
    const item = list[Math.min(target.index, list.length - 1)];
    const button = item?.querySelector<HTMLElement>('[data-tag-remove]:not(:disabled)');
    (button ?? listRef.current)?.focus();
  });

  return (
    <TagGroupContext.Provider value={context}>
      <ul ref={mergeRefs(ref, listRef)} tabIndex={-1} className={cx(styles.group, className)} {...rest}>
        {Children.toArray(children).map((child, index) => (
          <li key={isValidElement(child) && child.key !== null ? child.key : index} className={styles.groupItem}>
            {child}
          </li>
        ))}
      </ul>
      <div role="status" className={visuallyHidden}>
        {announcement}
      </div>
    </TagGroupContext.Provider>
  );
});
