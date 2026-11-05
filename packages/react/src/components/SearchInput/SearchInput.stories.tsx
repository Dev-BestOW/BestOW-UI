import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { SearchInput } from './SearchInput';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  render: (args) => (
    <div style={{ width: 300 }}>
      <SearchInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '검색 입력이에요. 앞에 돋보기, 글자가 있으면 끝에 지우기 버튼이 생겨요. Enter 는 `onSearch`(한글 조합을 끝내는 Enter 는 무시), Escape 는 검색어를 지워요. 레이블이 없으면 스크린리더 이름은 "검색" 이에요. 페이지의 주요 검색이라면 감싸는 `<form role="search">` 를 함께 두세요.',
      },
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { placeholder: '주문번호·고객 이름' } };

export const Filled: Story = { name: '입력된 상태', args: { defaultValue: '무선 이어폰' } };

export const WithLabel: Story = {
  name: '레이블과 도움말',
  args: { label: '상품 검색', helperText: '상품명이나 브랜드로 찾아요', fullWidth: true },
};

export const Sizes: Story = {
  name: '크기',
  render: () => (
    <Stack gap={3} style={{ width: 300 }}>
      <SearchInput size="sm" aria-label="작은 검색" defaultValue="작게" />
      <SearchInput size="md" aria-label="보통 검색" defaultValue="보통" />
      <SearchInput size="lg" aria-label="큰 검색" defaultValue="크게" />
    </Stack>
  ),
};

export const Disabled: Story = { name: '비활성', args: { defaultValue: '무선 이어폰', disabled: true } };

function SearchDemo() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState<string | null>(null);
  return (
    <Stack gap={3} style={{ width: 300 }}>
      <SearchInput value={query} onValueChange={setQuery} onSearch={setSearched} placeholder="검색어를 넣고 Enter" />
      <Typography variant="body-sm" color="muted">
        검색한 말: {searched === null ? '(아직 없음)' : searched || '(빈 검색어)'}
      </Typography>
    </Stack>
  );
}

export const OnSearch: Story = { name: 'Enter 로 검색 (제어 모드)', render: () => <SearchDemo /> };

/** 실제 브라우저에서 Escape·지우기 버튼 동작을 확인한다 */
export const ClearAndEscape: Story = {
  name: '지우기 버튼과 Escape',
  tags: ['!visual'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('searchbox', { name: '검색' }) as HTMLInputElement;
    await userEvent.type(box, '사과');
    await userEvent.click(canvas.getByRole('button', { name: '검색어 지우기' }));
    await expect(box.value).toBe('');
    await expect(document.activeElement).toBe(box);
    await userEvent.type(box, '배{Escape}');
    await expect(box.value).toBe('');
    await expect(canvas.queryByRole('button', { name: '검색어 지우기' })).toBeNull();
  },
};
