import 'server-only';
import { cookies } from 'next/headers';
import { findUser } from './db';

// ⚠️ 예제용 세션 — 쿠키에 이메일을 그대로 넣는다(누구나 바꿀 수 있음). 실제 서비스에서는 Auth.js·Lucia 같은
// 인증 라이브러리나 서명한 세션 토큰으로 바꾼다.
const COOKIE = 'starter-session';

export async function startSession(email: string) {
  (await cookies()).set(COOKIE, email, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser() {
  const email = (await cookies()).get(COOKIE)?.value;
  return email ? findUser(email) : undefined;
}
