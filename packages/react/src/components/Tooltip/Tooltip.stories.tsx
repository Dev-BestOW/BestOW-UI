import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsIcon } from '@bestow-ui/icons';
import { Button } from '../Button';
// 스토리 이름(IconButton)과 겹치지 않게 별칭으로 가져온다
import { IconButton as IconOnlyButton } from '../IconButton';
import { Stack } from '../Stack';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: '변경 사항을 저장해요',
    children: <Button variant="outline">마우스를 올려 보세요</Button>,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 48 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sides: Story = {
  render: (args) => (
    <Stack direction="row" gap={3}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} {...args} side={side} content={side}>
          <Button variant="soft" color="neutral">
            {side}
          </Button>
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const IconButton: Story = {
  args: {
    content: '설정',
    children: (
      <IconOnlyButton aria-label="설정">
        <SettingsIcon />
      </IconOnlyButton>
    ),
  },
};

export const AlwaysOpen: Story = {
  args: { defaultOpen: true },
};
