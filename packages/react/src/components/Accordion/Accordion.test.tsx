import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, type AccordionProps } from './Accordion';

function Example(props: Partial<AccordionProps> & { disableSecond?: boolean }) {
  const { disableSecond, ...rest } = props;
  return (
    <Accordion {...({ type: 'single', ...rest } as AccordionProps)}>
      <AccordionItem value="refund" title="환불은 어떻게 하나요?">
        결제 후 7일 이내에 환불할 수 있어요.
      </AccordionItem>
      <AccordionItem value="plan" title="플랜을 바꿀 수 있나요?" disabled={disableSecond}>
        언제든 바꿀 수 있어요.
      </AccordionItem>
      <AccordionItem value="team" title="팀원을 초대하려면?">
        설정 &gt; 멤버에서 초대해요.
      </AccordionItem>
    </Accordion>
  );
}

const button = (name: string) => screen.getByRole('button', { name });
const REFUND = '환불은 어떻게 하나요?';
const PLAN = '플랜을 바꿀 수 있나요?';
const TEAM = '팀원을 초대하려면?';

describe('Accordion', () => {
  it('각 제목은 heading(기본 h3) 안의 버튼이고, 닫혀 있으면 aria-expanded=false 이며 내용이 없다', () => {
    render(<Example />);
    const heading = screen.getByRole('heading', { level: 3, name: REFUND });
    expect(heading.contains(button(REFUND))).toBe(true);
    expect(button(REFUND).getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('headingLevel 로 heading 수준을 바꾼다', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="a" title="질문" headingLevel={2}>
          답
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('heading', { level: 2, name: '질문' })).toBeTruthy();
  });

  it('클릭하면 펼쳐지고, 내용은 제목을 이름으로 가진 region 으로 aria-controls 와 연결된다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(button(REFUND));

    const region = screen.getByRole('region', { name: REFUND });
    expect(button(REFUND).getAttribute('aria-expanded')).toBe('true');
    expect(button(REFUND).getAttribute('aria-controls')).toBe(region.id);
    expect(region.textContent).toBe('결제 후 7일 이내에 환불할 수 있어요.');
  });

  it('single: 다른 항목을 열면 이전 항목은 닫힌다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.click(button(REFUND));
    await user.click(button(TEAM));

    expect(onValueChange).toHaveBeenLastCalledWith('team');
    expect(button(REFUND).getAttribute('aria-expanded')).toBe('false');
    expect(button(TEAM).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByRole('region')).toHaveLength(1);
  });

  it('single: collapsible 이 없으면 열린 항목을 다시 눌러도 닫히지 않고, 있으면 닫힌다', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Example />);
    await user.click(button(REFUND));
    await user.click(button(REFUND));
    expect(button(REFUND).getAttribute('aria-expanded')).toBe('true');
    // 닫을 수 없는 열린 항목은 aria-disabled 로 알린다
    expect(button(REFUND).getAttribute('aria-disabled')).toBe('true');
    unmount();

    render(<Example collapsible />);
    await user.click(button(REFUND));
    await user.click(button(REFUND));
    expect(button(REFUND).getAttribute('aria-expanded')).toBe('false');
  });

  it('multiple: 여러 항목을 함께 열고 onValueChange 는 배열을 받는다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example type="multiple" onValueChange={onValueChange} />);
    await user.click(button(REFUND));
    await user.click(button(TEAM));

    expect(onValueChange).toHaveBeenLastCalledWith(['refund', 'team']);
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  it('키보드: 방향키·Home/End 로 제목 사이를 이동하고 Enter/Space 로 펼치고 접는다', async () => {
    const user = userEvent.setup();
    render(<Example collapsible />);
    button(REFUND).focus();

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(button(PLAN));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(button(TEAM));
    await user.keyboard('{ArrowDown}'); // 끝에서 처음으로 순환
    expect(document.activeElement).toBe(button(REFUND));
    await user.keyboard('{End}{Home}');
    expect(document.activeElement).toBe(button(REFUND));

    await user.keyboard('{Enter}');
    expect(button(REFUND).getAttribute('aria-expanded')).toBe('true');
    await user.keyboard(' ');
    expect(button(REFUND).getAttribute('aria-expanded')).toBe('false');
  });

  it('disabled 항목은 펼쳐지지 않고 방향키 이동에서 건너뛴다', async () => {
    const user = userEvent.setup();
    render(<Example disableSecond />);
    expect(button(PLAN).hasAttribute('disabled')).toBe(true);

    await user.click(button(PLAN));
    expect(button(PLAN).getAttribute('aria-expanded')).toBe('false');

    button(REFUND).focus();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(button(TEAM));
  });

  it.each(['single', 'multiple'] as const)(
    '%s: value 를 undefined 로 시작해도 제어 모드로 동작하고 경고가 없다',
    async (type) => {
      const user = userEvent.setup();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      function Controlled() {
        const [value, setValue] = useState<string | string[]>();
        return <Example {...({ type, value, onValueChange: setValue } as Partial<AccordionProps>)} />;
      }
      render(<Controlled />);
      expect(screen.queryByRole('region')).toBeNull();

      await user.click(button(TEAM));
      expect(screen.getByRole('region', { name: TEAM })).toBeTruthy();

      const messages = [...warn.mock.calls, ...error.mock.calls].flat().join(' ');
      expect(messages).not.toMatch(/uncontrolled|controlled/);
      warn.mockRestore();
      error.mockRestore();
    },
  );

  it('ref 와 className 을 전달한다', () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <Accordion ref={rootRef} type="single" className="root">
        <AccordionItem ref={itemRef} value="a" title="질문" className="item" />
      </Accordion>,
    );
    expect(rootRef.current?.classList.contains('root')).toBe(true);
    expect(itemRef.current?.classList.contains('item')).toBe(true);
  });
});
