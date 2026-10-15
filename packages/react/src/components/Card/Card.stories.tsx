import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'elevated', 'soft'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    as: { control: false },
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <CardHeader>
        <Typography variant="h4">Pro 플랜</Typography>
        <Typography variant="body-sm" color="muted">
          팀을 위한 모든 기능
        </Typography>
      </CardHeader>
      <CardBody>무제한 프로젝트, 우선 지원, 고급 권한 관리를 제공해요.</CardBody>
      <CardFooter>
        <Button variant="ghost" color="neutral">
          자세히
        </Button>
        <Button>시작하기</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 220px)', gap: 16 }}>
      {(['outline', 'elevated', 'soft'] as const).map((variant) => (
        <Card key={variant} {...args} variant={variant}>
          <Typography variant="h4">{variant}</Typography>
          <Typography variant="body-sm" color="muted">
            카드 내용
          </Typography>
        </Card>
      ))}
    </div>
  ),
};

/** `padding="none"` 이면 이미지를 가장자리까지 붙이고, 텍스트 영역에만 여백을 준다. */
export const MediaCard: Story = {
  args: { padding: 'none' },
  render: (args) => (
    <Card {...args} as="article" style={{ maxWidth: 300, overflow: 'hidden' }}>
      <div
        role="img"
        aria-label="그라데이션 커버"
        style={{
          height: 140,
          background: 'linear-gradient(135deg, var(--bestow-color-primary-solid), var(--bestow-color-success-solid))',
        }}
      />
      <CardHeader style={{ paddingInline: 24 }}>
        <Badge color="primary" style={{ alignSelf: 'flex-start' }}>
          새 글
        </Badge>
        <Typography variant="h4">디자인 시스템 0.5 출시</Typography>
      </CardHeader>
      <CardBody style={{ paddingInline: 24, paddingBottom: 24 }}>Spinner, Badge, Card 가 추가됐어요.</CardBody>
    </Card>
  ),
};
