import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: '내용을 입력하세요',
    'aria-label': '예시 입력',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startAdornment: { control: false },
    endAdornment: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
      <Input {...args} size="sm" />
      <Input {...args} size="md" />
      <Input {...args} size="lg" />
    </div>
  ),
};

export const WithAdornments: Story = {
  args: {
    startAdornment: <span aria-hidden>🔍</span>,
    endAdornment: <span>원</span>,
    placeholder: '0',
  },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: '잘못된 값' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '수정할 수 없음' },
};
