import {
  Link,
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
import { choosing } from './choosing';

/** 묶음별 "이럴 때 / 피할 때" 표 */
export function ChoosingTables() {
  return (
    <ThemeProvider theme="light" style={{ background: 'transparent' }}>
      <Stack gap={8}>
        {choosing.map((group) => (
          <Stack key={group.group} gap={3}>
            <Typography variant="h3" as="h2">
              {group.group}
            </Typography>
            <Typography color="muted">{group.rule}</Typography>
            <Table aria-label={group.group} size="sm">
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: 200 }}>컴포넌트</TableHead>
                  <TableHead>이럴 때</TableHead>
                  <TableHead style={{ width: '35%' }}>피할 때</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.items.map((item) => (
                  <TableRow key={item.name}>
                    <TableHead style={{ verticalAlign: 'top' }}>
                      <Link href={item.path} target="_top">
                        {item.name}
                      </Link>
                    </TableHead>
                    <TableCell style={{ verticalAlign: 'top' }}>{item.when}</TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      {item.avoid ?? (
                        <Typography as="span" variant="body-sm" color="muted">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        ))}
      </Stack>
    </ThemeProvider>
  );
}
