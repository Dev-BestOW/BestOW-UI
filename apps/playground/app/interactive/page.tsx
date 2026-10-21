'use client';

import { useState } from 'react';
import {
  AddressInput,
  AgreementGroup,
  AmountInput,
  BusinessNumberInput,
  Avatar,
  Button,
  Card,
  Combobox,
  DatePicker,
  FileUpload,
  Modal,
  PhoneNumberInput,
  ModalClose,
  NumberInput,
  Progress,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Stack,
  Switch,
  TextField,
  Textarea,
  Tooltip,
  Typography,
  VerificationCodeInput,
  hasAllRequiredAgreements,
  useToast,
} from '@bestow-ui/react';
import { InfoIcon, TrashIcon } from '@bestow-ui/icons';

// 공휴일은 라이브러리에 내장하지 않는다(음력·대체공휴일이 해마다 바뀜) — 서비스가 가진 목록으로 isHoliday 를 넘긴다.
// 예제라 날짜가 고정된 것만 둔다. 실제로는 공공데이터포털 특일 정보 API 등에서 받은 목록을 쓴다.
const FIXED_HOLIDAYS = new Set(['01-01', '03-01', '05-05', '06-06', '08-15', '10-03', '10-09', '12-25']);
const isHoliday = (date: Date) =>
  FIXED_HOLIDAYS.has(`${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);

const agreements = [
  {
    value: 'terms',
    label: '서비스 이용약관 동의',
    required: true,
    content: '제1조 (목적) 이 약관은 서비스 이용 조건을 정합니다.',
  },
  { value: 'privacy', label: '개인정보 수집·이용 동의', required: true, content: '수집 항목: 이메일, 휴대폰 번호' },
  { value: 'marketing', label: '마케팅 정보 수신 동의' },
];

export default function InteractivePage() {
  const { toast } = useToast();
  const [plan, setPlan] = useState<string>();
  const [agreed, setAgreed] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [billing, setBilling] = useState<string>();
  const [seats, setSeats] = useState<number | null>(1);
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [upload, setUpload] = useState<number | null>(null);
  const [price, setPrice] = useState([20000, 80000]);

  const startUpload = () => {
    setUpload(0);
    const timer = setInterval(() => {
      setUpload((v) => {
        const next = Math.min(100, (v ?? 0) + 10);
        if (next >= 100) clearInterval(timer);
        return next;
      });
    }, 150);
  };

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
          setSubmitting(true);
          setTimeout(() => {
            setSubmitting(false);
            toast({
              title: '가입했어요',
              description: `플랜: ${plan ?? '선택 안 함'} · 결제: ${billing ?? '선택 안 함'}`,
              color: 'success',
            });
          }, 1500);
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
        <RadioGroup
          label="결제 주기"
          orientation="horizontal"
          value={billing}
          onValueChange={setBilling}
          options={[
            { value: 'monthly', label: '월간' },
            { value: 'yearly', label: '연간' },
          ]}
        />
        <NumberInput
          label="좌석 수"
          unit="석"
          min={1}
          max={20}
          value={seats}
          onValueChange={setSeats}
          helperText={`선택한 좌석: ${seats ?? '없음'} (최대 20석)`}
        />
        <Textarea
          label="메모"
          placeholder="요청 사항을 적어 주세요"
          fullWidth
          autoResize
          rows={2}
          showCount
          maxLength={200}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <Switch label="마케팅 알림 받기" />
        <PhoneNumberInput fullWidth />
        <VerificationCodeInput
          expiresIn={180}
          value={code}
          onValueChange={setCode}
          onResend={() => toast({ title: '인증번호를 다시 보냈어요' })}
          helperText="휴대폰으로 받은 6자리 숫자를 입력하세요. (예제: 아무 숫자)"
        />
        <AgreementGroup label="약관 동의" items={agreements} value={agreed} onValueChange={setAgreed} />
        <Button
          type="submit"
          disabled={!hasAllRequiredAgreements(agreements, agreed) || code.length < 6}
          loading={submitting}
        >
          {submitting ? '가입하는 중' : '가입하기'}
        </Button>
      </Stack>

      <Stack gap={3} style={{ maxWidth: 400 }}>
        <Button
          variant="outline"
          color="neutral"
          loading={loadingPost}
          onClick={() => {
            setLoadingPost(true);
            setTimeout(() => setLoadingPost(false), 1500);
          }}
        >
          게시글 다시 불러오기
        </Button>
        <Card as="section" aria-label="게시글" aria-busy={loadingPost}>
          {loadingPost ? (
            <>
              <Stack direction="row" gap={3} align="center">
                <Skeleton variant="circle" width={36} />
                <Stack gap={2} style={{ flex: 1 }}>
                  <Skeleton width="40%" />
                  <Skeleton width="25%" height={12} />
                </Stack>
              </Stack>
              <Skeleton lines={3} />
            </>
          ) : (
            <>
              <Stack direction="row" gap={3} align="center">
                <Avatar name="Jane Doe" />
                <Stack gap={1}>
                  <Typography weight="semibold">Jane Doe</Typography>
                  <Typography variant="caption" color="muted">
                    방금 전
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="body-sm">
                Skeleton 은 장식용이라 스크린리더에서 숨기고, 로딩 상태는 감싸는 영역의 aria-busy 로 알려요.
              </Typography>
            </>
          )}
        </Card>
      </Stack>

      <Stack as="section" aria-label="정산 정보" gap={3} style={{ maxWidth: 400 }}>
        <BusinessNumberInput fullWidth />
        {/* 기본 공급자: 카카오 우편번호 (검색을 누를 때 스크립트를 불러온다) */}
        <AddressInput label="사업장 주소" />
        <AmountInput label="정산 금액" max={100000000} fullWidth />
        <FileUpload
          label="통장 사본"
          name="bankbook"
          multiple
          maxFiles={2}
          accept=".pdf,image/*"
          maxSize={5 * 1024 * 1024}
          helperText="PDF·이미지, 파일당 5MB 이하, 최대 2개"
        />
        <DatePicker label="정산 희망일" isHoliday={isHoliday} fullWidth />
      </Stack>

      <Stack gap={3} style={{ maxWidth: 400 }}>
        <Combobox
          label="배송 도시"
          placeholder="도시를 검색하세요"
          options={[
            { value: 'seoul', label: '서울' },
            { value: 'busan', label: '부산' },
            { value: 'incheon', label: '인천' },
            { value: 'daegu', label: '대구' },
            { value: 'daejeon', label: '대전' },
            { value: 'jeju', label: '제주' },
          ]}
          onValueChange={(value) => toast({ title: `${value} 를 골랐어요` })}
          fullWidth
        />
        <Slider label="음량" defaultValue={[40]} showValue />
        <Slider
          label="가격"
          value={price}
          onValueChange={setPrice}
          min={0}
          max={100000}
          step={5000}
          minStepsBetweenThumbs={1}
          showValue
          formatValue={(v) => `${v.toLocaleString('ko-KR')}원`}
          helperText="두 손잡이로 범위를 정해요."
        />
      </Stack>

      <Stack gap={3} style={{ maxWidth: 400 }}>
        <Progress
          label={upload === 100 ? '업로드 완료' : 'report.pdf 업로드'}
          value={upload ?? 0}
          showValue
          color={upload === 100 ? 'success' : 'primary'}
        />
        <Button variant="outline" color="neutral" onClick={startUpload} style={{ alignSelf: 'start' }}>
          업로드 시작
        </Button>
      </Stack>

      <Stack direction="row" gap={2} align="center" wrap>
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
                <Button color="danger" onClick={() => toast({ title: '삭제했어요', color: 'danger' })}>
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
