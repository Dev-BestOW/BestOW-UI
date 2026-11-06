import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { Tag } from './Tag';
import { TagGroup } from './TagGroup';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: '디자인' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['soft', 'outline'] },
    color: { control: 'inline-radio', options: ['primary', 'neutral', 'danger', 'success', 'warning', 'info'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    startIcon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          '짧은 글자 하나를 담는 태그예요. 세 가지로 써요. **표시**(분류·키워드 — 결제 완료 같은 상태 라벨은 Badge), **삭제**(`onRemove` — 고른 필터·입력한 키워드, 삭제 버튼 위에서 Delete·Backspace 로도 지워요), **고르기**(`selected`·`onSelectedChange` — 필터 칩, `aria-pressed` 와 체크 아이콘으로 켜짐을 보여요). 여러 개를 나열하면 `TagGroup` 으로 감싸요 — 지운 뒤 포커스를 다음 태그로 옮기고 "… 삭제됨" 을 알려요.',
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  name: '색과 모양',
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 12 }}>
      {(['primary', 'neutral', 'danger', 'success', 'warning', 'info'] as const).map((color) =>
        (['soft', 'outline'] as const).map((variant) => (
          <Tag key={`${color}-${variant}`} {...args} color={color} variant={variant}>
            {`${color} ${variant}`}
          </Tag>
        )),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  name: '크기',
  render: () => (
    <Stack direction="row" gap={2} align="center">
      <Tag size="sm">작게</Tag>
      <Tag size="md">보통</Tag>
      <Tag size="sm" onRemove={() => {}}>
        작게 삭제
      </Tag>
      <Tag size="md" onRemove={() => {}}>
        보통 삭제
      </Tag>
    </Stack>
  ),
};

const REGIONS = ['서울', '부산', '대구', '인천', '광주'];

function RemovableDemo() {
  const [tags, setTags] = useState(REGIONS);
  return (
    <Stack gap={3} style={{ maxWidth: 420 }}>
      <Typography variant="body-sm" id="regions-title">
        고른 지역
      </Typography>
      <TagGroup aria-labelledby="regions-title">
        {tags.map((tag) => (
          <Tag key={tag} color="primary" onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}>
            {tag}
          </Tag>
        ))}
      </TagGroup>
      <Button
        size="sm"
        variant="outline"
        color="neutral"
        onClick={() => setTags(REGIONS)}
        style={{ alignSelf: 'start' }}
      >
        처음으로
      </Button>
    </Stack>
  );
}

export const Removable: Story = { name: '삭제 (TagGroup)', render: () => <RemovableDemo /> };

/** 실제 브라우저에서 지운 뒤 포커스가 다음 태그로 가는지 */
export const RemoveFocus: Story = {
  name: '지우면 다음 태그로 포커스',
  tags: ['no-visual'],
  render: () => <RemovableDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '부산 삭제' }));
    await expect(document.activeElement).toBe(canvas.getByRole('button', { name: '대구 삭제' }));
    await userEvent.keyboard('{Backspace}');
    await expect(document.activeElement).toBe(canvas.getByRole('button', { name: '인천 삭제' }));
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

const QUICK = ['무료 배송', '오늘 출발', '할인 중', '리뷰 많은 순'];

function SelectableDemo() {
  const [selected, setSelected] = useState<string[]>(['무료 배송']);
  return (
    <Stack gap={3}>
      <div role="group" aria-label="빠른 필터" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {QUICK.map((label) => (
          <Tag
            key={label}
            selected={selected.includes(label)}
            onSelectedChange={(on) => setSelected((prev) => (on ? [...prev, label] : prev.filter((s) => s !== label)))}
          >
            {label}
          </Tag>
        ))}
      </div>
      <Typography variant="body-sm" color="muted">
        켠 필터: {selected.join(', ') || '(없음)'}
      </Typography>
    </Stack>
  );
}

export const Selectable: Story = { name: '고르기 (필터 칩)', render: () => <SelectableDemo /> };

export const Disabled: Story = {
  name: '비활성',
  render: () => (
    <Stack direction="row" gap={2}>
      <Tag disabled onRemove={() => {}}>
        삭제 비활성
      </Tag>
      <Tag disabled defaultSelected>
        고르기 비활성
      </Tag>
    </Stack>
  ),
};
