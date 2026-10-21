// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { PlusIcon } from '@bestow-ui/icons';
import {
  Accordion,
  AccordionItem,
  AddressInput,
  AgreementGroup,
  Alert,
  AmountInput,
  Avatar,
  Badge,
  Breadcrumb,
  BusinessNumberInput,
  Button,
  Calendar,
  Card,
  CardBody,
  Checkbox,
  Combobox,
  DatePicker,
  DateRangePicker,
  dateRangePresets,
  DescriptionList,
  Divider,
  Drawer,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ErrorSummary,
  FileUpload,
  IconButton,
  Input,
  Link,
  LocaleProvider,
  Modal,
  NumberInput,
  Pagination,
  PhoneNumberInput,
  Popover,
  Progress,
  RadioGroup,
  SegmentedControl,
  NativeSelect,
  Select,
  Skeleton,
  SkipLink,
  Slider,
  Spinner,
  Stack,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  TextField,
  ThemeProvider,
  ToastProvider,
  Tooltip,
  Typography,
  VerificationCodeInput,
  VisuallyHidden,
  en,
} from './index';

// 서버 렌더링(SSR) 스모크 테스트 — Node 환경에서 모든 컴포넌트를 renderToString 으로 그려 경고·오류가 없는지 본다.
// CI 는 React 19 와 React 18(ci.yml react18 job) 양쪽으로 돈다 — React 18 SSR 은 useLayoutEffect 경고 등이 다르다.
const options = [
  { value: 'a', label: '가' },
  { value: 'b', label: '나' },
];

function Everything() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SkipLink />
        <Stack gap={2}>
          <ErrorSummary errors={[{ id: 'name', message: '이름을 입력해 주세요.' }]} />
          <VisuallyHidden>숨긴 글자</VisuallyHidden>
          <DescriptionList items={[{ term: '고객', description: '최별' }]} />
          <Typography variant="h1">제목</Typography>
          <Button startIcon={<PlusIcon />}>버튼</Button>
          <Button loading>저장</Button>
          <IconButton aria-label="추가">
            <PlusIcon />
          </IconButton>
          <Link href="/">링크</Link>
          <Badge>배지</Badge>
          <Avatar name="홍길동" />
          <Divider />
          <Card>
            <CardBody>카드</CardBody>
          </Card>
          <Alert title="알림">내용</Alert>
          <Spinner label="로딩" />
          <Skeleton width={100} />
          <Progress label="진행" value={40} />
          <Input aria-label="입력" />
          <TextField label="이름" helperText="도움말" />
          <Textarea label="메모" autoResize />
          <NumberInput label="수량" defaultValue={1} />
          <Select label="선택" options={options} />
          <NativeSelect label="기본 선택" placeholder="선택하세요" options={[{ value: 'a', label: '가' }]} />
          <Combobox label="검색" options={options} />
          <SegmentedControl aria-label="보기" options={options} defaultValue="a" />
          <RadioGroup label="라디오" options={options} />
          <Checkbox label="체크" />
          <Switch label="스위치" />
          <Slider label="음량" defaultValue={[40]} />
          <FileUpload label="첨부" />
          <Stepper steps={[{ label: '하나' }, { label: '둘' }]} current={0} />
          <Tabs defaultValue="a">
            <TabsList aria-label="탭">
              <TabsTrigger value="a">가</TabsTrigger>
            </TabsList>
            <TabsContent value="a">내용</TabsContent>
          </Tabs>
          <Accordion type="single">
            <AccordionItem value="a" title="질문">
              답
            </AccordionItem>
          </Accordion>
          <Pagination totalPages={5} page={1} onPageChange={() => {}} />
          <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '현재' }]} />
          <Table caption="표">
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>값</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Modal title="대화상자" trigger={<Button>열기</Button>}>
            내용
          </Modal>
          <Drawer title="서랍" trigger={<Button>서랍</Button>}>
            내용
          </Drawer>
          <Popover content="팝오버">
            <Button>팝오버</Button>
          </Popover>
          <Tooltip content="툴팁">
            <Button>툴팁</Button>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>메뉴</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>항목</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PhoneNumberInput />
          <BusinessNumberInput />
          <AmountInput />
          <AddressInput />
          <AgreementGroup items={[{ value: 'terms', label: '이용약관', required: true }]} />
          <VerificationCodeInput />
          <Calendar today="2026-10-19" />
          <DatePicker label="날짜" today="2026-10-19" />
          <DateRangePicker label="기간" today="2026-10-19" presets={dateRangePresets} />
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}

describe('서버 렌더링 (renderToString)', () => {
  it('모든 컴포넌트가 경고·오류 없이 HTML 로 그려진다', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = renderToString(<Everything />);
    const messages = [...error.mock.calls, ...warn.mock.calls].map((call) => call.map(String).join(' '));
    error.mockRestore();
    warn.mockRestore();
    expect(messages).toEqual([]);
    expect(html).toContain('본문 바로가기');
    expect(html).toContain('role="spinbutton"');
    expect(html).toContain('2026');
  });

  it('LocaleProvider 문구도 서버에서 적용된다', () => {
    const html = renderToString(
      <LocaleProvider messages={en}>
        <SkipLink />
        <FileUpload label="Files" />
      </LocaleProvider>,
    );
    expect(html).toContain('Skip to main content');
    expect(html).toContain('Choose files');
  });
});
