'use server';

import { redirect } from 'next/navigation';
import { checkCode, consumeCode, createUser, findUser, hashPassword, issueCode } from './db';
import {
  issuesToFieldErrors,
  loginSchema,
  signupSchema,
  type FieldErrors,
  type LoginValues,
  type SignupValues,
} from './schemas';
import { endSession, startSession } from './session';

/** 칸별 오류가 있으면 돌려주고, 성공하면 redirect 로 끝난다(돌아오지 않는다) */
export type ActionResult<T> = { fieldErrors: FieldErrors<T> };

/** 가입 1단계에서 이미 가입한 이메일인지 미리 확인한다 */
export async function checkEmail(email: string): Promise<string | null> {
  return findUser(email) ? '이미 가입한 이메일이에요.' : null;
}

/** 인증번호 보내기. 예제라서 번호를 돌려줘 화면에 보여 준다 — 실제로는 문자로만 보내고 아무것도 돌려주지 않는다 */
export async function sendCode(phone: string): Promise<{ demoCode: string } | { error: string }> {
  if (!/^01\d{8,9}$/.test(phone)) return { error: '휴대폰 번호를 끝까지 입력해 주세요.' };
  return { demoCode: issueCode(phone) };
}

export async function verifyCode(phone: string, code: string): Promise<string | null> {
  const result = checkCode(phone, code);
  if (result === 'expired') return '인증 시간이 지났어요. 재전송해 주세요.';
  if (result === 'wrong') return '인증번호가 맞지 않아요.';
  return null;
}

export async function signup(values: SignupValues): Promise<ActionResult<SignupValues>> {
  // 클라이언트와 같은 스키마로 다시 확인한다 — 브라우저 검사를 건너뛴 요청도 막는다
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: issuesToFieldErrors(parsed.error) };

  const data = parsed.data;
  if (findUser(data.email)) return { fieldErrors: { email: '이미 가입한 이메일이에요.' } };
  const codeError = await verifyCode(data.phone, data.code);
  if (codeError) return { fieldErrors: { code: codeError } };

  consumeCode(data.phone);
  const { password, passwordConfirm: _confirm, code: _code, ...profile } = data;
  createUser({ ...profile, passwordHash: hashPassword(password), createdAt: new Date().toISOString() });
  await startSession(data.email);
  redirect('/account?welcome=1');
}

export async function login(values: LoginValues): Promise<ActionResult<LoginValues>> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: issuesToFieldErrors(parsed.error) };

  const user = findUser(parsed.data.email);
  // 어느 쪽이 틀렸는지 알려 주지 않는다(가입한 이메일인지 알아내는 데 쓰이지 않게)
  if (!user || user.passwordHash !== hashPassword(parsed.data.password)) {
    return { fieldErrors: { password: '이메일 또는 비밀번호가 맞지 않아요.' } };
  }
  await startSession(user.email);
  redirect('/account');
}

export async function logout() {
  await endSession();
  redirect('/');
}
