import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('열리면 내용을 tooltip 역할로 노출한다', () => {
    render(
      <Tooltip content="도움말" defaultOpen>
        <button>버튼</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip').textContent).toContain('도움말');
  });

  it('disabled 이면 children 만 렌더링한다', () => {
    render(
      <Tooltip content="도움말" defaultOpen disabled>
        <button>버튼</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.getByRole('button', { name: '버튼' })).toBeTruthy();
  });
});
