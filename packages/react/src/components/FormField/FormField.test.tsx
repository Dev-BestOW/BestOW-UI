import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { FormField } from './FormField';

describe('FormField', () => {
  it('레이블·도움말·오류를 자식 입력에 연결한다', () => {
    render(
      <FormField label="회사명" helperText="사업자등록증의 이름" error required>
        {(field) => <input {...field} />}
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: '회사명' });
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    const helper = document.getElementById(input.getAttribute('aria-describedby')!);
    expect(helper?.textContent).toBe('사업자등록증의 이름');
    // * 는 장식 — 이름에 들어가지 않는다
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
  });

  it('id 를 주면 그 id 를 쓰고, 없는 상태 속성은 넘기지 않는다 (DOM 경고 없음)', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <FormField id="company" label="회사명">
        {(field) => <input {...field} />}
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: '회사명' });
    expect(input.id).toBe('company');
    for (const name of ['aria-invalid', 'aria-required', 'aria-describedby'])
      expect(input.hasAttribute(name)).toBe(false);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('둘째 인자의 labelId 로 label 을 쓸 수 없는 요소에도 이름을 준다', () => {
    render(
      <FormField label="근무 요일">
        {({ id }, { labelId }) => <div id={id} role="group" aria-labelledby={labelId} />}
      </FormField>,
    );
    expect(screen.getByRole('group', { name: '근무 요일' })).toBeTruthy();
  });

  it('서버에서도 렌더링된다 (hook 은 useId 뿐)', () => {
    const html = renderToString(
      <FormField label="이름" helperText="실명">
        {(field) => <input {...field} />}
      </FormField>,
    );
    expect(html).toContain('aria-describedby=');
    expect(html).toContain('실명');
  });
});
