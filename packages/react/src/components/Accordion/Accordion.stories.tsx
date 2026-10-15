import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from './Accordion';

const faq = [
  { value: 'refund', title: '환불은 어떻게 하나요?', body: '결제 후 7일 이내라면 설정 > 결제에서 바로 환불할 수 있어요.' },
  { value: 'plan', title: '플랜을 바꿀 수 있나요?', body: '언제든 바꿀 수 있어요. 남은 기간은 일할 계산해요.' },
  { value: 'team', title: '팀원을 초대하려면?', body: '설정 > 멤버에서 이메일로 초대해요.' },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { type: 'single', collapsible: true },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
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
