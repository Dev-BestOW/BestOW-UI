import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'soft', 'outline', 'ghost'] },
    color: { control: 'inline-radio', options: ['primary', 'neutral', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: 12 }}>
      {(['primary', 'neutral', 'danger'] as const).map((color) =>
        (['solid', 'soft', 'outline', 'ghost'] as const).map((variant) => (
          <Button key={`${color}-${variant}`} {...args} color={color} variant={variant}>
            {variant}
          </Button>
        )),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    startIcon: <span aria-hidden>＋</span>,
    endIcon: <span aria-hidden>→</span>,
  },
};

export const Loading: Story = {
  args: { loading: true, children: '저장 중' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** 페이지를 이동하는 주요 동작. Next.js 는 `<Button asChild><NextLink href="/signup" /></Button>` 처럼 쓴다 */
export const AsLink: Story = {
  name: '링크로 쓰기 (asChild)',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} asChild>
        <a href="#signup">시작하기</a>
      </Button>
      <Button {...args} asChild variant="outline" color="neutral">
        <a href="#docs">문서 보기</a>
      </Button>
      <Button {...args} asChild loading>
        <a href="#loading">이동 중</a>
      </Button>
      <Button {...args} asChild disabled>
        <a href="#disabled">준비 중</a>
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};
