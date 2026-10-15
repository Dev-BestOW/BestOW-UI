import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';

// 스크린샷이 날마다 바뀌지 않도록 "오늘" 을 고정한다
const TODAY = '2026-10-15';
// 날짜가 고정된 공휴일만 예시로 (개천절, 한글날)
const isHoliday = (date: Date) => date.getMonth() === 9 && [3, 9].includes(date.getDate());

const meta = {
  title: 'Korean Kit/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { today: TODAY },
  parameters: {
    docs: {
      description: {
        component:
          '달력이에요. 일요일부터 시작하고 일요일·공휴일은 빨강, 토요일은 파랑으로 표시해요. 날짜는 "2026년 10월 15일 목요일" 처럼 읽혀요. 키보드: ←→ 하루, ↑↓ 일주일, Home/End 주의 처음·끝, PageUp/PageDown 한 달(Shift 와 함께 1년), Enter/Space 선택.',
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = { name: '선택된 날짜', args: { defaultValue: '2026-10-21' } };

export const Holidays: Story = { name: '공휴일 표시', args: { isHoliday } };

export const Range: Story = {
  name: '고를 수 있는 범위 · 주말 제외',
  args: { min: '2026-10-12', max: '2026-10-28', isDateDisabled: (date: Date) => [0, 6].includes(date.getDay()) },
};
