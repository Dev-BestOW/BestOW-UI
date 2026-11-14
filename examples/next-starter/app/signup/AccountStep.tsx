'use client';

import { AgreementGroup, Button, ErrorSummary, PasswordInput, Stack, TextField } from '@bestow-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { checkEmail } from '@/lib/actions';
import { toSummary } from '@/lib/form';
import { accountSchema, AGREEMENTS, type AccountValues } from '@/lib/schemas';

export function AccountStep({
  defaultValues,
  onNext,
}: {
  defaultValues?: AccountValues;
  onNext: (values: AccountValues) => void;
}) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, submitCount },
  } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    shouldFocusError: false,
    defaultValues: defaultValues ?? { email: '', password: '', passwordConfirm: '', agreements: [] },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        startTransition(async () => {
          // 서버에서만 알 수 있는 오류는 다음 단계로 가기 전에 확인한다
          const taken = await checkEmail(values.email);
          if (taken) setError('email', { type: 'server', message: taken });
          else onNext(values);
        }),
      )}
    >
      <Stack gap={5}>
        <ErrorSummary errors={toSummary(errors, 'join')} focusKey={submitCount} />
        <TextField
          id="join-email"
          label="이메일"
          type="email"
          autoComplete="email"
          required
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <PasswordInput
          id="join-password"
          label="비밀번호"
          autoComplete="new-password"
          required
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message ?? '8자 이상'}
        />
        <PasswordInput
          id="join-passwordConfirm"
          label="비밀번호 확인"
          autoComplete="new-password"
          required
          fullWidth
          {...register('passwordConfirm')}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}
        />
        <Controller
          name="agreements"
          control={control}
          render={({ field, fieldState }) => (
            <AgreementGroup
              id="join-agreements"
              label="약관 동의"
              items={AGREEMENTS}
              value={field.value}
              onValueChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" loading={pending} fullWidth>
          다음
        </Button>
      </Stack>
    </form>
  );
}
