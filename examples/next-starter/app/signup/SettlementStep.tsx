'use client';

import {
  AccountNumberInput,
  Alert,
  BusinessNumberInput,
  Button,
  ErrorSummary,
  KOREAN_BANKS,
  NativeSelect,
  Stack,
  TextField,
} from '@bestow-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { signup } from '@/lib/actions';
import { applyServerErrors, toSummary } from '@/lib/form';
import { settlementSchema, type AccountValues, type SettlementValues, type VerifyValues } from '@/lib/schemas';

const BANK_OPTIONS = KOREAN_BANKS.map((bank) => ({ value: bank.code, label: bank.name }));
const SETTLEMENT_FIELDS = new Set(Object.keys(settlementSchema.shape));

export function SettlementStep({
  collected,
  defaultValues,
  onBack,
}: {
  collected: { account: AccountValues; verify: VerifyValues };
  defaultValues?: Partial<SettlementValues>;
  onBack: () => void;
}) {
  const [pending, startTransition] = useTransition();
  // 앞 단계 칸의 서버 오류(그사이 같은 이메일로 가입, 인증 시간 지남 등)
  const [earlierError, setEarlierError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, submitCount },
  } = useForm<SettlementValues>({
    resolver: zodResolver(settlementSchema),
    shouldFocusError: false,
    defaultValues: { businessNumber: '', bank: '', accountNumber: '', accountHolder: '', ...defaultValues },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        startTransition(async () => {
          setEarlierError(null);
          // 모은 값을 한 번에 보낸다. 성공하면 서버가 /account 로 보낸다
          const result = await signup({ ...collected.account, ...collected.verify, ...values });
          if (!result) return;
          const own = Object.fromEntries(
            Object.entries(result.fieldErrors).filter(([name]) => SETTLEMENT_FIELDS.has(name)),
          );
          applyServerErrors<SettlementValues>(own, setError);
          const others = Object.entries(result.fieldErrors).filter(([name]) => !SETTLEMENT_FIELDS.has(name));
          if (others.length) setEarlierError(others.map(([, message]) => message).join(' '));
        }),
      )}
    >
      <Stack gap={5}>
        <ErrorSummary errors={toSummary(errors, 'settle')} focusKey={submitCount} />
        {earlierError && (
          <Alert color="danger" title="앞 단계를 다시 확인해 주세요">
            {earlierError}
          </Alert>
        )}
        <Controller
          name="businessNumber"
          control={control}
          render={({ field, fieldState }) => (
            <BusinessNumberInput
              id="settle-businessNumber"
              ref={field.ref}
              name={field.name}
              value={field.value}
              onValueChange={(digits) => field.onChange(digits)}
              onBlur={field.onBlur}
              // 검증은 스키마가 한다 — 컴포넌트 자동 검증을 끄면 같은 오류가 두 번 나오지 않는다
              validate={false}
              required
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <NativeSelect
          id="settle-bank"
          label="은행"
          placeholder="선택하세요"
          options={BANK_OPTIONS}
          required
          fullWidth
          {...register('bank')}
          error={!!errors.bank}
          helperText={errors.bank?.message}
        />
        <Controller
          name="accountNumber"
          control={control}
          render={({ field, fieldState }) => (
            <AccountNumberInput
              id="settle-accountNumber"
              ref={field.ref}
              name={field.name}
              value={field.value}
              onValueChange={(digits) => field.onChange(digits)}
              onBlur={field.onBlur}
              validate={false}
              required
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? '은행 앱에서 복사해 붙여 넣어도 숫자만 남아요.'}
            />
          )}
        />
        <TextField
          id="settle-accountHolder"
          label="예금주"
          required
          fullWidth
          {...register('accountHolder')}
          error={!!errors.accountHolder}
          helperText={errors.accountHolder?.message}
        />
        <Stack direction="row" gap={3}>
          <Button type="button" variant="outline" color="neutral" onClick={onBack}>
            이전
          </Button>
          <Button type="submit" loading={pending} style={{ flex: 1 }}>
            가입하기
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
