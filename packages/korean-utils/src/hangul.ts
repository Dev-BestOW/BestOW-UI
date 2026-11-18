// 한글 검색 — 초성으로 찾기, 입력 중(조합 중)인 글자로 찾기

const SYLLABLE_START = 0xac00;
const SYLLABLE_END = 0xd7a3;
const CHOSEONG = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
// 받침 번호(0~27) → 호환 자모. 0 은 받침 없음
const JONGSEONG = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];

interface Syllable {
  cho: number;
  jung: number;
  jong: number;
}

function decompose(char: string | undefined): Syllable | null {
  if (!char) return null;
  const code = char.charCodeAt(0);
  if (code < SYLLABLE_START || code > SYLLABLE_END) return null;
  const offset = code - SYLLABLE_START;
  return { cho: Math.floor(offset / 588), jung: Math.floor((offset % 588) / 28), jong: offset % 28 };
}

const choseongOf = (char: string | undefined) => {
  const s = decompose(char);
  return s ? CHOSEONG[s.cho] : undefined;
};

/**
 * 한글 음절을 초성으로 바꾼다. 한글 음절이 아닌 글자(영문·숫자·공백·낱자모)는 그대로 둔다.
 * @example getChoseong('국민은행')  // 'ㄱㅁㅇㅎ'
 * @example getChoseong('KB국민')    // 'KBㄱㅁ'
 */
export function getChoseong(text: string): string {
  let result = '';
  for (const char of text) result += choseongOf(char) ?? char;
  return result;
}

/**
 * target 의 시작 위치 i 부터 query 가 맞는지.
 */
function matchesAt(target: string, query: string, i: number): boolean {
  let t = i;
  for (let j = 0; j < query.length; j++, t++) {
    const q = query[j]!;
    const c = target[t];
    if (c === undefined) return false;
    if (q === c) continue;
    // 초성만 친 글자: 그 자리 음절의 초성과 같으면 맞음
    if (CHOSEONG.includes(q) && choseongOf(c) === q) continue;
    const isLast = j === query.length - 1;
    const qs = decompose(q);
    const cs = decompose(c);
    if (isLast && qs && cs && qs.cho === cs.cho && qs.jung === cs.jung) {
      // 조합 중 "미" → "민": 받침을 아직 안 쳤다
      if (qs.jong === 0) continue;
      // 조합 중 "한" → "하나": 친 받침이 다음 글자의 초성이 될 자음이다
      if (cs.jong === 0 && choseongOf(target[t + 1]) === JONGSEONG[qs.jong]) {
        t++;
        continue;
      }
    }
    return false;
  }
  return true;
}

/**
 * 검색어가 이름에 들어 있는지 — 한국어 목록 검색용. 대소문자와 앞뒤 공백은 무시한다.
 * - 초성: `ㄱㅁ` 이 "국민은행" 에 맞는다 (음절과 섞어 `국ㅁ` 도 된다)
 * - 입력 중인 마지막 글자: `국미`(→ 국민)·`한`(→ 하나) 처럼 한글을 조합하는 도중의 글자도 맞는다
 * 빈 검색어는 모두 맞는다.
 * @example matchesKorean('KB국민은행', 'ㄱㅁ')  // true
 * @example matchesKorean('하나은행', '한')       // true
 */
export function matchesKorean(target: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === '') return true;
  const t = target.toLowerCase();
  for (let i = 0; i < t.length; i++) if (matchesAt(t, q, i)) return true;
  return false;
}
