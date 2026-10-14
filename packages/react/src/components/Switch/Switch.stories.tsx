import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: '알림 받기', onCheckedChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Switch {...args} label="꺼짐" />
      <Switch {...args} label="켜짐" defaultChecked />
      <Switch {...args} label="비활성" disabled />
      <Switch {...args} label="켜짐 + 비활성" defaultChecked disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Switch {...args} size="sm" label="Small" defaultChecked />
      <Switch {...args} size="md" label="Medium" defaultChecked />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': '다크 모드' },
};
