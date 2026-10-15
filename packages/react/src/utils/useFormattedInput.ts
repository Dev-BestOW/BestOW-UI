import { useLayoutEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type RefObject } from 'react';

interface Options {
  /** 제어 모드 여부와 값 (원본 — 서식 문자 없는 값) */
  isControlled: boolean;
  value: string | undefined;
  defaultValue: string | undefined;
  onValueChange?: (raw: string) => void;
  /** 입력 문자열에서 의미 있는 문자만 남긴다 (예: 숫자만) + 최대 길이 */
  sanitize: (input: string) => string;
  /** 원본 → 화면 표시 (예: "01012345678" → "010-1234-5678") */
  format: (raw: string) => string;
  /** 화면 표시의 한 글자가 의미 있는 문자인지 (서식 문자가 아닌지) */
  isMeaningful: (char: string) => boolean;
  inputRef: RefObject<HTMLInputElement | null>;
}

/** 서식 문자열에서 의미 있는 문자 count 개 바로 뒤의 위치 */
function caretAfter(display: string, count: number, isMeaningful: (char: string) => boolean): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < display.length; i++) {
    if (isMeaningful(display[i]!)) seen++;
    if (seen === count) return i + 1;
  }
  return display.length;
}

/**
 * 하이픈·쉼표처럼 서식이 붙는 입력창의 공통 동작.
 * - 원본 값(서식 없음)과 화면 표시를 나누고, onValueChange 에는 원본을 넘긴다.
 * - 서식 문자가 끼어들거나 빠져도 커서가 입력한 문자 바로 뒤에 머문다 (흔한 "커서가 끝으로 튀는" 문제 방지).
 * - 서식 문자 바로 뒤에서 Backspace(앞)·Delete(뒤)를 누르면 그 너머의 의미 있는 문자를 지운다
 *   (그대로 두면 서식 문자만 지워졌다가 다시 생겨 지워지지 않는 것처럼 보인다).
 */
export function useFormattedInput({
  isControlled,
  value,
  defaultValue,
  onValueChange,
  sanitize,
  format,
  isMeaningful,
  inputRef,
}: Options) {
  const [innerValue, setInnerValue] = useState(() => sanitize(defaultValue ?? ''));
  const raw = isControlled ? sanitize(value ?? '') : innerValue;
  const display = format(raw);
  // 다음 렌더 뒤 커서를 둘 위치 (의미 있는 문자 개수 기준)
  const pendingCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (pendingCaret.current === null || !input || document.activeElement !== input) return;
    const position = caretAfter(input.value, pendingCaret.current, isMeaningful);
    input.setSelectionRange(position, position);
    pendingCaret.current = null;
  });

  const commit = (next: string, caretCount: number) => {
    pendingCaret.current = caretCount;
    if (!isControlled) setInnerValue(next);
    if (next !== raw) onValueChange?.(next);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: typed, selectionStart } = event.target;
    const next = sanitize(typed);
    const before = sanitize(typed.slice(0, selectionStart ?? typed.length));
    commit(next, Math.min(before.length, next.length));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const { selectionStart: start, selectionEnd: end } = input;
    if (start === null || start !== end) return;
    const countBefore = (text: string) => [...text].filter(isMeaningful).length;
    if (event.key === 'Backspace' && start > 0 && !isMeaningful(input.value[start - 1]!)) {
      // 서식 문자 앞의 의미 있는 문자를 지운다
      const index = countBefore(input.value.slice(0, start)) - 1;
      if (index < 0) return;
      event.preventDefault();
      commit(raw.slice(0, index) + raw.slice(index + 1), index);
    } else if (event.key === 'Delete' && start < input.value.length && !isMeaningful(input.value[start]!)) {
      const index = countBefore(input.value.slice(0, start));
      if (index >= raw.length) return;
      event.preventDefault();
      commit(raw.slice(0, index) + raw.slice(index + 1), index);
    }
  };

  return { raw, display, onChange, onKeyDown };
}
