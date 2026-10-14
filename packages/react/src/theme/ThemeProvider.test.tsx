import { render, screen } from '@testing-library/react';
import { Modal } from '../components/Modal';
import { Tooltip } from '../components/Tooltip';
import { themeClass } from './contract.css';
import { ThemeProvider } from './ThemeProvider';

describe('ThemeProvider', () => {
  it('portal 로 렌더링되는 요소에도 현재 테마를 적용한다', () => {
    render(
      <ThemeProvider theme="dark">
        <Modal defaultOpen title="제목" />
        <Tooltip content="도움말" defaultOpen>
          <button>버튼</button>
        </Tooltip>
      </ThemeProvider>,
    );
    const dialog = screen.getByRole('dialog');
    // portal 이므로 ThemeProvider div 바깥(body 직속)에 렌더링된다
    expect(dialog.closest('[data-theme]')).toBeNull();
    expect(dialog.classList.contains(themeClass.dark)).toBe(true);
    expect(document.querySelector('[data-radix-popper-content-wrapper] > *')?.classList.contains(themeClass.dark)).toBe(true);
  });
});
