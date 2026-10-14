'use client';

import { useState } from 'react';
import {
  Button,
  Checkbox,
  Modal,
  ModalClose,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useToast,
} from '@bestow-ui/react';
import { InfoIcon, TrashIcon } from '@bestow-ui/icons';

export default function InteractivePage() {
  const { toast } = useToast();
  const [plan, setPlan] = useState<string>();
  const [agreed, setAgreed] = useState(false);

  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Typography variant="h1">상호작용 페이지</Typography>
        <Typography color="muted">
          portal 로 렌더링되는 Modal·Select·Tooltip·Toast 가 다크모드와 브랜드 테마를 따라가는지 확인해요.
        </Typography>
      </Stack>

      <Stack
        as="form"
        gap={4}
        style={{ maxWidth: 400 }}
        onSubmit={(e) => {
          e.preventDefault();
          toast({ title: '가입했어요', description: `플랜: ${plan ?? '선택 안 함'}`, variant: 'success' });
        }}
      >
        <TextField label="이메일" type="email" required fullWidth />
        <Select
          label="플랜"
          placeholder="선택하세요"
          fullWidth
          value={plan}
          onValueChange={setPlan}
          options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
          ]}
        />
        <Checkbox label="이용약관에 동의합니다" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <Button type="submit" disabled={!agreed}>
          가입하기
        </Button>
      </Stack>

      <Stack direction="row" gap={2} align="center">
        <Modal
          title="프로젝트 삭제"
          description="삭제한 프로젝트는 복구할 수 없어요."
          trigger={
            <Button color="danger" startIcon={<TrashIcon size={16} />}>
              삭제
            </Button>
          }
          footer={
            <>
              <ModalClose asChild>
                <Button variant="ghost" color="neutral">
                  취소
                </Button>
              </ModalClose>
              <ModalClose asChild>
                <Button color="danger" onClick={() => toast({ title: '삭제했어요', variant: 'danger' })}>
                  삭제
                </Button>
              </ModalClose>
            </>
          }
        />
        <Tooltip content="툴팁도 테마를 따라가요">
          <Button variant="ghost" color="neutral" aria-label="정보">
            <InfoIcon size={18} />
          </Button>
        </Tooltip>
        <Button variant="outline" onClick={() => toast({ title: '저장했어요' })}>
          토스트
        </Button>
      </Stack>
    </Stack>
  );
}
