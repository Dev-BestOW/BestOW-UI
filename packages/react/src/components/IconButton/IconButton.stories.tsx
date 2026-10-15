import type { Meta, StoryObj } from '@storybook/react-vite';
import { EllipsisIcon, HeartIcon, PencilIcon, SettingsIcon, TrashIcon } from '@bestow-ui/icons';
import { Stack } from '../Stack';
import { Tooltip } from '../Tooltip';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    variant: 'ghost',
    color: 'neutral',
    size: 'md',
    'aria-label': '설정',
    children: <SettingsIcon />,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'soft', 'outline', 'solid'] },
    color: { control: 'inline-radio', options: ['neutral', 'primary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          '아이콘만 있는 정사각형 버튼이에요. 스크린리더용 이름인 `aria-label` 은 필수예요. 마우스 사용자도 뜻을 알 수 있게 `Tooltip` 으로 감싸는 걸 권해요.',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap={3}>
      {(['neutral', 'primary', 'danger'] as const).map((color) => (
        <Stack key={color} direction="row" gap={2} align="center">
          {(['ghost', 'soft', 'outline', 'solid'] as const).map((variant) => (
            <IconButton key={variant} {...args} color={color} variant={variant} aria-label={`${color} ${variant}`}>
              <HeartIcon />
            </IconButton>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap={2} align="center">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <IconButton key={size} {...args} size={size} variant="outline" aria-label={`설정 (${size})`}>
          <SettingsIcon />
        </IconButton>
      ))}
    </Stack>
  ),
};

export const WithTooltip: Story = {
  name: 'Tooltip 과 함께 (툴바)',
  render: () => (
    <Stack direction="row" gap={1} role="toolbar" aria-label="게시글 도구">
      <Tooltip content="수정">
        <IconButton aria-label="수정">
          <PencilIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content="삭제">
        <IconButton aria-label="삭제" color="danger">
          <TrashIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content="더보기">
        <IconButton aria-label="더보기">
          <EllipsisIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  ),
};

export const States: Story = {
  name: '로딩 · 비활성',
  tags: ['!visual'], // 스피너 회전 애니메이션
  render: () => (
    <Stack direction="row" gap={2} align="center">
      <IconButton aria-label="저장 중" variant="solid" color="primary" loading>
        <HeartIcon />
      </IconButton>
      <IconButton aria-label="삭제" variant="outline" disabled>
        <TrashIcon />
      </IconButton>
    </Stack>
  ),
};
