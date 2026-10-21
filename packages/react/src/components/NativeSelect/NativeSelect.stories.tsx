import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NativeSelect } from './NativeSelect';

const fruits = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리' },
  { value: 'durian', label: '두리안 (품절)', disabled: true },
  { value: 'grape', label: '포도' },
];

/**
 * 브라우저 기본 `<select>` 에 Select 와 같은 모양을 입힌 것. Radix 를 쓰지 않아 가볍고, 모바일에서는 운영체제의 선택 화면이 열린다.
 * 목록 모양을 꾸며야 하면 Select 를 쓴다.
 */
const meta = {
  title: 'Components/NativeSelect',
  component: NativeSelect,
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
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NativeSelect>;

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

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <NativeSelect {...args} size="sm" label="Small" defaultValue="apple" />
      <NativeSelect {...args} size="md" label="Medium" defaultValue="apple" />
      <NativeSelect {...args} size="lg" label="Large" defaultValue="apple" />
    </div>
  ),
};

/** options 대신 `<option>`·`<optgroup>` 을 직접 넣을 수 있다 */
export const WithOptgroup: Story = {
  args: { options: undefined, label: '지역', placeholder: '선택하세요' },
  render: (args) => (
    <NativeSelect {...args}>
      <optgroup label="수도권">
        <option value="seoul">서울</option>
        <option value="incheon">인천</option>
        <option value="gyeonggi">경기</option>
      </optgroup>
      <optgroup label="영남">
        <option value="busan">부산</option>
        <option value="daegu">대구</option>
      </optgroup>
    </NativeSelect>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState('banana');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <NativeSelect {...args} value={value} onValueChange={setValue} fullWidth />
        <span>value: {value}</span>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: '과일' }), '체리');
    await expect(canvas.getByText('value: cherry')).toBeInTheDocument();
  },
};
