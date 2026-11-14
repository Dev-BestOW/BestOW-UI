'use client';

import {
  Alert,
  Button,
  ErrorSummary,
  NativeSelect,
  PhoneNumberInput,
  Stack,
  TextField,
  VerificationCodeInput,
} from '@bestow-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { sendCode, verifyCode } from '@/lib/actions';
import { toSummary } from '@/lib/form';
import { CARRIERS, verifySchema, type VerifyValues } from '@/lib/schemas';

// 실제 서비스는 본인확인기관(PASS·NICE 등)의 인증 창으로 바꾼다 — 이름·통신사·번호를 그쪽에서 받아 결과만 돌려준다.
export function VerifyStep({
  defaultValues,
  onBack,
  onNext,
}: {
  defaultValues?: VerifyValues;
  onBack: () => void;
  onNext: (values: VerifyValues) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [sending, startSending] = useTransition();
  // 예제라서 서버가 돌려준 인증번호를 화면에 보여 준다(실제로는 문자로만 보낸다)
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors, submitCount },
  } = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    shouldFocusError: false,
    defaultValues: defaultValues ?? { name: '', carrier: '', phone: '', code: '' },
  });
  const codeSent = demoCode !== null || !!defaultValues;

  const send = () =>
    startSending(async () => {
      const result = await sendCode(getValues('phone'));
      if ('error' in result) {
        setError('phone', { type: 'server', message: result.error });
        return;
      }
      clearErrors('phone');
      setDemoCode(result.demoCode);
    });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        startTransition(async () => {
          const error = await verifyCode(values.phone, values.code);
          if (error) setError('code', { type: 'server', message: error });
          else onNext(values);
        }),
      )}
    >
      <Stack gap={5}>
        <ErrorSummary errors={toSummary(errors, 'verify')} focusKey={submitCount} />
        <TextField
          id="verify-name"
          label="이름"
          autoComplete="name"
          required
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <NativeSelect
          id="verify-carrier"
          label="통신사"
          placeholder="선택하세요"
          options={CARRIERS}
          required
          fullWidth
          {...register('carrier')}
          error={!!errors.carrier}
          helperText={errors.carrier?.message}
        />
        <Stack gap={2}>
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <PhoneNumberInput
                id="verify-phone"
                ref={field.ref}
                name={field.name}
                value={field.value}
                onValueChange={(digits) => field.onChange(digits)}
                onBlur={field.onBlur}
                required
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Button type="button" variant="outline" color="neutral" onClick={send} loading={sending}>
            {codeSent ? '인증번호 다시 받기' : '인증번호 받기'}
          </Button>
        </Stack>
        {demoCode && (
          <Alert color="info" title="예제용 안내">
            문자 대신 여기에 보여 드려요. 인증번호: {demoCode}
          </Alert>
        )}
        {codeSent && (
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <VerificationCodeInput
                // 새 번호를 받을 때마다 남은 시간을 처음부터
                key={demoCode ?? 'saved'}
                id="verify-code"
                ref={field.ref}
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                expiresIn={180}
                onResend={send}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        )}
        <Stack direction="row" gap={3}>
          <Button type="button" variant="outline" color="neutral" onClick={onBack}>
            이전
          </Button>
          <Button type="submit" loading={pending} style={{ flex: 1 }}>
            다음
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
