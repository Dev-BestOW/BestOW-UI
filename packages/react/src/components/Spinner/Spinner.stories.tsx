import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'inline-radio', options: ['current', 'primary', 'neutral', 'danger'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['current', 'primary', 'neutral', 'danger'] as const).map((color) => (
        <Spinner key={color} {...args} color={color} />
      ))}
    </div>
  ),
};

/** 기본 `color="current"` 는 부모 글자색을 따른다. */
export const InheritColor: Story = {
  render: (args) => (
    <p style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--bestow-color-success-text)' }}>
      <Spinner {...args} size="sm" />
      저장하는 중…
    </p>
  ),
};
