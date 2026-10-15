import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../Alert';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { Link } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    href: '#',
    children: '이용약관',
    color: 'primary',
    underline: 'always',
  },
  argTypes: {
    color: { control: 'inline-radio', options: ['primary', 'neutral', 'inherit'] },
    underline: { control: 'inline-radio', options: ['always', 'hover'] },
    as: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          '문장 안의 링크는 색만으로 구분되지 않도록 기본으로 밑줄을 둬요. Next.js 에서는 `as={NextLink}` 로 라우터 링크를 그대로 쓸 수 있어요.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InText: Story = {
  name: '문장 안에서',
  render: () => (
    <Typography style={{ maxWidth: 480 }}>
      가입하면 <Link href="#">이용약관</Link>과 <Link href="#">개인정보 처리방침</Link>에 동의하는 것으로 봐요.
    </Typography>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack gap={3}>
      <Link href="#">primary · 밑줄 항상</Link>
      <Link href="#" color="neutral" underline="hover">
        neutral · 마우스를 올리면 밑줄
      </Link>
      <Alert color="warning" title="결제 수단을 확인해 주세요">
        카드 유효기간이 지났어요.{' '}
        <Link href="#" color="inherit">
          결제 수단 변경
        </Link>
      </Alert>
    </Stack>
  ),
};

export const External: Story = {
  name: '외부 링크 (새 창)',
  args: { href: 'https://github.com/Dev-BestOW/BestOW-UI', external: true, children: 'GitHub 저장소' },
};
