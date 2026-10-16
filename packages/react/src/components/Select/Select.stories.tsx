import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
  decorators: [
    (Story) => (
      <div style={{ width: 280, minHeight: 280 }}>
        <Story />
      </div>
    ),
  ],
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

/** play 로 목록을 연 상태 — 스토리 테스트의 axe 와 시각 회귀가 열린 목록까지 확인한다 */
export const Open: Story = {
  name: '목록 열림',
  args: { defaultValue: 'banana' },
  parameters: {
    a11y: {
      // 열려 있는 동안 Radix 가 목록 바깥을 aria-hidden 으로 숨기고 포커스를 목록 안에 가둔다 — 숨겨진 트리거는
      // 키보드·스크린리더로 닿지 않고 닫히면 포커스가 돌아간다. axe 는 "숨긴 영역 안에 포커스 가능한 요소" 로 본다.
      config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox', { name: '과일' }));
    const listbox = within(document.body).getByRole('listbox');
    await expect(within(listbox).getByRole('option', { name: '바나나' })).toHaveAttribute('aria-selected', 'true');
  },
};
