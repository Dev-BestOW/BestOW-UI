import { composeExtraAddress } from '@bestow-ui/korean-utils';

/** 주소 검색 결과 */
export interface AddressSearchResult {
  /** 우편번호 (5자리 국가기초구역번호) */
  zonecode: string;
  /** 기본 주소 (도로명 또는 지번) */
  address: string;
  /** 참고 항목 (도로명 주소일 때 법정동·건물명, 예: " (역삼동, 래미안아파트)") */
  extraAddress?: string;
}

/**
 * 주소 검색 공급자. container 안에 검색 화면을 그리고, 사용자가 고르면 onSelect 를 부른다.
 * 정리 함수를 돌려주면 검색 창이 닫힐 때 부른다. 다른 주소 서비스(행정안전부 도로명주소 API 등)로 바꿔 끼울 수 있다.
 */
export type AddressProvider = (
  container: HTMLElement,
  onSelect: (result: AddressSearchResult) => void,
) => void | (() => void) | Promise<void | (() => void)>;

// 참고 항목 함수는 @bestow-ui/korean-utils 로 옮겼다(1.6) — 예전 import 경로도 되게 다시 export
export { composeExtraAddress };

// 카카오 우편번호 서비스 (https://postcode.map.kakao.com/guide)
const KAKAO_POSTCODE_SRC = 'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

interface KakaoPostcodeData {
  zonecode: string;
  userSelectedType: 'R' | 'J';
  roadAddress: string;
  jibunAddress: string;
  autoJibunAddress?: string;
  bname: string;
  buildingName: string;
  apartment: 'Y' | 'N';
}

type PostcodeConstructor = new (options: {
  oncomplete: (data: KakaoPostcodeData) => void;
  width?: string | number;
  height?: string | number;
}) => { embed: (element: HTMLElement) => void };

interface PostcodeWindow {
  kakao?: { Postcode?: PostcodeConstructor };
  daum?: { Postcode?: PostcodeConstructor };
}

let loading: Promise<PostcodeConstructor> | null = null;

function loadKakaoPostcode(): Promise<PostcodeConstructor> {
  const w = window as unknown as PostcodeWindow;
  const existing = w.kakao?.Postcode ?? w.daum?.Postcode;
  if (existing) return Promise.resolve(existing);
  loading ??= new Promise<PostcodeConstructor>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = KAKAO_POSTCODE_SRC;
    script.async = true;
    script.onload = () => {
      const ctor = w.kakao?.Postcode ?? w.daum?.Postcode;
      if (ctor) resolve(ctor);
      else reject(new Error('우편번호 서비스를 찾지 못했어요'));
    };
    script.onerror = () => {
      loading = null; // 다음에 다시 시도할 수 있게
      reject(new Error('우편번호 서비스를 불러오지 못했어요'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/**
 * 기본 공급자: 카카오(다음) 우편번호 서비스. 처음 쓸 때 스크립트를 불러오므로 코어 번들 크기에 영향이 없다.
 * 사용 조건은 서비스 가이드를 따른다.
 */
export const kakaoPostcodeProvider: AddressProvider = async (container, onSelect) => {
  const Postcode = await loadKakaoPostcode();
  new Postcode({
    width: '100%',
    height: '100%',
    oncomplete: (data) => {
      const address =
        data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress || data.autoJibunAddress || '';
      onSelect({ zonecode: data.zonecode, address, extraAddress: composeExtraAddress(data) });
    },
  }).embed(container);
};
