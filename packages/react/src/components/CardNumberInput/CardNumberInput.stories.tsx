import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardNumberInput } from './CardNumberInput';

const meta = {
  title: 'Korean Kit/CardNumberInput',
  component: CardNumberInput,
  tags: ['autodocs'],
  render: (args) => (
    <div style={{ width: 300 }}>
      <CardNumberInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '카드번호 입력이에요. 4자리씩 하이픈을 넣고(아메리칸 익스프레스는 4-6-5), 다 채우면 검사 공식(Luhn)으로 오타를 걸러요. 브라우저·비밀번호 관리자의 카드 자동 완성(`cc-number`)을 받아요. 실제로 쓸 수 있는 카드인지는 결제사가 확인해요. 다시 보여 줄 때는 `maskCardNumber` 로 가려요.',
      },
    },
  },
} satisfies Meta<typeof CardNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Valid: Story = { name: '올바른 번호', args: { defaultValue: '4111111111111111' } };

export const Amex: Story = { name: '아메리칸 익스프레스 (4-6-5)', args: { defaultValue: '378282246310005' } };

export const Invalid: Story = { name: '검증 실패', args: { defaultValue: '4111111111111112' } };
