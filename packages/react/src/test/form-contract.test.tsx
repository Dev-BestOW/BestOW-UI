import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import {
  AddressInput,
  AgreementGroup,
  AmountInput,
  BusinessNumberInput,
  Checkbox,
  CheckboxGroup,
  Combobox,
  DatePicker,
  DateRangePicker,
  FileUpload,
  NativeSelect,
  NumberInput,
  PasswordInput,
  PhoneNumberInput,
  RadioGroup,
  ResidentNumberInput,
  SearchInput,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Textarea,
  TextField,
  VerificationCodeInput,
} from '../index';
import type { AddressProvider } from '../components/AddressInput/addressProviders';

/**
 * 값을 받는 폼 컴포넌트가 네이티브 입력처럼 동작하는지 한곳에서 확인한다.
 * 새 폼 컴포넌트는 여기에 넣는다 — `name` prop 이 있는 컴포넌트가 빠지면 마지막 테스트가 실패한다.
 */
const options = [
  { value: 'a', label: '가' },
  { value: 'b', label: '나' },
];
const noProvider: AddressProvider = () => () => undefined;
const typeInto = (name: string, text: string) => (user: UserEvent) => user.type(screen.getByLabelText(name), text);
const clickOn = (role: 'checkbox' | 'radio', name: string) => (user: UserEvent) =>
  user.click(screen.getByRole(role, { name }));

interface Case {
  name: string;
  element: ReactElement;
  /** 값을 처음과 다르게 바꾼다 */
  change: (user: UserEvent) => Promise<unknown>;
}

const cases: Case[] = [
  { name: 'TextField', element: <TextField label="칸" name="f" />, change: typeInto('칸', '글자') },
  {
    name: 'PasswordInput',
    element: <PasswordInput label="칸" name="f" />,
    // 보기 버튼도 눌러 둔다 — reset 이면 다시 가려져야 한다(type 은 state() 의 controls 에 없어 화면 글자로는 못 잡으므로 아래 단위 테스트가 맡음)
    change: async (user) => {
      await user.type(screen.getByLabelText('칸'), '비밀');
      await user.click(screen.getByRole('button', { name: '비밀번호 보기' }));
    },
  },
  {
    name: 'SearchInput',
    element: <SearchInput label="칸" name="f" defaultValue="처음" />,
    change: typeInto('칸', '글자'),
  },
  {
    name: 'Textarea',
    element: <Textarea label="칸" name="f" showCount maxLength={10} />,
    change: typeInto('칸', '글자'),
  },
  {
    name: 'NativeSelect',
    element: <NativeSelect label="칸" name="f" options={options} placeholder="고르기" />,
    change: (user) => user.selectOptions(screen.getByLabelText('칸'), 'b'),
  },
  { name: 'Checkbox', element: <Checkbox label="칸" name="f" />, change: clickOn('checkbox', '칸') },
  {
    name: 'Switch',
    element: <Switch label="칸" name="f" />,
    change: (user) => user.click(screen.getByRole('switch', { name: '칸' })),
  },
  {
    name: 'PhoneNumberInput',
    element: <PhoneNumberInput label="칸" name="f" defaultValue="01011112222" />,
    change: typeInto('칸', '{Backspace}'),
  },
  {
    name: 'BusinessNumberInput',
    element: <BusinessNumberInput label="칸" name="f" />,
    change: typeInto('칸', '123'),
  },
  { name: 'AmountInput', element: <AmountInput label="칸" name="f" />, change: typeInto('칸', '1000') },
  { name: 'NumberInput', element: <NumberInput label="칸" name="f" defaultValue={1} />, change: typeInto('칸', '2') },
  {
    name: 'ResidentNumberInput',
    element: <ResidentNumberInput label="칸" name="f" defaultValue="900101" />,
    change: (user) => user.type(screen.getAllByRole('textbox')[0]!, '{Backspace}'),
  },
  {
    name: 'VerificationCodeInput',
    element: <VerificationCodeInput label="칸" name="f" length={4} />,
    change: (user) => user.type(document.querySelector('input')!, '12'),
  },
  {
    name: 'DatePicker',
    element: <DatePicker label="칸" name="f" today="2026-10-30" />,
    change: typeInto('칸', '20260101'),
  },
  {
    name: 'DateRangePicker',
    element: <DateRangePicker label="칸" startName="s" endName="e" today="2026-10-30" />,
    change: (user) => user.type(screen.getAllByRole('textbox')[0]!, '20260101'),
  },
  {
    name: 'Combobox',
    element: <Combobox label="칸" name="f" options={options} />,
    change: (user) => user.type(screen.getByRole('combobox', { name: '칸' }), '가{Enter}'),
  },
  {
    name: 'Select',
    element: <Select label="칸" name="f" options={options} />,
    change: async (user) => {
      await user.click(screen.getByRole('combobox', { name: '칸' }));
      await user.click(await screen.findByRole('option', { name: '나' }));
    },
  },
  {
    name: 'RadioGroup',
    element: <RadioGroup label="칸" name="f" options={options} defaultValue="a" />,
    change: clickOn('radio', '나'),
  },
  {
    name: 'SegmentedControl',
    element: <SegmentedControl aria-label="칸" name="f" options={options} defaultValue="a" />,
    change: clickOn('radio', '나'),
  },
  {
    name: 'CheckboxGroup',
    element: <CheckboxGroup label="칸" name="f" options={options} />,
    change: clickOn('checkbox', '가'),
  },
  {
    name: 'AgreementGroup',
    element: <AgreementGroup name="f" items={[{ value: 'a', label: '약관' }]} />,
    change: (user) => user.click(screen.getByRole('checkbox', { name: /약관/ })),
  },
  {
    name: 'Slider',
    element: <Slider label="칸" name="f" defaultValue={[10]} />,
    change: async (user) => {
      screen.getByRole('slider').focus();
      await user.keyboard('{ArrowRight}');
    },
  },
  {
    name: 'FileUpload',
    element: <FileUpload label="칸" name="f" />,
    change: (user) =>
      user.upload(document.querySelector<HTMLInputElement>('input[type="file"]')!, new File(['x'], 'a.txt')),
  },
  {
    name: 'AddressInput',
    element: (
      <AddressInput
        name="f"
        provider={noProvider}
        defaultValue={{ zonecode: '12345', address: '서울시', detail: '' }}
      />
    ),
    change: (user) => user.type(screen.getByRole('textbox', { name: /상세/ }), '101호'),
  },
];

