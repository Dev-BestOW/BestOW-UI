// 검증 규칙은 이 파일 한곳에 둔다. 클라이언트(zodResolver)와 서버 액션(lib/actions.ts)이 같은 스키마를 쓴다 —
// 브라우저 검사를 건너뛴 요청도 서버에서 같은 기준으로 다시 거른다.
// 'use client' 가 없는 파일이라 서버에서도 불러온다. @bestow-ui/react 의 검증 함수도 서버에서 그대로 쓸 수 있다.
import { hasAllRequiredAgreements, isValidAccountNumber, isValidBusinessNumber, KOREAN_BANKS } from '@bestow-ui/react';
import { z } from 'zod';

export const AGREEMENTS = [
  { value: 'terms', label: '서비스 이용약관 동의', required: true, content: '서비스 이용약관 전문을 여기에 넣어요.' },
  {
    value: 'privacy',
    label: '개인정보 수집·이용 동의',
    required: true,
    content: '수집 항목·목적·보유 기간을 여기에 넣어요.',
  },
  { value: 'marketing', label: '광고성 정보 수신 동의' },
];

export const CARRIERS = [
  { value: 'skt', label: 'SKT' },
  { value: 'kt', label: 'KT' },
  { value: 'lgu', label: 'LG U+' },
  { value: 'mvno', label: '알뜰폰' },
];

const BANK_CODES = new Set(KOREAN_BANKS.map((bank) => bank.code));

// ── 1단계: 계정 ──
const accountFields = z.object({
  email: z.string().min(1, '이메일을 입력해 주세요.').pipe(z.email('이메일 형식이 아니에요.')),
  password: z.string().min(8, '비밀번호는 8자 이상이에요.'),
  passwordConfirm: z.string().min(1, '비밀번호를 한 번 더 입력해 주세요.'),
  agreements: z
    .array(z.string())
    .refine((value) => hasAllRequiredAgreements(AGREEMENTS, value), '필수 약관에 동의해 주세요.'),
});
const samePassword = (value: { password: string; passwordConfirm: string }) => value.password === value.passwordConfirm;
const samePasswordError = { path: ['passwordConfirm'], message: '비밀번호가 같지 않아요.' };

export const accountSchema = accountFields.refine(samePassword, samePasswordError);

// ── 2단계: 본인 확인 ──
// 실제 서비스는 본인확인기관(PASS·NICE 등)의 인증 창을 띄운다. 이 템플릿은 문자 인증번호 흐름만 흉내 낸다.
const verifyFields = z.object({
  name: z.string().trim().min(2, '이름을 입력해 주세요.'),
  carrier: z.string().min(1, '통신사를 골라 주세요.'),
  phone: z.string().min(10, '휴대폰 번호를 끝까지 입력해 주세요.'),
  code: z.string().length(6, '인증번호 6자리를 입력해 주세요.'),
});
export const verifySchema = verifyFields;

// ── 3단계: 정산 정보 ──
const settlementFields = z.object({
  businessNumber: z.string().refine(isValidBusinessNumber, '올바른 사업자등록번호가 아니에요.'),
  bank: z.string().refine((code) => BANK_CODES.has(code), '은행을 골라 주세요.'),
  accountNumber: z.string().refine(isValidAccountNumber, '계좌번호를 10자리 이상 입력해 주세요.'),
  accountHolder: z.string().trim().min(1, '예금주를 입력해 주세요.'),
});
export const settlementSchema = settlementFields;

// ── 서버에서 한 번에 확인하는 전체 가입 정보 ──
export const signupSchema = z
  .object({ ...accountFields.shape, ...verifyFields.shape, ...settlementFields.shape })
  .refine(samePassword, samePasswordError);

export const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해 주세요.').pipe(z.email('이메일 형식이 아니에요.')),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export type AccountValues = z.infer<typeof accountSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
export type SettlementValues = z.infer<typeof settlementSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;

/** 서버 액션이 돌려주는 칸별 오류 — 클라이언트가 setError 로 붙인다 */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function issuesToFieldErrors<T>(error: z.ZodError<T>): FieldErrors<T> {
  const result: FieldErrors<T> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof T | undefined;
    if (key !== undefined && !result[key]) result[key] = issue.message;
  }
  return result;
}
