import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileTextIcon, PlusIcon, SearchIcon } from '@bestow-ui/icons';
import { Button } from '../Button';
import { Card, CardBody } from '../Card';
import { Table, TableBody, TableEmpty, TableHead, TableHeader, TableRow } from '../Table';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: '검색 결과가 없어요',
    description: '검색어를 바꾸거나 필터를 줄여 보세요.',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    titleAs: { control: 'inline-radio', options: ['h2', 'h3', 'h4', 'p'] },
    icon: { control: false },
    action: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          '보여 줄 것이 없을 때의 안내예요(검색 결과 없음, 아직 만든 것 없음). 제목은 무엇이 없는지, 설명은 무엇을 하면 되는지 쓰고, 할 수 있는 행동이 있으면 버튼을 함께 둬요. 서버 컴포넌트에서도 써요. 제목 수준은 `titleAs`(기본 h3) — 표나 카드 안처럼 제목이 어울리지 않으면 `"p"`. 검색·필터로 결과가 바뀌어 나타나면 결과 수를 `role="status"` 로 따로 알려 주세요.',
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    icon: <SearchIcon size={24} />,
    action: (
      <Button variant="outline" color="neutral">
        조건 초기화
      </Button>
    ),
  },
};

export const FirstUse: Story = {
  name: '처음 사용',
  args: {
    icon: <FileTextIcon size={24} />,
    title: '아직 만든 문서가 없어요',
    description: '첫 문서를 만들면 여기에 모여요.',
    action: (
      <>
        <Button startIcon={<PlusIcon size={16} />}>새 문서</Button>
        <Button variant="ghost" color="neutral">
          예시 보기
        </Button>
      </>
    ),
  },
};

export const InCard: Story = {
  name: '카드 안 (작게)',
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardBody>
        <EmptyState size="sm" titleAs="p" title="받은 알림이 없어요" description="새 알림이 오면 여기에 보여요." />
      </CardBody>
    </Card>
  ),
};

export const InTable: Story = {
  name: '표 안 (TableEmpty)',
  render: () => (
    <Table aria-label="주문 목록">
      <TableHead>
        <TableRow>
          <TableHeader>주문번호</TableHeader>
          <TableHeader>고객</TableHeader>
          <TableHeader>금액</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableEmpty colSpan={3}>
          <EmptyState
            size="sm"
            titleAs="p"
            title="조건에 맞는 주문이 없어요"
            action={
              <Button size="sm" variant="outline" color="neutral">
                검색·필터 초기화
              </Button>
            }
          />
        </TableEmpty>
      </TableBody>
    </Table>
  ),
};
