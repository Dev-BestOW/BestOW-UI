import {
  Badge,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ThemeProvider,
  Typography,
} from '@bestow-ui/react';
import { caughtIssues, kwcag, type Coverage } from './kwcag';

const coverageColor: Record<Coverage, 'success' | 'warning' | 'neutral' | 'primary'> = {
  지원: 'success',
  일부: 'warning',
  '사용자 몫': 'primary',
  '해당 없음': 'neutral',
};

/** 대응 정도별 개수 */
export function KwcagSummary() {
  const items = kwcag.flatMap((group) => group.items);
  const counts = (Object.keys(coverageColor) as Coverage[]).map((coverage) => ({
    coverage,
    count: items.filter((item) => item.coverage === coverage).length,
  }));
  return (
    <ThemeProvider theme="light" style={{ background: 'transparent' }}>
      <Stack direction="row" gap={3} wrap>
        {counts.map(({ coverage, count }) => (
          <Badge key={coverage} color={coverageColor[coverage]} size="lg">
            {coverage} {count}
          </Badge>
        ))}
        <Badge size="lg">전체 {items.length}</Badge>
      </Stack>
    </ThemeProvider>
  );
}

/** 원칙별 검사항목 표 */
export function KwcagTables() {
  return (
    <ThemeProvider theme="light" style={{ background: 'transparent' }}>
      <Stack gap={8}>
        {kwcag.map((group) => (
          <Table key={group.principle} caption={group.principle} size="sm">
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 150 }}>검사항목</TableHead>
                <TableHead style={{ width: 90 }}>대응</TableHead>
                <TableHead>BestOW UI 가 해 둔 것</TableHead>
                <TableHead>사용하는 쪽이 할 일</TableHead>
                <TableHead style={{ width: 170 }}>확인 방법</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.items.map((item) => (
                <TableRow key={item.id}>
                  <TableHead style={{ verticalAlign: 'top' }}>
                    <Stack gap={1}>
                      <span>
                        {item.id} {item.name}
                      </span>
                      {item.isNew && (
                        <Badge size="sm" color="primary" style={{ alignSelf: 'start' }}>
                          2.2 신규
                        </Badge>
                      )}
                    </Stack>
                  </TableHead>
                  <TableCell style={{ verticalAlign: 'top' }}>
                    <Badge color={coverageColor[item.coverage]}>{item.coverage}</Badge>
                  </TableCell>
                  <TableCell style={{ verticalAlign: 'top' }}>{item.provided}</TableCell>
                  <TableCell style={{ verticalAlign: 'top' }}>{item.yours}</TableCell>
                  <TableCell style={{ verticalAlign: 'top' }}>
                    <Typography variant="caption" color="muted">
                      {item.verified}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}
      </Stack>
    </ThemeProvider>
  );
}

/** 자동 검사·테스트가 실제로 찾아 고친 문제 */
export function CaughtIssues() {
  return (
    <ThemeProvider theme="light" style={{ background: 'transparent' }}>
      <Table caption="검사로 찾아 고친 문제" size="sm">
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 170 }}>관련 항목</TableHead>
            <TableHead>찾은 문제</TableHead>
            <TableHead>고친 방법</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {caughtIssues.map((issue) => (
            <TableRow key={issue.found}>
              <TableHead style={{ verticalAlign: 'top' }}>{issue.item}</TableHead>
              <TableCell style={{ verticalAlign: 'top' }}>{issue.found}</TableCell>
              <TableCell style={{ verticalAlign: 'top' }}>{issue.fixed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ThemeProvider>
  );
}