const form = () => document.querySelector('form') as HTMLFormElement;
const submitted = () =>
  [...new FormData(form()).entries()].map(([key, value]) => [key, value instanceof File ? value.name : value]);
/** 화면과 제출 값을 모두 담는다 — 숨긴 input 만 돌아오고 보이는 칸이 남는 경우도 잡는다 */
const state = () =>
  JSON.stringify({
    submitted: submitted(),
    // 파일 입력의 value 는 user-event 가 고정해 reset 이 닿지 않는다(jsdom 한정) — 파일 목록은 text 로 확인한다
    controls: [
      ...form().querySelectorAll<HTMLInputElement>('input:not([type="file"]), textarea, select, [role="switch"]'),
    ].map((el) => [el.value, el.checked, el.getAttribute('aria-checked')]),
    text: form().textContent,
  });

describe.each(cases)('폼 계약 — $name', ({ element, change }) => {
  it('form.reset() 이면 화면과 제출 값이 처음으로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<form>{element}</form>);
    const initial = state();

    await change(user);
    expect(state(), '테스트가 값을 바꾸지 못했다').not.toBe(initial);

    await user.tab();
    act(() => form().reset());
    expect(state()).toBe(initial);

    // 내부 상태도 돌아왔다면 같은 조작이 다시 먹는다 (화면만 돌아오고 상태가 남으면 여기서 바뀌지 않는다)
    await change(user);
    expect(state()).not.toBe(initial);
  });

  it('fieldset disabled 안에서는 조작할 수 없고 제출되지 않는다', () => {
    render(
      <form>
        <fieldset disabled>{element}</fieldset>
      </form>,
    );
    const controls = [...form().querySelectorAll('input, button, select, textarea')];
    expect(controls.length).toBeGreaterThan(0);
    expect(controls.filter((control) => !control.matches(':disabled'))).toEqual([]);
    // Radix 가 span 으로 그리는 컨트롤은 네이티브 비활성이 닿지 않는다
    expect([...form().querySelectorAll('[tabindex="0"]:not(:disabled)')]).toEqual([]);
    expect(submitted()).toEqual([]);
  });
});

