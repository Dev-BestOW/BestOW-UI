import { describe, expect, it } from 'vitest';
import { findKitPage, kitDates, kitDatesFor, kitPages } from './kit';

describe('쪽마다 고친 날', () => {
  it('modified 가 없으면 공통 날짜, 있으면 그 쪽 날짜', () => {
    const unchanged = kitPages.find((page) => !page.modified)!;
    expect(kitDatesFor(unchanged)).toEqual(kitDates);
    expect(kitDatesFor(findKitPage('amount-input')!)).toEqual({
      published: kitDates.published,
      modified: '2026-11-18',
    });
  });

  // 쪽 날짜가 공통 날짜보다 앞이면 모든 쪽을 고친 날보다 옛 날짜를 적은 것 — 지우거나 올린다
  it.each(kitPages.filter((page) => page.modified).map((page) => [page.slug, page.modified!] as const))(
    '%s 의 modified 는 YYYY-MM-DD 이고 공통 날짜보다 뒤',
    (_, modified) => {
      expect(modified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(modified > kitDates.modified).toBe(true);
    },
  );
});
