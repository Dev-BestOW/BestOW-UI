import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { DatePicker } from './DatePicker';

const TODAY = '2026-10-15';
const isHoliday = (date: Date) => date.getMonth() === 9 && [3, 9].includes(date.getDate());

const meta = {
  title: 'Korean Kit/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { today: TODAY, isHoliday },
  argTypes: { isHoliday: { control: false }, isDateDisabled: { control: false } },
  render: (args) => (
    <div style={{ width: 280 }}>
      <DatePicker {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '날짜 입력이에요. `YYYY-MM-DD` 로 직접 입력하거나(숫자만 쳐도 하이픈이 들어가요) 달력 버튼으로 골라요. 달력을 열면 선택된 날짜(없으면 오늘)로 포커스가 가고, 고르면 닫히며 버튼으로 포커스가 돌아와요. 값은 시간대 문제가 없는 `"YYYY-MM-DD"` 문자열이에요.',
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = { name: '입력된 상태', args: { label: '예약일', defaultValue: '2026-10-21' } };

export const Invalid: Story = { name: '없는 날짜 (자동 오류)', args: { defaultValue: '2026-02-30' } };

export const WithRange: Story = {
  name: '범위 제한',
  args: {
    label: '배송 희망일',
    min: '2026-10-16',
    max: '2026-11-15',
    helperText: '내일부터 한 달 안에서 골라 주세요.',
  },
};

/** play 로 달력을 연 상태 — 스토리 테스트의 axe 가 달력(grid)까지 검사한다 */
export const CalendarOpen: Story = {
  name: '달력 열림',
  tags: ['!visual'],
  args: { defaultValue: '2026-10-21' },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '달력 열기' }));
    const grid = within(document.body).getByRole('grid', { name: '2026년 10월' });
    await expect(within(grid).getByRole('button', { name: /^21, 2026년 10월 수요일/ })).toHaveFocus();
  },
};

function ControlledDemo() {
  const [date, setDate] = useState('');
  return (
    <Stack gap={3} style={{ width: 280 }}>
      <DatePicker label="예약일" value={date} onValueChange={setDate} today={TODAY} isHoliday={isHoliday} />
      <Typography variant="body-sm" color="muted">
        넘어오는 값: {date || "''"}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = { name: '값은 YYYY-MM-DD', render: () => <ControlledDemo /> };
