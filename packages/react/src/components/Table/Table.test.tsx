import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './Table';

function Example(props: Partial<React.ComponentProps<typeof Table>>) {
  return (
    <Table {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead align="right">금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead>김하늘</TableHead>
          <TableCell align="right">1,000원</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableHead>합계</TableHead>
          <TableCell align="right">1,000원</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe('Table', () => {
  it('caption 이 표와 스크롤 영역의 이름이 된다', () => {
    render(<Example caption="최근 결제" />);
    expect(screen.getByRole('table', { name: '최근 결제' })).toBeTruthy();
    expect(screen.getByRole('region', { name: '최근 결제' })).toBeTruthy();
  });

  it('caption 이 없으면 aria-label 을 이름으로 쓴다', () => {
    render(<Example aria-label="결제 내역" />);
    expect(screen.getByRole('table', { name: '결제 내역' })).toBeTruthy();
    expect(screen.getByRole('region', { name: '결제 내역' })).toBeTruthy();
  });

  it('스크롤 영역은 키보드로 스크롤할 수 있게 포커스를 받는다', async () => {
    const user = userEvent.setup();
    render(<Example caption="표" />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('region', { name: '표' }));
  });

  it('머리 셀은 위치에 따라 scope 를 정한다 (thead → col, tbody·tfoot → row)', () => {
    render(<Example caption="표" />);
    expect(screen.getByRole('columnheader', { name: '이름' }).getAttribute('scope')).toBe('col');
    expect(screen.getByRole('rowheader', { name: '김하늘' }).getAttribute('scope')).toBe('row');
    expect(screen.getByRole('rowheader', { name: '합계' }).getAttribute('scope')).toBe('row');
  });

  it('onSort 를 주면 머리 셀이 정렬 버튼이 되고, 정렬 상태를 aria-sort 로 알린다', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    const { rerender } = render(
      <Table caption="표">
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="none" onSort={onSort}>
              금액
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    const header = screen.getByRole('columnheader', { name: '금액' });
    expect(header.hasAttribute('aria-sort')).toBe(false);
    await user.click(within(header).getByRole('button', { name: '금액' }));
    expect(onSort).toHaveBeenCalledTimes(1);

    rerender(
      <Table caption="표">
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="descending" onSort={onSort}>
              금액
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(screen.getByRole('columnheader', { name: '금액' }).getAttribute('aria-sort')).toBe('descending');
  });

  it('onSort 가 없으면 버튼이 아니다', () => {
    render(<Example caption="표" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('selected 행을 data-state 로 표시하고, ref·className 을 전달한다', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref} className="custom" aria-label="표">
        <TableBody>
          <TableRow selected data-testid="row">
            <TableCell>내용</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current).toBe(screen.getByRole('table'));
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(screen.getByTestId('row').getAttribute('data-state')).toBe('selected');
  });
});
