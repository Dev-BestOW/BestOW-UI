import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { opacity } from '@bestow-ui/tokens';
import { vars } from '../theme/contract.css';
import { createTheme, themeToStyle } from '../theme/createTheme';

// 비활성 투명도는 모든 컴포넌트가 vars.opacity.disabled 하나를 쓴다(2.0 — 1.x 에는 0.4·0.5·0.6 이 섞여 있었다).
// 숫자를 직접 적으면 여기서 실패한다. 비활성이 아닌 흐림(정렬 안 된 열 아이콘, 진행률 모름 상태)만 예외.
const NOT_DISABLED = new Set(['Progress', 'Table']);

describe('비활성 투명도', () => {
  const root = resolve(import.meta.dirname, '../components');

  it('토큰 값은 0.5 이고 CSS 변수 --bestow-opacity-disabled 로 나간다', () => {
    expect(opacity.disabled).toBe('0.5');
    expect(vars.opacity.disabled).toBe('var(--bestow-opacity-disabled)');
  });

  it('테마로 한 번에 바꿀 수 있다 (MIGRATION-2.0 의 예)', () => {
    const style = themeToStyle(createTheme({ common: { opacity: { disabled: '0.6' } } }), 'light');
    expect(style).toEqual({ '--bestow-opacity-disabled': '0.6' });
  });

  it('컴포넌트 스타일에 투명도 숫자를 직접 적지 않는다', () => {
    const offenders = readdirSync(root).flatMap((name) => {
      if (NOT_DISABLED.has(name)) return [];
      const files = readdirSync(resolve(root, name)).filter((file) => file.endsWith('.css.ts'));
      return files.flatMap((file) => {
        const code = readFileSync(resolve(root, name, file), 'utf8');
        // 애니메이션의 0·1 은 비활성과 무관하다
        return [...code.matchAll(/opacity:\s*(0?\.\d+)/g)].map((match) => `${name}/${file}: ${match[0]}`);
      });
    });
    expect(offenders).toEqual([]);
  });

  it('비활성 스타일을 가진 컴포넌트는 토큰을 쓴다', () => {
    const users = readdirSync(root).filter((name) =>
      readdirSync(resolve(root, name)).some(
        (file) =>
          file.endsWith('.css.ts') && readFileSync(resolve(root, name, file), 'utf8').includes('vars.opacity.disabled'),
      ),
    );
    expect(users.sort()).toEqual(
      [
        'Accordion',
        'Button',
        'Calendar',
        'Checkbox',
        'DropdownMenu',
        'Input',
        'Pagination',
        'RadioGroup',
        'Select',
        'SegmentedControl',
        'Slider',
        'Switch',
        'Tabs',
        'Textarea',
        'VerificationCodeInput',
      ].sort(),
    );
  });
});
