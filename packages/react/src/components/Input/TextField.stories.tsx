import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Checkbox } from '../Checkbox';
import { RadioGroup } from '../RadioGroup';
import { SegmentedControl } from '../SegmentedControl';
import { Select } from '../Select';
import { Stack } from '../Stack';
import { Switch } from '../Switch';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: '이메일',
    placeholder: 'name@example.com',
    helperText: '로그인에 사용할 이메일을 입력하세요.',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startAdornment: { control: false },
    endAdornment: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: {
    error: true,
    defaultValue: 'name@',
    helperText: '올바른 이메일 형식이 아닙니다.',
  },
};

/** `disabled` prop 이 없어도 감싸는 fieldset 이 비활성이면 같은 모양이다 (계산된 스타일은 실제 브라우저에서만 확인된다) */
export const InDisabledFieldset: Story = {
  name: 'fieldset disabled 안',
  render: () => {
    const options = [
      { value: 'a', label: '가' },
      { value: 'b', label: '나' },
    ];
    return (
      <fieldset disabled style={{ border: 0, padding: 0, margin: 0 }}>
        <Stack gap={4} style={{ maxWidth: 320 }}>
          <TextField label="이메일" />
          <Select label="플랜" options={options} />
          <Checkbox label="동의" />
          <Switch label="알림" />
          <RadioGroup label="주기" name="cycle" options={options} />
          <SegmentedControl aria-label="보기" options={options} defaultValue="a" />
        </Stack>
      </fieldset>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 컴포넌트마다 값이 달라(0.5·0.6) 흐려졌는지만 본다
    const dimmed = (element: Element | null) => expect(Number(getComputedStyle(element!).opacity)).toBeLessThan(1);
    await dimmed(canvas.getByRole('textbox', { name: '이메일' }).parentElement);
    await dimmed(canvas.getByRole('combobox', { name: '플랜' }));
    await dimmed(canvas.getByRole('checkbox', { name: '동의' }).closest('label'));
    await dimmed(canvas.getByRole('switch', { name: '알림' }).parentElement);
    await dimmed(canvas.getAllByRole('radio', { name: '나' }).at(-1)!); // SegmentedControl
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};
