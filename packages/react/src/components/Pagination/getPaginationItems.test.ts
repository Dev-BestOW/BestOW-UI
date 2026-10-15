import { getPaginationItems } from './getPaginationItems';

const S = 'ellipsis-start';
const E = 'ellipsis-end';

describe('getPaginationItems', () => {
  it.each([
    // [page, total, 기대 결과]
    [1, 0, []],
    [1, 1, [1]],
    [1, 2, [1, 2]],
    [3, 5, [1, 2, 3, 4, 5]],
    [4, 7, [1, 2, 3, 4, 5, 6, 7]], // 7페이지 이하는 모두 보인다 (sibling 1, boundary 1)
    [1, 10, [1, 2, 3, 4, 5, E, 10]],
    [4, 10, [1, 2, 3, 4, 5, E, 10]],
    [5, 10, [1, S, 4, 5, 6, E, 10]],
    [6, 10, [1, S, 5, 6, 7, E, 10]],
    [7, 10, [1, S, 6, 7, 8, 9, 10]],
    [10, 10, [1, S, 6, 7, 8, 9, 10]],
  ] as const)('page %i / %i → %j', (page, total, expected) => {
    expect(getPaginationItems(page, total)).toEqual(expected);
  });

  it('total 이 8 이상이면 현재 페이지와 관계없이 항목 수가 7개로 일정하다', () => {
    for (let page = 1; page <= 20; page++) {
      expect(getPaginationItems(page, 20)).toHaveLength(7);
    }
  });

  it('현재 페이지는 항상 목록에 있고, 숫자는 오름차순이며 중복이 없다', () => {
    for (const total of [1, 2, 5, 8, 9, 15, 100]) {
      for (let page = 1; page <= total; page++) {
        const items = getPaginationItems(page, total);
        const numbers = items.filter((item): item is number => typeof item === 'number');
        expect(numbers).toContain(page);
        expect(numbers[0]).toBe(1);
        expect(numbers[numbers.length - 1]).toBe(total);
        expect(numbers).toEqual([...new Set(numbers)].sort((a, b) => a - b));
      }
    }
  });

  it('siblingCount 와 boundaryCount 를 반영한다', () => {
    expect(getPaginationItems(10, 20, 2)).toEqual([1, S, 8, 9, 10, 11, 12, E, 20]);
    expect(getPaginationItems(10, 20, 0)).toEqual([1, S, 10, E, 20]);
    expect(getPaginationItems(10, 20, 1, 2)).toEqual([1, 2, S, 9, 10, 11, E, 19, 20]);
    expect(getPaginationItems(10, 20, 1, 0)).toEqual([S, 9, 10, 11, E]);
  });
});
