import { vars } from './contract.css';

function collect(node: unknown): string[] {
  if (typeof node === 'string') return [node.replace(/^var\((--[^)]+)\)$/, '$1')];
  return Object.values(node as Record<string, unknown>).flatMap(collect);
}

/**
 * CSS 변수 이름(--bestow-*)은 사용자가 CSS 로 덮어쓰는 공개 API 다 (1.0 에서 확정).
 * 이 테스트가 실패하면 토큰 키를 바꾸거나 지운 것 → breaking change 다. 새 토큰 **추가**는 목록에 더하면 된다(minor).
 */
describe('vars (공개 CSS 변수 이름)', () => {
  it('1.0 에서 확정한 이름을 모두 그대로 가진다', () => {
    const actual = collect(vars).sort();
    const expected = [
      // color
      '--bestow-color-bg-default',
      '--bestow-color-bg-inverse',
      '--bestow-color-bg-muted',
      '--bestow-color-bg-overlay',
      '--bestow-color-bg-subtle',
      '--bestow-color-border-default',
      '--bestow-color-border-focus',
      '--bestow-color-border-strong',
      '--bestow-color-danger-contrast',
      '--bestow-color-danger-solid',
      '--bestow-color-danger-solid-hover',
      '--bestow-color-danger-subtle',
      '--bestow-color-danger-subtle-hover',
      '--bestow-color-danger-text',
      '--bestow-color-fg-default',
      '--bestow-color-fg-inverse',
      '--bestow-color-fg-muted',
      '--bestow-color-fg-subtle',
      '--bestow-color-neutral-contrast',
      '--bestow-color-neutral-solid',
      '--bestow-color-neutral-solid-hover',
      '--bestow-color-neutral-subtle',
      '--bestow-color-neutral-subtle-hover',
      '--bestow-color-neutral-text',
      '--bestow-color-primary-contrast',
      '--bestow-color-primary-solid',
      '--bestow-color-primary-solid-hover',
      '--bestow-color-primary-subtle',
      '--bestow-color-primary-subtle-hover',
      '--bestow-color-primary-text',
      '--bestow-color-success-contrast',
      '--bestow-color-success-solid',
      '--bestow-color-success-solid-hover',
      '--bestow-color-success-subtle',
      '--bestow-color-success-subtle-hover',
      '--bestow-color-success-text',
      '--bestow-color-warning-contrast',
      '--bestow-color-warning-solid',
      '--bestow-color-warning-solid-hover',
      '--bestow-color-warning-subtle',
      '--bestow-color-warning-subtle-hover',
      '--bestow-color-warning-text',
      // duration
      '--bestow-duration-fast',
      '--bestow-duration-normal',
      '--bestow-duration-slow',
      // font
      '--bestow-font-family-mono',
      '--bestow-font-family-sans',
      '--bestow-font-line-height-normal',
      '--bestow-font-line-height-relaxed',
      '--bestow-font-line-height-tight',
      '--bestow-font-size-2xl',
      '--bestow-font-size-3xl',
      '--bestow-font-size-4xl',
      '--bestow-font-size-lg',
      '--bestow-font-size-md',
      '--bestow-font-size-sm',
      '--bestow-font-size-xl',
      '--bestow-font-size-xs',
      '--bestow-font-weight-bold',
      '--bestow-font-weight-medium',
      '--bestow-font-weight-regular',
      '--bestow-font-weight-semibold',
      // radius
      '--bestow-radius-full',
      '--bestow-radius-lg',
      '--bestow-radius-md',
      '--bestow-radius-none',
      '--bestow-radius-sm',
      '--bestow-radius-xl',
      // shadow
      '--bestow-shadow-lg',
      '--bestow-shadow-md',
      '--bestow-shadow-sm',
      // space
      '--bestow-space-0',
      '--bestow-space-1',
      '--bestow-space-10',
      '--bestow-space-12',
      '--bestow-space-16',
      '--bestow-space-2',
      '--bestow-space-3',
      '--bestow-space-4',
      '--bestow-space-5',
      '--bestow-space-6',
      '--bestow-space-8',
      // z
      '--bestow-z-index-dropdown',
      '--bestow-z-index-modal',
      '--bestow-z-index-overlay',
      '--bestow-z-index-toast',
      '--bestow-z-index-tooltip',
    ].sort();
    expect(actual).toEqual(expected);
  });
});
