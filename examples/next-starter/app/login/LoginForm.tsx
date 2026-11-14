'use client';

import { Button, ErrorSummary, Link, PasswordInput, Stack, TextField, Typography } from '@bestow-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import NextLink from 'next/link';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '@/lib/actions';
import { loginSchema, type LoginValues } from '@/lib/schemas';
import { applyServerErrors, toSummary } from '@/lib/form';

export function LoginForm() {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, submitCount },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    // 칸 대신 오류 요약으로 포커스를 옮긴다 — 스크린리더가 "고칠 곳 N개" 와 목록을 읽는다
    shouldFocusError: false,
    defaultValues: { email: '', password: '' },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        startTransition(async () => {
          const result = await login(values); // 성공하면 서버가 /account 로 보내고 여기로 돌아오지 않는다
          if (result) applyServerErrors(result.fieldErrors, setError);
        }),
      )}
    >
      <Stack gap={5}>
        <Typography variant="h1">로그인</Typography>
        <ErrorSummary errors={toSummary(errors, 'login')} focusKey={submitCount} />
        <TextField
          id="login-email"
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
          id="login-password"
          label="비밀번호"
          autoComplete="current-password"
          required
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" loading={pending} fullWidth>
          로그인
        </Button>
        <Typography variant="body-sm" color="muted">
          처음이세요?{' '}
          <Link as={NextLink} href="/signup">
            회원가입
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}
