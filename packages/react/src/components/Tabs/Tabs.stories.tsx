import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsIcon, UserIcon } from '@bestow-ui/icons';
import { Typography } from '../Typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { defaultValue: 'account' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'soft'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    activationMode: { control: 'inline-radio', options: ['automatic', 'manual'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (args) => (
    <Tabs {...args} style={{ maxWidth: 480 }}>
      <TabsList aria-label="계정 설정">
        <TabsTrigger value="account">계정</TabsTrigger>
        <TabsTrigger value="password">비밀번호</TabsTrigger>
        <TabsTrigger value="billing">결제</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Typography>이름과 이메일을 바꿀 수 있어요.</Typography>
      </TabsContent>
      <TabsContent value="password">
        <Typography>비밀번호를 바꾼 뒤에는 다시 로그인해야 해요.</Typography>
      </TabsContent>
      <TabsContent value="billing">
        <Typography>결제 수단과 청구 내역을 확인해요.</Typography>
      </TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Soft: Story = {
  args: { variant: 'soft' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const WithIconsAndDisabled: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="계정 설정">
        <TabsTrigger value="account">
          <UserIcon size={16} />
          계정
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon size={16} />
          설정
        </TabsTrigger>
        <TabsTrigger value="admin" disabled>
          관리자 (권한 없음)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">계정 탭</TabsContent>
      <TabsContent value="settings">설정 탭</TabsContent>
    </Tabs>
  ),
};

function SettingsTabs(args: Story['args']) {
  return (
    <Tabs {...args} defaultValue="profile" style={{ maxWidth: 560 }}>
      <TabsList aria-label="설정 메뉴">
        <TabsTrigger value="profile">
          <UserIcon size={16} />
          프로필
        </TabsTrigger>
        <TabsTrigger value="notifications">알림</TabsTrigger>
        <TabsTrigger value="security">보안·로그인</TabsTrigger>
        <TabsTrigger value="admin" disabled>
          관리자 (권한 없음)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Typography>이름·사진·소개를 바꿀 수 있어요.</Typography>
      </TabsContent>
      <TabsContent value="notifications">
        <Typography>이메일·푸시 알림을 고를 수 있어요.</Typography>
      </TabsContent>
      <TabsContent value="security">
        <Typography>비밀번호와 2단계 인증을 관리해요.</Typography>
      </TabsContent>
    </Tabs>
  );
}

/**
 * `orientation="vertical"` — 탭 목록이 왼쪽, 내용이 오른쪽. ↑/↓ 로 이동한다(Home/End 동일).
 * 탭이 많거나 이름이 길어 가로로 넘칠 때(설정 화면 등) 쓴다. 좁은 화면에서는 가로로 바꾸거나 Select 를 검토한다.
 */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => <SettingsTabs {...args} />,
};

export const VerticalSoft: Story = {
  args: { orientation: 'vertical', variant: 'soft' },
  render: (args) => <SettingsTabs {...args} />,
};
