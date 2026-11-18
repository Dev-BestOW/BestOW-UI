import type { ReactNode } from 'react';

// 서버 컴포넌트에서도 부를 수 있도록 컴포넌트(hook·Radix) 파일과 분리한 순수 타입·함수

/** 하위 항목 (예: 마케팅 수신 동의의 문자·이메일·푸시). 필수 여부는 부모를 따른다 */
export interface AgreementSubItem {
  value: string;
  label: ReactNode;
}

export interface AgreementItem {
  value: string;
  /** 약관 이름 (예: "서비스 이용약관 동의") */
  label: ReactNode;
  /** 필수 동의 여부. 이름 앞에 "필수"/"선택" 이 붙는다 */
  required?: boolean;
  /** 펼쳐서 보여 줄 약관 내용. 있으면 "보기" 버튼이 생긴다 */
  content?: ReactNode;
  /**
   * 하위 항목 (한 단계). 있으면 이 항목의 체크는 하위 항목이 모두 동의일 때 켜지고, 일부면 부분 선택이다.
   * 이때 이 항목의 value 는 키로만 쓰고 동의 값에는 하위 항목 value 만 들어간다.
   */
  children?: AgreementSubItem[];
}

/** 동의 값에 들어가는 value 목록 — 하위 항목이 있으면 하위 항목 value, 없으면 자기 value (내부용) */
export function leafValues(items: AgreementItem[]): string[] {
  return items.flatMap((item) => (item.children?.length ? item.children.map((child) => child.value) : [item.value]));
}

/** 필수 항목에 모두 동의했는지 */
export function hasAllRequiredAgreements(items: AgreementItem[], value: string[]): boolean {
  return items.every((item) => !item.required || leafValues([item]).every((v) => value.includes(v)));
}
