import { getChoseong, matchesKorean } from './hangul';

describe('getChoseong', () => {
  it.each([
    ['국민은행', 'ㄱㅁㅇㅎ'],
    ['KB국민 1', 'KBㄱㅁ 1'], // 한글 음절이 아니면 그대로
    ['까치', 'ㄲㅊ'],
    ['ㄱㅏ', 'ㄱㅏ'], // 낱자모는 그대로
    ['', ''],
  ])('%s → %s', (text, expected) => {
    expect(getChoseong(text)).toBe(expected);
  });
});

describe('matchesKorean', () => {
  it.each([
    ['KB국민은행', 'ㄱㅁ', true],
    ['KB국민은행', 'kb', true],
    ['KB국민은행', '국민', true],
    ['KB국민은행', '', true],
    ['KB국민은행', '  ', true], // 공백만 = 모두 맞음
    ['KB국민은행', ' 국민 ', true], // 앞뒤 공백은 지운다
    ['KB국민은행', '국ㅁ', true], // 음절 + 초성 섞기
    ['KB국민은행', '국미', true], // 조합 중: 마지막 음절은 받침 없이 초·중성만 맞으면 됨
    ['KB국민은행', '구', true], // 조합 중: 받침 없는 첫 음절
    ['하나은행', '한', true], // 조합 중: 마지막 음절의 받침이 다음 글자의 초성
    ['하나은행', '한ㅇ', false], // 마지막이 아니면 받침 규칙을 쓰지 않음
    ['하나', '하나ㄴ', false], // target 보다 길면 안 맞음
    ['하', '한', false], // 받침 규칙은 다음 글자가 있어야 함
    ['까치', 'ㄱ', false], // 쌍자음은 따로
    ['신한은행', 'ㅅㅎ', true],
    ['신한은행', 'ㅎㅅ', false],
    ['우리은행', '국민', false],
    ['국민은행', '구민', false], // 마지막이 아닌 음절은 정확히 같아야 함
  ])('matchesKorean(%s, %s) = %s', (target, query, expected) => {
    expect(matchesKorean(target, query)).toBe(expected);
  });
});
