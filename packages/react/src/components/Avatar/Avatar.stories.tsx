import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

// 외부 이미지 요청 없이 확인할 수 있도록 data URI 이미지를 쓴다
const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#fff" opacity=".9"/><path d="M12 60c2-12 10-18 20-18s18 6 20 18" fill="#fff" opacity=".9"/></svg>',
  );

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'Jane Doe',
    src: photo,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    fallback: { control: false },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};

/** 이미지를 불러오지 못하면 이니셜, 이름도 없으면 사용자 아이콘을 보여 준다. */
export const Fallbacks: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar {...args} />
      <Avatar {...args} src="/broken-image.png" />
      <Avatar {...args} src={undefined} name="홍길동" />
      <Avatar {...args} src={undefined} name={undefined} />
    </div>
  ),
};

export const Square: Story = {
  args: { shape: 'square', size: 'lg' },
};
