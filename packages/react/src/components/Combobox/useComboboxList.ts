import { useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react';
import { ANNOUNCE_DELAY } from '../../utils/useDelayedAnnouncement';
import type { ComboboxOption } from './Combobox';

export const defaultComboboxFilter = (option: ComboboxOption, query: string) =>
  option.label.toLowerCase().includes(query.trim().toLowerCase());

/**
 * 한글 조합 중의 키는 조합을 끝내는 입력이다. 여기서 항목을 고르면 조합이 끝나며 글자가 이름 뒤에 붙는다("국민은행국").
 * Safari 는 조합을 끝낸 뒤 isComposing=false 로 보내 keyCode 229 로도 확인한다.
 */
export const isComposingKey = (event: KeyboardEvent<HTMLInputElement>) =>
  event.nativeEvent.isComposing || event.keyCode === 229;

interface Params {
  id?: string;
  options: ComboboxOption[];
  filter: (option: ComboboxOption, query: string) => boolean;
  disabled?: boolean;
  /** 목록을 열 때 이 항목을 가리킨다 */
  isSelected: (option: ComboboxOption) => boolean;
  /** 이동·선택에서 건너뛸 항목 (기본: option.disabled) */
  isDisabled?: (option: ComboboxOption) => boolean;
}

/**
 * Combobox·MultiCombobox 가 함께 쓰는 목록 상태 (내부용).
 * 열림·검색어·활성 항목, 거르기, 이동, 활성 항목 스크롤, "결과가 없어요" 지연 알림을 맡는다. 선택 값은 부르는 쪽이 든다.
 */
export function useComboboxList({ id, options, filter, disabled, isSelected, isDisabled }: Params) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-listbox`;
  const optionId = (index: number) => `${inputId}-option-${index}`;
  const skip = isDisabled ?? ((option: ComboboxOption) => Boolean(option.disabled));

  const [open, setOpen] = useState(false);
  // 사용자가 입력 중일 때만 query 로 거른다 (null = 입력하지 않음)
  const [query, setQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = useMemo(() => (query ? options.filter((o) => filter(o, query)) : options), [options, filter, query]);

  const firstEnabled = (list: ComboboxOption[], from = 0, step = 1) => {
    for (let i = from; i >= 0 && i < list.length; i += step) if (!skip(list[i]!)) return i;
    return -1;
  };

  const openList = (list: ComboboxOption[] = filtered, preferLast = false) => {
    setOpen(true);
    const selectedIndex = list.findIndex(isSelected);
    setActiveIndex(
      selectedIndex >= 0 && !skip(list[selectedIndex]!)
        ? selectedIndex
        : preferLast
          ? firstEnabled(list, list.length - 1, -1)
          : firstEnabled(list),
    );
  };

  const reset = () => {
    setOpen(false);
    setQuery(null);
    setActiveIndex(-1);
  };

  const move = (step: 1 | -1) => {
    const start = activeIndex < 0 ? (step === 1 ? 0 : filtered.length - 1) : activeIndex + step;
    const next = firstEnabled(filtered, start, step);
    if (next >= 0) setActiveIndex(next);
  };

  /** 입력창 글자가 바뀌었을 때 */
  const changeQuery = (nextQuery: string) => {
    const nextList = nextQuery ? options.filter((o) => filter(o, nextQuery)) : options;
    setQuery(nextQuery);
    setOpen(true);
    // 모두 지웠을 때는 아무 항목도 가리키지 않는다 — 그대로 Enter 를 누르면 첫 항목이 고르지 않는다
    setActiveIndex(nextQuery ? firstEnabled(nextList) : -1);
  };

  // 키보드로 옮긴 항목이 보이도록 스크롤한다
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
    // optionId 는 inputId 에서 만들어지므로 의존성에서 뺀다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  const hasOptions = filtered.length > 0;
  const noResults = open && !disabled && !hasOptions;

  // "결과가 없어요" 알림은 입력이 잠시 멈춘 뒤 넣는다. 글자를 칠 때 바로 바꾸면 VoiceOver 가 입력한 글자를 읽느라
  // 이 알림을 버렸다(스크린리더 수동 점검 2026-10-21, GOV.UK accessible-autocomplete 도 같은 이유로 늦춘다).
  // 어떤 입력에 대한 알림인지 기억해, 입력이 바뀌면 다시 기다린다.
  const [announcedFor, setAnnouncedFor] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    if (!noResults) return;
    const timer = setTimeout(() => setAnnouncedFor(query), ANNOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [noResults, query]);
  const announceNoResults = noResults && announcedFor === query;

  return {
    inputId,
    listId,
    optionId,
    open,
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    filtered,
    hasOptions,
    isDisabled: skip,
    openList,
    reset,
    move,
    changeQuery,
    announceNoResults,
  };
}
