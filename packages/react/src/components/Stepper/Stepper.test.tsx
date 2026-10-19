import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { Stepper } from './Stepper';

const steps = [
  { label: '약관 동의' },
  { label: '정보 입력', description: '이름·연락처' },
  { label: '본인 인증' },
  { label: '가입 완료' },
];

describe('Stepper', () => {
  it('이름 있는 순서 목록(ol)이고 단계마다 항목(li)이다', () => {
    render(<Stepper steps={steps} current={1} />);
    const list = screen.getByRole('list', { name: '진행 단계' });
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(4);
  });

  it('현재 단계만 aria-current="step" 이고, 앞 단계는 "(완료)" 를 함께 읽는다', () => {
    render(<Stepper steps={steps} current={2} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.getAttribute('aria-current'))).toEqual([null, null, 'step', null]);
    expect(items.map((item) => item.getAttribute('data-status'))).toEqual([
      'complete',
      'complete',
      'current',
      'upcoming',
    ]);
    // 숫자·체크 표시는 숨기고 이름과 상태만 읽는다
    expect(items[0]!.querySelector('[aria-hidden="true"]')).toBeTruthy();
    expect(items[0]!.textContent?.replace(items[0]!.querySelector('[aria-hidden]')!.textContent ?? '', '')).toBe(
      '약관 동의 (완료)',
    );
    expect(items[2]!.textContent).toBe('3본인 인증');
    expect(within(items[3]!).queryByText(/완료\)/)).toBeNull();
  });

  it('완료한 단계는 숫자 대신 체크 표시, 나머지는 단계 번호', () => {
    render(<Stepper steps={steps} current={1} />);
    const [first, second] = screen.getAllByRole('listitem');
    expect(first!.querySelector('[aria-hidden] svg')).toBeTruthy();
    expect(second!.querySelector('[aria-hidden]')!.textContent).toBe('2');
  });

  it('current 가 steps.length 면 모두 완료', () => {
    render(<Stepper steps={steps} current={4} />);
    expect(screen.getAllByRole('listitem').every((item) => item.getAttribute('data-status') === 'complete')).toBe(true);
    expect(screen.queryByRole('listitem', { current: 'step' })).toBeNull();
  });

  it('설명을 보여 주고, aria-label·ref·className 을 전달한다', () => {
    const ref = createRef<HTMLOListElement>();
    render(<Stepper ref={ref} steps={steps} current={0} aria-label="회원가입 단계" className="custom" />);
    const list = screen.getByRole('list', { name: '회원가입 단계' });
    expect(ref.current).toBe(list);
    expect(list.classList.contains('custom')).toBe(true);
    expect(screen.getByText('이름·연락처')).toBeTruthy();
  });

  it('문구는 LocaleProvider 로 바꿀 수 있다', () => {
    render(
      <LocaleProvider messages={en}>
        <Stepper steps={steps} current={1} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('list', { name: 'Progress' })).toBeTruthy();
    expect(screen.getByText('(completed)', { exact: false })).toBeTruthy();
  });
});
