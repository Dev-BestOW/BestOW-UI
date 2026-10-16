/**
 * 서버 컴포넌트에서도 부를 수 있는 함수·값 (hook·Context·Radix 를 쓰지 않는 모듈만).
 * 빌드(ESM)에서 "use client" 가 붙지 않는 파일로 나가, Next.js 서버 컴포넌트에서 createTheme() 등을 바로 호출할 수 있다.
 * 여기에 넣는 모듈은 React hook·createContext·Radix 를 import 하면 안 된다 (서버에서 실행됨).
 */
export { vars, themeClass, type ThemeName, type ThemeTokens } from './theme/contract.css';
export { createIntentColors, contrastRatio, type IntentName } from './theme/color';
export {
  createTheme,
  type BestowTheme,
  type DeepPartial,
  type ThemeInput,
  type ThemeOverrides,
} from './theme/createTheme';
export { en } from './i18n/en';
export {
  formatBusinessNumber,
  formatKoreanAmount,
  formatPhoneNumber,
  isValidBusinessNumber,
} from './utils/koreanFormat';
export { formatKoreanDate, parseISODate, toISODate } from './utils/date';
export {
  composeExtraAddress,
  kakaoPostcodeProvider,
  type AddressProvider,
  type AddressSearchResult,
} from './components/AddressInput/addressProviders';
export { hasAllRequiredAgreements, type AgreementItem } from './components/AgreementGroup/agreements';
