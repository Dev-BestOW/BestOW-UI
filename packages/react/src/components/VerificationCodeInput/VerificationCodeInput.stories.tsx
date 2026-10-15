import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { VerificationCodeInput } from './VerificationCodeInput';

const meta = {
  title: 'Korean Kit/VerificationCodeInput',
  component: VerificationCodeInput,
  tags: ['autodocs'],
  args: { length: 6, type: 'numeric' },
  argTypes: {
    type: { control: 'inline-radio', options: ['numeric', 'alphanumeric'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '문자로 받은 인증번호 입력이에요. 실제 입력창은 하나라서 휴대폰의 문자 자동 채우기와 붙여넣기("123-456" 도)가 그대로 되고, 스크린리더는 "인증번호" 하나로 읽어요. `expiresIn` 으로 남은 시간, `onResend` 로 재전송 버튼을 붙여요.',
      },
    },
  },
} satisfies Meta<typeof VerificationCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = { name: '입력된 상태', args: { defaultValue: '4821' } };

export const WithError: Story = {
  name: '오류',
  args: { defaultValue: '123456', error: true, helperText: '인증번호가 맞지 않아요. 다시 확인해 주세요.' },
};

export const Alphanumeric: Story = { name: '영문·숫자 4자리', args: { type: 'alphanumeric', length: 4 } };

function VerifyDemo() {
  const [message, setMessage] = useState('');
  return (
    <Stack gap={3}>
      <VerificationCodeInput
        expiresIn={180}
        onResend={() => setMessage('인증번호를 다시 보냈어요.')}
        onExpire={() => setMessage('')}
        onComplete={(code) => setMessage(code === '123456' ? '인증되었어요.' : '인증번호가 맞지 않아요.')}
      />
      <Typography variant="body-sm" color="muted" role="status">
        {message}
      </Typography>
    </Stack>
  );
}

export const WithTimer: Story = {
  name: '남은 시간 · 재전송 (123456 입력 시 성공)',
  tags: ['!visual'], // 시간이 흘러 화면이 매번 달라진다
  render: () => <VerifyDemo />,
};
