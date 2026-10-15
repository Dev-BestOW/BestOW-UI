import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsProps } from './Tabs';

function Example(props: Partial<TabsProps> & { disableSecond?: boolean }) {
  const { disableSecond, ...rest } = props;
  return (
    <Tabs defaultValue="account" {...rest}>
      <TabsList aria-label="설정">
        <TabsTrigger value="account">계정</TabsTrigger>
        <TabsTrigger value="password" disabled={disableSecond}>
          비밀번호
        </TabsTrigger>
        <TabsTrigger value="billing">결제</TabsTrigger>
      </TabsList>
      <TabsContent value="account">계정 내용</TabsContent>
      <TabsContent value="password">비밀번호 내용</TabsContent>
      <TabsContent value="billing">결제 내용</TabsContent>
    </Tabs>
  );
}

const selectedTab = () => screen.getAllByRole('tab').find((tab) => tab.getAttribute('aria-selected') === 'true');

describe('Tabs', () => {
  it('tablist / tab / tabpanel 역할과 서로의 연결(aria-controls, aria-labelledby)을 갖춘다', () => {
    render(<Example />);
    expect(screen.getByRole('tablist', { name: '설정' })).toBeTruthy();
    expect(screen.getAllByRole('tab')).toHaveLength(3);

    const tab = screen.getByRole('tab', { name: '계정' });
    const panel = screen.getByRole('tabpanel', { name: '계정' });
    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.textContent).toBe('계정 내용');
    // 선택되지 않은 패널은 렌더링하지 않는다
    expect(screen.queryByText('결제 내용')).toBeNull();
  });

  it('탭을 클릭하면 선택이 바뀌고 onValueChange 가 호출된다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    await user.click(screen.getByRole('tab', { name: '결제' }));

    expect(onValueChange).toHaveBeenCalledWith('billing');
    expect(selectedTab()?.textContent).toBe('결제');
    expect(screen.getByRole('tabpanel').textContent).toBe('결제 내용');
  });

  it('방향키로 이동하면 바로 선택되고(automatic), Home/End 로 처음·끝으로 간다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('tab', { name: '계정' }));

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement?.textContent).toBe('비밀번호');
    expect(selectedTab()?.textContent).toBe('비밀번호');

    await user.keyboard('{End}');
    expect(selectedTab()?.textContent).toBe('결제');

    await user.keyboard('{ArrowRight}'); // 끝에서 처음으로 순환
    expect(selectedTab()?.textContent).toBe('계정');

    await user.keyboard('{Home}');
    expect(selectedTab()?.textContent).toBe('계정');
  });

  it('activationMode="manual" 이면 방향키는 포커스만 옮기고 Enter 로 선택한다', async () => {
    const user = userEvent.setup();
    render(<Example activationMode="manual" />);
    await user.click(screen.getByRole('tab', { name: '계정' }));

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement?.textContent).toBe('비밀번호');
    expect(selectedTab()?.textContent).toBe('계정');

    await user.keyboard('{Enter}');
    expect(selectedTab()?.textContent).toBe('비밀번호');
  });

  it('disabled 탭은 클릭해도 선택되지 않고 키보드 이동에서 건너뛴다', async () => {
    const user = userEvent.setup();
    render(<Example disableSecond />);
    const disabled = screen.getByRole('tab', { name: '비밀번호' });
    expect(disabled.hasAttribute('disabled')).toBe(true);

    await user.click(disabled);
    expect(selectedTab()?.textContent).toBe('계정');

    await user.click(screen.getByRole('tab', { name: '계정' }));
    await user.keyboard('{ArrowRight}');
    expect(selectedTab()?.textContent).toBe('결제');
  });

  it('Tab 키로 탭 목록에서 선택된 패널로 이동한다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('tab', { name: '계정' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('tabpanel'));
  });

  it('value 를 undefined 로 시작해도 제어 모드로 동작하고 경고가 없다', async () => {
    const user = userEvent.setup();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Controlled() {
      const [value, setValue] = useState<string>();
      return <Example defaultValue={undefined} value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    expect(selectedTab()).toBeUndefined();

    await user.click(screen.getByRole('tab', { name: '결제' }));
    expect(selectedTab()?.textContent).toBe('결제');

    const messages = [...warn.mock.calls, ...error.mock.calls].flat().join(' ');
    expect(messages).not.toMatch(/uncontrolled|controlled/);
    warn.mockRestore();
    error.mockRestore();
  });

  it('variant 에 따라 다른 클래스를 쓰고 ref·className 을 전달한다', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <Tabs ref={ref} className="root" defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const lineClass = screen.getByRole('tab').className;
    expect(ref.current?.classList.contains('root')).toBe(true);

    rerender(
      <Tabs ref={ref} variant="soft" defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(screen.getByRole('tab').className).not.toBe(lineClass);
  });
});
