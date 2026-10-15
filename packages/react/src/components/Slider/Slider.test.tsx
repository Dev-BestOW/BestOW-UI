import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './Slider';

describe('Slider', () => {
  it('label 이 손잡이(slider)의 이름이 되고 값·범위를 aria 속성으로 알린다', () => {
    render(<Slider label="음량" defaultValue={[40]} min={0} max={100} />);
    const thumb = screen.getByRole('slider', { name: '음량' });
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('키보드로 값을 바꾸고 formatValue 가 aria-valuetext 와 화면 표시에 쓰인다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider
        label="투명도"
        defaultValue={[50]}
        step={10}
        showValue
        formatValue={(v) => `${v}%`}
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole('slider', { name: '투명도' });
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith([60]);
    expect(thumb.getAttribute('aria-valuenow')).toBe('60');
    expect(thumb.getAttribute('aria-valuetext')).toBe('60%');
    expect(screen.getByText('60%').getAttribute('aria-hidden')).toBe('true');

    await user.keyboard('{End}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('100');
  });

  it('범위 슬라이더는 손잡이마다 "레이블 + 최소/최대" 이름을 가진다', () => {
    render(<Slider label="가격" defaultValue={[20, 80]} />);
    expect(screen.getByRole('slider', { name: '가격 최소' }).getAttribute('aria-valuenow')).toBe('20');
    expect(screen.getByRole('slider', { name: '가격 최대' }).getAttribute('aria-valuenow')).toBe('80');
  });

  it('label 이 없으면 aria-label 을 쓰고, 범위면 thumbLabels 와 합친다', () => {
    const { unmount } = render(<Slider aria-label="음량" defaultValue={[10]} />);
    expect(screen.getByRole('slider', { name: '음량' })).toBeTruthy();
    unmount();
    render(<Slider aria-label="기간" defaultValue={[1, 5]} thumbLabels={['시작', '끝']} />);
    expect(screen.getByRole('slider', { name: '기간 시작' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: '기간 끝' })).toBeTruthy();
  });

  it('helperText 를 aria-describedby 로 연결한다', () => {
    render(<Slider label="밝기" helperText="어두우면 배터리가 오래가요." defaultValue={[50]} />);
    const thumb = screen.getByRole('slider', { name: '밝기' });
    const helper = screen.getByText('어두우면 배터리가 오래가요.');
    expect(thumb.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('value 를 undefined 로 시작해도 제어 모드로 동작하고 경고가 없다', async () => {
    const user = userEvent.setup();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Controlled() {
      const [value, setValue] = useState<number[]>();
      return <Slider label="값" value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    const thumb = screen.getByRole('slider', { name: '값' });
    expect(thumb.getAttribute('aria-valuenow')).toBe('0');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('1');
    expect(error.mock.calls.flat().join(' ')).not.toMatch(/uncontrolled|controlled/);
    error.mockRestore();
  });

  it('disabled 면 키보드로 바꿀 수 없다', async () => {
    const user = userEvent.setup();
    render(<Slider label="음량" defaultValue={[40]} disabled />);
    const thumb = screen.getByRole('slider', { name: '음량' });
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });
});
