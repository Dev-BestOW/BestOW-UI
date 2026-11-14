# BestOW UI — Next.js 가입 흐름 템플릿

회원가입(계정 → 휴대폰 본인 확인 → 정산 정보)·로그인·내 정보 화면이 완성된 Next.js(App Router) 템플릿이에요.
화면은 [`@bestow-ui/react`](https://www.npmjs.com/package/@bestow-ui/react), 폼은 react-hook-form + zod 로 만들었어요.

```bash
npx create-next-app@latest my-app --example "https://github.com/Dev-BestOW/BestOW-UI/tree/main/examples/next-starter"
cd my-app
npm run dev
```

데모 계정: `demo@example.com` / `password1234`

## 들어 있는 것

| 화면 | 내용 |
| --- | --- |
| `/signup` | 3단계 가입. 단계 표시(Stepper), 단계가 바뀌면 새 제목으로 포커스. 이메일·비밀번호·약관 동의 → 이름·통신사·휴대폰·인증번호(3분 타이머·재전송) → 사업자등록번호·은행·계좌번호·예금주 |
| `/login` | 이메일·비밀번호. 틀리면 어느 쪽이 틀렸는지 알려 주지 않는 서버 오류 |
| `/account` | 서버 컴포넌트. 로그인한 사람만. 휴대폰·계좌번호 마스킹, 사업자등록번호 서식(서버에서 부르는 함수) |

- **규칙은 한곳에** — [`lib/schemas.ts`](lib/schemas.ts). 브라우저(zodResolver)와 서버 액션([`lib/actions.ts`](lib/actions.ts))이 같은 스키마로 확인해요.
  사업자등록번호·계좌번호·필수 약관은 `@bestow-ui/react` 의 검증 함수를 그대로 써요.
- **오류는 요약으로** — 제출에 실패하면 폼 맨 위 오류 요약(ErrorSummary)으로 포커스가 가고, 링크로 칸에 바로 가요. 서버에서만 알 수 있는 오류(이미 가입한 이메일·틀린 인증번호)도 같은 자리에 나와요.
- **단계마다 폼 하나** — 비밀번호 확인처럼 칸 여럿에 걸친 규칙은 다른 칸 오류가 모두 없어야 확인돼요. 단계를 하나의 폼으로 묶으면 1단계에서 이 규칙이 동작하지 않아서 단계마다 폼을 나누고, 마지막에 모은 값을 서버 액션 하나로 보내요.
- **다크 모드** — OS 설정을 따르고(`theme="system"`), 서버 렌더링 첫 화면부터 깜빡이지 않아요. 대표색은 [`app/providers.tsx`](app/providers.tsx) 주석처럼 한 줄로 바꿔요.

## 실제 서비스로 바꿀 곳

예제라서 단순하게 둔 부분이에요. 모두 `⚠️` 주석이 달려 있어요.

- [`lib/db.ts`](lib/db.ts) — 메모리 저장소(서버를 다시 켜면 사라짐) → DB. 비밀번호 해시 → bcrypt·argon2.
- [`lib/session.ts`](lib/session.ts) — 쿠키에 이메일을 그대로 넣는 세션 → Auth.js 같은 인증 라이브러리나 서명한 토큰.
- 인증번호 — 지금은 화면에 보여 줘요. 문자 발송 API 로 보내거나, 본인확인기관(PASS·NICE 등) 인증 창으로 바꿔요.
- 계좌 — 자릿수만 확인해요. 실제 계좌·예금주 확인은 은행·결제사의 예금주 조회가 필요해요.

## 더 보기

- 컴포넌트 문서: [Storybook](https://dev-bestow.github.io/BestOW-UI/storybook/) · 폼 패턴: [Guides › 화면 패턴](https://dev-bestow.github.io/BestOW-UI/storybook/?path=/docs/guides-화면-패턴--docs)
- 서식·검증 함수만 쓰려면: [`@bestow-ui/korean-utils`](https://dev-bestow.github.io/BestOW-UI/korean-utils/)
