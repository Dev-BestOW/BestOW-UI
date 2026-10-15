import * as RadixAvatar from '@radix-ui/react-avatar';
import { UserIcon } from '@bestow-ui/icons';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Avatar.css';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** 이미지 주소. 없거나 불러오지 못하면 fallback 을 보여 준다 */
  src?: string;
  /** 스크린리더가 읽을 이름. 없으면 `name` 을 쓰고, 둘 다 없으면 장식용으로 숨긴다 */
  alt?: string;
  /** 사용자 이름. fallback 이니셜과 기본 접근 가능한 이름에 쓴다 */
  name?: string;
  /** fallback 을 직접 지정한다 (기본: 이니셜 → 사용자 아이콘) */
  fallback?: ReactNode;
  /** 크기 (sm 28px, md 36px, lg 48px) */
  size?: 'sm' | 'md' | 'lg';
  /** 모양 */
  shape?: 'circle' | 'square';
}

/** "Jane Doe" → "JD", "홍길동" → "홍", "bestow" → "B" */
export function getInitials(name: string): string {
  const [a = '', b = ''] = name.trim().split(/\s+/);
  const first = (word: string) => Array.from(word)[0] ?? '';
  return (first(a) + first(b)).toUpperCase();
}

export const Avatar = /* @__PURE__ */ forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, name, fallback, size, shape, className, ...rest },
  ref,
) {
  const label = alt ?? name;
  // 이미지 로딩 상태와 관계없이 같은 이름을 읽도록 이름은 바깥 요소에 둔다
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  const initials = name ? getInitials(name) : '';

  return (
    <RadixAvatar.Root ref={ref} className={cx(styles.root({ size, shape }), className)} {...a11y} {...rest}>
      {src && <RadixAvatar.Image src={src} alt="" className={styles.image} />}
      <RadixAvatar.Fallback className={styles.fallback}>
        {fallback ?? (initials || <UserIcon size="60%" />)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});
