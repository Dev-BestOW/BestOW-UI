import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Select } from './Select';

const fruits = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리' },
  { value: 'durian', label: '두리안 (품절)', disabled: true },
  { value: 'grape', label: '포도' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: '과일',
    placeholder: '선택하세요',
    options: fruits,
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    options: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 280, minHeight: 280 }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHelperText: Story = {
  args: { helperText: '배송 가능한 과일만 표시돼요.', required: true },
};

export const WithError: Story = {
  args: { error: true, helperText: '과일을 선택해 주세요.' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'apple' },
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState('banana');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Select {...args} value={value} onValueChange={setValue} fullWidth />
        <span>value: {value}</span>
      </div>
    );
  },
};
