import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

const bar = () => screen.getByRole('progressbar');
const indicator = () => bar().firstElementChild as HTMLElement;

describe('Progress', () => {
  it('label 이 progressbar 의 이름이 되고, 값·범위·값 텍스트를 aria 속성으로 알린다', () => {
    render(<Progress label="업로드" value={42} />);
    const progress = screen.getByRole('progressbar', { name: '업로드' });
    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuemax')).toBe('100');
    expect(progress.getAttribute('aria-valuenow')).toBe('42');
    expect(progress.getAttribute('aria-valuetext')).toBe('42%');
    expect(indicator().style.width).toBe('42%');
  });

  it('label 이 없으면 aria-label 을 이름으로 쓴다', () => {
    render(<Progress aria-label="페이지 불러오는 중" value={10} />);
    expect(screen.getByRole('progressbar', { name: '페이지 불러오는 중' })).toBeTruthy();
  });

  it('value 가 없으면 indeterminate — aria-valuenow·valuetext 를 넣지 않는다', () => {
    render(<Progress label="준비 중" />);
    expect(bar().hasAttribute('aria-valuenow')).toBe(false);
    expect(bar().hasAttribute('aria-valuetext')).toBe(false);
    expect(indicator().getAttribute('data-state')).toBe('indeterminate');
  });

  it('범위를 벗어난 값은 0 ~ max 로 맞춘다', () => {
    const { rerender } = render(<Progress label="p" value={150} />);
    expect(bar().getAttribute('aria-valuenow')).toBe('100');
    expect(indicator().getAttribute('data-state')).toBe('complete');
    rerender(<Progress label="p" value={-5} />);
    expect(bar().getAttribute('aria-valuenow')).toBe('0');
  });

  it('max 와 formatValue 로 값 텍스트를 바꾸고, showValue 면 화면에도 보여 준다 (화면용은 aria-hidden)', () => {
    render(<Progress label="온보딩" value={3} max={5} showValue formatValue={(v, m) => `${m}단계 중 ${v}단계`} />);
    expect(bar().getAttribute('aria-valuetext')).toBe('5단계 중 3단계');
    expect(indicator().style.width).toBe('60%');
    const visible = screen.getByText('5단계 중 3단계');
    expect(visible.getAttribute('aria-hidden')).toBe('true');
  });

  it('ref, className, HTML 속성은 바깥 요소에 전달한다', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} className="custom" data-testid="root" label="p" value={1} />);
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(ref.current?.contains(bar())).toBe(true);
  });
});
