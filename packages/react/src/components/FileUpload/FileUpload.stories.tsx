import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { FileUpload } from './FileUpload';

const sample = (name: string, size: number, type = 'application/pdf') =>
  new File([new Uint8Array(size)], name, { type, lastModified: 1 });

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  args: {
    label: '증빙 서류',
    helperText: 'PDF·JPG·PNG, 파일당 10MB 이하',
    accept: '.pdf,image/jpeg,image/png',
    maxSize: 10 * 1024 * 1024,
  },
  argTypes: { value: { control: false }, defaultValue: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <FileUpload {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '파일 첨부예요. "파일 선택" 버튼이나 끌어다 놓기로 고르고, 선택한 파일을 이름·크기·삭제 버튼 목록으로 보여 줘요. ' +
          '끌어다 놓기는 덤이라 버튼만으로 모두 할 수 있어요(KWCAG 2.5.7). accept·maxSize·maxFiles 에 맞지 않는 파일은 이유를 보여 주고 스크린리더에 알려요. ' +
          '서버 전송은 하지 않아요 — onValueChange 로 받은 File 을 직접 보내요. name 을 주면 일반 폼 제출에도 그대로 실려요.',
      },
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Multiple: Story = {
  name: '여러 개 (최대 3개)',
  args: { multiple: true, maxFiles: 3, helperText: '최대 3개, 파일당 10MB 이하' },
};

export const WithFiles: Story = {
  name: '선택된 파일',
  args: {
    multiple: true,
    defaultValue: [
      sample('사업자등록증.pdf', 482_000),
      sample('통장사본-아주-긴-파일-이름이-들어간-경우.jpg', 1_250_000, 'image/jpeg'),
    ],
  },
};

export const WithError: Story = {
  name: '에러',
  args: { required: true, error: true, helperText: '서류를 첨부해 주세요.' },
};

export const Disabled: Story = { args: { disabled: true } };

/** 실제 브라우저에서 끌어다 놓기 → 조건 검사 → name 으로 폼에 실리는지 확인한다 (jsdom 에는 DataTransfer 가 없다) */
export const FormSubmit: Story = {
  name: '폼 제출 (끌어다 놓기)',
  args: { name: 'documents', multiple: true, maxSize: 1024 * 1024, helperText: 'PDF, 1MB 이하' },
  render: (args) => (
    <form data-testid="form" style={{ maxWidth: 420 }} onSubmit={(event) => event.preventDefault()}>
      <FileUpload {...args} />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const transfer = new DataTransfer();
    transfer.items.add(sample('계약서.pdf', 2048));
    transfer.items.add(sample('너무-큰.pdf', 2 * 1024 * 1024));
    // fireEvent.drop 은 DataTransfer 의 속성을 복사하는데 files 는 프로토타입에 있어 빠진다 — 브라우저 DragEvent 를 직접 보낸다
    canvas
      .getByRole('group', { name: '증빙 서류' })
      .dispatchEvent(new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true }));
    await expect(await canvas.findByRole('button', { name: '계약서.pdf 삭제' })).toBeInTheDocument();
    await expect(canvas.getByText('너무-큰.pdf: 1.0 MB 이하만 올릴 수 있어요.')).toBeInTheDocument();
    const form = canvas.getByTestId('form') as HTMLFormElement;
    const submitted = new FormData(form).getAll('documents') as File[];
    await expect(submitted.map((file) => file.name)).toEqual(['계약서.pdf']);
  },
};

function ControlledDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Stack gap={3} style={{ maxWidth: 420 }}>
      <FileUpload label="첨부 파일" multiple value={files} onValueChange={setFiles} />
      <Typography variant="body-sm" color="muted">
        선택한 파일: {files.length}개
      </Typography>
      <Button size="sm" variant="outline" color="neutral" disabled={files.length === 0} onClick={() => setFiles([])}>
        모두 지우기
      </Button>
    </Stack>
  );
}

export const Controlled: Story = { name: '제어 모드', render: () => <ControlledDemo /> };
