import { composeExtraAddress } from './address';

describe('composeExtraAddress (카카오 가이드 방식)', () => {
  it.each([
    [{ userSelectedType: 'R', bname: '역삼동', buildingName: '래미안', apartment: 'Y' }, ' (역삼동, 래미안)'],
    [{ userSelectedType: 'R', bname: '역삼동', buildingName: '강남빌딩', apartment: 'N' }, ' (역삼동)'],
    [{ userSelectedType: 'R', bname: '외도리', buildingName: '', apartment: 'N' }, ''], // 법정리는 제외
    [{ userSelectedType: 'J', bname: '역삼동', buildingName: '래미안', apartment: 'Y' }, ''], // 지번은 참고 항목 없음
  ] as const)('%o → "%s"', (data, expected) => {
    expect(composeExtraAddress(data)).toBe(expected);
  });
});
