import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { media } from '../../utils/responsive';
import { Card, CardBody } from '../Card';
import { Typography } from '../Typography';
import { Grid } from './Grid';

const cards = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <Card key={i} variant="outline" padding="sm">
      <Typography variant="h4" as="h3">
        상품 {i + 1}
      </Typography>
      <CardBody>
        <Typography variant="body-sm" color="muted">
          칸 폭은 같고, 화면 폭에 따라 열 수가 바뀌어요.
        </Typography>
      </CardBody>
    </Card>
  ));

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: { columns: 3, gap: 4, children: cards(6) },
  argTypes: {
    columns: { control: 'object', description: '열 개수. 구간별로 `{ base: 1, md: 2, lg: 3 }`' },
    gap: { control: 'object', description: '칸 사이 간격 (space 토큰 키). 구간별 값도 받아요' },
    minItemWidth: { control: 'text' },
    children: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 좁은 화면 1열 → `md`(768px) 2열 → `lg`(1024px) 3열. 창 폭을 바꿔 보세요. */
export const ResponsiveColumns: Story = {
  args: { columns: { base: 1, md: 2, lg: 3 }, gap: { base: 3, md: 4 }, 'data-testid': 'grid' } as Story['args'],
  play: async ({ canvasElement }) => {
    // 실제 브라우저의 지금 창 폭에서 열 수가 맞는지 (jsdom 은 미디어쿼리를 계산하지 못한다)
    const grid = canvasElement.querySelector<HTMLElement>('[data-testid="grid"]')!;
    const expected = window.matchMedia(media.lg).matches ? 3 : window.matchMedia(media.md).matches ? 2 : 1;
    await expect(getComputedStyle(grid).gridTemplateColumns.split(' ')).toHaveLength(expected);
  },
};

/**
 * `minItemWidth` — 칸 최소 폭만 정하면 들어가는 만큼 열을 자동으로 만들어요(구간을 정하지 않아도 됨).
 * 화면이 그 폭보다 좁으면 칸이 화면 폭으로 줄어들어 가로 스크롤이 생기지 않아요.
 */
export const MinItemWidth: Story = {
  args: { columns: undefined, minItemWidth: '14rem' },
};

/** 목록이면 `as="ul"` — 칸은 `li` 로 */
export const AsList: Story = {
  args: {
    as: 'ul',
    columns: 2,
    gap: 2,
    style: { listStyle: 'none', margin: 0, padding: 0 },
    children: ['서울', '부산', '대구', '인천'].map((city) => <li key={city}>{city}</li>),
  },
};
