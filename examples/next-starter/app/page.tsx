// 서버 컴포넌트 — 표시용 컴포넌트(Typography·Stack·Card)는 클라이언트 JS 없이 그려진다.
// 링크는 asChild 로 Next.js Link 를 감싼다(서버 컴포넌트에서는 as={NextLink} 처럼 함수를 넘길 수 없다).
import { Card, CardBody, Link, Stack, Typography } from '@bestow-ui/react';
import NextLink from 'next/link';
import { currentUser } from '@/lib/session';

export default async function HomePage() {
  const user = await currentUser();

  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Typography variant="h1">한국 서비스 가입 흐름 템플릿</Typography>
        <Typography color="muted">
          이메일 가입 → 휴대폰 본인 확인 → 정산 정보(사업자·계좌)까지 들어 있는 Next.js 템플릿이에요. 규칙은
          lib/schemas.ts 한곳에 있고, 브라우저와 서버가 같은 규칙으로 확인해요.
        </Typography>
      </Stack>
      <Card>
        <CardBody>
          <Stack gap={3}>
            {user ? (
              <Typography>
                {user.name}님으로 로그인했어요.{' '}
                <Link asChild>
                  <NextLink href="/account">내 정보 보기</NextLink>
                </Link>
              </Typography>
            ) : (
              <>
                <Typography>
                  <Link asChild>
                    <NextLink href="/signup">회원가입</NextLink>
                  </Link>{' '}
                  으로 새 계정을 만들거나,{' '}
                  <Link asChild>
                    <NextLink href="/login">로그인</NextLink>
                  </Link>{' '}
                  해 보세요.
                </Typography>
                <Typography variant="body-sm" color="muted">
                  데모 계정: demo@example.com / password1234 (서버를 다시 켜면 새로 가입한 계정은 사라져요)
                </Typography>
              </>
            )}
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
