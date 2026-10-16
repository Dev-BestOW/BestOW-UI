import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Link } from '../Link';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { SkipLink } from './SkipLink';

const meta = {
  title: 'Components/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  args: { href: '#story-main' },
  parameters: {
    docs: {
      description: {
        component:
          '본문 바로가기 (KWCAG 2.2 6.4.1 · WCAG 2.4.1). 페이지 맨 앞에 두면 평소에는 보이지 않다가 첫 Tab 에 왼쪽 위에 나타나고, 누르면 본문으로 포커스를 옮긴다. 본문 요소에 `id="main"`(기본 href) 을 준다.',
      },
    },
  },
  render: (args) => (
    <>
      <SkipLink {...args} />
      <Stack as="nav" aria-label="주요 메뉴" direction="row" gap={4} style={{ paddingTop: 48 }}>
        <Link href="#">홈</Link>
        <Link href="#">상품</Link>
        <Link href="#">고객센터</Link>
      </Stack>
      <Stack as="main" id="story-main" gap={2} style={{ marginTop: 24 }}>
        <Typography variant="h3" as="h1">
          본문
        </Typography>
        <Typography>Tab 을 누르면 왼쪽 위에 "본문 바로가기" 가 나타나요. Enter 로 이 영역으로 건너뛰어요.</Typography>
      </Stack>
    </>
  ),
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 평소에는 보이지 않는다 (Tab 을 눌러 보세요) */
export const Playground: Story = {};

/** play 로 첫 Tab 을 누른 상태 — 나타난 모양을 시각 회귀·axe 로 확인한다 */
export const Focused: Story = {
  name: '포커스를 받은 상태',
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole('link', { name: '본문 바로가기' })).toHaveFocus();
  },
};
