import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { label: '문의 내용', placeholder: '궁금한 점을 적어 주세요' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    resize: { control: 'inline-radio', options: ['none', 'vertical', 'both'] },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithCount: Story = {
  name: '글자 수 표시',
  args: { showCount: true, maxLength: 200, helperText: '200자까지 입력할 수 있어요.' },
};

export const AutoResize: Story = {
  name: '자동 높이',
  args: {
    autoResize: true,
    rows: 2,
    style: { maxHeight: 240 },
    helperText: '내용이 늘어나면 높이도 늘어나요 (최대 240px).',
  },
};

export const WithError: Story = {
  args: { required: true, error: true, helperText: '내용을 입력해 주세요.' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '수정할 수 없는 내용' },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};
