import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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

/** form 안에서는 숨긴 checkbox 로 값이 제출된다(켜져 있을 때만 name=value). required 면 꺼진 동안 검증에 걸린다. */
export const InForm: Story = {
  render: (args) => (
    <form aria-label="알림 설정" onSubmit={(event) => event.preventDefault()}>
      <Switch {...args} name="notify" value="yes" required />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form')!;
    const sw = within(canvasElement).getByRole('switch', { name: '알림 받기' });
    await expect(form.checkValidity()).toBe(false);
    await userEvent.click(sw);
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(new FormData(form).get('notify')).toBe('yes');
    await expect(form.checkValidity()).toBe(true);
  },
};
