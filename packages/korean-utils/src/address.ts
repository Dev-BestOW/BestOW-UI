// 카카오(다음) 우편번호 서비스 결과를 다루는 함수 (https://postcode.map.kakao.com/guide)

/** 참고 항목을 만드는 데 필요한 우편번호 서비스 결과 값 */
export interface ExtraAddressSource {
  /** 사용자가 고른 주소 종류: R 도로명, J 지번 */
  userSelectedType: 'R' | 'J';
  /** 법정동·법정리 이름 */
  bname: string;
  buildingName: string;
  /** 공동주택이면 'Y' */
  apartment: 'Y' | 'N';
}

/**
 * 카카오 가이드의 방식으로 도로명 주소의 참고 항목(법정동, 공동주택 건물명)을 만든다. 지번 주소를 골랐으면 빈 문자열.
 * @example composeExtraAddress({ userSelectedType: 'R', bname: '역삼동', buildingName: '래미안', apartment: 'Y' }) // ' (역삼동, 래미안)'
 */
export function composeExtraAddress(data: ExtraAddressSource): string {
  if (data.userSelectedType !== 'R') return '';
  const parts: string[] = [];
  // 법정동명은 "동·로·가" 로 끝날 때만 (법정리는 제외)
  if (data.bname && /[동로가]$/.test(data.bname)) parts.push(data.bname);
  if (data.buildingName && data.apartment === 'Y') parts.push(data.buildingName);
  return parts.length ? ` (${parts.join(', ')})` : '';
}
