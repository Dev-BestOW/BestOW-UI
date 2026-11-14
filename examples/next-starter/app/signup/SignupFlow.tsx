'use client';

import { Stepper, Stack, Typography } from '@bestow-ui/react';
import { useEffect, useRef, useState } from 'react';
import type { AccountValues, SettlementValues, VerifyValues } from '@/lib/schemas';
import { AccountStep } from './AccountStep';
import { SettlementStep } from './SettlementStep';
import { VerifyStep } from './VerifyStep';

const STEPS = [{ label: '계정' }, { label: '본인 확인' }, { label: '정산 정보' }];

export interface Collected {
  account?: AccountValues;
  verify?: VerifyValues;
}

// 단계마다 폼(useForm)과 스키마를 따로 둔다. 하나의 폼으로 만들면 비밀번호 확인처럼 칸 여럿에 걸친 규칙(refine)이
// "다른 칸 오류가 모두 없을 때" 만 확인돼 1단계에서 동작하지 않는다. 마지막 단계에서 모은 값을 서버 액션 하나로 보낸다.
export function SignupFlow() {
  const [step, setStep] = useState(0);
  const [collected, setCollected] = useState<Collected>({});

  // 단계가 바뀌면 새 단계의 제목으로 포커스를 옮겨 스크린리더에 알린다(처음 열 때는 옮기지 않는다)
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    titleRef.current?.focus();
  }, [step]);

  return (
    <Stack gap={6}>
      <Typography variant="h1">회원가입</Typography>
      <Stepper aria-label="회원가입 단계" steps={STEPS} current={step} />
      <Typography ref={titleRef} variant="h2" tabIndex={-1} style={{ outline: 'none' }}>
        {step + 1}. {STEPS[step]!.label}
      </Typography>
      {step === 0 && (
        <AccountStep
          defaultValues={collected.account}
          onNext={(account) => {
            setCollected((prev) => ({ ...prev, account }));
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <VerifyStep
          defaultValues={collected.verify}
          onBack={() => setStep(0)}
          onNext={(verify) => {
            setCollected((prev) => ({ ...prev, verify }));
            setStep(2);
          }}
        />
      )}
      {step === 2 && collected.account && collected.verify && (
        <SettlementStep
          collected={{ account: collected.account, verify: collected.verify }}
          defaultValues={{ accountHolder: collected.verify.name } satisfies Partial<SettlementValues>}
          onBack={() => setStep(1)}
        />
      )}
    </Stack>
  );
}
