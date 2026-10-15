import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: {
    value: 42,
    max: 100,
    label: '업로드',
    showValue: true,
    size: 'md',
    color: 'primary',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'inline-radio', options: ['primary', 'neutral', 'success', 'warning', 'danger'] },
    formatValue: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Progress {...args} />
    </div>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Colors: Story = {
  render: () => (
    <Stack gap={4} style={{ maxWidth: 420 }}>
      {(['primary', 'neutral', 'success', 'warning', 'danger'] as const).map((color, i) => (
        <Progress key={color} color={color} value={30 + i * 15} label={color} showValue />
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack gap={4} style={{ maxWidth: 420 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Progress key={size} size={size} value={60} label={`size ${size}`} />
      ))}
    </Stack>
  ),
};

export const CustomFormat: Story = {
  name: '값 형식 바꾸기',
  args: {
    label: '온보딩',
    value: 3,
    max: 5,
    formatValue: (value: number, max: number) => `${max}단계 중 ${value}단계`,
  },
};

export const WithoutLabel: Story = {
  name: '레이블 없이 (aria-label)',
  args: { label: undefined, showValue: false, 'aria-label': '페이지 불러오는 중', size: 'sm' },
};

export const Indeterminate: Story = {
  name: '진행률을 모를 때',
  tags: ['!visual'], // 막대가 계속 움직인다
  args: { value: null, label: '파일을 준비하고 있어요' },
};

function UploadDemo() {
  const [value, setValue] = useState<number | null>(null);
  useEffect(() => {
    if (value === null || value >= 100) return;
    const timer = setTimeout(() => setValue((v) => Math.min(100, (v ?? 0) + 7)), 150);
    return () => clearTimeout(timer);
  }, [value]);
  const done = value !== null && value >= 100;
  return (
    <Stack gap={3} style={{ maxWidth: 420 }}>
      <Progress
        value={value ?? 0}
        label={done ? '업로드 완료' : '업로드'}
        showValue
        color={done ? 'success' : 'primary'}
      />
      <Button variant="outline" color="neutral" onClick={() => setValue(0)} style={{ alignSelf: 'start' }}>
        {done ? '다시 업로드' : '업로드 시작'}
      </Button>
    </Stack>
  );
}

export const Live: Story = {
  name: '진행 흉내',
  tags: ['!visual'],
  render: () => <UploadDemo />,
};
