import 'server-only';
import { createHash, randomInt } from 'node:crypto';
import type { SignupValues } from './schemas';

// ⚠️ 예제용 메모리 저장소 — 서버를 다시 켜면 사라진다. 실제 서비스에서는 DB 로 바꾼다.
// 개발 서버가 파일을 다시 불러와도(HMR) 값이 남도록 globalThis 에 둔다.

export interface User extends Omit<SignupValues, 'password' | 'passwordConfirm' | 'code'> {
  passwordHash: string;
  createdAt: string;
}

interface Store {
  users: Map<string, User>;
  codes: Map<string, { code: string; expiresAt: number }>;
}

const store: Store = ((globalThis as { __starterStore?: Store }).__starterStore ??= {
  users: new Map(),
  codes: new Map(),
});

// 예제라서 단순 해시를 쓴다. 실제 서비스는 bcrypt·argon2 같은 비밀번호 전용 해시를 쓴다.
export const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex');

export const findUser = (email: string) => store.users.get(email.toLowerCase());

export function createUser(user: User) {
  store.users.set(user.email.toLowerCase(), user);
}

/** 인증번호를 만들어 저장한다(3분). 실제 서비스에서는 문자 발송 API 로 보내고 화면에는 보여 주지 않는다. */
export function issueCode(phone: string) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  store.codes.set(phone, { code, expiresAt: Date.now() + 180_000 });
  return code;
}

export function checkCode(phone: string, code: string): 'ok' | 'expired' | 'wrong' {
  const saved = store.codes.get(phone);
  if (!saved || saved.expiresAt < Date.now()) return 'expired';
  return saved.code === code ? 'ok' : 'wrong';
}

export const consumeCode = (phone: string) => store.codes.delete(phone);

// 처음부터 있는 데모 계정 — 로그인 화면과 "이미 가입한 이메일" 오류를 바로 확인할 수 있게
if (!findUser('demo@example.com')) {
  createUser({
    email: 'demo@example.com',
    passwordHash: hashPassword('password1234'),
    agreements: ['terms', 'privacy'],
    name: '홍길동',
    carrier: 'skt',
    phone: '01012345678',
    businessNumber: '1248100998',
    bank: '004',
    accountNumber: '12345678901234',
    accountHolder: '홍길동',
    createdAt: new Date().toISOString(),
  });
}
