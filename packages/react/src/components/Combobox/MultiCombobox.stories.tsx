import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import type { ComboboxOption } from './Combobox';
import { MultiCombobox } from './MultiCombobox';

const cities: ComboboxOption[] = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'incheon', label: '인천' },
  { value: 'daegu', label: '대구' },
  { value: 'daejeon', label: '대전' },
  { value: 'gwangju', label: '광주' },
  { value: 'ulsan', label: '울산' },
  { value: 'sejong', label: '세종', disabled: true },
  { value: 'suwon', label: '수원' },
  { value: 'jeju', label: '제주' },
];

const meta = {
  title: 'Components/MultiCombobox',
  component: MultiCombobox,
  tags: ['autodocs'],
  args: {
    label: '업무 지역',
    options: cities,
    placeholder: '지역을 검색하세요',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    options: { control: false },
    filter: { control: false },
    removeLabel: { control: false },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <MultiCombobox {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '입력해서 거르며 여러 개를 고르는 선택 상자예요. 고른 값은 입력창 안에 칩으로 보여요. Enter·클릭으로 고르고 다시 누르면 풀려요(목록은 열린 채). 빈 입력창에서 Backspace 를 누르면 마지막 칩이 지워지고, 칩의 삭제 버튼은 Tab 으로 갈 수 있어요. 선택지가 적고(7개 이하) 검색이 필요 없으면 `CheckboxGroup` 이 더 쉬워요.',
      },
    },
  },
} satisfies Meta<typeof MultiCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  name: '고른 값',
  args: { defaultValue: ['seoul', 'busan', 'gwangju'] },
};

/** 칩이 칸 너비를 넘으면 여러 줄이 된다 */
export const ManySelected: Story = {
  name: '여러 줄',
  args: { defaultValue: ['seoul', 'busan', 'incheon', 'daegu', 'daejeon', 'gwangju', 'ulsan'], clearable: true },
};

/** 다 고르면 나머지 항목이 비활성이 되고 칸 아래에 안내가 보인다 */
export const MaxSelected: Story = {
  name: '최대 개수',
  args: { maxSelected: 3, defaultValue: ['seoul', 'busan', 'incheon'], helperText: '자주 가는 지역을 골라 주세요.' },
};

/** play 로 목록을 연 상태 — 스토리 테스트의 axe 가 열린 listbox(aria-multiselectable)까지 검사한다 */
export const Open: Story = {
  name: '검색해서 연 상태',
  args: { defaultValue: ['daegu'] },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: '업무 지역' });
    await userEvent.type(input, '대');
    const listbox = within(document.body).getByRole('listbox', { name: '업무 지역' });
    await expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    await expect(
      within(listbox)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['대구', '대전']);
  },
};

/** 키보드: 고르기 → Backspace 로 마지막 칩 지우기 (실제 브라우저에서 커서 위치 조건까지 확인) */
export const KeyboardRemove: Story = {
  name: '키보드로 고르고 지우기',
  tags: ['no-visual'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: '업무 지역' });
    await userEvent.type(input, '부{Enter}인{Enter}{Escape}');
    const chips = () =>
      within(canvas.getByRole('list', { name: '고른 항목' }))
        .getAllByRole('listitem')
        .map((li) => li.textContent);
    await expect(chips()).toEqual(['부산', '인천']);
    await userEvent.keyboard('{Backspace}');
    await expect(chips()).toEqual(['부산']);
    await expect(input).toHaveFocus();
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('인천 삭제됨'));
  },
};

export const WithError: Story = {
  name: '에러',
  args: { required: true, error: true, helperText: '지역을 하나 이상 골라 주세요.' },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: ['seoul', 'busan'] } };

export const Sizes: Story = {
  name: '크기',
  render: (args) => (
    <Stack gap={3} style={{ width: 320 }}>
      <MultiCombobox {...args} size="sm" label="작게" defaultValue={['seoul', 'busan']} />
      <MultiCombobox {...args} size="md" label="보통" defaultValue={['seoul', 'busan']} />
      <MultiCombobox {...args} size="lg" label="크게" defaultValue={['seoul', 'busan']} />
    </Stack>
  ),
};

function ControlledDemo() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <Stack gap={3} style={{ width: 320 }}>
      <MultiCombobox label="업무 지역" options={cities} value={values} onValueChange={setValues} clearable />
      <Typography variant="body-sm" color="muted">
        고른 값: {values.length ? values.join(', ') : '없음'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };
