import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as icons from '@bestow-ui/icons';
import type { Icon, IconProps } from '@bestow-ui/icons';
import { Button, Stack, TextField, Tooltip, Typography, vars } from '@bestow-ui/react';

const iconEntries = Object.entries(icons).filter(
  (entry): entry is [string, Icon] => entry[0].endsWith('Icon') && typeof entry[1] === 'object',
);

type GalleryArgs = Pick<IconProps, 'size' | 'strokeWidth' | 'color'>;

function IconGallery({ size, strokeWidth, color }: GalleryArgs) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? iconEntries.filter(([name]) => name.toLowerCase().includes(q)) : iconEntries;
  }, [query]);

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(`<${name} />`);
      setCopied(name);
      setTimeout(() => setCopied((current) => (current === name ? null : current)), 1500);
    } catch {
      // 클립보드 권한이 없는 환경에서는 무시한다.
    }
  };

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={4} align="end" justify="between" wrap>
        <TextField
          label="아이콘 검색"
          placeholder="예: arrow, user"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Typography variant="body-sm" color="muted">
          {filtered.length}개 · 클릭하면 JSX 가 복사돼요
        </Typography>
      </Stack>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 8,
        }}
      >
        {filtered.map(([name, IconComponent]) => (
          <button
            key={name}
            type="button"
            onClick={() => copy(name)}
            title={`<${name} />`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '16px 8px',
              border: `1px solid ${vars.color.border.default}`,
              borderRadius: 8,
              background: copied === name ? vars.color.primary.subtle : 'transparent',
              color: vars.color.fg.default,
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            <IconComponent size={size} strokeWidth={strokeWidth} color={color} />
            <span style={{ fontSize: 11, color: vars.color.fg.muted, wordBreak: 'break-all' }}>
              {copied === name ? '복사됨!' : name.replace(/Icon$/, '')}
            </span>
          </button>
        ))}
      </div>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Icons',
  component: IconGallery,
  args: {
    size: 24,
    strokeWidth: 2,
  },
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 48, step: 2 } },
    strokeWidth: { control: { type: 'range', min: 1, max: 3, step: 0.25 } },
    color: { control: 'color' },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`@bestow-ui/icons` 의 모든 아이콘이에요. `import { SearchIcon } from "@bestow-ui/icons"` 처럼 필요한 것만 가져다 쓰면 그 아이콘만 번들에 포함돼요.',
      },
    },
  },
} satisfies Meta<typeof IconGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};

export const UsageWithComponents: Story = {
  name: '컴포넌트와 함께 쓰기',
  render: () => (
    <Stack direction="row" gap={3} align="center">
      <Button startIcon={<icons.PlusIcon size={16} />}>추가</Button>
      <Button variant="outline" color="neutral" endIcon={<icons.ExternalLinkIcon size={16} />}>
        문서 열기
      </Button>
      <Tooltip content="삭제">
        <Button variant="ghost" color="danger" aria-label="삭제">
          <icons.TrashIcon size={18} />
        </Button>
      </Tooltip>
      <TextField aria-label="검색" placeholder="검색" startAdornment={<icons.SearchIcon size={16} />} />
    </Stack>
  ),
};
