import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from '../components/Alert';
import { Breadcrumb } from '../components/Breadcrumb';
import { Calendar } from '../components/Calendar';
import { Combobox } from '../components/Combobox';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { Spinner } from '../components/Spinner';
import { en } from './en';
import { LocaleProvider } from './LocaleProvider';

describe('LocaleProvider', () => {
  it('Provider 가 없으면 한국어 기본 문구를 쓴다', () => {
    render(<Breadcrumb items={[{ label: '홈' }]} />);
    expect(screen.getByRole('navigation', { name: '이동 경로' })).toBeTruthy();
  });

  it('영어 묶음(en)을 넣으면 여러 컴포넌트의 기본 문구가 바뀐다', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider messages={en}>
        <Breadcrumb items={[{ label: 'Home' }]} />
        <Pagination totalPages={3} defaultPage={2} />
        <Spinner />
        <Alert onClose={() => {}}>Saved</Alert>
        <Calendar today="2026-10-15" />
        <Combobox aria-label="City" options={[{ value: 'seoul', label: 'Seoul' }]} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeTruthy();
    // Combobox 에도 결과 없음 알림용 status 가 항상 있어 Spinner 것을 글자로 고른다
    expect(screen.getAllByRole('status').map((el) => el.textContent)).toContain('Loading');
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy(); // Alert
    // 달력: 제목·요일·날짜 이름 (날짜 이름은 보이는 숫자로 시작)
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Su' }).getAttribute('abbr')).toBe('Sunday');
    expect(screen.getByRole('button', { name: '15, Thursday, October 2026, today' })).toBeTruthy();
    // Combobox 결과 없음
    await user.type(screen.getByRole('combobox', { name: 'City' }), 'zz');
    expect(screen.getByText('No results')).toBeTruthy();
    // 스크린리더 알림도 같은 문구 (입력이 멈춘 뒤)
    await waitFor(() => expect(screen.getAllByRole('status').map((el) => el.textContent)).toContain('No results'));
  });

  it('열린 Modal 의 닫기 버튼도 바뀐다 (Modal 이 열리면 바깥은 숨겨지므로 따로 확인)', () => {
    render(
      <LocaleProvider messages={en}>
        <Modal defaultOpen title="Title" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('우선순위: 컴포넌트 prop > Provider > 한국어 기본값, 중첩하면 바깥을 이어받고 안쪽이 우선한다', () => {
    render(
      <LocaleProvider messages={{ breadcrumb: '바깥 경로', close: '창 닫기' }}>
        <LocaleProvider messages={{ breadcrumb: '안쪽 경로' }}>
          <Breadcrumb items={[{ label: '홈' }]} />
          <Breadcrumb items={[{ label: '홈' }]} aria-label="직접 준 이름" />
          <Alert onClose={() => {}}>내용</Alert>
        </LocaleProvider>
      </LocaleProvider>,
    );
    expect(screen.getByRole('navigation', { name: '안쪽 경로' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: '직접 준 이름' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '창 닫기' })).toBeTruthy(); // 바깥 값을 이어받음
  });
});
