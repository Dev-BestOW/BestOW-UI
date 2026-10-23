import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StarIcon } from '@bestow-ui/icons';
import { createIntentColors } from '../../theme/color';
import { createTheme } from '../../theme/createTheme';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Alert } from './Alert';

// 주황 브랜드 — primary 안내가 경고처럼 보이는 예
const brand = createTheme(createIntentColors('primary', '#e8590c'));

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: '새 버전이 나왔어요',
    children: '변경 내역을 확인하고 업데이트해 주세요.',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['soft', 'outline', 'solid'] },
    color: { control: 'inline-radio', options: ['info', 'primary', 'neutral', 'success', 'warning', 'danger'] },
    icon: { control: false },
    action: { control: false },
  },
  render: (args) => <Alert {...args} style={{ maxWidth: 560 }} />,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const examples = {
  info: { title: '안내', body: '9월 30일 새벽 2시부터 4시까지 점검이 있어요.' },
  primary: { title: '새 기능', body: '대시보드에서 차트를 바로 내보낼 수 있어요.' },
  neutral: { title: '참고', body: '이 설정은 팀원 모두에게 적용돼요.' },
  success: { title: '저장했어요', body: '변경 사항이 모든 기기에 반영됐어요.' },
  warning: { title: '저장 공간이 부족해요', body: '남은 공간이 10% 미만이에요. 오래된 파일을 정리해 주세요.' },
  danger: { title: '결제에 실패했어요', body: '카드 정보를 확인한 뒤 다시 시도해 주세요.' },
} as const;

function AllColors({ variant }: { variant: 'soft' | 'outline' | 'solid' }) {
  return (
    <Stack gap={3} style={{ maxWidth: 560 }}>
      {(Object.keys(examples) as Array<keyof typeof examples>).map((color) => (
        <Alert key={color} variant={variant} color={color} title={examples[color].title}>
          {examples[color].body}
        </Alert>
      ))}
    </Stack>
  );
}

export const Soft: Story = { render: () => <AllColors variant="soft" /> };

export const Outline: Story = { render: () => <AllColors variant="outline" /> };

export const Solid: Story = { render: () => <AllColors variant="solid" /> };

/**
 * 일반 안내는 `info` — 브랜드 색(primary)을 바꿔도 파랑으로 남아요. primary 는 브랜드를 드러내는 안내(새 기능 소개 등)에 써요.
 * 아래는 primary 를 주황 브랜드색으로 바꾼 테마예요. 점검 안내를 primary 로 쓰면 경고처럼 보여요.
 */
export const InfoVsBrand: Story = {
  name: 'info 와 브랜드 색',
  render: () => (
    <ThemeProvider overrides={brand}>
      <Stack gap={3} style={{ maxWidth: 560 }}>
        <Alert color="info" title="안내 (info)">
          9월 30일 새벽 2시부터 4시까지 점검이 있어요.
        </Alert>
        <Alert color="primary" title="같은 안내를 primary 로">
          9월 30일 새벽 2시부터 4시까지 점검이 있어요.
        </Alert>
      </Stack>
    </ThemeProvider>
  ),
};

export const DescriptionOnly: Story = {
  name: '제목 없이',
  args: { title: undefined, color: 'neutral', children: '검색 결과는 최근 30일 기준이에요.' },
};

export const CustomIcon: Story = {
  name: '아이콘 바꾸기 · 숨기기',
  render: () => (
    <Stack gap={3} style={{ maxWidth: 560 }}>
      <Alert icon={<StarIcon size={18} />} title="새 기능">
        대시보드에서 차트를 바로 내보낼 수 있어요.
      </Alert>
      <Alert icon={false} color="neutral">
        아이콘 없이 문장만 보여 줄 수도 있어요.
      </Alert>
    </Stack>
  ),
};

export const WithAction: Story = {
  name: '액션 버튼',
  args: {
    color: 'warning',
    title: '구독이 3일 뒤 만료돼요',
    children: '지금 갱신하면 할인된 가격으로 이어서 쓸 수 있어요.',
    action: (
      <Button size="sm" variant="outline" color="neutral">
        갱신하기
      </Button>
    ),
  },
};

function DismissibleDemo() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Alert color="success" title="초대를 보냈어요" onClose={() => setOpen(false)} style={{ maxWidth: 560 }}>
      팀원이 수락하면 알려 드릴게요.
    </Alert>
  ) : (
    <Button variant="outline" color="neutral" onClick={() => setOpen(true)}>
      다시 보기
    </Button>
  );
}

export const Dismissible: Story = {
  name: '닫기 버튼',
  render: () => <DismissibleDemo />,
};

function LiveRegionDemo() {
  const [error, setError] = useState(false);
  return (
    <Stack gap={3} style={{ maxWidth: 560 }}>
      <Button variant="outline" color="neutral" onClick={() => setError(true)} style={{ alignSelf: 'start' }}>
        저장하기 (실패 흉내)
      </Button>
      {/* 사용자 동작 뒤에 새로 나타나는 메시지는 role="alert" 로 스크린리더가 바로 읽게 한다 */}
      {error && (
        <Alert role="alert" color="danger" title="저장하지 못했어요" onClose={() => setError(false)}>
          네트워크 연결을 확인해 주세요.
        </Alert>
      )}
    </Stack>
  );
}

export const LiveRegion: Story = {
  name: '동적으로 나타나는 메시지 (role="alert")',
  render: () => <LiveRegionDemo />,
};
