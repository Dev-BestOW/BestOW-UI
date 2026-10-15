import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { PhoneNumberInput } from './PhoneNumberInput';

const meta = {
  title: 'Korean Kit/PhoneNumberInput',
  component: PhoneNumberInput,
  tags: ['autodocs'],
  render: (args) => (
    <div style={{ width: 280 }}>
      <PhoneNumberInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '전화번호 입력이에요. 입력하는 대로 하이픈을 넣고(010-1234-5678, 02-123-4567, 1588-1234) 값은 숫자만 넘겨요. 중간에 숫자를 넣거나 하이픈 뒤에서 지워도 커서가 제자리에 머물러요. `formatPhoneNumber` 함수도 따로 쓸 수 있어요.',
      },
    },
  },
} satisfies Meta<typeof PhoneNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = { name: '입력된 상태', args: { defaultValue: '01012345678' } };

/** 실제 브라우저에서 커서 위치를 확인한다 (jsdom 은 커서를 실제와 다르게 다룬다) */
export const CaretStays: Story = {
  name: '중간 입력 시 커서 유지',
  args: { defaultValue: '0101234567' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: '휴대폰 번호' }) as HTMLInputElement;
    await expect(input.value).toBe('010-123-4567');
    input.focus();
    // 하이픈 위치가 바뀌는 입력이어야 의미가 있다 (서식 전후 문자열이 같으면 브라우저가 커서를 그대로 둔다)
    input.setSelectionRange(1, 1); // "0|10-123-4567"
    await userEvent.keyboard('9'); // 09101234567 → "091-0123-4567"
    await expect(input.value).toBe('091-0123-4567');
    await expect(input.selectionStart).toBe(2); // "09|1-…" — 끝으로 튀지 않는다
  },
};

function ControlledDemo() {
  const [phone, setPhone] = useState('');
  return (
    <Stack gap={3} style={{ width: 280 }}>
      <PhoneNumberInput value={phone} onValueChange={setPhone} helperText="인증번호를 받을 번호예요." />
      <Typography variant="body-sm" color="muted">
        넘어오는 값: {phone || '(없음)'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = { name: '값은 숫자만', render: () => <ControlledDemo /> };
