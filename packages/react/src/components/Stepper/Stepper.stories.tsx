import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Stepper } from './Stepper';

const signup = [{ label: '약관 동의' }, { label: '정보 입력' }, { label: '본인 인증' }, { label: '가입 완료' }];

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: signup, current: 1 },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    current: { control: { type: 'number', min: 0, max: 4 } },
    steps: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Stepper {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '여러 단계로 나뉜 흐름(가입·결제·신청)에서 지금 어디쯤인지 보여 줘요. 순서 목록이라 스크린리더가 "4개 중 2번째" 를 읽고, ' +
          '현재 단계는 aria-current="step", 완료한 단계는 "(완료)" 를 함께 읽어요. 단계를 눌러 이동하는 기능은 없어요 — "이전"·"다음" 버튼으로 이동해요.',
      },
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllComplete: Story = { name: '모두 완료', args: { current: 4 } };

/** 설명이 길면 세로로 둔다 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    current: 1,
    steps: [
      { label: '주문 접수', description: '10월 19일 14:02' },
      { label: '상품 준비 중', description: '판매자가 상품을 포장하고 있어요.' },
      { label: '배송 중' },
      { label: '배송 완료' },
    ],
  },
};

export const WithDescription: Story = {
  name: '설명',
  args: {
    current: 2,
    steps: [
      { label: '장바구니', description: '3개 상품' },
      { label: '주문서 작성', description: '배송지·결제' },
      { label: '결제', description: '카드·계좌이체' },
    ],
  },
};

function FlowDemo() {
  const [current, setCurrent] = useState(0);
  return (
    <Stack gap={4} style={{ maxWidth: 560 }}>
      <Stepper steps={signup} current={current} aria-label="회원가입 단계" />
      <Stack direction="row" gap={2}>
        <Button variant="outline" color="neutral" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          이전
        </Button>
        <Button disabled={current === signup.length} onClick={() => setCurrent((c) => c + 1)}>
          {current >= signup.length - 1 ? '완료' : '다음'}
        </Button>
      </Stack>
    </Stack>
  );
}

/** "이전"·"다음" 버튼과 함께 쓰는 예 */
export const WithButtons: Story = { name: '버튼과 함께', render: () => <FlowDemo /> };
