// 함수 문서 쪽에 붙는 참고 표. 값은 korean-utils 를 불러 만든다 — 함수와 표가 어긋나지 않게.
import { KOREAN_BANKS, parseResidentNumber } from '@bestow-ui/korean-utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Typography } from '@bestow-ui/react';
import { bankCodesCheckedAt } from './guides';

/** 주민·외국인등록번호 뒷자리 첫 숫자 순서(많이 보는 1~4 먼저, 1800년대 9·0 은 끝에) */
const residentCodes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export function ResidentCodeTable() {
  const rows = residentCodes.map((code) => {
    // 1월 1일은 모든 세기에 있는 날이라 null 이 되지 않는다
    const info = parseResidentNumber(`000101-${code}`)!;
    return {
      code,
      century: `${info.birthDate.slice(0, 4)}년대`,
      sex: info.sex === 'male' ? '남성' : '여성',
      kind: info.foreigner ? '외국인' : '내국인',
    };
  });
  return (
    <section aria-labelledby="resident-codes-title">
      <Typography id="resident-codes-title" as="h2" variant="h2" className="doc-section-title">
        뒷자리 첫 숫자 표
      </Typography>
      <Typography className="doc-text">
        주민등록번호 앞자리 6자리는 생년월일(YYMMDD)이에요. 성별과 태어난 세기, 내국인·외국인 구분은 뒷자리 첫 숫자로
        정해져요. 예를 들어 2000년 이후에 태어난 여성은 4, 외국인등록번호는 5~8 이에요. parseResidentNumber 가 이 표대로
        읽어요.
      </Typography>
      <Table caption="주민등록번호 뒷자리 첫 숫자" size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>첫 숫자</TableHead>
            <TableHead>태어난 해</TableHead>
            <TableHead>성별</TableHead>
            <TableHead>구분</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.code}>
              <TableCell>{row.code}</TableCell>
              <TableCell>{row.century}</TableCell>
              <TableCell>{row.sex}</TableCell>
              <TableCell>{row.kind}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function BankCodeTable() {
  return (
    <section aria-labelledby="banks-title">
      <Typography id="banks-title" as="h2" variant="h2" className="doc-section-title">
        은행 코드표
      </Typography>
      <Typography className="doc-text">
        KOREAN_BANKS 에 든 {KOREAN_BANKS.length}곳이에요({bankCodesCheckedAt.label} 기준, 토스페이먼츠 기관 코드 문서와
        대조). 금융결제원 표준 코드 3자리이고, 많이 쓰는 은행부터 적었어요.
      </Typography>
      <Table caption="국내 은행 코드(금융결제원)" size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>코드</TableHead>
            <TableHead>은행</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {KOREAN_BANKS.map((bank) => (
            <TableRow key={bank.code}>
              <TableCell>{bank.code}</TableCell>
              <TableCell>{bank.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
