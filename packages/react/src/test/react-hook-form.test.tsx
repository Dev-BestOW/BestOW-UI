import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controller, useForm } from 'react-hook-form';
import { AgreementGroup } from '../components/AgreementGroup';
import { Checkbox } from '../components/Checkbox';
import { ErrorSummary } from '../components/ErrorSummary';
import { FileUpload } from '../components/FileUpload';
import { TextField } from '../components/Input';
import { NumberInput } from '../components/NumberInput';
import { PhoneNumberInput } from '../components/PhoneNumberInput';
import { RadioGroup } from '../components/RadioGroup';
import { Select } from '../components/Select';

// react-hook-form 과 함께 쓰는 방법(문서의 예와 같음)이 실제로 동작하는지 — register(네이티브 입력)·Controller(값을 고르는 컴포넌트)·
// ErrorSummary(shouldFocusError: false, focusKey=submitCount)
interface Values {
  email: string;
  phone: string;
  plan: string;
  billing: string;
  seats: number | null;
  agreements: string[];
  marketing: boolean;
  documents: File[];
}

const AGREEMENTS = [
  { value: 'terms', label: '서비스 이용약관 동의', required: true },
  { value: 'privacy', label: '개인정보 수집·이용 동의', required: true },
  { value: 'ads', label: '광고성 정보 수신 동의' },
];

function SignupForm({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<Values>({
    shouldFocusError: false, // 첫 칸 대신 오류 요약으로 포커스를 옮긴다
    defaultValues: {
      email: '',
      phone: '',
      plan: '',
      billing: '',
      seats: 1,
      agreements: [],
      marketing: false,
      documents: [],
    },
  });
  const summary = (Object.keys(errors) as (keyof Values)[]).map((key) => ({
    id: `signup-${key}`,
    message: errors[key]?.message ?? '',
  }));

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <ErrorSummary errors={summary} focusKey={submitCount} />
      <TextField
        id="signup-email"
        label="이메일"
        {...register('email', {
          required: '이메일을 입력해 주세요.',
          pattern: { value: /^\S+@\S+$/, message: '이메일 형식이 아니에요.' },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <Controller
        name="phone"
        control={control}
        rules={{ validate: (v) => v.length >= 10 || '휴대폰 번호를 끝까지 입력해 주세요.' }}
        render={({ field, fieldState }) => (
          <PhoneNumberInput
            id="signup-phone"
            ref={field.ref}
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="plan"
        control={control}
        rules={{ required: '플랜을 골라 주세요.' }}
        render={({ field, fieldState }) => (
          <Select
            id="signup-plan"
            label="플랜"
            placeholder="선택하세요"
            options={[
              { value: 'free', label: '무료' },
              { value: 'pro', label: '프로' },
            ]}
            value={field.value}
            onValueChange={field.onChange}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="billing"
        control={control}
        rules={{ required: '결제 주기를 골라 주세요.' }}
        render={({ field, fieldState }) => (
          <RadioGroup
            id="signup-billing"
            label="결제 주기"
            options={[
              { value: 'monthly', label: '월간' },
              { value: 'yearly', label: '연간' },
            ]}
            value={field.value}
            onValueChange={field.onChange}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="seats"
        control={control}
        render={({ field }) => (
          <NumberInput
            id="signup-seats"
            label="좌석 수"
            min={1}
            max={10}
            ref={field.ref}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
      />
      <Controller
        name="agreements"
        control={control}
        rules={{
          validate: (v) =>
            AGREEMENTS.filter((a) => a.required).every((a) => v.includes(a.value)) || '필수 약관에 동의해 주세요.',
        }}
        render={({ field, fieldState }) => (
          <AgreementGroup
            id="signup-agreements"
            label="약관 동의"
            items={AGREEMENTS}
            value={field.value}
            onValueChange={field.onChange}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Checkbox label="마케팅 메일 받기" {...register('marketing')} />
      <Controller
        name="documents"
        control={control}
        rules={{ validate: (v) => v.length > 0 || '서류를 첨부해 주세요.' }}
        render={({ field, fieldState }) => (
          <FileUpload
            id="signup-documents"
            label="재직 증명서"
            value={field.value}
            onValueChange={field.onChange}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <button type="submit">가입</button>
    </form>
  );
}

describe('react-hook-form 과 함께 쓰기', () => {
  it('빈 채로 제출하면 오류 요약에 포커스, 칸마다 aria-invalid 와 오류 문구, 링크로 각 칸에 간다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: '가입' }));

    expect(onSubmit).not.toHaveBeenCalled();
    const summaryTitle = screen.getByText('입력한 내용에 고칠 곳이 6개 있어요');
    const summary = summaryTitle.closest('[tabindex="-1"]')!;
    expect(document.activeElement).toBe(summary);
    expect(screen.getByRole('textbox', { name: '이메일' }).getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('textbox', { name: '휴대폰 번호' }).getAttribute('aria-invalid')).toBe('true');

    const links = within(summary as HTMLElement);
    await user.click(links.getByRole('link', { name: '결제 주기를 골라 주세요.' }));
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: '월간' }));
    await user.click(links.getByRole('link', { name: '필수 약관에 동의해 주세요.' }));
    expect(document.activeElement).toBe(screen.getByRole('checkbox', { name: '전체 동의' }));
    await user.click(links.getByRole('link', { name: '서류를 첨부해 주세요.' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '파일 선택' }));
    await user.click(links.getByRole('link', { name: '플랜을 골라 주세요.' }));
    expect(document.activeElement).toBe(screen.getByRole('combobox', { name: '플랜' }));
  });

  it('다시 제출해도 오류가 남아 있으면 요약으로 다시 포커스한다', async () => {
    const user = userEvent.setup();
    render(<SignupForm onSubmit={() => {}} />);
    await user.click(screen.getByRole('button', { name: '가입' }));
    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'a@b.c');
    await user.click(screen.getByRole('button', { name: '가입' }));
    const summary = screen.getByText('입력한 내용에 고칠 곳이 5개 있어요').closest('[tabindex="-1"]');
    expect(document.activeElement).toBe(summary);
  });

  it('모두 채우면 제출되고, 값은 각 컴포넌트가 넘기는 형태(숫자·배열·File)로 온다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);
    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'me@bestow.dev');
    await user.type(screen.getByRole('textbox', { name: '휴대폰 번호' }), '01012345678');
    fireEvent.keyDown(screen.getByRole('combobox', { name: '플랜' }), { key: 'Enter' });
    fireEvent.click(screen.getByRole('option', { name: '프로' }));
    await user.click(screen.getByRole('radio', { name: '연간' }));
    screen.getByRole('spinbutton', { name: '좌석 수' }).focus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    await user.click(screen.getByRole('checkbox', { name: '전체 동의' }));
    await user.click(screen.getByRole('checkbox', { name: '마케팅 메일 받기' }));
    const file = new File(['%PDF'], '재직증명서.pdf', { type: 'application/pdf' });
    await user.upload(document.querySelector('input[type="file"]') as HTMLInputElement, file);

    await act(async () => {
      await user.click(screen.getByRole('button', { name: '가입' }));
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0]![0] as Values;
    expect(values).toMatchObject({
      email: 'me@bestow.dev',
      phone: '01012345678',
      plan: 'pro',
      billing: 'yearly',
      seats: 3,
      agreements: ['terms', 'privacy', 'ads'],
      marketing: true,
    });
    expect(values.documents.map((f) => f.name)).toEqual(['재직증명서.pdf']);
    expect(screen.queryByText(/고칠 곳이/)).toBeNull();
  });
});
