import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CopyIcon, EllipsisIcon, PencilIcon, ShareIcon, TrashIcon } from '@bestow-ui/icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenuContent,
  tags: ['autodocs'],
  args: {
    side: 'bottom',
    align: 'start',
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" color="neutral">
          문서 메뉴
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>문서</DropdownMenuLabel>
          <DropdownMenuItem icon={<PencilIcon size={16} />} shortcut="⌘E" onSelect={fn()}>
            편집
          </DropdownMenuItem>
          <DropdownMenuItem icon={<CopyIcon size={16} />} shortcut="⌘D" onSelect={fn()}>
            복제
          </DropdownMenuItem>
          <DropdownMenuItem icon={<ShareIcon size={16} />} disabled>
            공유 (권한 없음)
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<TrashIcon size={16} />} color="danger" shortcut="⌫" onSelect={fn()}>
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 아이콘만 있는 트리거는 aria-label 로 이름을 준다. */
export const IconTrigger: Story = {
  args: { align: 'end' },
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label="더보기">
            <EllipsisIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent {...args}>
          <DropdownMenuItem>이름 바꾸기</DropdownMenuItem>
          <DropdownMenuItem>이동</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem color="danger">삭제</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
