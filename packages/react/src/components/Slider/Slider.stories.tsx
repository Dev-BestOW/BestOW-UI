import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    label: '음량',
    defaultValue: [40],
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    formatValue: { control: false },
    value: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  name: '범위 (손잡이 두 개)',
  args: {
    label: '가격',
    defaultValue: [20000, 80000],
    min: 0,
    max: 100000,
    step: 5000,
    minStepsBetweenThumbs: 1,
    formatValue: (v: number) => `${v.toLocaleString('ko-KR')}원`,
  },
};

export const WithHelperText: Story = {
  name: '보조 설명',
  args: { label: '밝기', defaultValue: [70], helperText: '화면이 어두우면 배터리가 오래가요.', showValue: false },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap={6} style={{ maxWidth: 360 }}>
      <Slider label="sm" size="sm" defaultValue={[30]} />
      <Slider label="md" size="md" defaultValue={[60]} />
    </Stack>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

function ControlledDemo() {
  const [value, setValue] = useState([25]);
  const [committed, setCommitted] = useState(25);
  return (
    <Stack gap={3} style={{ maxWidth: 360 }}>
      <Slider
        label="투명도"
        value={value}
        onValueChange={setValue}
        onValueCommit={([v]) => setCommitted(v ?? 0)}
        showValue
        formatValue={(v) => `${v}%`}
      />
      <Typography variant="body-sm" color="muted">
        드래그 중: {value[0]}% · 저장된 값(onValueCommit): {committed}%
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };
