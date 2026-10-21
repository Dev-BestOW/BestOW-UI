/**
 * 컴포넌트별 키보드·스크린리더 메모. 동작을 바꾸면 여기도 고친다 (CLAUDE.md: 접근성에 영향을 주는 동작 → kwcag.ts 와 함께).
 * Radix 기반 컴포넌트의 키보드 동작은 WAI-ARIA Authoring Practices 패턴을 따르는 Radix 구현 그대로다.
 */
export interface ComponentA11y {
  name: string;
  /** 키보드 조작. 비어 있으면 "Tab 으로 포커스만" 이거나 포커스를 받지 않는다 */
  keyboard: string;
  /** 스크린리더가 듣는 역할·이름·상태 */
  screenReader: string;
  /** 사용하는 쪽이 챙길 것 */
  yours?: string;
}

export interface ComponentA11yGroup {
  group: string;
  items: ComponentA11y[];
}

export const componentA11y: ComponentA11yGroup[] = [
  {
    group: '버튼·링크',
    items: [
      {
        name: 'Button',
        keyboard: 'Enter·Space 로 실행.',
        screenReader:
          'button. loading 이면 aria-busy·aria-disabled — 포커스는 유지되고(위치를 잃지 않음) 클릭·제출만 막힌다. 스피너는 장식으로 숨김.',
        yours: '아이콘만 있는 버튼은 IconButton 을 쓴다.',
      },
      {
        name: 'IconButton',
        keyboard: 'Enter·Space 로 실행.',
        screenReader: 'button. aria-label 이 타입으로 필수라 이름 없는 버튼을 만들 수 없다. 아이콘은 숨김.',
        yours: '이름은 동작으로 ("닫기", "검색"). 같은 화면의 같은 아이콘은 같은 이름.',
      },
      {
        name: 'Link',
        keyboard: 'Enter 로 이동.',
        screenReader:
          'link. external 이면 새 창 안내("(새 창)")를 이름에 덧붙이고 rel="noopener noreferrer". as/asChild 로 라우터 링크를 써도 같은 스타일·속성.',
        yours: '링크 글자만으로 목적지를 알 수 있게 ("여기" 대신 "환불 정책").',
      },
    ],
  },
  {
    group: '입력',
    items: [
      {
        name: 'TextField · Textarea · Input',
        keyboard: '기본 입력 동작.',
        screenReader:
          '<label> 로 이름 연결, helperText 는 aria-describedby, error 면 aria-invalid. required 는 required 속성으로 알리고 화면의 * 표시는 스크린리더에서 숨김. Input 은 레이블 없는 단독 컨트롤 — 바깥에서 이름을 준다.',
        yours: '오류 문구는 무엇이 틀렸고 어떻게 고치는지를 helperText 로.',
      },
      {
        name: 'Checkbox',
        keyboard: 'Space 로 체크.',
        screenReader: '네이티브 checkbox 라 모든 보조기기에서 동작. indeterminate 는 "혼합" 상태로 읽힌다.',
      },
      {
        name: 'Switch',
        keyboard: 'Space·Enter 로 켜고 끔.',
        screenReader:
          'switch, 켬/끔 상태. 네이티브 button(role=switch) — form 안에서는 숨긴 checkbox(aria-hidden)가 값 제출·required 검증을 맡는다.',
        yours: '즉시 적용되는 설정에만. 제출해야 반영되는 값은 Checkbox.',
      },
      {
        name: 'RadioGroup',
        keyboard:
          'Tab 으로 그룹에 들어가면 선택된 항목(없으면 첫 항목)에 포커스, 화살표로 이동하며 바로 선택(비활성 건너뜀). 브라우저 기본 radio 라 키 입력 방식과 상관없이 같게 동작하고, 세부는 브라우저를 따른다 — 끝에서 처음으로 도는 것은 Chrome·Firefox, Safari 는 멈춤. Safari 는 마우스로 누르면 포커스를 주지 않는다.',
        screenReader:
          'radiogroup (label 이 그룹 이름) 안의 네이티브 radio — "n개 중 m번째" 와 선택 상태를 읽는다. 보조 설명은 각 radio 의 설명으로, helperText·error·required 는 그룹에 연결.',
      },
      {
        name: 'FileUpload',
        keyboard:
          '"파일 선택" 버튼(Enter·Space)으로 운영체제 파일 창을 연다 — 끌어다 놓기는 덤. 목록의 "○○ 삭제" 버튼으로 지우면 포커스가 다음 삭제 버튼, 없으면 "파일 선택" 으로 간다.',
        screenReader:
          'group(레이블이 이름) + 도움말·거부 이유를 설명으로 연결. 선택한 파일은 목록 "선택한 파일", 추가·삭제·거부는 상태 알림(role=status)으로 읽는다("파일 2개 선택됨"). 삭제 알림은 포커스를 다음 버튼으로 옮긴 뒤 0.5초 있다가 넣고, 삭제 버튼은 파일 크기를 설명으로 읽는다(VoiceOver+Safari 수동 확인 2026-10-21).',
        yours: '받는 형식·크기·개수를 helperText 로 미리 알린다. 서버 전송·진행률은 직접(Progress 와 함께).',
      },
      {
        name: 'NumberInput',
        keyboard:
          '↑/↓ 한 단계(step), PageUp/PageDown 큰 단계(largeStep), min·max 가 있으면 Home/End 로 끝값. −/+ 버튼은 ↑/↓ 가 대신해 Tab 순서에서 빠져 있고, 눌러도 입력창 포커스를 뺏지 않는다.',
        screenReader:
          'spinbutton — 현재 값(aria-valuenow)·최소·최대, 단위를 붙인 읽기 값(aria-valuetext "3개"). 키·버튼으로 바꾼 값은 숨은 알림 영역(assertive)으로도 알린다(VoiceOver+Safari 가 글자 편집으로만 읽어서 — 수동 확인 2026-10-21). 버튼은 "줄이기"/"늘리기"(aria-controls 로 입력창 연결), 범위 끝에서 비활성.',
        yours:
          '입력 중에는 범위 밖 값도 받고 포커스가 빠질 때 맞춘다 — 범위를 helperText 로도 알린다(예: "최대 8명"). 금액은 AmountInput.',
      },
      {
        name: 'SegmentedControl',
        keyboard: 'Tab 으로 들어가면 선택된 칸, ←/→ 로 옮기면 바로 선택(끝에서 처음으로 돈다, 비활성 칸은 건너뜀).',
        screenReader: 'radiogroup(label 또는 aria-label 이 이름) / radio 의 선택 상태. 아이콘은 숨김.',
        yours: '선택에 따라 아래 내용(패널)이 바뀌면 Tabs 를 쓴다. 칸이 5개를 넘으면 Select.',
      },
      {
        name: 'Select',
        keyboard: 'Enter·Space·↓ 로 열기, 화살표 이동, 글자 입력으로 항목 찾기, Enter 선택, Esc 닫기.',
        screenReader: 'combobox 버튼 + listbox. 선택된 값이 버튼 글자로 읽힌다.',
      },
      {
        name: 'NativeSelect',
        keyboard:
          '브라우저 기본 select — 키 동작은 운영체제를 따른다(Windows 는 닫힌 채 ↑/↓ 로 바로 바뀜, macOS 는 Space·↓ 로 목록을 연다). 모바일은 운영체제 선택 창. 클릭(pointerup)으로 열려 6.5.2 걱정이 없다.',
        screenReader:
          'combobox(네이티브 select) — 레이블·선택된 값·"n개 중 m번째" 를 보조기기가 직접 읽는다. placeholder 는 값이 빈 고를 수 없는 첫 항목.',
        yours: '목록 모양·항목 아이콘을 꾸밀 수 없다(운영체제 창). 꾸며야 하면 Select.',
      },
      {
        name: 'Combobox',
        keyboard:
          '입력하면 목록이 걸러진다. ↓/↑ 열기·이동(비활성 항목 건너뜀), Enter 선택(목록이 열려 있으면 폼 제출 대신), Esc 닫기, Tab 은 닫고 다음으로. 글자를 모두 지우고 닫으면(Enter·Esc·Tab) 선택이 지워진다.',
        screenReader:
          'combobox(aria-autocomplete="list") + listbox. 포커스는 입력에 둔 채 aria-activedescendant 로 현재 항목을 알린다. "결과가 없어요" 는 처음부터 있는 숨은 status 영역에, 입력이 0.8초 멈춘 뒤 넣어 읽힌다(새로 생긴 live region·입력과 같은 순간의 변경은 VoiceOver 가 읽지 않음 — VoiceOver+Safari 수동 확인 2026-10-21). clearable 의 "선택 지우기" 버튼은 마우스용이라 Tab 순서에서 빠진다(키보드는 글자를 지워서 지운다).',
      },
      {
        name: 'Slider',
        keyboard: '←/→·↑/↓ 한 단계, PageUp/PageDown 큰 단계, Home/End 최소·최대.',
        screenReader:
          'slider, 현재 값·최소·최대. 범위 슬라이더는 손잡이마다 "최소"/"최대" 가 이름에 붙는다. formatValue 가 화면 값과 aria-valuetext 에 함께 쓰인다.',
        yours: '값에 단위가 있으면 formatValue 를 준다 (예: v => `${v.toLocaleString()}원`).',
      },
      {
        name: 'DatePicker',
        keyboard:
          '숫자만 입력하면 YYYY-MM-DD 로 서식. "달력 열기" 버튼으로 열면 선택된(없으면 오늘) 날짜에 포커스, Esc 로 닫고 버튼으로 복귀.',
        screenReader:
          '입력 + "달력 열기" 버튼. 잘못된 날짜·범위 밖·덜 입력은 helperText 로 이유를 알리고 aria-invalid. 달력은 아래 Calendar 와 같다.',
      },
      {
        name: 'DateRangePicker',
        keyboard: '시작일·종료일 칸은 DatePicker 와 같다. 빠른 선택은 버튼(Enter·Space)으로 두 칸을 한 번에 채운다.',
        screenReader:
          'fieldset(legend 가 이름) 안에 "시작일"·"종료일" 칸. 시작일이 종료일보다 늦으면 그 칸이 aria-invalid + 이유. 빠른 선택은 group "빠른 선택", 현재 기간과 같은 버튼은 aria-pressed=true. "~" 는 숨김.',
        yours: '조회 결과가 바뀌면 개수를 role="status" 로 알린다.',
      },
      {
        name: 'Calendar',
        keyboard:
          '날짜 하나만 Tab 정지점. 화살표 하루/한 주, Home/End 주의 처음·끝, PageUp/PageDown 한 달, Shift+PageUp/PageDown 한 해, Enter·Space 선택.',
        screenReader:
          'grid, 달 제목이 grid 이름이고 달이 바뀌면 aria-live 로 알림. 날짜 이름은 화면 숫자로 시작("15, 2026년 10월 목요일"), 오늘·공휴일·선택(aria-selected)·선택 불가(aria-disabled) 포함.',
      },
    ],
  },
  {
    group: '한국 서비스 키트',
    items: [
      {
        name: 'PhoneNumberInput · BusinessNumberInput · AmountInput',
        keyboard:
          '하이픈·쉼표는 자동. 서식 문자 뒤에서 Backspace/Delete 를 누르면 그 너머 숫자를 지운다(커서 위치 유지).',
        screenReader:
          '모바일에서 숫자 키패드(전화번호는 inputMode="tel", 나머지는 "numeric"). AmountInput 은 "12만 3,400원" 같은 한글 금액을 helperText 로 함께 읽는다. 사업자번호는 검증 실패를 aria-invalid + 문구로.',
      },
      {
        name: 'VerificationCodeInput',
        keyboard:
          '입력 하나라 붙여넣기·자동 채우기(autoComplete="one-time-code")가 그대로 된다. 숫자 외 글자는 걸러진다.',
        screenReader:
          '안내("6자리 숫자를 입력하세요.")를 aria-describedby 로. 남은 시간은 timer 역할이라 매초 읽지 않고, 만료되면 항상 있는 status 영역에 문구를 넣어 한 번 알린다. 글자 칸은 화면용(숨김).',
        yours: '만료 시간은 충분히 (KWCAG 6.3.1 — 연장 수단인 재전송 버튼 제공).',
      },
      {
        name: 'AgreementGroup',
        keyboard: '체크박스는 Space, "보기" 버튼으로 약관 펼침.',
        screenReader:
          'fieldset(legend = label). "전체 동의" 는 일부 선택 시 혼합 상태. 항목 이름이 "필수 서비스 이용약관" 처럼 필수/선택으로 시작. 보기 버튼은 aria-expanded·aria-controls, 펼친 약관은 이름 있는 region(스크롤 가능하면 포커스 가능).',
      },
      {
        name: 'AddressInput',
        keyboard: '"주소 검색" 버튼 → 검색 창(Modal)에서 선택 → 상세 주소 입력으로 포커스 이동.',
        screenReader:
          'fieldset. 우편번호·기본 주소는 읽기 전용 입력이라 값이 읽힌다. 검색 스크립트 로딩·실패는 status 로.',
        yours: '카카오 우편번호 화면 자체의 접근성은 공급자 몫 — 직접 입력이 필요한 서비스는 대안을 둔다.',
      },
    ],
  },
  {
    group: '오버레이',
    items: [
      {
        name: 'Modal · Drawer',
        keyboard:
          '열리면 안으로 포커스, Tab 이 안에서만 돈다(포커스 가둠), Esc 로 닫고 연 요소로 포커스 복귀(trigger 없이 제어해도 복귀).',
        screenReader: 'dialog, title 이 이름·description 이 설명. 열려 있는 동안 바깥 내용은 스크린리더에서 숨겨진다.',
        yours: 'title 은 꼭 준다. 닫기 버튼을 숨기면 다른 닫기 수단을 둔다.',
      },
      {
        name: 'Popover',
        keyboard: '열리면 안으로 포커스, Esc 로 닫고 트리거로 복귀. 바깥을 누르면 닫힘.',
        screenReader: 'dialog(비모달). title 또는 aria-label 이 이름.',
      },
      {
        name: 'DropdownMenu',
        keyboard:
          'Enter·Space·↓ 로 열면 첫 항목, 화살표 이동(비활성 건너뜀), 글자 입력으로 찾기, Enter 실행, Esc 닫고 트리거로 복귀. 체크·라디오 항목은 Enter·Space 로 바꿈. 하위 메뉴는 →·Enter·Space 로 열어 첫 항목, ← 로 닫고 여는 항목으로 복귀.',
        screenReader:
          'menu / menuitem / group. 체크 항목은 menuitemcheckbox, 라디오 항목은 menuitemradio + aria-checked(일부 선택은 mixed). 하위 메뉴를 여는 항목은 aria-haspopup="menu" + aria-expanded. 단축키·체크·화살표 표시는 이름에 섞이지 않게 숨김.',
        yours:
          '메뉴는 "동작" 목록 — 페이지 이동 목록은 링크 목록(nav)으로. 체크 항목을 여러 개 이어서 바꾸게 하려면 onSelect 에서 preventDefault 로 열어 둔다. 하위 메뉴는 한 단계까지만.',
      },
      {
        name: 'Tooltip',
        keyboard:
          '트리거에 포커스·마우스를 올리면 표시, Esc 로 닫힘. 툴팁 위로 마우스를 옮겨도 유지(KWCAG 6.1.4 계열).',
        screenReader: '트리거의 설명(aria-describedby)으로 읽힌다.',
        yours: '꼭 필요한 정보는 툴팁에만 두지 않는다 (터치 기기에서는 보기 어렵다).',
      },
      {
        name: 'Toast',
        keyboard: 'F8 로 알림 영역에 포커스, 포커스·마우스가 머무는 동안 자동 닫힘 멈춤, Esc 닫기.',
        screenReader: '알림 영역(region "알림") + 내용이 즉시 읽힘. action 은 altText 로 대체 방법을 알린다.',
        yours: '되돌리기 같은 중요한 동작은 토스트에만 두지 않는다 (사라진다).',
      },
    ],
  },
  {
    group: '탐색·구조',
    items: [
      {
        name: 'Stepper',
        keyboard: '포커스를 받지 않는다 (표시용). 단계 이동은 "이전"·"다음" 버튼으로.',
        screenReader:
          '순서 목록(ol, 이름 "진행 단계") — "4개 중 2번째" 를 읽는다. 현재 단계는 aria-current="step", 완료한 단계는 "(완료)" 를 함께 읽고, 원 안의 숫자·체크는 숨김.',
        yours: '단계가 바뀌면 새 단계의 제목(h1 등)으로 포커스를 옮겨 바뀐 것을 알린다.',
      },
      {
        name: 'Tabs',
        keyboard:
          'Tab 으로 탭 목록에 들어가면 선택된 탭, ←/→ 이동하며 전환(세로 orientation 이면 ↑/↓), Home/End. 비활성 탭은 건너뜀.',
        screenReader: 'tablist(aria-orientation 가로·세로) / tab(선택 상태) / tabpanel 연결.',
        yours:
          '탭이 많거나 이름이 길어 가로로 넘치면 orientation="vertical" — 좁은 화면에서는 가로로 바꾸거나 Select 를 검토한다.',
      },
      {
        name: 'Accordion',
        keyboard: 'Enter·Space 로 펼침, ↑/↓·Home/End 로 머리글 사이 이동.',
        screenReader: '머리글 button 의 aria-expanded, 본문은 머리글로 이름 붙은 region.',
      },
      {
        name: 'SkipLink',
        keyboard:
          '페이지에서 첫 Tab 에 왼쪽 위에 나타나고, Enter 로 본문으로 포커스가 간다. macOS Safari 는 기본 설정에서 Tab 이 링크를 건너뛰어 Option+Tab(또는 설정 "Tab 키로 각 항목 강조")으로 닿는다 — 브라우저 동작.',
        screenReader: 'link "본문 바로가기". 숨김은 위치로만 해서(display:none 아님) Tab·스크린리더 모두 닿는다.',
        yours: '페이지 맨 앞에 두고 본문 요소에 id="main"(기본 href) 을 준다.',
      },
      {
        name: 'Breadcrumb',
        keyboard: '링크를 Tab 으로.',
        screenReader: 'nav "이동 경로", 현재 페이지는 aria-current="page". 구분자는 숨김.',
      },
      {
        name: 'Pagination',
        keyboard: '버튼을 Tab 으로, Enter·Space.',
        screenReader:
          'nav "페이지 탐색", 현재 페이지 aria-current, 버튼 이름 "3 페이지"·"이전 페이지". 생략(…)은 숨김.',
      },
      {
        name: 'Table',
        keyboard: '넘치면 스크롤 영역에 포커스가 가서 화살표로 스크롤. 정렬 가능한 머리글은 버튼.',
        screenReader:
          'caption 이 표·스크롤 영역 이름. 정렬 상태는 aria-sort. 행 머리글은 TableHead(scope). TableEmpty 는 표 전체 폭의 안내 셀, TableSkeleton 행은 숨김(표에 aria-busy).',
        yours:
          'caption(또는 aria-label)을 준다. 레이아웃용으로 표를 쓰지 않는다. 검색·필터로 결과가 바뀌면 개수를 role="status" 로 알린다. 행 선택 체크박스 이름은 "○○ 선택" (useTableSelection).',
      },
    ],
  },
  {
    group: '상태 표시',
    items: [
      {
        name: 'ErrorSummary',
        keyboard:
          '나타나면(또는 focusKey 가 바뀌면) 요약으로 포커스. 링크(Enter)로 해당 칸에 간다 — 묶음은 선택된·첫 항목, FileUpload 는 "파일 선택" 버튼(focusField).',
        screenReader:
          '포커스를 받은 묶음의 이름이 제목("입력한 내용에 고칠 곳이 N개 있어요")이라 제목과 목록을 읽는다. role="alert" 는 쓰지 않는다(포커스와 함께 쓰면 두 번 읽힘).',
        yours:
          '칸마다 error·helperText 도 함께 준다. react-hook-form 은 shouldFocusError: false + focusKey={submitCount}.',
      },
      {
        name: 'Alert',
        keyboard: '닫기 버튼(onClose 를 줄 때).',
        screenReader:
          '기본은 역할 없음(처음부터 있는 안내). 동작 뒤에 새로 나타나면 role="alert"(긴급) 또는 role="status" 를 넘긴다. 아이콘은 숨기고 의미는 글자로.',
      },
      {
        name: 'Progress',
        keyboard: '포커스를 받지 않는다.',
        screenReader: 'progressbar, 값·최대(aria-valuetext 로 "40%"), label 이 이름. value=null 이면 진행률 모름.',
      },
      {
        name: 'Spinner',
        keyboard: '포커스를 받지 않는다.',
        screenReader: 'status "로딩 중". label="" 이면 장식(숨김) — 바깥에서 상태를 알릴 때(Button loading).',
      },
      {
        name: 'Skeleton',
        keyboard: '포커스를 받지 않는다.',
        screenReader: '숨김(aria-hidden).',
        yours: '로딩 중인 영역에 aria-busy="true" 를 붙인다.',
      },
      {
        name: 'Badge · Avatar',
        keyboard: '포커스를 받지 않는다.',
        screenReader:
          'Badge 는 글자 그대로. Avatar 는 alt 또는 name 이 있으면 img 와 그 이름(이미지 로딩·실패와 관계없이 같은 이름, 실패 시 화면은 이니셜), 없으면 장식으로 숨김.',
        yours: '색만으로 상태를 구분하지 않게 Badge 글자에 상태를 쓴다.',
      },
    ],
  },
  {
    group: '레이아웃·글자',
    items: [
      {
        name: 'Stack · Card · Divider · Typography',
        keyboard: '포커스를 받지 않는다.',
        screenReader:
          '의미 없는 div 가 기본 — as 로 section·ul·h2 등 의미 요소를 고른다. Typography 의 variant(모양)와 as(제목 단계)는 따로. Divider 는 기본 separator, 꾸밈용이면 decorative 로 숨긴다.',
        yours: '제목 단계(h1~h6)는 모양이 아니라 문서 구조로 정한다.',
      },
      {
        name: 'DescriptionList',
        keyboard: '포커스를 받지 않는다.',
        screenReader:
          'dl 안의 dt·dd 쌍 — 이름과 값을 짝지어 읽는다(목록·항목 수를 알리는 스크린리더도 있다). aria-label 로 목록 이름을 줄 수 있다.',
        yours: '같은 종류의 여러 줄을 비교해야 하면 Table.',
      },
      {
        name: 'VisuallyHidden',
        keyboard: '포커스를 받지 않는다.',
        screenReader:
          '화면에는 안 보이지만 읽힌다(위치로 숨김, display:none 아님). 아이콘만 있는 열 머리글·보충 설명에.',
        yours: '버튼·링크의 이름은 aria-label 이 더 간단하다. 보이는 글자와 다른 이름을 붙이지 않는다(KWCAG 6.5.3).',
      },
    ],
  },
];
