/** "언제 무엇을 쓰나" — 헷갈리는 컴포넌트 묶음별 선택 기준 (Choosing.mdx 가 그린다) */
export interface ChoiceGroup {
  group: string;
  /** 묶음을 고르는 한 줄 기준 */
  rule: string;
  items: Array<{ name: string; path: string; when: string; avoid?: string }>;
}

// 표는 문서 iframe(iframe.html) 안에 그려지므로 ./?path= 에 target="_top" 으로 바깥 Storybook 을 이동시킨다(Pages 의 /BestOW-UI/ 에서도 맞음)
const docs = (id: string) => `./?path=/docs/${id}--docs`;

export const choosing: ChoiceGroup[] = [
  {
    group: '하나 고르기',
    rule: '선택지가 적고 한눈에 보여야 하면 RadioGroup·SegmentedControl, 많으면 Select, 아주 많아 찾아야 하면 Combobox.',
    items: [
      {
        name: 'RadioGroup',
        path: docs('components-radiogroup'),
        when: '폼 안에서 2~5개 중 하나. 선택지마다 설명이 필요할 때.',
        avoid: '고르자마자 화면이 바뀌는 보기 전환 (→ SegmentedControl).',
      },
      {
        name: 'SegmentedControl',
        path: docs('components-segmentedcontrol'),
        when: '2~5개 짧은 이름 중 하나를 고르면 바로 반영(기간 일/주/월, 목록·격자 보기).',
        avoid: '아래 내용(패널)이 통째로 바뀜 (→ Tabs). 폼 제출 값 (→ RadioGroup).',
      },
      {
        name: 'Select',
        path: docs('components-select'),
        when: '6개 이상이거나 자리가 좁을 때. 목록이 길지 않아 훑어보면 찾을 수 있을 때.',
        avoid: '20개 넘게 길어 찾기 어려움 (→ Combobox).',
      },
      {
        name: 'Combobox',
        path: docs('components-combobox'),
        when: '선택지가 많아 글자를 입력해 걸러야 할 때(도시·은행·상품).',
        avoid: '선택지가 몇 개뿐 (→ Select·RadioGroup).',
      },
      {
        name: 'DropdownMenu (라디오 항목)',
        path: docs('components-dropdownmenu'),
        when: '정렬·간격처럼 화면 보기 설정을 메뉴 안에서.',
        avoid: '폼에 제출하는 값 (→ Select·RadioGroup).',
      },
    ],
  },
  {
    group: '여러 개 고르기 · 켜고 끄기',
    rule: '폼에서 여러 개면 Checkbox, 약관은 AgreementGroup, 표의 행은 useTableSelection. 바로 적용되는 설정은 Switch.',
    items: [
      {
        name: 'Checkbox',
        path: docs('components-checkbox'),
        when: '폼에서 여러 개를 고르거나, 제출할 때 함께 적용되는 동의·옵션 하나.',
      },
      {
        name: 'AgreementGroup',
        path: docs('korean-kit-agreementgroup'),
        when: '전체 동의 + 필수/선택 약관(보기 펼침 포함).',
      },
      {
        name: 'Switch',
        path: docs('components-switch'),
        when: '누르는 즉시 적용되는 켜기/끄기(알림 받기).',
        avoid: '"저장" 을 눌러야 적용되는 폼 값 (→ Checkbox).',
      },
      {
        name: 'Table + useTableSelection',
        path: docs('components-table'),
        when: '목록의 행을 골라 일괄 작업.',
      },
    ],
  },
  {
    group: '숫자 · 금액 · 날짜',
    rule: '정확한 값은 입력창, 대략적인 값·범위는 Slider. 서식(쉼표·하이픈)은 컴포넌트가 맡는다.',
    items: [
      {
        name: 'NumberInput',
        path: docs('components-numberinput'),
        when: '수량·인원처럼 작은 범위의 정수·소수(−/+, ↑/↓).',
      },
      {
        name: 'AmountInput',
        path: docs('korean-kit-amountinput'),
        when: '금액. 천 단위 쉼표와 "12만 5,000원" 읽기.',
      },
      {
        name: 'Slider',
        path: docs('components-slider'),
        when: '대략적인 값이나 범위(음량·가격대)를 눈으로 고를 때.',
        avoid: '정확한 값이 중요 (→ NumberInput, 또는 함께 둔다).',
      },
      {
        name: 'DatePicker',
        path: docs('korean-kit-datepicker'),
        when: '날짜 하나. 숫자 입력(YYYY-MM-DD)과 달력 둘 다.',
        avoid: '생년월일처럼 먼 날짜 — 숫자 입력이 더 빠르다는 것을 안내.',
      },
    ],
  },
  {
    group: '위에 띄우기 · 알리기',
    rule: '결정이 필요하면 Modal, 옆에서 길게 보면 Drawer, 짧은 추가 정보는 Popover, 결과 알림은 Toast, 페이지에 남겨야 하면 Alert.',
    items: [
      {
        name: 'Modal',
        path: docs('components-modal'),
        when: '흐름을 멈추고 확인·짧은 입력이 필요할 때(삭제 확인, 초대).',
        avoid: '긴 내용·참고용 상세 (→ Drawer).',
      },
      {
        name: 'Drawer',
        path: docs('components-drawer'),
        when: '목록에서 상세 보기·필터처럼 옆에서 길게 보는 내용.',
      },
      {
        name: 'Popover',
        path: docs('components-popover'),
        when: '버튼 옆의 짧은 추가 정보·작은 폼(공유 설정). 바깥을 누르면 닫힘.',
      },
      {
        name: 'Tooltip',
        path: docs('components-tooltip'),
        when: '아이콘 버튼 이름 같은 짧은 보조 설명.',
        avoid: '꼭 알아야 할 정보·링크·버튼 (터치 기기에서 보기 어렵다).',
      },
      {
        name: 'DropdownMenu',
        path: docs('components-dropdownmenu'),
        when: '버튼 하나에 모은 동작 목록(편집·복제·삭제).',
        avoid: '페이지 이동 목록 (→ 링크 목록).',
      },
      {
        name: 'Toast',
        path: docs('components-toast'),
        when: '동작 결과를 잠깐 알림(저장했어요).',
        avoid: '되돌리기처럼 놓치면 안 되는 동작만 두기 (사라진다).',
      },
      {
        name: 'Alert',
        path: docs('components-alert'),
        when: '페이지에 남아 있어야 하는 안내·경고.',
      },
      {
        name: 'ErrorSummary',
        path: docs('components-errorsummary'),
        when: '폼 제출에 실패했을 때 고칠 곳 모음(포커스·링크).',
      },
    ],
  },
  {
    group: '화면 나누기 · 이동',
    rule: '같은 페이지에서 내용을 바꾸면 Tabs, 세로로 접으면 Accordion, 진행 위치는 Stepper, 다른 페이지로 가면 Link.',
    items: [
      {
        name: 'Tabs',
        path: docs('components-tabs'),
        when: '선택에 따라 아래 패널이 바뀜. 탭이 많거나 이름이 길면 세로.',
        avoid: '값만 고르고 패널이 없음 (→ SegmentedControl).',
      },
      {
        name: 'Accordion',
        path: docs('components-accordion'),
        when: '자주 묻는 질문처럼 여러 섹션을 세로로 펼쳐 봄.',
      },
      {
        name: 'Stepper',
        path: docs('components-stepper'),
        when: '가입·결제처럼 단계가 정해진 흐름의 현재 위치 표시.',
        avoid: '단계 간 자유 이동 (→ Tabs).',
      },
      {
        name: 'Pagination',
        path: docs('components-pagination'),
        when: '긴 목록을 페이지로 나눔.',
      },
      {
        name: 'Link · Button',
        path: docs('components-link'),
        when: '다른 페이지·주소로 가면 Link, 이 화면에서 동작하면 Button.',
      },
    ],
  },
  {
    group: '기다림 · 상태 표시',
    rule: '얼마나 남았는지 알면 Progress, 모르면 Spinner, 내용 자리를 미리 보여 주면 Skeleton.',
    items: [
      {
        name: 'Progress',
        path: docs('components-progress'),
        when: '업로드처럼 진행률을 알 때(모르면 value 없이).',
      },
      { name: 'Spinner', path: docs('components-spinner'), when: '짧은 대기·버튼 안 로딩(Button loading).' },
      {
        name: 'Skeleton · TableSkeleton',
        path: docs('components-skeleton'),
        when: '불러오는 동안 내용 모양을 미리(aria-busy 와 함께).',
      },
      { name: 'Badge', path: docs('components-badge'), when: '짧은 상태 라벨(결제 완료·배송 중).' },
    ],
  },
];
