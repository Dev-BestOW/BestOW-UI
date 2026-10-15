import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterIcon, MenuIcon } from '@bestow-ui/icons';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { IconButton } from '../IconButton';
import { RadioGroup } from '../RadioGroup';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { Drawer, DrawerClose } from './Drawer';

const filterBody = (
  <Stack gap={6}>
    <RadioGroup
      label="정렬"
      defaultValue="recent"
      options={[
        { value: 'recent', label: '최신순' },
        { value: 'popular', label: '인기순' },
        { value: 'price', label: '낮은 가격순' },
      ]}
    />
    <Stack gap={3}>
      <Typography variant="body-sm" weight="semibold">
        상태
      </Typography>
      <Checkbox label="판매 중" defaultChecked />
      <Checkbox label="예약 중" />
      <Checkbox label="판매 완료" />
    </Stack>
  </Stack>
);

const filterFooter = (
  <>
    <DrawerClose asChild>
      <Button variant="ghost" color="neutral">
        취소
      </Button>
    </DrawerClose>
    <DrawerClose asChild>
      <Button>적용</Button>
    </DrawerClose>
  </>
);

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: {
    title: '필터',
    description: '조건을 고르고 적용을 누르세요.',
    side: 'right',
    size: 'md',
    trigger: (
      <Button variant="outline" color="neutral" startIcon={<FilterIcon size={16} />}>
        필터
      </Button>
    ),
    children: filterBody,
    footer: filterFooter,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['right', 'left', 'top', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    trigger: { control: false },
    footer: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sides: Story = {
  name: '방향',
  render: (args) => (
    <Stack direction="row" gap={2} wrap>
      {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
        <Drawer
          key={side}
          {...args}
          side={side}
          size={side === 'top' || side === 'bottom' ? 'sm' : 'md'}
          title={`${side} 패널`}
          trigger={
            <Button variant="outline" color="neutral">
              {side}
            </Button>
          }
        />
      ))}
    </Stack>
  ),
};

export const NavigationMenu: Story = {
  name: '모바일 메뉴 (left)',
  args: {
    side: 'left',
    size: 'sm',
    title: '메뉴',
    description: undefined,
    footer: undefined,
    trigger: (
      <IconButton aria-label="메뉴 열기">
        <MenuIcon />
      </IconButton>
    ),
    children: (
      <nav aria-label="주 메뉴">
        <Stack as="ul" gap={1} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {['홈', '탐색', '알림', '설정'].map((item) => (
            <li key={item}>
              <Button variant="ghost" color="neutral" fullWidth style={{ justifyContent: 'flex-start' }}>
                {item}
              </Button>
            </li>
          ))}
        </Stack>
      </nav>
    ),
  },
};

export const LongContent: Story = {
  name: '긴 본문 (본문만 스크롤)',
  args: {
    title: '이용약관',
    description: undefined,
    children: (
      <Stack gap={4}>
        {Array.from({ length: 20 }, (_, i) => (
          <Typography key={i} variant="body-sm">
            제{i + 1}조 — 회사는 서비스 제공을 위해 필요한 범위에서 최소한의 정보를 수집하며, 수집한 정보는 정해진
            기간이 지나면 지체 없이 파기합니다.
          </Typography>
        ))}
      </Stack>
    ),
    footer: (
      <DrawerClose asChild>
        <Button>동의</Button>
      </DrawerClose>
    ),
  },
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [open, setOpen] = useState(false);
    return (
      <Stack direction="row" gap={2} align="center">
        <Button onClick={() => setOpen(true)}>코드로 열기</Button>
        <span>open: {String(open)}</span>
        <Drawer {...args} trigger={undefined} open={open} onOpenChange={setOpen} />
      </Stack>
    );
  },
};

export const Opened: Story = {
  name: '열린 상태',
  tags: ['!visual'], // 여는 애니메이션 도중에 찍힐 수 있다
  args: { defaultOpen: true },
};
