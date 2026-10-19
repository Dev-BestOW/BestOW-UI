import { useCallback, useState, type ChangeEvent } from 'react';

/**
 * 표 행 선택 상태. 페이지를 넘겨도 선택은 유지되고, "이 페이지 모두 선택" 체크박스(혼합 상태 포함)와 행 체크박스에
 * 바로 펼쳐 쓰는 prop 을 돌려준다.
 *
 * ```tsx
 * const selection = useTableSelection<string>();
 * <Checkbox aria-label="이 페이지 모두 선택" {...selection.selectAllProps(pageIds)} />
 * <Checkbox aria-label={`${row.id} 선택`} {...selection.rowProps(row.id)} />
 * <TableRow selected={selection.isSelected(row.id)}>
 * ```
 */
export function useTableSelection<Id extends string | number = string>(initial: Id[] = []) {
  const [selected, setSelected] = useState<Id[]>(initial);

  const isSelected = useCallback((id: Id) => selected.includes(id), [selected]);

  const toggle = useCallback((id: Id, checked?: boolean) => {
    setSelected((prev) => {
      const on = checked ?? !prev.includes(id);
      if (on) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((value) => value !== id);
    });
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  /** "이 페이지 모두 선택" 체크박스용 — 모두 선택이면 checked, 일부면 indeterminate. 누르면 이 페이지를 모두 선택/해제 */
  const selectAllProps = (pageIds: Id[]) => {
    const all = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
    const some = pageIds.some((id) => selected.includes(id));
    return {
      checked: all,
      indeterminate: !all && some,
      onChange: () =>
        setSelected((prev) =>
          all ? prev.filter((id) => !pageIds.includes(id)) : [...prev, ...pageIds.filter((id) => !prev.includes(id))],
        ),
    };
  };

  /** 행 체크박스용 */
  const rowProps = (id: Id) => ({
    checked: selected.includes(id),
    onChange: (event: ChangeEvent<HTMLInputElement>) => toggle(id, event.target.checked),
  });

  return { selected, setSelected, isSelected, toggle, clear, selectAllProps, rowProps };
}
