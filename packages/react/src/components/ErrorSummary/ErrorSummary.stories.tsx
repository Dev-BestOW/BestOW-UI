import { useState, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { TextField } from '../Input';
import { RadioGroup } from '../RadioGroup';
import { Stack } from '../Stack';
import { ErrorSummary, type ErrorSummaryItem } from './ErrorSummary';

const meta = {
  title: 'Components/ErrorSummary',
  component: ErrorSummary,
  tags: ['autodocs'],
  args: {
    errors: [
      { id: 'demo-name', message: '이름을 입력해 주세요.' },
      { id: 'demo-email', message: '이메일 형식이 아니에요.' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          '폼 제출에 실패했을 때 고칠 곳을 모아 보여 줘요(GOV.UK error summary 패턴). 나타나면 포커스가 와서 스크린리더가 제목과 목록을 읽고, ' +
          '각 링크로 해당 칸에 바로 가요(RadioGroup·AgreementGroup 같은 묶음은 선택된·첫 항목, FileUpload 는 "파일 선택" 버튼). ' +
          '칸마다 `error`·`helperText` 도 함께 표시해요. 다시 제출해도 오류가 남아 있으면 포커스하도록 `focusKey` 에 제출 횟수를 넘겨요.\n\n' +
          '**react-hook-form**: `useForm({ shouldFocusError: false })` 로 두고 `errors` 를 `{ id, message }` 목록으로 바꿔 넘겨요. ' +
          '`focusKey={formState.submitCount}`. 값을 고르는 컴포넌트(Select·RadioGroup·AgreementGroup·FileUpload 등)는 `Controller` 로 `value`/`onValueChange` 를 연결해요.\n\n' +
          '```tsx\nconst { register, control, handleSubmit, formState: { errors, submitCount } } = useForm({ shouldFocusError: false });\n' +
          "const summary = Object.entries(errors).map(([name, e]) => ({ id: `signup-${name}`, message: e?.message ?? '' }));\n" +
          '<ErrorSummary errors={summary} focusKey={submitCount} />\n' +
          '<TextField id="signup-email" label="이메일" {...register(\'email\', { required: \'이메일을 입력해 주세요.\' })}\n' +
          '  error={!!errors.email} helperText={errors.email?.message} />\n```',
      },
    },
  },
  render: (args) => (
    <Stack gap={4} style={{ maxWidth: 420 }}>
      <ErrorSummary {...args} />
      <TextField id="demo-name" label="이름" error helperText="이름을 입력해 주세요." fullWidth />
      <TextField
        id="demo-email"
        label="이메일"
        defaultValue="bestow"
        error
        helperText="이메일 형식이 아니에요."
        fullWidth
      />
    </Stack>
  ),
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function DemoForm() {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<string>();
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const [submitCount, setSubmitCount] = useState(0);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: ErrorSummaryItem[] = [];
    if (!name.trim()) next.push({ id: 'form-name', message: '이름을 입력해 주세요.' });
    if (!plan) next.push({ id: 'form-plan', message: '플랜을 골라 주세요.' });
    setErrors(next);
    setSubmitCount((c) => c + 1);
  };
  const messageOf = (id: string) => errors.find((e) => e.id === id)?.message;
  return (
    <form noValidate onSubmit={submit} style={{ maxWidth: 420 }}>
      <Stack gap={4}>
        <ErrorSummary errors={errors} focusKey={submitCount} />
        <TextField
          id="form-name"
          label="이름"
          required
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!messageOf('form-name')}
          helperText={messageOf('form-name')}
        />
        <RadioGroup
          id="form-plan"
          label="플랜"
          required
          options={[
            { value: 'free', label: '무료' },
            { value: 'pro', label: '프로' },
          ]}
          value={plan}
          onValueChange={setPlan}
          error={!!messageOf('form-plan')}
          helperText={messageOf('form-plan')}
        />
        <Button type="submit" style={{ alignSelf: 'start' }}>
          가입
        </Button>
      </Stack>
    </form>
  );
}

/** 빈 채로 "가입" → 요약에 포커스 → 링크로 칸 이동 (실제 브라우저에서 확인) */
export const WithForm: Story = {
  name: '폼과 함께 (제출 → 링크로 이동)',
  render: () => <DemoForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '가입' }));
    const title = await canvas.findByText('입력한 내용에 고칠 곳이 2개 있어요');
    await expect(title.closest('[tabindex="-1"]')).toHaveFocus();
    await userEvent.click(canvas.getByRole('link', { name: '플랜을 골라 주세요.' }));
    await expect(canvas.getByRole('radio', { name: '무료' })).toHaveFocus();
  },
};
