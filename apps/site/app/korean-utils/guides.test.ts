import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { findKitPage } from '../components/kit';
import { bankCodesCheckedAt, findGuide, guideDates, guideDatesFor, guides } from './guides';

describe('guides 의 React 컴포넌트 연결', () => {
  // slug 를 잘못 적으면 함수 쪽의 "문서 보기" 링크가 없는 쪽(404)으로 간다
  it.each(guides.filter((guide) => guide.component).map((guide) => [guide.slug, guide.component!] as const))(
    '%s → 같은 이름의 컴포넌트 문서 쪽',
    (_, component) => {
      expect(findKitPage(component.slug)?.name).toBe(component.name);
    },
  );
});

describe('쪽마다 고친 날', () => {
  it('modified 가 없으면 공통 날짜, 있으면 그 쪽 날짜', () => {
    const unchanged = guides.find((guide) => !guide.modified)!;
    expect(guideDatesFor(unchanged)).toEqual(guideDates);
    expect(guideDatesFor(findGuide('resident-number')!)).toEqual({
      published: guideDates.published,
      modified: '2026-11-23',
    });
  });

  // 쪽 날짜가 공통 날짜보다 앞이면 모든 쪽을 고친 날보다 옛 날짜를 적은 것 — 지우거나 올린다
  it.each(guides.filter((guide) => guide.modified).map((guide) => [guide.slug, guide.modified!] as const))(
    '%s 의 modified 는 YYYY-MM-DD 이고 공통 날짜보다 뒤',
    (_, modified) => {
      expect(modified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(modified > guideDates.modified).toBe(true);
    },
  );
});

describe('은행 코드표 기준 달', () => {
  it('korean-utils bank.ts 주석의 기준 달과 같다', () => {
    const source = readFileSync(new URL('../../../../packages/korean-utils/src/bank.ts', import.meta.url), 'utf8');
    expect(source.match(/(\d{4}-\d{2}) 기준/)?.[1]).toBe(bankCodesCheckedAt.month);
    const [year, month] = bankCodesCheckedAt.month.split('-');
    expect(bankCodesCheckedAt.label).toBe(`${year}년 ${Number(month)}월`);
  });
});
