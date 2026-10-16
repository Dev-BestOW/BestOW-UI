import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { AgreementGroup } from './AgreementGroup';
import { hasAllRequiredAgreements, type AgreementItem } from './agreements';

const items: AgreementItem[] = [
  { value: 'age', label: '만 14세 이상입니다', required: true },
  {
    value: 'terms',
    label: '서비스 이용약관 동의',
    required: true,
    content:
      '제1조 (목적)\n이 약관은 회사가 제공하는 서비스의 이용 조건과 절차, 회사와 회원의 권리·의무를 정하는 것을 목적으로 합니다.\n\n제2조 (정의)\n“회원”이란 이 약관에 동의하고 서비스를 이용하는 사람을 말합니다.',
  },
  {
    value: 'privacy',
    label: '개인정보 수집·이용 동의',
    required: true,
    content: '수집 항목: 이름, 휴대폰 번호, 이메일\n이용 목적: 회원 식별, 서비스 안내\n보유 기간: 회원 탈퇴 시까지',
  },
  { value: 'marketing', label: '마케팅 정보 수신 동의', content: '새 기능과 이벤트 소식을 문자·이메일로 보내 드려요.' },
];

const meta = {
  title: 'Korean Kit/AgreementGroup',
  component: AgreementGroup,
  tags: ['autodocs'],
  args: { label: '약관 동의', items },
  argTypes: { items: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 440 }}>
      <AgreementGroup {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '회원가입 등에서 쓰는 약관 동의 묶음이에요. "전체 동의" 와 개별 항목이 서로 맞춰지고(일부만 동의하면 부분 선택 상태), 항목마다 필수·선택 표시와 약관 내용 펼쳐 보기를 지원해요. `hasAllRequiredAgreements(items, value)` 로 필수 동의 여부를 확인해요.',
      },
    },
  },
} satisfies Meta<typeof AgreementGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** play 로 약관 내용을 펼친 상태 — 스토리 테스트의 axe 가 펼친 영역까지 검사한다 */
export const Expanded: Story = {
  name: '약관 내용 펼침',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '필수 서비스 이용약관 동의 보기' }));
    await expect(canvas.getByRole('region', { name: '필수 서비스 이용약관 동의' })).toBeInTheDocument();
  },
};

function SignupDemo() {
  const [agreed, setAgreed] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const ok = hasAllRequiredAgreements(items, agreed);
  const showError = submitted && !ok;
  return (
    <Stack
      as="form"
      gap={4}
      style={{ maxWidth: 440 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <AgreementGroup
        label="약관 동의"
        items={items}
        value={agreed}
        onValueChange={setAgreed}
        error={showError}
        helperText={showError ? '필수 약관에 모두 동의해 주세요.' : undefined}
      />
      <Button type="submit" fullWidth>
        {submitted && ok ? '가입 완료!' : '동의하고 가입하기'}
      </Button>
    </Stack>
  );
}

export const WithValidation: Story = {
  name: '가입 폼 (필수 확인)',
  render: () => <SignupDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '동의하고 가입하기' }));
    await expect(canvas.getByText('필수 약관에 모두 동의해 주세요.')).toBeInTheDocument();
  },
};
