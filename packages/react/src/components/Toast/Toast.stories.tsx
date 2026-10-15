import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { ToastProvider, useToast } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '앱 최상단을 `ToastProvider`로 감싸고, 하위 컴포넌트에서 `useToast()`의 `toast()`로 띄워요.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { toast, dismiss } = useToast();
  return (
    <Stack direction="row" gap={2} wrap>
      <Button variant="outline" color="neutral" onClick={() => toast({ title: '저장했어요' })}>
        기본
      </Button>
      <Button
        variant="outline"
        color="neutral"
        onClick={() =>
          toast({ title: '업로드 완료', description: 'report.pdf 파일이 업로드됐어요.', variant: 'success' })
        }
      >
        성공
      </Button>
      <Button
        variant="outline"
        color="danger"
        onClick={() => toast({ title: '저장 실패', description: '네트워크 연결을 확인해 주세요.', variant: 'danger' })}
      >
        에러
      </Button>
      <Button
        variant="outline"
        color="neutral"
        onClick={() =>
          toast({
            title: '메일을 보관함으로 옮겼어요',
            action: { label: '실행 취소', onClick: () => toast({ title: '되돌렸어요' }) },
            duration: 8000,
          })
        }
      >
        액션 포함
      </Button>
      <Button variant="ghost" color="neutral" onClick={() => dismiss()}>
        모두 닫기
      </Button>
    </Stack>
  );
}

export const Playground: Story = {
  render: () => <Demo />,
};
