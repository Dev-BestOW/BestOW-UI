import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Typography } from '../Typography';
import { DateRangePicker } from './DateRangePicker';
import { dateRangePresets, type DateRange } from './presets';

const meta = {
  title: 'Korean Kit/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: { label: '조회 기간', today: '2026-10-19', presets: dateRangePresets },
  argTypes: { presets: { control: false }, value: { control: false }, defaultValue: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <DateRangePicker {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '기간 선택이에요(조회 기간, 예약 기간). 시작일·종료일 DatePicker 두 개를 묶어 숫자 입력과 달력을 그대로 쓰고, ' +
          '시작일이 종료일보다 늦을 수 없게 서로 제한해요. `presets` 로 오늘에서 거슬러 올라간 빠른 선택(오늘·1주일·1개월·3개월 — `dateRangePresets`)을 붙이면, ' +
          '현재 기간과 같은 버튼이 눌린 상태(aria-pressed)로 보여요. 값은 `{ start, end }`(`YYYY-MM-DD`, 없으면 빈 문자열).',
      },
    },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = {
  name: '입력된 상태',
  args: { defaultValue: { start: '2026-09-19', end: '2026-10-19' } },
};

export const WithoutPresets: Story = { name: '빠른 선택 없이', args: { presets: undefined } };

export const WithHelperText: Story = {
  name: '도움말·범위 제한',
  args: { min: '2026-01-01', max: '2026-10-19', helperText: '올해 기록만 조회할 수 있어요.' },
};

function ControlledDemo() {
  const [range, setRange] = useState<DateRange>({ start: '', end: '' });
  return (
    <div style={{ maxWidth: 520 }}>
      <DateRangePicker
        label="조회 기간"
        today="2026-10-19"
        presets={dateRangePresets}
        value={range}
        onValueChange={setRange}
      />
      <Typography variant="body-sm" color="muted" style={{ marginTop: 12 }}>
        넘어오는 값: {JSON.stringify(range)}
      </Typography>
    </div>
  );
}

/** 빠른 선택 → 두 칸에 값이 들어가고 버튼이 눌린 상태가 된다 (실제 브라우저) */
export const Controlled: Story = {
  name: '제어 모드 (빠른 선택)',
  render: () => <ControlledDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '1개월' }));
    await expect(canvas.getByRole('textbox', { name: '시작일' })).toHaveValue('2026-09-19');
    await expect(canvas.getByRole('textbox', { name: '종료일' })).toHaveValue('2026-10-19');
    await expect(canvas.getByRole('button', { name: '1개월' })).toHaveAttribute('aria-pressed', 'true');
  },
};
