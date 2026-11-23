import { describe, expect, test } from 'vitest';
import { koreanDateLabel } from './DocDates';

describe('koreanDateLabel', () => {
  test('앞자리 0 없이 한국어 날짜로', () => {
    expect(koreanDateLabel('2026-11-05')).toBe('2026년 11월 5일');
    expect(koreanDateLabel('2026-01-23')).toBe('2026년 1월 23일');
  });
});
