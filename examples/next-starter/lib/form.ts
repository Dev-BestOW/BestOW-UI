import type { ErrorSummaryItem } from '@bestow-ui/react';
import type { FieldErrors as RhfErrors, FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { FieldErrors } from './schemas';

/** react-hook-form 의 오류를 ErrorSummary 목록으로 — 칸 id 는 `${prefix}-${칸 이름}` 으로 맞춰 둔다 */
export function toSummary<T extends FieldValues>(errors: RhfErrors<T>, prefix: string): ErrorSummaryItem[] {
  return Object.entries(errors).map(([name, error]) => ({
    id: `${prefix}-${name}`,
    message: String((error as { message?: unknown } | undefined)?.message ?? ''),
  }));
}

/** 서버 액션이 돌려준 칸별 오류를 폼에 붙인다. 오류 요약이 다시 나타나며 포커스를 받는다 */
export function applyServerErrors<T extends FieldValues>(
  fieldErrors: FieldErrors<T> | undefined,
  setError: UseFormSetError<T>,
) {
  for (const [name, message] of Object.entries(fieldErrors ?? {})) {
    if (message) setError(name as Path<T>, { type: 'server', message: message as string });
  }
}
