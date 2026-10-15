import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Card.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** 시각적 스타일. elevated 는 테두리 + 그림자 */
  variant?: 'outline' | 'elevated' | 'soft';
  /** 안쪽 여백 (sm 16px, md 24px, lg 32px). 이미지를 가장자리까지 붙이려면 none */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** 렌더링할 요소 (기본 div). 목록이면 li, 독립된 콘텐츠면 article 등 */
  as?: ElementType;
}

/** 배경·테두리·radius·padding 을 가진 컨테이너. 자식 사이 간격은 16px. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { variant, padding, as: Component = 'div', className, ...rest },
  ref,
) {
  return <Component ref={ref} className={cx(styles.card({ variant, padding }), className)} {...rest} />;
});

export type CardSectionProps = HTMLAttributes<HTMLDivElement>;

/** 제목·설명 영역. Typography 와 함께 쓴다. */
export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader({ className, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.header, className)} {...rest} />;
});

/** 본문 영역 */
export const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(function CardBody({ className, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.body, className)} {...rest} />;
});

/** 버튼 등 동작 영역. 오른쪽 정렬 */
export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter({ className, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.footer, className)} {...rest} />;
});
