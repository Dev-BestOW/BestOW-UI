// 한국 키트 컴포넌트 문서(/components/<slug>/) — 쪽마다 직접 쓰는 글. 계획: docs/SEO-GEO-PLAN.md.
// props·키보드·스크린리더 절은 빌드 때 소스에서 읽어 온다(source.ts) — 여기에는 소스에 없는 글만 둔다.
// korean-utils 함수 쪽(guides.ts)과 겹치지 않게 "입력 칸으로서의 문제"(커서·지우기·붙여넣기·키패드·알림)를 쓴다.
// 실제 동작은 컴포넌트 소스·스토리·테스트에서 확인하고 쓴다. 동작을 바꾸면 여기도 고친다.

export interface KitPage {
  slug: string;
  /** 컴포넌트 이름 — packages/react/src/components/<name>/<name>.tsx 와 componentA11y.ts 항목에서 찾는다 */
  name: string;
  /** 제목(h1·<title>) — 검색어에 가깝게 */
  title: string;
  /** 머리말·meta description 에 쓰는 한두 문장 */
  summary: string;
  /** 무엇이 어려운가요 — 문단 */
  problem: string[];
  code: string;
  /** 알아 둘 점 */
  notes: string[];
  /** Storybook 문서의 `?path=` 값 */
  storybookPath: string;
  /** 같은 서식·검증 함수 쪽(/korean-utils/<utilsSlug>/) */
  utilsSlug?: string;
}

export const kitPages: KitPage[] = [
  {
    slug: 'phone-number-input',
    name: 'PhoneNumberInput',
    title: 'React 전화번호 입력 컴포넌트 — 하이픈 자동·커서 유지',
    summary:
      '입력하는 대로 010-1234-5678 처럼 하이픈을 넣고, 값은 숫자만 넘기는 React 입력 칸이에요. 중간을 고쳐도 커서가 제자리에 있고, 하이픈 뒤 Backspace·붙여넣기·휴대폰 전화 키패드까지 챙겼어요.',
    problem: [
      '입력값에 하이픈을 끼워 넣어 value 를 바꾸면, 가운데 숫자를 고칠 때 커서가 맨 끝으로 튀어요. 하이픈이 생기거나 빠지면서 글자 위치가 바뀌기 때문이에요.',
      '하이픈 바로 뒤에서 Backspace 를 누르면 하이픈만 지워졌다가 서식이 곧바로 다시 넣어요. 사용자에게는 아무리 눌러도 지워지지 않는 칸처럼 보여요.',
      '붙여 넣은 값(+82 10-1234-5678, 공백·괄호가 섞인 번호)과 브라우저 자동 완성 값도 같은 서식으로 맞춰야 하고, 서버에는 숫자만 보내야 해요. 휴대폰에서는 글자 자판이 아니라 전화 키패드가 떠야 하고요.',
    ],
    code: `import { PhoneNumberInput } from '@bestow-ui/react';
import { useState } from 'react';

export function SignupPhone() {
  const [phone, setPhone] = useState(''); // '01012345678' — 숫자만

  return (
    <PhoneNumberInput
      label="휴대폰 번호"
      required
      value={phone}
      onValueChange={setPhone}
      helperText="인증번호를 받을 번호예요"
    />
  );
}`,
    notes: [
      'value·onValueChange 는 숫자만 든 문자열이에요. 하이픈은 화면에만 있어요.',
      'name 을 주고 form 을 그대로 제출하면 화면 글자(010-1234-5678)가 가요. 서버에서는 korean-utils 의 phoneNumberDigits 로 숫자만 남기세요.',
      '자릿수가 모자란 번호를 오류로 막지는 않아요. 제출할 때 확인해서 error·helperText 로 알려 주세요.',
      '기본 레이블은 "휴대폰 번호", placeholder 는 "010-0000-0000" 이에요. 유선 번호도 받으면 label 을 바꾸세요. LocaleProvider 로 영어 문구를 쓸 수 있어요.',
      '앱에 styles.css 를 한 번 불러오고 ThemeProvider 로 감싸야 모양이 들어가요(시작 방법은 첫 화면).',
    ],
    storybookPath: '/docs/korean-kit-phonenumberinput--docs',
    utilsSlug: 'phone-number',
  },
];

export function findKitPage(slug: string): KitPage | undefined {
  return kitPages.find((page) => page.slug === slug);
}
