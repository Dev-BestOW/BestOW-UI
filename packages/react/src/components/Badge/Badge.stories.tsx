import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleCheckIcon } from '@bestow-ui/icons';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Badge',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'soft', 'outline'] },
    color: { control: 'inline-radio', options: ['primary', 'neutral', 'danger', 'success', 'warning'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: 12 }}>
      {(['primary', 'neutral', 'danger', 'success', 'warning'] as const).map((color) =>
        (['solid', 'soft', 'outline'] as const).map((variant) => (
          <Badge key={`${color}-${variant}`} {...args} color={color} variant={variant}>
            {color} {variant}
          </Badge>
        )),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
      <Badge {...args} size="lg">
        Large
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    color: 'success',
    children: '완료',
    startIcon: <CircleCheckIcon size={12} />,
  },
};
