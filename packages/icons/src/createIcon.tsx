import { createElement, forwardRef, type ForwardRefExoticComponent, type RefAttributes, type SVGProps } from 'react';

export type IconNode = Array<[tag: string, attrs: Record<string, string>]>;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'children'> {
  /** 가로·세로 크기. 숫자는 px, 문자열은 CSS 값 (예: "1em") */
  size?: number | string;
  /** 선 두께 */
  strokeWidth?: number | string;
  /**
   * 스크린리더가 읽을 이름. 없으면 장식용 아이콘으로 보고 aria-hidden 처리한다.
   * 아이콘만 있는 버튼이라면 버튼 쪽에 aria-label 을 주는 것이 더 좋다.
   */
  title?: string;
}

export type Icon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

const defaultAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function createIcon(name: string, node: IconNode, overrides?: Record<string, string>): Icon {
  // hook 을 쓰지 않아서 React Server Component 에서도 그대로 쓸 수 있다.
  const Component = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = 24, strokeWidth, title, ...rest },
    ref,
  ) {
    const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };
    return createElement(
      'svg',
      {
        ref,
        ...defaultAttrs,
        ...overrides,
        ...(strokeWidth !== undefined && { strokeWidth }),
        width: size,
        height: size,
        focusable: 'false',
        'data-icon': name,
        ...a11y,
        ...rest,
      },
      title ? createElement('title', null, title) : null,
      ...node.map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs })),
    );
  });
  Component.displayName = `${name}Icon`;
  return Component;
}
