import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: '이용약관에 동의합니다',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox {...args} label="선택 안 됨" />
      <Checkbox {...args} label="선택됨" defaultChecked />
      <Checkbox {...args} label="일부 선택" indeterminate />
      <Checkbox {...args} label="에러" invalid />
      <Checkbox {...args} label="비활성" disabled />
      <Checkbox {...args} label="선택됨 + 비활성" defaultChecked disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Checkbox {...args} size="sm" label="Small" defaultChecked />
      <Checkbox {...args} size="md" label="Medium" defaultChecked />
    </div>
  ),
};

const options = ['사과', '바나나', '체리'];

export const SelectAll: Story = {
  render: function SelectAllStory() {
    const [checked, setChecked] = useState<string[]>(['사과']);
    const all = checked.length === options.length;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Checkbox
          label="전체 선택"
          checked={all}
          indeterminate={checked.length > 0 && !all}
          onChange={() => setChecked(all ? [] : options)}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 28 }}>
          {options.map((option) => (
            <Checkbox
              key={option}
              label={option}
              checked={checked.includes(option)}
              onChange={(e) =>
                setChecked((prev) => (e.target.checked ? [...prev, option] : prev.filter((o) => o !== option)))
              }
            />
          ))}
        </div>
      </div>
    );
  },
};
