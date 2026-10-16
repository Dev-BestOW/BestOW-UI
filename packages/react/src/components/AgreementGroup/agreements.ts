import type { ReactNode } from 'react';

// 서버 컴포넌트에서도 부를 수 있도록 컴포넌트(hook·Radix) 파일과 분리한 순수 타입·함수

export interface AgreementItem {
  value: string;
  /** 약관 이름 (예: "서비스 이용약관 동의") */
  label: ReactNode;
  /** 필수 동의 여부. 이름 앞에 "필수"/"선택" 이 붙는다 */
  required?: boolean;
  /** 펼쳐서 보여 줄 약관 내용. 있으면 "보기" 버튼이 생긴다 */
  content?: ReactNode;
}

/** 필수 항목에 모두 동의했는지 */
export function hasAllRequiredAgreements(items: AgreementItem[], value: string[]): boolean {
  return items.every((item) => !item.required || value.includes(item.value));
}
