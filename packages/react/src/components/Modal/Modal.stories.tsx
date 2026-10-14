import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { TextField } from '../Input';
import { Stack } from '../Stack';
import { Modal, ModalClose } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    title: '프로젝트 삭제',
    description: '삭제한 프로젝트는 복구할 수 없어요.',
    trigger: <Button color="danger">프로젝트 삭제</Button>,
    footer: (
      <>
        <ModalClose asChild>
          <Button variant="ghost" color="neutral">취소</Button>
        </ModalClose>
        <ModalClose asChild>
          <Button color="danger">삭제</Button>
        </ModalClose>
      </>
    ),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    trigger: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithForm: Story = {
  args: {
    title: '팀원 초대',
    description: '초대 메일을 보낼 이메일을 입력하세요.',
    trigger: <Button>팀원 초대</Button>,
    children: (
      <Stack gap={4}>
        <TextField label="이름" fullWidth />
        <TextField label="이메일" type="email" required fullWidth />
      </Stack>
    ),
    footer: (
      <>
        <ModalClose asChild>
          <Button variant="ghost" color="neutral">취소</Button>
        </ModalClose>
        <Button>초대 보내기</Button>
      </>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: '이용약관',
    description: undefined,
    size: 'lg',
    trigger: <Button variant="outline">약관 보기</Button>,
    children: Array.from({ length: 30 }, (_, i) => <p key={i}>제{i + 1}조 — 내용이 길어지면 본문 영역만 스크롤돼요.</p>),
    footer: (
      <ModalClose asChild>
        <Button>동의</Button>
      </ModalClose>
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
        <Modal {...args} trigger={undefined} open={open} onOpenChange={setOpen} />
      </Stack>
    );
  },
};
