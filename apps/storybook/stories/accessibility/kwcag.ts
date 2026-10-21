// KWCAG 2.2 (KS X OT0003:2022, 4원칙 · 14지침 · 33검사항목) 항목별 BestOW UI 대응 근거.
// 번호는 표준 원문의 절 번호(5.1.1 ~ 8.2.1). 원칙 번호로 쓰는 자료(1.1.1 ~ 4.2.1)도 있다 — 5→1, 6→2, 7→3, 8→4.
// "인증을 보장" 하는 문서가 아니다. 컴포넌트가 해 둔 것과 사용하는 쪽이 할 일을 나눠 적는다.

export type Coverage = '지원' | '일부' | '사용자 몫' | '해당 없음';

export interface KwcagItem {
  id: string;
  name: string;
  /** 2.2 에서 새로 생긴 항목 */
  isNew?: boolean;
  coverage: Coverage;
  /** BestOW UI 가 해 둔 것 */
  provided: string;
  /** 사용하는 쪽이 할 일 */
  yours: string;
  /** 어떻게 확인하는지 (자동 검사 · 단위 테스트 · 수동) */
  verified: string;
}

export interface KwcagGroup {
  principle: string;
  items: KwcagItem[];
}

export const kwcag: KwcagGroup[] = [
  {
    principle: '원칙 1. 인식의 용이성',
    items: [
      {
        id: '5.1.1',
        name: '적절한 대체 텍스트 제공',
        coverage: '일부',
        provided:
          '아이콘은 기본 장식용(aria-hidden), 의미가 있으면 title 로 이름. IconButton 은 aria-label 이 타입에서 필수. Avatar 는 이름을 role="img" 이름으로.',
        yours: '이미지의 대체 텍스트 내용, 의미 있는 아이콘의 title.',
        verified: 'axe(button-name, svg-img-alt, role-img-alt) · IconButton 타입 테스트',
      },
      {
        id: '5.2.1',
        name: '자막 제공',
        coverage: '해당 없음',
        provided: '멀티미디어 컴포넌트가 없다.',
        yours: '영상·음성 콘텐츠의 자막·대본·수어.',
        verified: '—',
      },
      {
        id: '5.3.1',
        name: '표의 구성',
        coverage: '지원',
        provided:
          'Table: caption(또는 aria-label)로 표 이름, 머리 셀 scope 자동(thead → col, tbody·tfoot → row), 정렬 상태 aria-sort.',
        yours: '머리 셀에는 TableHead 를, 데이터 셀에는 TableCell 을 쓴다.',
        verified: '단위 테스트(scope·aria-sort, 변이 확인) · axe',
      },
      {
        id: '5.3.2',
        name: '콘텐츠의 선형구조',
        coverage: '일부',
        provided:
          '컴포넌트 안의 읽는 순서 = 화면 순서(CSS order 로 뒤섞지 않음). 팝업은 연 요소 다음 흐름으로 포커스를 옮긴다.',
        yours: '페이지 전체의 마크업 순서.',
        verified: '수동(스크린리더로 읽기 순서 확인)',
      },
      {
        id: '5.3.3',
        name: '명확한 지시사항 제공',
        coverage: '일부',
        provided:
          '필수 표시(*)는 required·aria-required 와 함께, 오류는 색과 함께 글자로(helperText). 달력의 요일 색에는 요일 글자가 함께 있다.',
        yours: '"빨간 항목을 고치세요" 처럼 한 가지 감각에만 기대는 안내 문구를 쓰지 않는다.',
        verified: '수동',
      },
      {
        id: '5.4.1',
        name: '색에 무관한 콘텐츠 인식',
        coverage: '지원',
        provided:
          'Link 는 기본 밑줄, 오류는 테두리 + 글자, 선택 상태는 aria-selected/aria-current 와 모양 변화, 달력 오늘은 테두리 + 굵게, 공휴일은 색 + 점 표시.',
        yours: '직접 만든 화면에서 색만으로 상태를 알리지 않는다.',
        verified: '수동 · 스토리 시각 회귀(라이트·다크)',
      },
      {
        id: '5.4.2',
        name: '자동 재생 금지',
        coverage: '해당 없음',
        provided: '컴포넌트는 소리를 재생하지 않는다.',
        yours: '자동 재생 소리의 제어 수단.',
        verified: '—',
      },
      {
        id: '5.4.3',
        name: '텍스트 콘텐츠의 명도 대비',
        coverage: '지원',
        provided:
          '모든 의미 색은 대비를 계산해 정했다(글자 4.5:1, hover 포함). createIntentColors 는 브랜드 색을 넣어도 대비를 보장. 테마 빌더가 항목별 대비를 보여 준다.',
        yours: '직접 지정한 색은 테마 빌더나 대비 검사기로 확인.',
        verified: 'axe color-contrast 를 라이트·다크 두 테마로 CI 실행 · 의미 색 대비 단위 테스트',
      },
      {
        id: '5.4.4',
        name: '콘텐츠 간의 구분',
        coverage: '지원',
        provided:
          '테두리·간격 토큰, 다크 모드 그림자에 가장자리 ring, Divider. 입력 칸·체크 컨트롤 테두리를 배경과 3:1 이상으로 올리는 strongInputBorders(선택 — 기본은 1.3:1·2.07:1, 2.0 에서 기본값 예정). Windows 고대비 모드에서 배경색·그림자로 보이던 상태(Switch·선택된 탭·SegmentedControl·메뉴 강조·현재 페이지·선택한 날·Progress·Slider·Stepper)를 시스템 강조색으로 다시 그린다.',
        yours:
          '레이아웃에서 영역 간 간격·구분선. 직접 만든 요소는 상태를 배경색만으로 보이지 않게(테두리·글자·아이콘도 함께).',
        verified: '스토리 시각 회귀 · 고대비 E2E(forced-colors 에뮬레이션, 시스템 강조색 확인)',
      },
    ],
  },
  {
    principle: '원칙 2. 운용의 용이성',
    items: [
      {
        id: '6.1.1',
        name: '키보드 사용 보장',
        coverage: '지원',
        provided:
          '모든 상호작용 컴포넌트를 키보드로 쓸 수 있다(Radix 기반 + 직접 구현한 Combobox·Calendar·Slider·Table 스크롤 영역 등). 달력은 방향키·PageUp/Down·Home/End.',
        yours: 'div 에 onClick 을 다는 대신 Button·Link 를 쓴다.',
        verified: '단위 테스트(user-event 키보드 시나리오) · 실제 브라우저 점검',
      },
      {
        id: '6.1.2',
        name: '초점 이동과 표시',
        coverage: '지원',
        provided:
          '모든 컨트롤에 focus-visible 링(배경 대비 3:1 보장, 브랜드 색 포함). 오버레이는 포커스를 가두고 닫히면 연 요소로 돌려보낸다. 주소를 고르면 상세 주소로 포커스 이동.',
        yours: '포커스 링을 CSS 로 지우지 않는다.',
        verified: '단위 테스트(포커스 복귀, 변이 확인) · createIntentColors 포커스 링 대비 테스트',
      },
      {
        id: '6.1.3',
        name: '조작 가능',
        coverage: '일부',
        provided: 'Button·IconButton·입력창은 32px 이상(sm), 달력 날짜 36px. 체크박스·스위치는 레이블까지 눌리는 영역.',
        yours: '이웃한 작은 컨트롤 사이에 충분한 간격.',
        verified: '수동',
      },
      {
        id: '6.1.4',
        name: '문자 단축키',
        isNew: true,
        coverage: '지원',
        provided:
          '단일 문자 단축키를 등록하지 않는다. 메뉴·선택 목록의 글자 찾기(typeahead)는 그 컴포넌트에 포커스가 있을 때만 동작.',
        yours: '앱에서 단일 문자 단축키를 만들면 끄거나 바꿀 수 있게.',
        verified: '코드 검토',
      },
      {
        id: '6.2.1',
        name: '응답시간 조절',
        coverage: '일부',
        provided:
          'VerificationCodeInput: 남은 시간 표시, 재전송으로 연장, 만료 안내. Toast: 표시 시간 조절(duration, Infinity 가능), 마우스·포커스가 있으면 멈춤(Radix Toast).',
        yours: '세션 만료 등 앱의 시간제한에 연장 수단.',
        verified: '단위 테스트(타이머·재전송)',
      },
      {
        id: '6.2.2',
        name: '정지 기능 제공',
        coverage: '지원',
        provided: '"동작 줄이기" 설정이면 열림·닫힘 애니메이션을 끄고 Skeleton·진행 막대 움직임을 멈춘다.',
        yours: '자동 슬라이드 등 움직이는 콘텐츠의 정지 버튼.',
        verified: '실제 브라우저 점검(reducedMotion)',
      },
      {
        id: '6.3.1',
        name: '깜빡임과 번쩍임 사용 제한',
        coverage: '지원',
        provided: '깜빡이거나 번쩍이는 애니메이션이 없다(Spinner 회전, Skeleton 은 느린 shimmer).',
        yours: '콘텐츠의 깜빡임.',
        verified: '코드 검토',
      },
      {
        id: '6.4.1',
        name: '반복 영역 건너뛰기',
        coverage: '일부',
        provided:
          'SkipLink(본문 바로가기) — 평소에는 숨었다가 첫 Tab 에 나타나고, 누르면 본문으로 포커스를 옮긴다(본문이 포커스를 못 받으면 tabindex="-1" 을 붙임).',
        yours: '페이지 맨 앞(머리글보다 먼저)에 SkipLink 를 두고 본문 요소에 id="main" 을 준다.',
        verified: '단위 테스트(포커스 이동·tabindex), playground E2E(첫 Tab 표시·Enter 로 본문 이동)',
      },
      {
        id: '6.4.2',
        name: '제목 제공',
        coverage: '일부',
        provided:
          'Modal·Drawer 는 title 필수(대화상자 이름), Popover 는 title 또는 aria-label, Accordion 은 headingLevel, Table 은 caption, Breadcrumb 은 이름 있는 nav.',
        yours: '페이지 제목(<title>)과 제목 구조.',
        verified: '단위 테스트(이름) · axe',
      },
      {
        id: '6.4.3',
        name: '적절한 링크 텍스트',
        coverage: '일부',
        provided: 'Link external 은 "(새 창)" 을 덧붙인다. Breadcrumb 의 현재 페이지는 링크로 만들지 않는다.',
        yours: '"여기", "더보기" 대신 목적지를 알 수 있는 링크 글자.',
        verified: '단위 테스트 · Chrome 접근성 트리 확인',
      },
      {
        id: '6.4.4',
        name: '고정된 참조 위치 정보',
        isNew: true,
        coverage: '해당 없음',
        provided: '전자출판문서형 페이지 대상 항목.',
        yours: '전자출판 문서라면 쪽 번호 등 참조 위치.',
        verified: '—',
      },
      {
        id: '6.5.1',
        name: '단일 포인터 입력 지원',
        isNew: true,
        coverage: '지원',
        provided:
          'Slider 는 끌기 말고 트랙 누르기·키보드로도 바꿀 수 있다. FileUpload 의 끌어다 놓기는 "파일 선택" 버튼으로 대신할 수 있다. 끌기·여러 손가락만으로 되는 동작이 없다.',
        yours: '직접 만든 끌기 동작의 대체 수단.',
        verified: '실제 브라우저 점검',
      },
      {
        id: '6.5.2',
        name: '포인터 입력 취소',
        isNew: true,
        coverage: '지원',
        provided:
          '버튼 누르기와 메뉴·목록 항목 선택은 손을 뗄 때 실행된다(누른 채 밖으로 빼면 취소). 단 Select·DropdownMenu 의 목록 "열기" 는 누르는 순간 열린다(Radix 기본 동작) — 열기는 Esc 로 되돌릴 수 있어 기능 실행으로 보지 않는다.',
        yours: 'mousedown 에서 바로 실행하는 동작을 만들지 않는다.',
        verified: '코드 검토',
      },
      {
        id: '6.5.3',
        name: '레이블과 네임',
        isNew: true,
        coverage: '지원',
        provided:
          '접근 가능한 이름이 화면 글자를 포함하도록 했다: 달력 날짜 "15, 2026년 10월 목요일", 외부 링크 "GitHub (새 창)", 약관 버튼 "필수 서비스 이용약관 동의 보기".',
        yours: 'aria-label 을 쓸 때 화면 글자를 포함한다.',
        verified: 'axe(label-content-name-mismatch) CI',
      },
      {
        id: '6.5.4',
        name: '동작기반 작동',
        isNew: true,
        coverage: '해당 없음',
        provided: '기기 움직임(흔들기 등)으로 작동하는 기능이 없다.',
        yours: '동작 기반 기능을 만들면 UI 대체 수단과 끄기.',
        verified: '—',
      },
    ],
  },
  {
    principle: '원칙 3. 이해의 용이성',
    items: [
      {
        id: '7.1.1',
        name: '기본 언어 표시',
        coverage: '사용자 몫',
        provided: '예제 앱은 <html lang="ko">.',
        yours: '<html lang> 지정.',
        verified: 'axe(html-has-lang) — 앱에서',
      },
      {
        id: '7.2.1',
        name: '사용자 요구에 따른 실행',
        coverage: '지원',
        provided:
          '포커스나 값 변경만으로 페이지 이동·새 창 열기를 하지 않는다(Select·Combobox 는 값만 바꾼다). 새 창 링크는 미리 알린다.',
        yours: '값 변경 이벤트에서 바로 페이지를 이동하지 않는다.',
        verified: '코드 검토',
      },
      {
        id: '7.2.2',
        name: '찾기 쉬운 도움 정보',
        isNew: true,
        coverage: '사용자 몫',
        provided: '—',
        yours: '도움말·문의 링크를 페이지마다 같은 위치에.',
        verified: '—',
      },
      {
        id: '7.3.1',
        name: '오류 정정',
        coverage: '지원',
        provided:
          '폼 컴포넌트는 error + helperText(aria-invalid, aria-describedby). 자동 검증이 고치는 방법을 알려 준다(사업자번호, 날짜, 약관 필수 동의). 입력 중에는 오류를 띄우지 않는다.',
        yours: '서버 검증 오류를 같은 방식으로 표시.',
        verified: '단위 테스트(오류 연결) · axe',
      },
      {
        id: '7.3.2',
        name: '레이블 제공',
        coverage: '지원',
        provided:
          '모든 폼 컴포넌트에 label(htmlFor·aria-labelledby), 묶음은 fieldset·legend(약관 동의, 주소). 레이블이 없으면 aria-label.',
        yours: 'label 이나 aria-label 을 반드시 준다.',
        verified: 'axe(label) · 단위 테스트(역할·이름으로 찾기)',
      },
      {
        id: '7.3.3',
        name: '접근 가능한 인증',
        isNew: true,
        coverage: '지원',
        provided:
          'VerificationCodeInput 은 문자 자동 채우기(autocomplete="one-time-code")와 붙여넣기를 지원해 번호를 외워 옮겨 적지 않아도 된다. 입력창은 붙여넣기를 막지 않는다.',
        yours: '비밀번호 붙여넣기를 막지 않는다. 퍼즐형 인증만 두지 않는다.',
        verified: '단위 테스트(붙여넣기 정리) · 실제 브라우저 점검',
      },
      {
        id: '7.3.4',
        name: '반복 입력 정보',
        isNew: true,
        coverage: '일부',
        provided: '브라우저 자동 완성 속성: 전화번호 tel-national, 상세 주소 address-line2.',
        yours: '같은 과정에서 이미 받은 정보 다시 쓰기(배송지 = 주문자 주소 등).',
        verified: '코드 검토',
      },
    ],
  },
  {
    principle: '원칙 4. 견고성',
    items: [
      {
        id: '8.1.1',
        name: '마크업 오류 방지',
        coverage: '지원',
        provided: 'React + TypeScript, id 는 useId 로 만들어 중복되지 않는다.',
        yours: '직접 쓴 마크업의 id 중복.',
        verified: 'axe(duplicate-id-aria, aria-valid-attr) · 타입 검사',
      },
      {
        id: '8.2.1',
        name: '웹 애플리케이션 접근성 준수',
        coverage: '지원',
        provided:
          'WAI-ARIA 패턴(Radix 기반 + 직접 구현한 combobox·grid·progressbar). 모든 스토리를 라이트·다크에서 axe 로 검사하고, 열린 상태(목록·대화상자·달력)도 play 로 열어 검사.',
        yours: '직접 만든 위젯의 역할·상태.',
        verified: 'axe CI(스토리 전체) · 단위 테스트(역할·상태) · 변이 확인',
      },
    ],
  },
];

