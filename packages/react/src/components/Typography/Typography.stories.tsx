import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography, type TypographyVariant } from './Typography';

const variants: TypographyVariant[] = ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'caption'];

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  args: {
    children: '디자인 시스템으로 일관된 UI를 만듭니다.',
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    color: { control: 'select', options: ['default', 'muted', 'subtle', 'primary', 'danger', 'success', 'inherit'] },
    weight: { control: 'inline-radio', options: ['regular', 'medium', 'semibold', 'bold'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    as: { control: false },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {variants.map((variant) => (
        <div
          key={variant}
          style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'baseline', gap: 16 }}
        >
          <Typography variant="caption" color="subtle">
            {variant}
          </Typography>
          <Typography {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['default', 'muted', 'subtle', 'primary', 'danger', 'success'] as const).map((color) => (
        <Typography key={color} {...args} color={color}>
          {color} — {args.children}
        </Typography>
      ))}
    </div>
  ),
};

export const Truncate: Story = {
  args: {
    truncate: true,
    children:
      '아주 긴 텍스트는 truncate 옵션을 주면 한 줄로 잘리고 끝에 말줄임표가 표시됩니다. 컨테이너 너비를 넘어가면 잘립니다.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};
