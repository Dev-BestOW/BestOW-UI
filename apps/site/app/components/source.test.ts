import { describe, expect, test } from 'vitest';
import { kitPages } from './kit';
import { choosingFor, componentA11yFor, componentProps } from './source';

describe('componentProps', () => {
  test('인터페이스와 JSDoc 을 소스 그대로', () => {
    const props = componentProps('PhoneNumberInput');
    expect(props).toContain('export interface PhoneNumberInputProps');
    expect(props).toMatch(/\/\*\*/);
  });

  test('없는 컴포넌트는 빌드를 멈춘다', () => {
    expect(() => componentProps('NoSuchInput')).toThrow(/NoSuchInput/);
  });
});

describe('componentA11yFor', () => {
  test('묶음 항목에서 낱말이 정확히 같은 것', () => {
    expect(componentA11yFor('AmountInput').name).toContain('AmountInput');
    expect(componentA11yFor('DatePicker').name).toBe('DatePicker');
    // 앞쪽 'CardNumberInput · …' 항목에 글자로는 걸리지만, 정확한 항목은 뒤쪽 'Stack · … · Card · …'
    expect(componentA11yFor('Card').name).toContain('Container');
    expect(() => componentA11yFor('Picker')).toThrow(/Picker/);
  });

  test('없는 이름은 빌드를 멈춘다', () => {
    expect(() => componentA11yFor('NoSuchInput')).toThrow(/NoSuchInput/);
  });
});

test('choosingFor: 없으면 undefined', () => {
  expect(choosingFor('NoSuchInput')).toBeUndefined();
  expect(choosingFor('Combobox')?.when).toBeTruthy();
});

test('kitPages: slug 가 겹치지 않고 모든 쪽의 소스·접근성 정보를 찾는다', () => {
  expect(new Set(kitPages.map((p) => p.slug)).size).toBe(kitPages.length);
  for (const page of kitPages) {
    expect(() => componentProps(page.name)).not.toThrow();
    expect(() => componentA11yFor(page.name)).not.toThrow();
  }
});
