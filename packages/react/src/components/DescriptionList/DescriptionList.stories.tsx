import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { DescriptionList } from './DescriptionList';

const order = [
  { term: '상태', description: <Badge color="warning">배송 중</Badge> },
  { term: '고객', description: '최별' },
  { term: '연락처', description: '010-1234-1027' },
  { term: '상품', description: '노트북 거치대 × 1' },
  { term: '금액', description: '73,000원 (7만 3,000원)' },
  { term: '배송지', description: '서울 강남구 테헤란로 152 (역삼동, 강남파이낸스센터) 12층' },
];

const meta = {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  args: { items: order, 'aria-label': '주문 정보' },
  argTypes: {
    layout: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    items: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <DescriptionList {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '이름–값 목록이에요(상세 화면의 고객·연락처·금액 등). `<dl>` 로 그려 스크린리더가 이름과 값을 쌍으로 읽어요. ' +
          '여러 줄의 같은 종류 데이터를 비교해야 하면 Table 을 써요. 서버 컴포넌트로도 렌더링돼요.',
      },
    },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Divided: Story = { name: '구분선', args: { divided: true } };

export const Vertical: Story = { name: '세로 (좁은 곳)', args: { layout: 'vertical', divided: true } };

export const TermWidth: Story = { name: '이름 열 폭', args: { termWidth: '5rem' } };
