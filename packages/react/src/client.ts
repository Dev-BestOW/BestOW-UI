'use client';

/**
 * 컴포넌트·hook (클라이언트 전용). 함수·값은 shared.ts — 둘을 index.ts 가 합친다.
 * shared.ts 에 있는 이름을 여기서 다시 export 하면 안 된다 — Next.js 에서 같은 이름이 서버용·클라이언트 참조 두 가지가 되어
 * index 의 `export *` 가 모호해진다(이름이 사라짐). components/<Name>/index.ts 가 순수 함수도 export 하면 여기서는 직접 고른다.
 */
export { ThemeProvider, usePortalProps, useTheme, type ThemeProviderProps } from './theme/ThemeProvider';
export {
  LocaleProvider,
  useMessages,
  type BestowMessages,
  type LocaleProviderProps,
  type Messages,
} from './i18n/LocaleProvider';
export * from './components/Accordion';
export { AddressInput, type AddressInputProps, type AddressValue } from './components/AddressInput/AddressInput';
export { AgreementGroup, type AgreementGroupProps } from './components/AgreementGroup/AgreementGroup';
export * from './components/Alert';
export * from './components/AmountInput';
export * from './components/Avatar';
export * from './components/Breadcrumb';
export * from './components/BusinessNumberInput';
export * from './components/Button';
export * from './components/Calendar';
export * from './components/Checkbox';
export * from './components/Combobox';
export * from './components/DatePicker';
export * from './components/Drawer';
export * from './components/ErrorSummary';
export * from './components/FileUpload';
export * from './components/DropdownMenu';
export * from './components/IconButton';
export * from './components/Input';
export * from './components/Link';
export * from './components/Modal';
export * from './components/NumberInput';
export * from './components/Pagination';
export * from './components/PhoneNumberInput';
export * from './components/Popover';
export * from './components/RadioGroup';
export * from './components/SegmentedControl';
export * from './components/Select';
export * from './components/SkipLink';
export * from './components/Slider';
export * from './components/Stepper';
export * from './components/Spinner';
export * from './components/Switch';
export * from './components/Table';
export * from './components/Tabs';
export * from './components/Textarea';
export * from './components/Toast';
export * from './components/Tooltip';
export * from './components/VerificationCodeInput';
