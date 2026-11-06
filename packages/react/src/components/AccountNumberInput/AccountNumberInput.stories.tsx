import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { KOREAN_BANKS } from '@bestow-ui/korean-utils';
import { Combobox } from '../Combobox';
import { NativeSelect } from '../NativeSelect';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { AccountNumberInput } from './AccountNumberInput';

const meta = {
  title: 'Korean Kit/AccountNumberInput',
  component: AccountNumberInput,
  tags: ['autodocs'],
  render: (args) => (
    <div style={{ width: 300 }}>
      <AccountNumberInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '계좌번호 입력이에요. 은행·상품마다 자릿수와 하이픈 위치가 달라서 서식을 넣지 않고 숫자만 받아요(최대 16자리). 은행 앱에서 "110-123-456789" 처럼 복사해 붙여 넣어도 숫자만 남아요. 10자리보다 짧게 두고 벗어나면 안내해요. 은행은 `KOREAN_BANKS`(금융결제원 표준 코드 3자리 + 이름)로 Combobox·NativeSelect 를 함께 둬요. 실제 계좌·예금주 확인은 은행·결제사의 예금주 조회가 필요해요.',
      },
    },
  },
} satisfies Meta<typeof AccountNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = { name: '입력된 상태', args: { defaultValue: '110123456789' } };

const bankOptions = KOREAN_BANKS.map((bank) => ({ value: bank.code, label: bank.name }));

function BankAccountDemo() {
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  return (
    <Stack gap={3} style={{ width: 300 }}>
      <Combobox
        label="은행"
        placeholder="은행 이름으로 검색"
        options={bankOptions}
        value={bank}
        onValueChange={setBank}
        fullWidth
      />
      <AccountNumberInput value={account} onValueChange={setAccount} fullWidth />
      <Typography variant="body-sm" color="muted">
        넘어오는 값: 은행 코드 {bank || '(없음)'} · 계좌 {account || '(없음)'}
      </Typography>
    </Stack>
  );
}

export const WithBank: Story = { name: '은행 고르기와 함께 (Combobox)', render: () => <BankAccountDemo /> };

export const WithNativeSelect: Story = {
  name: '은행 고르기와 함께 (NativeSelect — 가볍게)',
  render: () => (
    <Stack gap={3} style={{ width: 300 }}>
      <NativeSelect label="은행" placeholder="은행 선택" options={bankOptions} fullWidth />
      <AccountNumberInput fullWidth />
    </Stack>
  ),
};
