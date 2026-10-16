import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { Combobox, type ComboboxOption } from './Combobox';

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
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    label: '도시',
    options: cities,
    placeholder: '도시를 검색하세요',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    options: { control: false },
    filter: { control: false },
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Combobox {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '입력해서 거르며 고르는 선택 상자예요. ↓/↑ 로 목록을 열고 이동, Enter 로 선택, Esc 로 닫아요. 목록에 없는 값은 입력할 수 없어요(선택만). 선택지가 적고 검색이 필요 없으면 `Select` 를 쓰세요.',
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 값이 있을 때 "선택 지우기" 버튼이 보인다. 버튼 없이도 글자를 모두 지우고 닫으면 선택이 지워진다. */
export const Clearable: Story = {
  args: { clearable: true, defaultValue: 'busan' },
};

/** play 로 목록을 연 상태 — 스토리 테스트의 axe 가 열린 listbox 까지 검사한다 */
export const Open: Story = {
  name: '검색해서 연 상태',
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: '도시' });
    await userEvent.type(input, '대');
    const listbox = within(document.body).getByRole('listbox', { name: '도시' });
    await expect(
      within(listbox)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['대구', '대전']);
  },
};

export const Selected: Story = { args: { defaultValue: 'busan' } };

export const WithError: Story = {
  name: '에러',
  args: { required: true, error: true, helperText: '도시를 골라 주세요.' },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'seoul' } };

function ControlledDemo() {
  const [city, setCity] = useState<string>();
  return (
    <Stack gap={3} style={{ width: 280 }}>
      <Combobox label="도시" options={cities} value={city} onValueChange={setCity} helperText="세종은 준비 중이에요." />
      <Typography variant="body-sm" color="muted">
        선택한 값: {city ?? '없음'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };
