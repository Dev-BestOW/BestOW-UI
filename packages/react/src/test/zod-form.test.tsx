import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { isValidBusinessNumber } from '@bestow-ui/korean-utils';
import { AgreementGroup } from '../components/AgreementGroup';
import { BusinessNumberInput } from '../components/BusinessNumberInput';
import { Button } from '../components/Button';
import { ErrorSummary } from '../components/ErrorSummary';
import { TextField } from '../components/Input';
import { PasswordInput } from '../components/PasswordInput';
import { PhoneNumberInput } from '../components/PhoneNumberInput';
import { hasAllRequiredAgreements } from '../components/AgreementGroup/agreements';

// Guides "화면 패턴 › 스키마로 검증하기(zod)" 의 코드가 실제로 동작하는지 — 문서를 고치면 여기도 맞춘다.
const AGREEMENTS = [
  { value: 'terms', label: '서비스 이용약관 동의', required: true },
  { value: 'ads', label: '광고성 정보 수신 동의' },
];

const schema = z
  .object({
    email: z.string().min(1, '이메일을 입력해 주세요.').pipe(z.email('이메일 형식이 아니에요.')),
    password: z.string().min(8, '비밀번호는 8자 이상이에요.'),
    passwordConfirm: z.string(),
    phone: z.string().min(10, '휴대폰 번호를 끝까지 입력해 주세요.'),
    businessNumber: z.string().refine(isValidBusinessNumber, '올바른 사업자등록번호가 아니에요.'),
    agreements: z
      .array(z.string())
      .refine((v) => hasAllRequiredAgreements(AGREEMENTS, v), '필수 약관에 동의해 주세요.'),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 같지 않아요.',
  });
type Values = z.infer<typeof schema>;

/** 칸 이름 → 화면의 칸 id. ErrorSummary 링크가 이 id 로 포커스를 옮긴다 */
const fieldId = (name: string) => `join-${name}`;

function JoinForm({
  submit,
}: {
  submit: (values: Values) => Promise<{ field: keyof Values; message: string } | null>;
}) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, submitCount, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    shouldFocusError: false,
    defaultValues: { email: '', password: '', passwordConfirm: '', phone: '', businessNumber: '', agreements: [] },
  });
  const summary = Object.entries(errors).map(([name, error]) => ({
    id: fieldId(name),
    message: error?.message ?? '',
  }));

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (values) => {
        // 서버가 거절한 칸은 setError 로 붙인다 — 요약이 새로 나타나며 포커스를 받는다
        const rejected = await submit(values);
        if (rejected) setError(rejected.field, { type: 'server', message: rejected.message });
      })}
    >
      <ErrorSummary errors={summary} focusKey={submitCount} />
      <TextField
        id={fieldId('email')}
        label="이메일"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <PasswordInput
        id={fieldId('password')}
        label="비밀번호"
        autoComplete="new-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message ?? '8자 이상'}
      />
      <PasswordInput
        id={fieldId('passwordConfirm')}
        label="비밀번호 확인"
        autoComplete="new-password"
        toggleLabel="비밀번호 확인 보기"
        {...register('passwordConfirm')}
        error={!!errors.passwordConfirm}
        helperText={errors.passwordConfirm?.message}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <PhoneNumberInput
            id={fieldId('phone')}
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
        name="businessNumber"
        control={control}
        render={({ field, fieldState }) => (
          <BusinessNumberInput
            id={fieldId('businessNumber')}
            ref={field.ref}
            name={field.name}
            value={field.value}
            onValueChange={(digits) => field.onChange(digits)}
            onBlur={field.onBlur}
            // 스키마가 검증을 맡으니 컴포넌트의 자동 검증은 끈다(같은 오류가 두 번 나오지 않게)
            validate={false}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="agreements"
        control={control}
        render={({ field, fieldState }) => (
          <AgreementGroup
            id={fieldId('agreements')}
            items={AGREEMENTS}
            value={field.value}
            onValueChange={field.onChange}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Button type="submit" loading={isSubmitting}>
        가입
      </Button>
    </form>
  );
}

const summaryBox = () => screen.getByText(/고칠 곳이/).closest('[tabindex="-1"]') as HTMLElement;

describe('react-hook-form + zod 스키마', () => {
  it('빈 제출: 스키마 오류가 칸과 오류 요약에 나오고, 요약으로 포커스가 간다', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<JoinForm submit={submit} />);
    await user.click(screen.getByRole('button', { name: '가입' }));
    await waitFor(() => expect(document.activeElement).toBe(summaryBox()));
    // 칸을 넘나드는 규칙(비밀번호 확인)은 칸 오류가 없을 때 돈다 — zod object refine 의 동작
    expect(screen.getByText(/고칠 곳이 5개/)).toBeTruthy();
    expect(screen.getByRole('textbox', { name: '이메일' }).getAttribute('aria-invalid')).toBe('true');
    expect(screen.getAllByText('휴대폰 번호를 끝까지 입력해 주세요.').length).toBeGreaterThan(0);
    expect(submit).not.toHaveBeenCalled();
  });

  it('여러 칸에 걸친 규칙(비밀번호 확인)은 path 의 칸에 붙고, 요약 링크로 그 칸에 간다', async () => {
    const user = userEvent.setup();
    render(<JoinForm submit={vi.fn()} />);
    await user.type(screen.getByLabelText('비밀번호'), 'bestow-1234');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'bestow-9999');
    await user.click(screen.getByRole('button', { name: '가입' }));
    const link = await screen.findByRole('link', { name: '비밀번호가 같지 않아요.' });
    await user.click(link);
    expect(document.activeElement).toBe(screen.getByLabelText('비밀번호 확인'));
  });

  it('통과하면 숫자만 있는 값으로 제출되고, 서버가 거절한 칸은 setError 로 붙어 요약이 포커스를 받는다', async () => {
    const user = userEvent.setup();
    const submit = vi.fn(async (_values: Values) => ({
      field: 'email' as const,
      message: '이미 가입한 이메일이에요.',
    }));
    render(<JoinForm submit={submit} />);
    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'me@bestow.dev');
    await user.type(screen.getByLabelText('비밀번호'), 'bestow-1234');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'bestow-1234');
    await user.type(screen.getByRole('textbox', { name: '휴대폰 번호' }), '01012345678');
    await user.type(screen.getByRole('textbox', { name: '사업자등록번호' }), '1248100998');
    await user.click(screen.getByRole('checkbox', { name: /서비스 이용약관/ }));
    await user.click(screen.getByRole('button', { name: '가입' }));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0]![0]).toEqual({
      email: 'me@bestow.dev',
      password: 'bestow-1234',
      passwordConfirm: 'bestow-1234',
      phone: '01012345678',
      businessNumber: '1248100998',
      agreements: ['terms'],
    });
    await waitFor(() => expect(document.activeElement).toBe(summaryBox()));
    expect(screen.getByRole('link', { name: '이미 가입한 이메일이에요.' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: '이메일' }).getAttribute('aria-invalid')).toBe('true');
  });
});
