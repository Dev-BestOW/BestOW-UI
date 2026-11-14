// 서버 컴포넌트 — 로그인한 사용자만. 서식·마스킹 함수(formatBusinessNumber·maskPhoneNumber 등)는 서버에서 그대로 부른다.
import {
  Alert,
  Button,
  Card,
  CardBody,
  DescriptionList,
  formatBusinessNumber,
  formatKoreanDate,
  KOREAN_BANKS,
  maskDigits,
  maskPhoneNumber,
  Stack,
  Typography,
} from '@bestow-ui/react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions';
import { CARRIERS } from '@/lib/schemas';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: '내 정보' };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  const { welcome } = await searchParams;
  const bank = KOREAN_BANKS.find((b) => b.code === user.bank)?.name ?? user.bank;

  return (
    <Stack gap={6}>
      <Typography variant="h1">내 정보</Typography>
      {welcome && (
        <Alert color="success" title="가입을 마쳤어요">
          {user.name}님, 환영해요.
        </Alert>
      )}
      <Card>
        <CardBody>
          <DescriptionList
            divided
            items={[
              { term: '이메일', description: user.email },
              { term: '이름', description: user.name },
              {
                term: '휴대폰',
                description: `${CARRIERS.find((c) => c.value === user.carrier)?.label ?? ''} ${maskPhoneNumber(user.phone)}`,
              },
              { term: '사업자등록번호', description: formatBusinessNumber(user.businessNumber) },
              {
                term: '정산 계좌',
                description: `${bank} ${maskDigits(user.accountNumber, { end: 4 })} (${user.accountHolder})`,
              },
              { term: '가입일', description: formatKoreanDate(new Date(user.createdAt), false) },
            ]}
          />
        </CardBody>
      </Card>
      <form action={logout}>
        <Button type="submit" variant="outline" color="neutral">
          로그아웃
        </Button>
      </form>
    </Stack>
  );
}
