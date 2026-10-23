import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CheckboxGroup } from './CheckboxGroup';

const interests = [
  { value: 'design', label: '디자인' },
  { value: 'dev', label: '개발', description: '프론트엔드·백엔드·앱' },
  { value: 'marketing', label: '마케팅' },
  { value: 'pm', label: '기획', description: '이번 기수는 모집하지 않아요', disabled: true },
];

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  args: { label: '관심 분야', options: interests, defaultValue: ['dev'], onValueChange: fn() },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    options: { control: false },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // Space 로 켜고 끈다(네이티브 체크박스) — 값은 options 순서대로
    canvas.getByRole('checkbox', { name: '디자인' }).focus();
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['design', 'dev']);
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    label: '받을 알림',
    defaultValue: ['email'],
    options: [
      { value: 'email', label: '이메일' },
      { value: 'sms', label: '문자' },
      { value: 'push', label: '앱 푸시' },
    ],
  },
};

/** 하나 이상 골라야 할 때 — `required` 는 * 와 스크린리더용 "필수" 를 붙이고, 검증은 폼에서 해요 */
export const WithError: Story = {
  args: { required: true, defaultValue: [], error: true, helperText: '관심 분야를 하나 이상 골라 주세요.' },
};

function ControlledDemo() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <CheckboxGroup
      label="관심 분야"
      options={interests}
      value={value}
      onValueChange={setValue}
      helperText={value.length ? `${value.length}개 골랐어요` : '여러 개 고를 수 있어요'}
    />
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };
