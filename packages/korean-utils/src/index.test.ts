import * as utils from './index';

// 공개 API 목록을 고정한다 — 이름을 지우거나 바꾸면 이 테스트가 깨진다(= breaking change). 추가하면 여기에도 더한다.
it('공개 이름 목록', () => {
  expect(Object.keys(utils).sort()).toEqual([
    'KOREAN_WEEKDAYS',
    'composeExtraAddress',
    'formatBusinessNumber',
    'formatKoreanAmount',
    'formatKoreanDate',
    'formatPhoneNumber',
    'formatResidentNumber',
    'isValidBusinessNumber',
    'isValidResidentNumber',
    'maskCardNumber',
    'maskDigits',
    'maskName',
    'maskPhoneNumber',
    'maskResidentNumber',
    'parseResidentNumber',
    'phoneNumberMaxDigits',
  ]);
});
