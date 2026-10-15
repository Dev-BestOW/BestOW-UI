import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const Item = ({ label, height = 48 }: { label: string; height?: number }) => (
  <div
    style={{
      minWidth: 64,
      height,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      background: 'rgba(59, 111, 246, 0.16)',
      border: '1px dashed rgba(59, 111, 246, 0.6)',
      fontSize: 14,
    }}
  >
    {label}
  </div>
);

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    direction: 'row',
    gap: 3,
    children: (
      <>
        <Item label="1" />
        <Item label="2" height={72} />
        <Item label="3" />
      </>
    ),
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    gap: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'inline-radio', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    children: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Column: Story = {
  args: { direction: 'column', gap: 2 },
};

export const SpaceBetween: Story = {
  args: { justify: 'between', align: 'center' },
};

export const Wrap: Story = {
  args: {
    wrap: true,
    children: Array.from({ length: 16 }, (_, i) => <Item key={i} label={String(i + 1)} />),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};
