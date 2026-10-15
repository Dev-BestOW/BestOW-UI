import type { Meta, StoryObj } from '@storybook/react-vite';
import { HouseIcon } from '@bestow-ui/icons';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [{ label: '홈', href: '#' }, { label: '설정', href: '#' }, { label: '팀', href: '#' }, { label: '멤버' }],
  },
  argTypes: {
    linkAs: { control: false },
    separator: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          '현재 페이지까지의 경로예요. 마지막 항목이 현재 페이지로 표시돼요(`aria-current="page"`). Next.js 에서는 `linkAs={NextLink}` 를 넘겨요.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcon: Story = {
  name: '아이콘 · 구분 기호 바꾸기',
  args: {
    separator: '/',
    items: [
      {
        label: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <HouseIcon size={14} />홈
          </span>
        ),
        href: '#',
      },
      { label: '문서', href: '#' },
      { label: '시작하기' },
    ],
  },
};

export const LongPath: Story = {
  name: '긴 경로 (줄바꿈)',
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Breadcrumb
        {...args}
        items={[
          { label: '홈', href: '#' },
          { label: '프로젝트', href: '#' },
          { label: 'BestOW 디자인 시스템', href: '#' },
          { label: '컴포넌트', href: '#' },
          { label: 'Breadcrumb 개선 작업' },
        ]}
      />
    </div>
  ),
};
