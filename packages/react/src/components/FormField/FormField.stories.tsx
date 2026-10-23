import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from '../Input';
import { FormField } from './FormField';

const meta = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '직접 만든 입력이나 다른 라이브러리의 입력에 TextField 와 같은 레이블·도움말·오류 연결을 붙여요. 자식은 함수로 받아 첫째 인자(`id`·`aria-describedby`·`aria-invalid`·`aria-required`)를 입력에 펼쳐 넣어요.',
      },
    },
  },
  args: {
    label: '예약 시간',
    helperText: '오전 10시부터 오후 6시까지',
    children: (field) => <Input type="time" min="10:00" max="18:00" {...field} />,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithError: Story = {
  args: { required: true, error: true, helperText: '예약 시간을 골라 주세요.' },
  render: (args) => <FormField {...args}>{(field) => <Input type="time" invalid {...field} />}</FormField>,
};

/** 네이티브 요소도 그대로 — 여기서는 브라우저 기본 색 선택 */
export const NativeElement: Story = {
  name: '네이티브 요소',
  args: {
    label: '대표 색',
    helperText: '버튼·링크에 쓰여요',
    children: (field) => <input type="color" defaultValue="#3b6ff6" {...field} />,
  },
};

function WeekdayToggles(props: { id: string; 'aria-describedby'?: string; 'aria-labelledby'?: string }) {
  const [days, setDays] = useState(['월', '수']);
  return (
    <div role="group" {...props} style={{ display: 'flex', gap: 4 }}>
      {['월', '화', '수', '목', '금'].map((day) => (
        <Button
          key={day}
          size="sm"
          variant={days.includes(day) ? 'solid' : 'outline'}
          color="neutral"
          aria-pressed={days.includes(day)}
          onClick={() => setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))}
        >
          {day}
        </Button>
      ))}
    </div>
  );
}

/**
 * label 로 이름을 받을 수 없는 요소(div 에 role 을 준 직접 만든 컨트롤)는 둘째 인자의 `labelId` 를 `aria-labelledby` 에 넣어요.
 */
export const WithLabelledby: Story = {
  name: 'aria-labelledby 로 연결',
  args: { label: '근무 요일', helperText: '여러 요일을 고를 수 있어요' },
  render: (args) => (
    <FormField {...args}>{(field, { labelId }) => <WeekdayToggles {...field} aria-labelledby={labelId} />}</FormField>
  ),
};
