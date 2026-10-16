import {
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
import { componentA11y } from './componentA11y';

/** 분류별 컴포넌트 키보드·스크린리더 표 */
export function ComponentA11yTables() {
  return (
    <ThemeProvider theme="light" style={{ background: 'transparent' }}>
      <Stack gap={8}>
        {componentA11y.map((group) => (
          <Table key={group.group} caption={group.group} size="sm">
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 150 }}>컴포넌트</TableHead>
                <TableHead>키보드</TableHead>
                <TableHead>스크린리더</TableHead>
                <TableHead style={{ width: 200 }}>사용하는 쪽이 챙길 것</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.items.map((item) => (
                <TableRow key={item.name}>
                  <TableHead style={{ verticalAlign: 'top' }}>{item.name}</TableHead>
                  <TableCell style={{ verticalAlign: 'top' }}>{item.keyboard}</TableCell>
                  <TableCell style={{ verticalAlign: 'top' }}>{item.screenReader}</TableCell>
                  <TableCell style={{ verticalAlign: 'top' }}>
                    {item.yours ?? (
                      <Typography as="span" variant="body-sm" color="muted">
                        —
                      </Typography>
                    )}
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
