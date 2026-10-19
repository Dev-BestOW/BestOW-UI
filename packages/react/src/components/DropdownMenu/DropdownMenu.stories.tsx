import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CopyIcon, EllipsisIcon, FolderIcon, PencilIcon, ShareIcon, TrashIcon } from '@bestow-ui/icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

/** play 로 메뉴를 연 상태 — 스토리 테스트의 axe 와 시각 회귀가 열린 메뉴까지 확인한다 */
export const Open: Story = {
  name: '메뉴 열림',
  parameters: {
    a11y: {
      // 열려 있는 동안 Radix 가 메뉴 바깥을 aria-hidden 으로 숨기고 포커스를 메뉴 안에 가둔다 — 숨겨진 트리거는
      // 키보드·스크린리더로 닿지 않고 닫히면 포커스가 돌아간다. axe 는 "숨긴 영역 안에 포커스 가능한 요소" 로 본다.
      config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '문서 메뉴' }));
    await expect(within(document.body).getByRole('menu')).toBeInTheDocument();
  },
};

function ViewOptionsMenu(args: Story['args']) {
  const [grid, setGrid] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [sort, setSort] = useState('name');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" color="neutral">
          보기 옵션
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args}>
        <DropdownMenuLabel>표시</DropdownMenuLabel>
        {/* 여러 개를 이어서 바꾸도록 고른 뒤에도 메뉴를 열어 둔다 */}
        <DropdownMenuCheckboxItem checked={grid} onCheckedChange={setGrid} onSelect={(e) => e.preventDefault()}>
          격자로 보기
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={hidden} onCheckedChange={setHidden} onSelect={(e) => e.preventDefault()}>
          숨긴 파일 표시
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>정렬</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="name">이름순</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">날짜순</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size" disabled>
            크기순 (준비 중)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * `DropdownMenuCheckboxItem` 은 켜고 끄는 항목(menuitemcheckbox), `DropdownMenuRadioGroup` + `DropdownMenuRadioItem` 은
 * 하나만 고르는 항목(menuitemradio). 둘 다 고르면 기본으로 메뉴가 닫힌다 — 여러 개를 이어서 바꾸게 하려면
 * `onSelect={(e) => e.preventDefault()}` 로 열어 둔다(이 예의 체크 항목). RadioGroup 은 항상 `value` 로 제어한다.
 */
export const CheckboxAndRadio: Story = {
  name: '체크·라디오 항목',
  render: (args) => <ViewOptionsMenu {...args} />,
};

function MoveMenu(args: Story['args']) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" color="neutral">
          파일 메뉴
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args}>
        <DropdownMenuItem icon={<PencilIcon size={16} />}>이름 바꾸기</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<FolderIcon size={16} />}>이동</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>받은 문서함</DropdownMenuItem>
            <DropdownMenuItem>보관함</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>새 폴더…</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<TrashIcon size={16} />} color="danger">
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * 하위 메뉴: `DropdownMenuSub` 안에 `DropdownMenuSubTrigger`(여는 항목) + `DropdownMenuSubContent`(목록).
 * 마우스를 올리거나 → · Enter · Space 로 열고, ← · Esc 로 닫는다. 하위 메뉴는 한 단계까지만 쓰는 것을 권한다.
 */
export const Submenu: Story = {
  name: '하위 메뉴',
  render: (args) => <MoveMenu {...args} />,
};

const openMenuA11y = {
  a11y: {
    // "메뉴 열림" 스토리와 같은 이유 (Radix 가 바깥을 aria-hidden 으로 숨기고 포커스를 가둠)
    config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] },
  },
};

/** play 로 연 체크·라디오 메뉴 — axe·시각 회귀가 체크·라디오 표시까지 확인한다 */
export const CheckboxAndRadioOpen: Story = {
  name: '체크·라디오 열림',
  parameters: openMenuA11y,
  render: (args) => <ViewOptionsMenu {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '보기 옵션' }));
    const menu = within(document.body).getByRole('menu');
    await expect(within(menu).getByRole('menuitemcheckbox', { name: '격자로 보기' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(within(menu).getByRole('menuitemradio', { name: '이름순' })).toHaveAttribute('aria-checked', 'true');
  },
};

/** play 로 하위 메뉴까지 연 상태 (키보드 → 로 열기) */
export const SubmenuOpen: Story = {
  name: '하위 메뉴 열림',
  parameters: openMenuA11y,
  render: (args) => <MoveMenu {...args} />,
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('button', { name: '파일 메뉴' }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');
    const body = within(document.body);
    await expect(body.getByRole('menuitem', { name: '이동' })).toHaveAttribute('aria-expanded', 'true');
    await expect(await body.findByRole('menuitem', { name: '받은 문서함' })).toHaveFocus();
  },
};
