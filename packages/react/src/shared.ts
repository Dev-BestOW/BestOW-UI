/**
 * 서버 컴포넌트에서도 부를 수 있는 함수·값·컴포넌트 (hook·Context·Radix 를 쓰지 않는 모듈만).
 * 빌드(ESM)에서 "use client" 가 붙지 않는 파일로 나가, Next.js 서버 컴포넌트에서 createTheme() 등을 바로 호출할 수 있다.
 * 여기에 넣는 모듈은 React hook(서버에서도 되는 useId 제외)·createContext·Radix·이벤트 핸들러·useMessages 를 쓰면 안 된다
 * (서버에서 실행됨). 컴포넌트에 이런 것을 더하게 되면 client.ts 로 옮긴다 — 같은 이름을 양쪽에서 export 하면 안 된다.
 */
export { vars, themeClass, type ThemeMode, type ThemeName, type ThemeTokens } from './theme/contract.css';
export { createIntentColors, contrastRatio, type IntentName } from './theme/color';
export {
  createTheme,
  type BestowTheme,
  type DeepPartial,
  type ThemeInput,
  type ThemeOverrides,
} from './theme/createTheme';
export { strongInputBorders } from './theme/presets';
export { en } from './i18n/en';
// 한국 서비스 서식·검증 함수는 @bestow-ui/korean-utils 로 옮겼다(1.6). 예전처럼 여기서도 같은 이름으로 쓸 수 있게 다시 export 한다.
export {
  formatBusinessNumber,
  formatKoreanAmount,
  formatKoreanDate,
  formatPhoneNumber,
  isValidBusinessNumber,
} from '@bestow-ui/korean-utils';
// 1.7 에 korean-utils 에 추가한 주민번호·마스킹 함수 — react 만 설치한 사용자도 같은 이름으로 쓴다
export {
  formatResidentNumber,
  isValidResidentNumber,
  maskCardNumber,
  maskDigits,
  maskName,
  maskPhoneNumber,
  maskResidentNumber,
  parseResidentNumber,
  type ResidentNumberInfo,
} from '@bestow-ui/korean-utils';
export { parseISODate, toISODate } from './utils/date';
export { media, type Breakpoint, type Responsive } from './utils/responsive';
export {
  composeExtraAddress,
  kakaoPostcodeProvider,
  type AddressProvider,
  type AddressSearchResult,
} from './components/AddressInput/addressProviders';
export { hasAllRequiredAgreements, type AgreementItem } from './components/AgreementGroup/agreements';

// hook·이벤트 핸들러가 없는 표시용 컴포넌트 — 서버 컴포넌트로 렌더링된다(클라이언트 JS 없음, `as` 에 서버 컴포넌트도 넘길 수 있음).
// playground 첫 페이지가 `as` 에 서버 함수를 넘겨 빌드로 확인한다(클라이언트 컴포넌트면 "Functions cannot be passed" 로 실패).
export * from './components/Badge';
export * from './components/Card';
export * from './components/Container';
export * from './components/DescriptionList';
export {
  dateRangePresets,
  presetRange,
  type DateRange,
  type DateRangePreset,
} from './components/DateRangePicker/presets';
export * from './components/Divider';
export * from './components/FormField';
export * from './components/Grid';
export * from './components/Progress';
export * from './components/Skeleton';
export * from './components/Stack';
export * from './components/Typography';
export * from './components/VisuallyHidden';
export { focusField } from './utils/focusField';