/** 이 세션들에서 자동 검사·테스트가 실제로 찾아 고친 문제 — "검사로 지켜진다" 는 근거 */
export const caughtIssues: Array<{ item: string; found: string; fixed: string }> = [
  {
    item: '스크린리더 수동 점검 — VoiceOver + Safari (2026-10-21)',
    found:
      'Combobox 결과 없음 안내가 읽히지 않음(글자를 담은 채 새로 생긴 live region, 입력과 같은 순간의 변경), NumberInput 이 "선택 항목 대치됨, 2" 로만 읽힘(단위 없음), FileUpload 삭제 알림이 다음 버튼 포커스에 묻히고 Tab 으로는 파일 크기를 들을 수 없음',
    fixed:
      '항상 있는 알림 영역 + 입력이 멈춘 뒤(0.8초)·포커스를 옮긴 뒤(0.5초) 알림, 키·버튼으로 바꾼 값을 assertive 로 알림, 삭제 버튼 설명에 크기 — 단위 테스트(변이 확인) 후 VoiceOver 로 재확인',
  },
  {
    item: 'WCAG 1.4.11 비텍스트 대비 (KWCAG 항목 외)',
    found:
      '입력 칸 기본 테두리(border.default)가 흰 배경과 1.3:1, Checkbox·Radio·꺼진 Switch·Stepper 예정 단계(border.strong)가 라이트 2.07:1 — 경계가 잘 보이지 않음',
    fixed:
      '선택 토큰 color.border.input·inputHover·control + strongInputBorders(라이트 5.18:1, 다크 7.43:1 이상, 대비 단위 테스트). 기본값 변경은 2.0 (기존 화면 유지)',
  },
  {
    item: 'WCAG 1.4.10 리플로 · 1.4.4 글자 크기 (KWCAG 항목 외)',
    found:
      '320px 폭에서 인증번호 칸(6칸)이 화면보다 넓어 가로 스크롤이 생겼다. 글자 크기가 px 라 브라우저 기본 글꼴 크기를 키워도 커지지 않았다',
    fixed:
      '인증번호 칸이 좁을 때만 줄어들게, 글자 크기 CSS 변수를 rem 으로(기본 설정에서 화면 동일) + 리플로·글자 간격·글꼴 2배 E2E',
  },
  {
    item: '5.4.4 콘텐츠 간의 구분 (고대비 모드)',
    found:
      'Windows 고대비에서 Switch 가 통째로 사라지고, 선택된 탭·SegmentedControl 칸·메뉴/목록 강조 항목·현재 페이지·Progress 막대가 보이지 않았다. 켜진 Switch 에 마우스를 올리면 시스템 색 대신 원래 색이 나왔다',
    fixed:
      'forced-colors 미디어쿼리에서 시스템 색(Highlight 등)으로 다시 그림(hover 규칙 포함) + 시스템 강조색을 확인하는 E2E',
  },
  {
    item: '5.4.3 명도 대비',
    found: '라이트 fg.subtle 글자 대비 3.32:1, 다크 solid 버튼 hover 글자 대비 3.3~4.38:1',
    fixed: '토큰 조정(5.18:1, 6.47~7.44:1)과 hover 대비 단위 테스트',
  },
  {
    item: '6.1.2 초점 표시',
    found: '밝은 브랜드 색(노랑·하늘·분홍)이면 라이트 포커스 링 대비 1.5~2.8:1 (테마 빌더 리포트)',
    fixed: '3:1 미만이면 대비가 보장된 색으로 대체',
  },
  {
    item: '6.1.2 초점 이동',
    found: 'trigger 없이 제어하는 Modal·Drawer 를 닫으면 포커스가 페이지 처음(body)으로 사라짐',
    fixed: '열 때 포커스가 있던 요소로 되돌림',
  },
  {
    item: '6.5.3 레이블과 네임',
    found: '달력 날짜 이름 "2026년 10월 15일 …" 에 보이는 "15" 가 낱말로 없음 (axe)',
    fixed: '이름을 보이는 숫자로 시작 — "15, 2026년 10월 목요일"',
  },
  {
    item: '5.4.1 색에 무관한 인식',
    found: '달력 공휴일이 빨간색으로만 표시됨 (이 문서를 쓰며 항목별로 대조하다 발견)',
    fixed: '공휴일 숫자 아래 점 표시 추가',
  },
  {
    item: '7.3.3 접근 가능한 인증',
    found: '인증번호 입력의 maxLength 때문에 "987-654 321" 붙여넣기가 숫자만 남기기 전에 잘림',
    fixed: 'maxLength 제거, 숫자만 남긴 뒤 자름',
  },
];
