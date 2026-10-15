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