describe('form.reset() 과 알림', () => {
  it('비제어 모드는 값이 돌아갔음을 onValueChange 로 알린다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form>
        <PhoneNumberInput label="칸" onValueChange={onValueChange} />
      </form>,
    );
    await user.type(screen.getByLabelText('칸'), '010');
    onValueChange.mockClear();
    act(() => form().reset());
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  // 네이티브 reset 이 화면을 되돌려 주는 컴포넌트는 화면만 봐서는 내부 상태가 남은 것을 알 수 없다
  it.each([
    [
      'RadioGroup',
      (fn: () => void) => <RadioGroup label="칸" options={options} defaultValue="a" onValueChange={fn} />,
      clickOn('radio', '나'),
      'a',
    ],
    [
      'CheckboxGroup',
      (fn: () => void) => <CheckboxGroup label="칸" options={options} defaultValue={['a']} onValueChange={fn} />,
      clickOn('checkbox', '나'),
      ['a'],
    ],
  ])('비제어 %s 도 처음 값을 알린다', async (_, element, change, expected) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<form>{element(onValueChange)}</form>);
    await change(user);
    onValueChange.mockClear();
    act(() => form().reset());
    expect(onValueChange).toHaveBeenCalledWith(expected);
  });

  it.each([
    ['PhoneNumberInput', (fn: () => void) => <PhoneNumberInput label="칸" value="01011112222" onValueChange={fn} />],
    ['Switch', (fn: () => void) => <Switch label="칸" checked onCheckedChange={fn} />],
    ['Combobox', (fn: () => void) => <Combobox label="칸" options={options} value="a" onValueChange={fn} />],
    ['DatePicker', (fn: () => void) => <DatePicker label="칸" value="2026-01-01" onValueChange={fn} />],
    ['NumberInput', (fn: () => void) => <NumberInput label="칸" value={3} onValueChange={fn} />],
    ['SearchInput', (fn: () => void) => <SearchInput label="칸" value="사과" onValueChange={fn} />],
  ])('제어 모드 %s 는 값을 알리지 않는다 (react-hook-form reset 의 새 값을 덮어쓰면 안 된다)', (_, element) => {
    const onChange = vi.fn();
    render(<form>{element(onChange)}</form>);
    const before = state();
    act(() => form().reset());
    expect(onChange).not.toHaveBeenCalled();
    expect(state()).toBe(before);
  });

  it('제어 모드 DatePicker 는 입력 중이던 글자를 지운다', async () => {
    const user = userEvent.setup();
    render(
      <form>
        <DatePicker label="칸" value="" />
      </form>,
    );
    await user.type(screen.getByLabelText('칸'), '2026');
    act(() => form().reset());
    expect((screen.getByLabelText('칸') as HTMLInputElement).value).toBe('');
  });
});

it('react-hook-form reset(새 값) 이 Controller 로 연결한 컴포넌트에 그대로 들어간다', async () => {
  const user = userEvent.setup();
  function Example() {
    const { control, reset } = useForm({ defaultValues: { phone: '01011112222', on: false } });
    return (
      <form>
        <Controller
          name="phone"
          control={control}
          render={({ field: { ref, name, value, onChange } }) => (
            <PhoneNumberInput ref={ref} label="칸" name={name} value={value} onValueChange={onChange} />
          )}
        />
        <Controller
          name="on"
          control={control}
          render={({ field: { ref, value, onChange } }) => (
            <Switch ref={ref} label="알림" checked={value} onCheckedChange={onChange} />
          )}
        />
        <button type="button" onClick={() => reset({ phone: '01033334444', on: true })}>
          불러오기
        </button>
      </form>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: '불러오기' }));
  expect((screen.getByLabelText('칸') as HTMLInputElement).value).toBe('010-3333-4444');
  expect(screen.getByRole('switch', { name: '알림' }).getAttribute('aria-checked')).toBe('true');
});

it('fieldset disabled 안의 FileUpload 는 끌어다 놓은 파일을 받지 않는다', () => {
  const onValueChange = vi.fn();
  render(
    <form>
      <fieldset disabled>
        <FileUpload label="칸" onValueChange={onValueChange} />
      </fieldset>
    </form>,
  );
  const zone = form().querySelector('[data-disabled]')!;
  fireEvent.drop(zone, { dataTransfer: { files: [new File(['x'], 'a.txt')] } });
  expect(onValueChange).not.toHaveBeenCalled();
});

it('name prop 이 있는 컴포넌트는 모두 계약 테스트에 있다', () => {
  const root = resolve(import.meta.dirname, '../components');
  const withName = readdirSync(root).filter((name) => {
    if (name === 'Avatar') return false; // 사람 이름 — 폼 필드가 아니다
    try {
      return /\bname\?:/.test(readFileSync(resolve(root, name, `${name}.tsx`), 'utf8'));
    } catch {
      return false;
    }
  });
  expect(withName.filter((name) => !cases.some((c) => c.name === name))).toEqual([]);
});
