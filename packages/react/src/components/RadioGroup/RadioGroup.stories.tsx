import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioGroup } from './RadioGroup';

const plans = [
  { value: 'monthly', label: '월간', description: '매달 9,900원' },
  { value: 'yearly', label: '연간', description: '연 99,000원 (2개월 무료)' },
  { value: 'lifetime', label: '평생', description: '현재 판매하지 않아요', disabled: true },
];

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { label: '결제 주기', options: plans, defaultValue: 'monthly', onValueChange: fn() },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    options: { control: false },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    label: '크기',
    defaultValue: 'm',
    options: [
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
    ],
  },
};

export const WithError: Story = {
  args: { defaultValue: undefined, required: true, error: true, helperText: '결제 주기를 선택해 주세요.' },
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState<string>();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <RadioGroup {...args} defaultValue={undefined} value={value} onValueChange={setValue} />
        <span>value: {String(value)}</span>
      </div>
    );
  },
};
