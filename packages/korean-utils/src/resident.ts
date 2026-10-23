// 주민등록번호·외국인등록번호 서식과 구조 검사. 숫자가 아닌 글자는 무시하므로 하이픈이 섞인 입력도 받는다.

const onlyDigits = (input: string) => input.replace(/\D/g, '');

/**
 * 주민·외국인등록번호(13자리)에 하이픈을 넣는다. 입력 중인 값도 나눈다.
 * @example formatResidentNumber('9001011234567') // '900101-1234567'
 */
export function formatResidentNumber(input: string): string {
  const d = onlyDigits(input).slice(0, 13);
  return d.length <= 6 ? d : `${d.slice(0, 6)}-${d.slice(6)}`;
}

export interface ResidentNumberInfo {
  /** 생년월일 'YYYY-MM-DD' */
  birthDate: string;
  sex: 'male' | 'female';
  /** 외국인등록번호(뒷자리 첫 숫자 5~8)인지 */
  foreigner: boolean;
}

// 뒷자리 첫 숫자 → 태어난 세기·성별·외국인 여부 (9·0 은 1800년대)
const CENTURY: Record<string, number> = {
  1: 1900,
  2: 1900,
  3: 2000,
  4: 2000,
  5: 1900,
  6: 1900,
  7: 2000,
  8: 2000,
  9: 1800,
  0: 1800,
};

/**
 * 앞 7자리(생년월일 + 뒷자리 첫 숫자)를 읽는다. 날짜가 없는 날이거나 자릿수가 모자라면 null.
 * 뒤 6자리는 보지 않는다 — 앞 7자리만 받는 화면(성별·나이 확인)에도 쓴다.
 * @example parseResidentNumber('900101-1') // { birthDate: '1990-01-01', sex: 'male', foreigner: false }
 */
export function parseResidentNumber(input: string): ResidentNumberInfo | null {
  const d = onlyDigits(input);
  if (d.length < 7) return null;
  const code = d[6]!;
  const year = CENTURY[code]! + Number(d.slice(0, 2));
  const month = Number(d.slice(2, 4));
  const day = Number(d.slice(4, 6));
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    birthDate: `${year}-${pad(month)}-${pad(day)}`,
    sex: Number(code) % 2 === 1 ? 'male' : 'female',
    foreigner: Number(code) >= 5 && Number(code) <= 8,
  };
}

/**
 * 13자리이고 생년월일·뒷자리 첫 숫자가 맞는지 본다(오타 거르기).
 * **검증 숫자(마지막 자리)는 보지 않는다** — 2020년 10월부터 새로 받은 번호는 뒤 6자리가 임의 번호라 예전 공식으로 확인하면
 * 올바른 번호도 틀렸다고 나온다. 실제로 있는 번호인지는 본인확인 기관 조회가 필요하다.
 * @example isValidResidentNumber('900101-1234567') // true
 */
export function isValidResidentNumber(input: string): boolean {
  return onlyDigits(input).length === 13 && parseResidentNumber(input) !== null;
}
