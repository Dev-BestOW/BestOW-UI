import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card';
import { Stack } from '../Stack';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: { type: 'number', min: 1, max: 6 } },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack gap={4}>
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" lines={3} />
      <Skeleton variant="rect" height={120} />
      <Skeleton variant="circle" width={48} />
    </Stack>
  ),
};

/** 로딩 중인 영역에 `aria-busy="true"` 를 붙여 스크린리더에 상태를 알린다. */
export const CardPlaceholder: Story = {
  render: () => (
    <Card as="section" aria-busy="true" aria-label="게시글 불러오는 중">
      <Stack direction="row" gap={3} align="center">
        <Skeleton variant="circle" width={40} />
        <Stack gap={2} style={{ flex: 1 }}>
          <Skeleton width="40%" />
          <Skeleton width="25%" height={12} />
        </Stack>
      </Stack>
      <Skeleton variant="rect" height={140} />
      <Skeleton lines={2} />
    </Card>
  ),
};
