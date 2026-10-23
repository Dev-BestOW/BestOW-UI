import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { media } from '../../utils/responsive';
import { Stack } from './Stack';

const Item = ({ label, height = 48 }: { label: string; height?: number }) => (
  <div
    style={{
      minWidth: 64,
      height,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      background: 'rgba(59, 111, 246, 0.16)',
      border: '1px dashed rgba(59, 111, 246, 0.6)',
      fontSize: 14,
    }}
  >
    {label}
  </div>
);

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    direction: 'row',
    gap: 3,
    children: (
      <>
        <Item label="1" />
        <Item label="2" height={72} />
        <Item label="3" />
      </>
    ),
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    gap: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'inline-radio', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    children: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Column: Story = {
  args: { direction: 'column', gap: 2 },
};

export const SpaceBetween: Story = {
  args: { justify: 'between', align: 'center' },
};

export const Wrap: Story = {
  args: {
    wrap: true,
    children: Array.from({ length: 16 }, (_, i) => <Item key={i} label={String(i + 1)} />),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 구간별 값 — 좁은 화면에서는 세로, `md`(768px) 이상은 가로. 창 폭을 바꿔 보세요.
 * 주지 않은 구간은 앞(좁은) 구간 값을 이어받아요(`{ base: 2, lg: 6 }` 이면 sm·md 도 2).
 */
export const Responsive: Story = {
  args: {
    direction: { base: 'column', md: 'row' },
    gap: { base: 2, lg: 6 },
    align: { base: 'stretch', md: 'center' },
    'data-testid': 'responsive',
  } as Story['args'],
  argTypes: { direction: { control: 'object' }, gap: { control: 'object' }, align: { control: 'object' } },
  play: async ({ canvasElement }) => {
    // 실제 브라우저의 지금 창 폭에서 기대한 값이 나오는지 (jsdom 은 미디어쿼리를 계산하지 못한다)
    const stack = canvasElement.querySelector<HTMLElement>('[data-testid="responsive"]')!;
    const style = getComputedStyle(stack);
    const md = window.matchMedia(media.md).matches;
    const lg = window.matchMedia(media.lg).matches;
    await expect(style.flexDirection).toBe(md ? 'row' : 'column');
    await expect(style.alignItems).toBe(md ? 'center' : 'stretch');
    await expect(style.rowGap).toBe(lg ? '24px' : '8px');
  },
};

/** 중첩해도 안쪽 Stack 은 바깥의 구간별 값을 이어받지 않는다 (CSS 변수 초기화) */
export const ResponsiveNested: Story = {
  tags: ['!autodocs', '!visual'],
  render: () => (
    <Stack align={{ base: 'center' }} gap={{ base: 4 }}>
      <Stack data-testid="inner" direction="row" justify={{ xl: 'end' }} align={{ xl: 'end' }}>
        <Item label="안쪽" />
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const inner = getComputedStyle(canvasElement.querySelector<HTMLElement>('[data-testid="inner"]')!);
    const xl = window.matchMedia(media.xl).matches;
    await expect(inner.alignItems).toBe(xl ? 'flex-end' : 'normal');
    await expect(inner.justifyContent).toBe(xl ? 'flex-end' : 'normal');
    await expect(inner.rowGap).toBe('normal');
  },
};
