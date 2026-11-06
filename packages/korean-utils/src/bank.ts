export interface KoreanBank {
  /** 금융결제원 표준 은행 코드 3자리 (예: "004") */
  code: string;
  /** 화면에 보일 이름 */
  name: string;
}

/**
 * 국내 은행 목록 — 금융결제원 표준 코드 3자리와 이름. 많이 쓰는 은행부터(시중·인터넷 → 지방 → 특수·서민 금융).
 * 2026-11 기준(토스페이먼츠 기관 코드 문서로 대조). 합병·이름 변경이 있으면 minor 로 갱신한다(예: 2024년 대구은행 → iM뱅크, 코드 031 그대로).
 * 증권사·외국계 지점은 넣지 않았다 — 필요하면 이 목록에 더해 options 로 넘긴다.
 * @example KOREAN_BANKS.find((bank) => bank.code === '090')?.name // '카카오뱅크'
 */
export const KOREAN_BANKS: readonly KoreanBank[] = [
  { code: '004', name: 'KB국민은행' },
  { code: '088', name: '신한은행' },
  { code: '020', name: '우리은행' },
  { code: '081', name: '하나은행' },
  { code: '011', name: 'NH농협은행' },
  { code: '003', name: 'IBK기업은행' },
  { code: '090', name: '카카오뱅크' },
  { code: '092', name: '토스뱅크' },
  { code: '089', name: '케이뱅크' },
  { code: '023', name: 'SC제일은행' },
  { code: '027', name: '한국씨티은행' },
  { code: '031', name: 'iM뱅크(대구)' },
  { code: '032', name: '부산은행' },
  { code: '039', name: '경남은행' },
  { code: '034', name: '광주은행' },
  { code: '037', name: '전북은행' },
  { code: '035', name: '제주은행' },
  { code: '002', name: 'KDB산업은행' },
  { code: '007', name: 'Sh수협은행' },
  { code: '030', name: '수협중앙회' },
  { code: '012', name: '지역농·축협' },
  { code: '045', name: '새마을금고' },
  { code: '048', name: '신협' },
  { code: '071', name: '우체국' },
  { code: '050', name: '저축은행' },
  { code: '064', name: '산림조합' },
];

const onlyDigits = (input: string) => input.replace(/\D/g, '');

/**
 * 계좌번호에서 숫자만 남긴다(최대 16자리). 은행·상품마다 자릿수와 하이픈 위치가 달라 서식을 넣지 않고 숫자로만 다룬다 —
 * 은행 앱에서 "110-123-456789" 처럼 복사해 붙여 넣어도 된다.
 * @example accountNumberDigits('110-123-456789') // '110123456789'
 */
export function accountNumberDigits(input: string): string {
  return onlyDigits(input).slice(0, 16);
}

/**
 * 계좌번호 자릿수가 국내 계좌 범위(10~16자리)인지 확인한다. 은행마다 검증 공식이 공개돼 있지 않아 자릿수만 본다 —
 * 실제 계좌·예금주 확인은 은행·결제사의 예금주 조회 API 가 필요하다.
 * @example isValidAccountNumber('110-123-456789') // true
 */
export function isValidAccountNumber(input: string): boolean {
  const d = onlyDigits(input);
  return d.length >= 10 && d.length <= 16 && !/^0+$/.test(d);
}
