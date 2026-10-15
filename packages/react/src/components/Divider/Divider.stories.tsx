import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { Divider } from './Divider';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    children: { control: 'text' },
  },
  render: (args) => (
    <Stack gap={4} style={{ maxWidth: 360 }}>
      <Typography>위 내용</Typography>
      <Divider {...args} />
      <Typography>아래 내용</Typography>
    </Stack>
  ),
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <Stack direction="row" gap={3} align="center">
      <Typography variant="body-sm">프로필</Typography>
      <Divider {...args} />
      <Typography variant="body-sm">설정</Typography>
      <Divider {...args} />
      <Typography variant="body-sm">로그아웃</Typography>
    </Stack>
  ),
};

/** 가운데 텍스트는 스크린리더가 그대로 읽는다. */
export const WithLabel: Story = {
  args: { children: '또는' },
  render: (args) => (
    <Stack gap={4} style={{ maxWidth: 320 }}>
      <Button fullWidth>이메일로 계속하기</Button>
      <Divider {...args} />
      <Button fullWidth variant="outline" color="neutral">
        Google 로 계속하기
      </Button>
    </Stack>
  ),
};
