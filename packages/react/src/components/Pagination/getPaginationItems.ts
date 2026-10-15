export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

const range = (start: number, end: number) =>
  end < start ? [] : Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * 표시할 페이지 번호와 생략 부호(…) 목록을 만든다.
 * 현재 페이지가 움직여도 항목 개수가 일정하게 유지되어 버튼 위치가 흔들리지 않는다.
 *
 * @param page 현재 페이지 (1부터)
 * @param totalPages 전체 페이지 수
 * @param siblingCount 현재 페이지 양옆에 항상 보일 페이지 수
 * @param boundaryCount 처음과 끝에 항상 보일 페이지 수
 */
export function getPaginationItems(
  page: number,
  totalPages: number,
  siblingCount = 1,
  boundaryCount = 1,
): PaginationItem[] {
  if (totalPages < 1) return [];

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : totalPages - 1,
  );

  const items: PaginationItem[] = [...startPages];

  // 생략할 페이지가 하나뿐이면 … 대신 그 번호를 보여 준다
  if (siblingsStart > boundaryCount + 2) items.push('ellipsis-start');
  else if (boundaryCount + 1 < totalPages - boundaryCount) items.push(boundaryCount + 1);

  items.push(...range(siblingsStart, siblingsEnd));

  if (siblingsEnd < totalPages - boundaryCount - 1) items.push('ellipsis-end');
  else if (totalPages - boundaryCount > boundaryCount) items.push(totalPages - boundaryCount);

  items.push(...endPages);
  return items;
}
