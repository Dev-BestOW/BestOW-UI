'use client';

// react-hook-form 과 함께 쓰는 예 (ROADMAP P14-2). 패키지의 통합 테스트(src/test/react-hook-form.test.tsx)와 같은 폼을
// 실제 브라우저에서 확인한다 — register(네이티브 입력) · Controller(값을 고르는 컴포넌트) · ErrorSummary(shouldFocusError: false).
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AgreementGroup,
  Checkbox,
  ErrorSummary,
  FileUpload,
  NumberInput,
  PhoneNumberInput,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
} from '@bestow-ui/react';

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
      <Stack gap={4} style={{ maxWidth: 480 }}>
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
        <Button type="submit" style={{ alignSelf: 'start' }}>
          가입
        </Button>
      </Stack>
    </form>
  );
}

export default function SignupPage() {
  const [submitted, setSubmitted] = useState<Values | null>(null);
  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Typography variant="h1">회원가입 (react-hook-form)</Typography>
        <Typography color="muted">
          빈 채로 "가입" 을 누르면 오류 요약으로 포커스가 가고, 링크로 각 칸에 갈 수 있어요.
        </Typography>
      </Stack>
      {submitted ? (
        <Alert color="success" title="가입했어요" role="status">
          {submitted.email} · 좌석 {submitted.seats}개 · 서류 {submitted.documents.length}개
        </Alert>
      ) : (
        <SignupForm onSubmit={setSubmitted} />
      )}
    </Stack>
  );
}
