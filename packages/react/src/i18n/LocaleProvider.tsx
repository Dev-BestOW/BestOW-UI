import { createContext, useContext, useMemo, type ReactNode } from 'react';

/**
 * 컴포넌트의 기본 문구. 모두 생략할 수 있고, 생략하면 각 컴포넌트의 한국어 기본값을 쓴다.
 * 우선순위: 컴포넌트에 직접 준 prop > LocaleProvider 의 messages > 한국어 기본값.
 *
 * 한국어 기본값을 하나의 객체로 모으지 않고 각 컴포넌트에 두는 이유: 그 객체를 import 하면 Button 하나만 써도
 * 모든 문구가 번들에 딸려 온다(Button → Spinner). 이 파일에는 타입과 Provider 만 둔다.
 */
export interface BestowMessages {
  /** 닫기 버튼 (Modal, Drawer, Popover, Toast, Alert) — "닫기" */
  close: string;
  /** Spinner — "로딩 중" */
  loading: string;
  /** Toast 영역 — "알림" */
  notifications: string;
  /** Breadcrumb — "이동 경로" */
  breadcrumb: string;
  /** Pagination — "페이지 탐색", "이전 페이지", "다음 페이지", "3 페이지" */
  pagination: string;
  paginationPrevious: string;
  paginationNext: string;
  paginationPage: (page: number) => string;
  /** Link external — "(새 창)" */
  newWindow: string;
  /** Combobox — "결과가 없어요", "목록 열기" */
  noResults: string;
  openList: string;
  /**
   * Combobox clearable — "선택 지우기".
   * 1.0 이후에 추가한 키는 선택(?)으로 둔다 — 직접 만든 BestowMessages 객체(다른 언어 묶음)가 타입 오류로 깨지지 않게.
   */
  clearSelection?: string;
  /** SkipLink — "본문 바로가기" (1.0 이후 추가, 선택 키) */
  skipToContent?: string;
  /** NumberInput −/+ 버튼 — "줄이기", "늘리기" (1.0 이후 추가, 선택 키) */
  decrement?: string;
  increment?: string;
  /** Stepper — 목록 이름 "진행 단계", 완료한 단계에 붙는 "완료" (1.0 이후 추가, 선택 키) */
  steps?: string;
  stepCompleted?: string;
  /**
   * FileUpload (1.0 이후 추가, 선택 키) — "파일 선택", "또는 여기로 끌어다 놓으세요", "선택한 파일", "○○ 삭제",
   * "파일 2개 선택됨", "○○ 삭제됨", 크기·형식·개수 초과 안내
   */
  fileSelect?: string;
  fileDropHint?: string;
  fileList?: string;
  fileRemove?: (name: string) => string;
  filesSelected?: (count: number) => string;
  fileRemoved?: (name: string) => string;
  fileTooLarge?: (name: string, maxSize: string) => string;
  fileTypeNotAllowed?: (name: string) => string;
  fileTooMany?: (maxFiles: number) => string;
  /** ErrorSummary 제목 — "입력한 내용에 고칠 곳이 3개 있어요" (1.0 이후 추가, 선택 키) */
  errorSummaryTitle?: (count: number) => string;
  /** DateRangePicker — "시작일", "종료일", 빠른 선택 묶음 이름 "빠른 선택" (1.0 이후 추가, 선택 키) */
  dateRangeStart?: string;
  dateRangeEnd?: string;
  dateRangePresets?: string;
  /** Slider 범위 손잡이 — "최소", "최대" */
  rangeStart: string;
  rangeEnd: string;
  /** AgreementGroup — "전체 동의", "필수", "선택", "보기", "접기" */
  agreeAll: string;
  required: string;
  optional: string;
  show: string;
  hide: string;
  /** VerificationCodeInput — "인증번호", "6자리 숫자를 입력하세요.", "재전송", "인증 시간이 지났어요. 재전송해 주세요." */
  verificationCode: string;
  verificationCodeHint: (length: number, type: 'numeric' | 'alphanumeric') => string;
  resend: string;
  verificationExpired: string;
  /** PhoneNumberInput — "휴대폰 번호" */
  phoneNumber: string;
  /** BusinessNumberInput — "사업자등록번호" 와 검증 문구 */
  businessNumber: string;
  businessNumberInvalid: string;
  businessNumberIncomplete: string;
  /** AmountInput — "금액", "원" */
  amount: string;
  currencyUnit: string;
  /** AddressInput */
  address: string;
  addressSearch: string;
  addressSearchDescription: string;
  postalCode: string;
  baseAddress: string;
  baseAddressPlaceholder: string;
  detailAddress: string;
  detailAddressPlaceholder: string;
  addressLoading: string;
  addressLoadError: string;
  /** Calendar */
  previousMonth: string;
  nextMonth: string;
  /** 달 제목 — month 는 1~12 */
  monthTitle: (year: number, month: number) => string;
  /** 요일 머리글 (일요일부터 7개) */
  weekdaysShort: readonly string[];
  /** 요일 전체 이름 (일요일부터 7개) */
  weekdaysLong: readonly string[];
  /** 날짜 버튼 이름 — 화면에 보이는 날짜 숫자로 시작해야 한다 (WCAG 2.5.3) */
  dayLabel: (date: Date, weekdayLong: string) => string;
  holiday: string;
  today: string;
  /** DatePicker */
  date: string;
  openCalendar: string;
  calendar: string;
  dateInvalid: string;
  dateUnavailable: string;
  dateIncomplete: string;
}

export type Messages = Partial<BestowMessages>;

const MessagesContext = /* @__PURE__ */ createContext<Messages>({});

export interface LocaleProviderProps {
  /** 바꿀 문구. 일부만 넘기면 나머지는 바깥 LocaleProvider 또는 한국어 기본값을 쓴다 */
  messages: Messages;
  children?: ReactNode;
}

/**
 * 컴포넌트 기본 문구를 한곳에서 바꾼다 (다국어 대응 등). 중첩하면 바깥 값을 이어받고 안쪽이 우선한다.
 * @example <LocaleProvider messages={en}>…</LocaleProvider>
 * @example <LocaleProvider messages={{ close: '창 닫기' }}>…</LocaleProvider>
 */
export function LocaleProvider({ messages, children }: LocaleProviderProps) {
  const parent = useContext(MessagesContext);
  const value = useMemo(() => ({ ...parent, ...messages }), [parent, messages]);
  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

/** LocaleProvider 로 바꾼 문구 (없으면 빈 객체 — 각 컴포넌트가 한국어 기본값을 쓴다) */
export function useMessages(): Messages {
  return useContext(MessagesContext);
}
