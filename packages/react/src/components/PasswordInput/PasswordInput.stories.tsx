import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  render: (args) => (
    <div style={{ width: 300 }}>
      <PasswordInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '비밀번호 입력이에요. 입력창 끝의 보기 버튼으로 글자를 보이거나 가려요. 보기 버튼은 Tab 으로 닿고 켜짐/꺼짐을 스크린리더에 알려요(`aria-pressed`). 마우스로 눌러도 입력창 포커스와 커서 위치가 그대로예요. 로그인은 기본값(`autoComplete="current-password"`), 회원가입·비밀번호 변경의 새 비밀번호 칸은 `autoComplete="new-password"` 로 주세요.',
      },
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Visible: Story = {
  name: '글자로 보이는 상태',
  args: { defaultValue: 'bestow-1234', defaultVisible: true },
};

export const NewPassword: Story = {
  name: '새 비밀번호 (회원가입)',
  render: () => (
    <Stack gap={4} style={{ width: 300 }}>
      <PasswordInput
        label="새 비밀번호"
        autoComplete="new-password"
        required
        helperText="영문·숫자·특수문자를 섞어 8자 이상"
      />
      <PasswordInput label="새 비밀번호 확인" autoComplete="new-password" required />
    </Stack>
  ),
};

export const Error: Story = {
  name: '오류',
  args: { defaultValue: 'abc', error: true, helperText: '8자 이상 입력해 주세요.' },
};

export const Disabled: Story = { name: '비활성', args: { defaultValue: 'bestow-1234', disabled: true } };

/** 실제 브라우저에서 보기 버튼을 눌러도 입력창 포커스와 커서가 그대로인지 확인한다 (jsdom 은 커서를 실제와 다르게 다룬다) */
export const CaretStays: Story = {
  name: '보기 버튼을 눌러도 커서 유지',
  tags: ['!visual'],
  args: { defaultValue: 'abcdef' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('비밀번호') as HTMLInputElement;
    const toggle = canvas.getByRole('button', { name: '비밀번호 보기' });
    input.focus();
    input.setSelectionRange(2, 2); // "ab|cdef"
    await userEvent.click(toggle);
    await expect(input.type).toBe('text');
    await expect(document.activeElement).toBe(input);
    await expect(input.selectionStart).toBe(2);
    await userEvent.click(toggle);
    await expect(input.type).toBe('password');
    await expect(input.selectionStart).toBe(2);
  },
};
