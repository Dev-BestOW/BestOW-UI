import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody } from '../Card';
import { Typography } from '../Typography';
import { Container } from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    size: 'md',
    children: (
      <Card variant="soft">
        <Typography variant="h3" as="h2">
          페이지 본문
        </Typography>
        <CardBody>최대 폭 안에서 가운데에 놓이고, 좌우 여백은 좁은 화면 16px · md(768px) 이상 24px 이에요.</CardBody>
      </Card>
    ),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    children: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 폼처럼 좁은 화면 — `size="sm"`(640px) */
export const Narrow: Story = { args: { size: 'sm' } };

/** 안에서 직접 여백을 줄 때(표를 끝까지 채울 때 등) — `flush` */
export const Flush: Story = { args: { flush: true } };
