import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: '이메일',
    placeholder: 'name@example.com',
    helperText: '로그인에 사용할 이메일을 입력하세요.',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startAdornment: { control: false },
    endAdornment: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: {
    error: true,
    defaultValue: 'name@',
    helperText: '올바른 이메일 형식이 아닙니다.',
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};
