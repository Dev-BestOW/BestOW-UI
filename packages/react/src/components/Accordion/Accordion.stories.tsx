import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from './Accordion';

const faq = [
  {
    value: 'refund',
    title: '환불은 어떻게 하나요?',
    body: '결제 후 7일 이내라면 설정 > 결제에서 바로 환불할 수 있어요.',
  },
  { value: 'plan', title: '플랜을 바꿀 수 있나요?', body: '언제든 바꿀 수 있어요. 남은 기간은 일할 계산해요.' },
  { value: 'team', title: '팀원을 초대하려면?', body: '설정 > 멤버에서 이메일로 초대해요.' },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { type: 'single', collapsible: true },
  // AccordionProps 는 Radix 의 single/multiple 유니온 타입이라 react-docgen 이 prop 을 풀지 못한다 → 자동 문서 표를 여기서 채운다
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      description: 'single: 하나만 펼침, multiple: 여러 개 펼침 (필수)',
      table: { type: { summary: "'single' | 'multiple'" } },
    },
    collapsible: {
      control: 'boolean',
      description: 'single 일 때 펼친 항목을 다시 눌러 접을 수 있다 (multiple 에서는 무시)',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    value: {
      control: false,
      description: '펼친 항목 (제어 모드). single 은 문자열, multiple 은 배열',
      table: { type: { summary: 'string | string[]' } },
    },
    defaultValue: {
      control: false,
      description: '처음 펼친 항목 (비제어 모드)',
      table: { type: { summary: 'string | string[]' } },
    },
    onValueChange: {
      control: false,
      description: '펼친 항목이 바뀔 때 호출된다',
      table: { type: { summary: '(value: string) => void | (value: string[]) => void' } },
    },
    disabled: {
      control: 'boolean',
      description: '모든 항목을 비활성화한다',
      table: { type: { summary: 'boolean' } },
    },
  },
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 520 }}>
      {faq.map((item) => (
        <AccordionItem key={item.value} value={item.value} title={item.title}>
          {item.body}
        </AccordionItem>
      ))}
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DefaultOpen: Story = {
  args: { type: 'single', collapsible: true, defaultValue: 'plan' },
};

export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['refund', 'team'] },
};

export const DisabledItem: Story = {
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 520 }}>
      <AccordionItem value="a" title="열 수 있는 항목">
        내용
      </AccordionItem>
      <AccordionItem value="b" title="준비 중인 항목" disabled>
        아직 볼 수 없어요.
      </AccordionItem>
    </Accordion>
  ),
};
