import { forwardRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button, type ButtonProps } from '../Button';
import * as styles from './IconButton.css';

// variant·color·size·loading 은 Button 과 같지만, Storybook 문서 생성기(react-docgen)가 Omit 으로 물려받은 타입을 풀지 못해
// 직접 선언한다 (그래야 자동 문서와 컨트롤에 선택지가 나온다)
export interface IconButtonProps extends Omit<
  ButtonProps,
  'startIcon' | 'endIcon' | 'fullWidth' | 'children' | 'variant' | 'color' | 'size' | 'loading'
> {
  /** 시각적 스타일 (기본 ghost) */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  /** 의미 색상 (기본 neutral) */
  color?: 'primary' | 'neutral' | 'danger';
  /** 크기. 버튼 32·40·48px, 아이콘 16·20·24px */
  size?: 'sm' | 'md' | 'lg';
  /** 진행 중 상태. 아이콘 자리에 스피너를 보여 주고 `aria-busy` 를 붙이며 클릭을 막는다 (포커스는 유지) */
  loading?: boolean;
  /** 버튼이 하는 일을 설명하는 이름 (예: "삭제"). 아이콘만으로는 스크린리더가 알 수 없어 필수다 */
  'aria-label': string;
  /** 아이콘. 크기는 버튼 size 에 맞춰 자동으로 조절된다 (sm 16px · md 20px · lg 24px) */
  children: ReactNode;
}

/**
 * 아이콘만 있는 정사각형 버튼. Button 과 같은 variant·color·size·loading 을 받고, 기본은 ghost·neutral 이다.
 * 마우스 사용자에게도 이름을 보여 주려면 Tooltip 으로 감싼다.
 */
export const IconButton = /* @__PURE__ */ forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', color = 'neutral', size, loading, className, children, ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      loading={loading}
      className={cx(styles.iconButton({ size }), className)}
      {...rest}
    >
      {/* loading 이면 Button 이 아이콘 자리에 스피너를 넣으므로 원래 아이콘은 뺀다 */}
      {!loading && children}
    </Button>
  );
});
