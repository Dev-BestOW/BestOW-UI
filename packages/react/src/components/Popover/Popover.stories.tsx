import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { TextField } from '../Input';
import { Typography } from '../Typography';
import { Popover, PopoverClose } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    title: '공유 설정',
    showClose: true,
    content: (
      <Stack gap={3}>
        <TextField label="이메일" type="email" placeholder="name@example.com" fullWidth />
        <Stack direction="row" justify="end" gap={2}>
          <PopoverClose asChild>
            <Button size="sm" variant="ghost" color="neutral">
              취소
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button size="sm">초대</Button>
          </PopoverClose>
        </Stack>
      </Stack>
    ),
    children: <Button variant="outline">공유</Button>,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    content: { control: false },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ padding: '24px 0 220px' }}>{Story()}</div>],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 짧은 설명은 title 없이 aria-label 로 이름을 주고 화살표를 붙인다. */
export const SimpleWithArrow: Story = {
  args: {
    title: undefined,
    'aria-label': '요금 안내',
    showClose: false,
    showArrow: true,
    side: 'top',
    content: <Typography variant="body-sm">Pro 플랜은 사용자당 월 9,900원이에요.</Typography>,
    children: <Button variant="ghost">요금이 궁금해요</Button>,
  },
  decorators: [(Story) => <div style={{ paddingTop: 80 }}>{Story()}</div>],
};

/** play 로 연 상태 — 스토리 테스트의 axe 와 시각 회귀가 열린 팝오버까지 확인한다 */
export const Open: Story = {
  name: '열린 상태',
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '공유' }));
    await expect(within(document.body).getByRole('dialog', { name: '공유 설정' })).toBeInTheDocument();
  },
};
