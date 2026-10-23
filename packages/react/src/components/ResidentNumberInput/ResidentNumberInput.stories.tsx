import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ResidentNumberInput } from './ResidentNumberInput';

const meta = {
  title: 'Korean Kit/ResidentNumberInput',
  component: ResidentNumberInput,
  tags: ['autodocs'],
  args: { onValueChange: fn() },
  parameters: {
    docs: {
      description: {
        component:
          '주민·외국인등록번호 입력이에요. 앞 6자리와 뒷자리를 두 칸으로 받고 뒷자리는 가려요. 번호를 통째로 붙여 넣으면 두 칸에 나눠 넣어요. 다 채우면 생년월일·뒷자리 첫 숫자로 오타를 걸러요(2020년 10월 이후 번호는 뒤 6자리가 임의라 마지막 검증 숫자는 보지 않아요). 주민등록번호는 법령 근거가 있을 때만 수집할 수 있어요 — 나이·성별만 필요하면 `digits={7}` 을 쓰세요. 화면에 보여 줄 때는 `maskResidentNumber`(900101-1******).',
      },
    },
  },
} satisfies Meta<typeof ResidentNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { required: true, helperText: '본인 확인에만 쓰고 저장하지 않아요.' },
  play: async ({ canvasElement, args }) => {
    // 실제 브라우저의 붙여넣기 — 하이픈이 섞인 번호를 두 칸에 나눈다
    const canvas = within(canvasElement);
    const front = canvas.getByRole('textbox', { name: '앞 6자리' });
    await userEvent.click(front);
    await userEvent.paste('900101-1234567');
    await expect(front).toHaveValue('900101');
    await expect(canvas.getByLabelText('뒤 7자리')).toHaveValue('1234567');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('9001011234567', true);
  },
};

/** 나이·성별만 확인할 때 — 생년월일 + 뒷자리 첫 숫자 */
export const BirthAndSex: Story = {
  name: '앞 7자리만',
  args: { digits: 7, label: '생년월일 · 성별', defaultValue: '0502284' },
};

export const Invalid: Story = { name: '검증 실패', args: { defaultValue: '9002301234567' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: '9001011234567' } };
