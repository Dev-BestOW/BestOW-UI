import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from '@bestow-ui/icons';
import { cx } from '../../utils/cx';
import * as styles from './Alert.css';

type AlertColor = 'primary' | 'neutral' | 'danger' | 'success' | 'warning';

const defaultIcons: Record<AlertColor, typeof InfoIcon> = {
  primary: InfoIcon,
  neutral: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  danger: CircleAlertIcon,
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title'> {
  /** 시각적 스타일 */
  variant?: 'soft' | 'outline' | 'solid';
  /** 의미 색상. primary 는 일반 안내(info) 로 쓴다 */
  color?: AlertColor;
  /** 굵게 표시되는 제목 */
  title?: ReactNode;
  /** 앞에 표시할 아이콘. 생략하면 color 에 맞는 기본 아이콘, false 면 표시하지 않는다 (장식용 — 의미는 텍스트로 전달) */
  icon?: ReactNode | false;
  /** 오른쪽에 둘 버튼 등 */
  action?: ReactNode;
  /** 넘기면 닫기(X) 버튼을 표시하고, 누르면 호출한다. 실제로 숨기는 것은 사용하는 쪽이 한다 */
  onClose?: () => void;
  /** 닫기 버튼의 접근 가능한 이름 */
  closeLabel?: string;
}

/**
 * 페이지 안에 고정으로 보여 주는 안내 문구. 기본으로 role 이 없다.
 * 사용자 동작 뒤에 새로 나타나는 메시지라면 스크린리더가 바로 읽도록 `role="alert"`(중요·긴급) 또는
 * `role="status"`(일반 알림)를 넘긴다. 잠깐 떴다 사라지는 알림은 Toast 를 쓴다.
 */
export const Alert = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant, color = 'primary', title, icon, action, onClose, closeLabel = '닫기', className, children, ...rest },
  ref,
) {
  const DefaultIcon = defaultIcons[color];
  const iconNode = icon === undefined ? <DefaultIcon size={18} /> : icon;

  return (
    <div ref={ref} className={cx(styles.alert({ variant, color }), className)} {...rest}>
      {iconNode !== false && iconNode !== null && (
        <span className={styles.icon} aria-hidden>
          {iconNode}
        </span>
      )}
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div className={styles.description}>{children}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
      {onClose && (
        <button type="button" className={styles.closeButton} aria-label={closeLabel} onClick={onClose}>
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
});
