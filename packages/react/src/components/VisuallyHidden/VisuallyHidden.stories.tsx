import type { Meta, StoryObj } from '@storybook/react-vite';
import { EllipsisIcon } from '@bestow-ui/icons';
import { IconButton } from '../IconButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '화면에는 보이지 않고 스크린리더만 읽는 글자예요. 아이콘만 있는 열의 머리글("작업"), 보이는 글자에 붙는 보충 설명 등에 써요. ' +
          '`display: none` 과 달리 보조기술이 읽어요. 버튼·링크처럼 이름을 줄 수 있는 요소에는 `aria-label` 이 더 간단해요.',
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 표의 마지막 열은 아이콘 버튼뿐이라 머리글 글자를 숨겨 둔다 — 스크린리더는 "작업" 열로 읽는다 */
export const TableHeaderText: Story = {
  name: '표의 숨긴 열 머리글',
  render: () => (
    <Table aria-label="주문" size="sm" style={{ maxWidth: 420 }}>
      <TableHeader>
        <TableRow>
          <TableHead>주문번호</TableHead>
          <TableHead>
            <VisuallyHidden>작업</VisuallyHidden>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>ORD-02427</TableCell>
          <TableCell>
            <IconButton size="sm" aria-label="ORD-02427 작업">
              <EllipsisIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
