import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoonIcon, SettingsIcon, SunIcon } from '@bestow-ui/icons';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { SegmentedControl } from './SegmentedControl';

const periods = [
  { value: 'day', label: '일' },
  { value: 'week', label: '주' },
  { value: 'month', label: '월' },
  { value: 'year', label: '연' },
];

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: { 'aria-label': '기간', options: periods, defaultValue: 'week', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 전체 높이가 Button·Input 의 sm 32 / md 40 / lg 48 과 같다 */
export const Sizes: Story = {
  render: (args) => (
    <Stack gap={3} align="start">
      <SegmentedControl {...args} size="sm" aria-label="기간 (sm)" />
      <SegmentedControl {...args} size="md" aria-label="기간 (md)" />
      <SegmentedControl {...args} size="lg" aria-label="기간 (lg)" />
    </Stack>
  ),
};

export const WithLabel: Story = {
  args: {
    label: '정렬',
    'aria-label': undefined,
    options: [
      { value: 'latest', label: '최신순' },
      { value: 'popular', label: '인기순' },
      { value: 'price', label: '낮은 가격순' },
    ],
    defaultValue: 'latest',
  },
};

export const WithIcons: Story = {
  args: {
    'aria-label': '화면 모드',
    options: [
      { value: 'light', label: '라이트', icon: <SunIcon size={16} /> },
      { value: 'dark', label: '다크', icon: <MoonIcon size={16} /> },
      { value: 'system', label: '시스템', icon: <SettingsIcon size={16} /> },
    ],
    defaultValue: 'system',
  },
};

/** 부모 너비를 채우고 칸을 같은 너비로 나눈다 (모바일 상단 필터 등) */
export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <SegmentedControl {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Stack gap={3} align="start">
      <SegmentedControl {...args} aria-label="기간 (전체 비활성)" disabled />
      <SegmentedControl
        {...args}
        aria-label="기간 (일부 비활성)"
        options={periods.map((p) => (p.value === 'year' ? { ...p, disabled: true } : p))}
      />
    </Stack>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState('month');
    return (
      <Stack gap={3} align="start">
        <SegmentedControl {...args} value={value} onValueChange={setValue} />
        <Typography variant="body-sm" color="muted">
          선택: {value}
        </Typography>
      </Stack>
    );
  },
};
