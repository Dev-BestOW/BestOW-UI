import { useState, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { ErrorSummary } from '../ErrorSummary';
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
          <Button variant="ghost" color="neutral">
            취소
          </Button>
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
          <Button variant="ghost" color="neutral">
            취소
          </Button>
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
    children: Array.from({ length: 30 }, (_, i) => (
      <p key={i}>제{i + 1}조 — 내용이 길어지면 본문 영역만 스크롤돼요.</p>
    )),
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

/** play 로 연 상태 — 스토리 테스트의 axe 와 시각 회귀가 열린 대화상자까지 확인한다 */
export const Open: Story = {
  name: '열린 상태',
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '프로젝트 삭제' }));
    await expect(within(document.body).getByRole('dialog', { name: '프로젝트 삭제' })).toBeInTheDocument();
  },
};

function SubmitFormModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [submitCount, setSubmitCount] = useState(0);
  const [sent, setSent] = useState<string>();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitCount((c) => c + 1);
    if (!email.includes('@')) return setError('이메일 형식이 아니에요.');
    setError(undefined);
    setSent(email);
    setOpen(false);
  };
  return (
    <Stack gap={3}>
      <Modal
        title="팀원 초대"
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>팀원 초대</Button>}
        footer={
          <>
            <ModalClose asChild>
              <Button variant="ghost" color="neutral">
                취소
              </Button>
            </ModalClose>
            {/* footer 는 form 밖이라 form 속성으로 폼을 제출한다 — Enter 제출·필수 검사도 그대로 */}
            <Button type="submit" form="invite-form">
              초대 보내기
            </Button>
          </>
        }
      >
        <form id="invite-form" noValidate onSubmit={submit}>
          <Stack gap={4}>
            <ErrorSummary errors={error ? [{ id: 'invite-email', message: error }] : []} focusKey={submitCount} />
            <TextField
              id="invite-email"
              label="이메일"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </Stack>
        </form>
      </Modal>
      {sent && <span role="status">{sent} 님을 초대했어요.</span>}
    </Stack>
  );
}

/**
 * 대화상자 아래쪽(footer) 버튼으로 폼 제출 — footer 는 form 밖에 그려지므로 버튼에 `type="submit" form="폼 id"` 를 준다.
 * 검증에 실패하면 ErrorSummary 로 포커스를 옮긴다. (예제 앱 주문 관리의 등록 폼과 같은 방식)
 */
export const SubmitForm: Story = {
  name: '폼 제출 (footer 버튼)',
  render: () => <SubmitFormModal />,
  parameters: { a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '팀원 초대' }));
    const dialogElement = within(document.body).getByRole('dialog', { name: '팀원 초대' });
    const dialog = within(dialogElement);
    await userEvent.click(dialog.getByRole('button', { name: '초대 보내기' }));
    await expect(await dialog.findByText('입력한 내용에 고칠 곳이 1개 있어요')).toBeInTheDocument();
    await userEvent.type(dialog.getByRole('textbox', { name: '이메일' }), 'me@bestow.dev');
    await userEvent.click(dialog.getByRole('button', { name: '초대 보내기' }));
    // 닫히는 애니메이션이 끝나 대화상자가 사라질 때까지 바깥은 aria-hidden 이라 role 로 찾을 수 없다 (느린 CI WebKit 에서 1초를 넘김)
    await waitFor(() => expect(dialogElement).not.toBeInTheDocument(), { timeout: 5000 });
    await expect(canvas.getByRole('status')).toHaveTextContent('me@bestow.dev 님을 초대했어요.');
  },
};
