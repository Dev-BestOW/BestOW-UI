// 함수 문서 쪽에 붙는 참고 표. 값은 korean-utils 를 불러 만든다 — 함수와 표가 어긋나지 않게(라이브러리에 없는 참고 자료만 값으로 적는다).
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

/**
 * 사업자등록번호 가운데 두 자리(개인·법인 구분 코드). korean-utils 에는 없는 참고 자료라 여기에 값으로 적는다
 * (국세청 사업자등록 부여 기준 — 2026-11 에 여러 안내 자료가 같은 값을 적은 것을 확인). 범위가 아닌 코드는 하나씩 적는다
 */
const businessCodes = [
  { code: '01~79', kind: '개인 과세사업자' },
  { code: '90~99', kind: '개인 면세사업자' },
  { code: '80', kind: '아파트 관리사무소 같은 단체, 다단계 판매원' },
  { code: '89', kind: '법인이 아닌 종교 단체' },
  { code: '81, 86, 87, 88', kind: '영리법인 본점' },
  { code: '85', kind: '영리법인 지점' },
  { code: '82', kind: '비영리법인(본점·지점)' },
  { code: '83', kind: '국가·지방자치단체' },
  { code: '84', kind: '외국법인(본점·지점·연락사무소)' },
];

export function BusinessCodeTable() {
  return (
    <section aria-labelledby="business-codes-title">
      <Typography id="business-codes-title" as="h2" variant="h2" className="doc-section-title">
        번호 구성과 가운데 두 자리 표
      </Typography>
      <Typography className="doc-text">
        10자리는 세무서 코드 3자리, 개인·법인 구분 코드 2자리, 일련번호 4자리, 검증 숫자 1자리예요. 예를 들어
        124-81-00998 의 81 은 영리법인 본점이라는 뜻이에요. 구분 코드는 번호를 줄 때 정해지고 공식으로는 확인하지
        않아서, isValidBusinessNumber 는 이 표와 관계없이 검증 숫자만 봐요.
      </Typography>
      <Table caption="사업자등록번호 가운데 두 자리" size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>가운데 두 자리</TableHead>
            <TableHead>사업자 구분</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessCodes.map((row) => (
            <TableRow key={row.code}>
              <TableCell>{row.code}</TableCell>
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
