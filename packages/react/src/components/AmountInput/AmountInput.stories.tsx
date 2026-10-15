import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { AmountInput } from './AmountInput';

const meta = {
  title: 'Korean Kit/AmountInput',
  component: AmountInput,
  tags: ['autodocs'],
  render: (args) => (
    <div style={{ width: 300 }}>
      <AmountInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '금액 입력이에요. 천 단위 쉼표와 단위("원")를 붙이고, 아래에 "12만 5,000원" 처럼 읽기 쉬운 금액을 보여 줘요. 값은 숫자로 넘겨요. `formatKoreanAmount` 함수도 따로 쓸 수 있어요.',
      },
    },
  },
} satisfies Meta<typeof AmountInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = { name: '입력된 상태', args: { label: '송금액', defaultValue: 1250000 } };

export const WithMax: Story = {
  name: '최댓값',
  args: { label: '충전 금액', max: 2000000, helperText: '한 번에 200만원까지 충전할 수 있어요.' },
};

/** 실제 브라우저에서 쉼표가 늘어날 때 커서 위치를 확인한다 */
export const CaretStays: Story = {
  name: '쉼표가 생겨도 커서 유지',
  args: { defaultValue: 999 },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: '금액' }) as HTMLInputElement;
    await expect(input.value).toBe('999');
    input.focus();
    input.setSelectionRange(0, 0); // "|999"
    await userEvent.keyboard('1'); // 1999 → "1,999" (쉼표가 생긴다)
    await expect(input.value).toBe('1,999');
    await expect(input.selectionStart).toBe(1); // "1|,999"
  },
};

function ControlledDemo() {
  const [amount, setAmount] = useState<number | null>(null);
  return (
    <Stack gap={3} style={{ width: 300 }}>
      <AmountInput label="송금액" value={amount} onValueChange={setAmount} />
      <Typography variant="body-sm" color="muted">
        넘어오는 값: {amount === null ? 'null' : amount}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = { name: '값은 숫자', render: () => <ControlledDemo /> };
