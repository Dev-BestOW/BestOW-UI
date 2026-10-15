import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { vars } from '../../theme/contract.css';
import { Typography } from '../Typography';
import { AddressInput, type AddressValue } from './AddressInput';
import { kakaoPostcodeProvider, type AddressProvider } from './addressProviders';

const samples = [
  { zonecode: '06236', address: '서울 강남구 테헤란로 152', extraAddress: ' (역삼동, 강남파이낸스센터)' },
  { zonecode: '04524', address: '서울 중구 세종대로 110', extraAddress: ' (태평로1가)' },
  { zonecode: '48058', address: '부산 해운대구 해운대해변로 264', extraAddress: ' (우동)' },
];

/** 예제·테스트용 공급자 — 외부 스크립트 없이 샘플 주소 목록을 그린다 */
const sampleProvider: AddressProvider = (container, onSelect) => {
  const list = document.createElement('ul');
  Object.assign(list.style, { listStyle: 'none', margin: '0', padding: '8px', display: 'grid', gap: '4px' });
  for (const sample of samples) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `[${sample.zonecode}] ${sample.address}${sample.extraAddress}`;
    Object.assign(button.style, {
      width: '100%',
      padding: '10px 12px',
      textAlign: 'left',
      border: `1px solid ${vars.color.border.default}`,
      borderRadius: '6px',
      background: vars.color.bg.default,
      color: vars.color.fg.default,
      font: 'inherit',
      cursor: 'pointer',
    });
    button.onclick = () => onSelect(sample);
    item.appendChild(button);
    list.appendChild(item);
  }
  container.appendChild(list);
  return () => list.remove();
};

const meta = {
  title: 'Korean Kit/AddressInput',
  component: AddressInput,
  tags: ['autodocs'],
  args: { provider: sampleProvider },
  argTypes: { provider: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 440 }}>
      <AddressInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '주소 입력(우편번호·기본 주소·상세 주소)이에요. "주소 검색" 을 누르면 검색 창에서 주소를 고르고, 고르면 상세 주소 입력창으로 포커스가 옮겨가요. 기본 검색은 카카오(다음) 우편번호 서비스이고 처음 검색할 때 스크립트를 불러와요 — 코어 번들에는 들어가지 않아요. `provider` 로 다른 주소 서비스를 붙일 수 있어요. (이 문서의 예제는 외부 스크립트 없이 샘플 주소를 쓰는 공급자예요.)',
      },
    },
  },
} satisfies Meta<typeof AddressInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = {
  name: '입력된 상태',
  args: { defaultValue: { ...samples[0]!, detail: '12층' } },
};

/** play 로 검색 창을 연 상태 — 스토리 테스트의 axe 가 검색 창(Modal)까지 검사한다 */
export const SearchOpen: Story = {
  name: '검색 창 열림',
  tags: ['!visual'], // 여는 애니메이션 도중에 찍힐 수 있다
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주소 검색' }));
    const dialog = within(document.body).getByRole('dialog', { name: '주소 검색' });
    await expect(await within(dialog).findByText(/테헤란로 152/)).toBeInTheDocument();
  },
};

export const WithError: Story = {
  name: '필수 · 오류',
  args: { required: true, error: true, helperText: '배송받을 주소를 입력해 주세요.' },
};

function ControlledDemo() {
  const [address, setAddress] = useState<AddressValue>();
  return (
    <div style={{ maxWidth: 440, display: 'grid', gap: 12 }}>
      <AddressInput label="배송지" value={address} onValueChange={setAddress} provider={sampleProvider} required />
      <Typography variant="body-sm" color="muted">
        {address ? JSON.stringify(address) : '아직 고르지 않았어요'}
      </Typography>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

/** 실제 카카오 우편번호 서비스 — 외부 스크립트를 불러오므로 자동 테스트·스크린샷에서는 뺀다 */
export const KakaoPostcode: Story = {
  name: '실제 카카오 우편번호',
  tags: ['!test', '!visual'],
  args: { provider: kakaoPostcodeProvider },
};
