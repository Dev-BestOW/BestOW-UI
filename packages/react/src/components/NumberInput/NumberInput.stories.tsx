import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: { label: '수량', defaultValue: 1, min: 1, max: 99, unit: '개' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => (
    <div style={{ width: 240 }}>
      <NumberInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '숫자 입력이에요(수량·인원·나이 등). −/+ 버튼, ↑/↓(step)·PageUp/PageDown(largeStep)·Home/End(min/max)로 바꾸고 천 단위 쉼표를 넣어요. ' +
          '입력 중에는 범위를 벗어난 값도 받고, 포커스가 빠질 때 범위·자릿수에 맞춰요. 스크린리더에는 spinbutton 으로 값·최소·최대를 알려요. ' +
          '−/+ 버튼은 키보드로는 ↑/↓ 가 대신해서 Tab 순서에서 빠져 있어요. 금액은 AmountInput 을 써요.',
      },
    },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** step 0.1 이면 소수 한 자리까지. min 이 없으면 음수도 받는다 */
export const Decimal: Story = {
  name: '소수·음수',
  args: { label: '온도 보정', defaultValue: 0.5, min: undefined, max: undefined, step: 0.1, unit: '℃' },
};

export const LargeNumber: Story = {
  name: '큰 수 (쉼표)',
  args: { label: '목표 방문자', defaultValue: 125000, min: 0, max: undefined, step: 1000, unit: '명' },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap={3} style={{ width: 240 }}>
      <NumberInput {...args} size="sm" label="sm" />
      <NumberInput {...args} size="md" label="md" />
      <NumberInput {...args} size="lg" label="lg" />
    </Stack>
  ),
};

export const WithHelperText: Story = {
  name: '도움말·에러',
  render: (args) => (
    <Stack gap={3} style={{ width: 240 }}>
      <NumberInput {...args} label="인원" unit="명" max={8} helperText="최대 8명까지 예약할 수 있어요." />
      <NumberInput
        {...args}
        label="인원"
        unit="명"
        defaultValue={0}
        min={0}
        error
        helperText="1명 이상 선택해 주세요."
      />
    </Stack>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const WithoutStepper: Story = {
  name: '버튼 없이',
  args: { label: '나이', hideStepper: true, defaultValue: 30, min: 0, max: 150, unit: '세' },
};

function ControlledDemo() {
  const [value, setValue] = useState<number | null>(2);
  return (
    <Stack gap={3} style={{ width: 240 }}>
      <NumberInput label="수량" unit="개" min={1} max={10} value={value} onValueChange={setValue} />
      <Typography variant="body-sm" color="muted">
        넘어오는 값: {value === null ? 'null' : value}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = { name: '제어 모드', render: () => <ControlledDemo /> };

/** 실제 브라우저에서 키보드 조작과 쉼표가 생길 때 커서 위치를 확인한다 */
export const Keyboard: Story = {
  name: '키보드·커서',
  args: { label: '목표 방문자', defaultValue: 999, min: 0, max: undefined, unit: '명' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('spinbutton', { name: '목표 방문자' }) as HTMLInputElement;
    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(input.value).toBe('1,000');
    await expect(input).toHaveAttribute('aria-valuenow', '1000');
    await userEvent.keyboard('{ArrowDown}');
    await expect(input.value).toBe('999');
    input.setSelectionRange(0, 0); // "|999"
    await userEvent.keyboard('1'); // 1999 → "1,999" (쉼표가 생긴다)
    await expect(input.value).toBe('1,999');
    await expect(input.selectionStart).toBe(1); // "1|,999"
  },
};
