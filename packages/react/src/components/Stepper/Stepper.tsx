import { forwardRef, type OlHTMLAttributes, type ReactNode } from 'react';
import { CheckIcon } from '@bestow-ui/icons';
import { useMessages } from '../../i18n/LocaleProvider';
import { visuallyHidden } from '../../styles/visuallyHidden.css';
import { cx } from '../../utils/cx';
import * as styles from './Stepper.css';

export interface StepperStep {
  /** 단계 이름 */
  label: ReactNode;
  /** 이름 아래 보조 설명 */
  description?: ReactNode;
}

export interface StepperProps extends Omit<OlHTMLAttributes<HTMLOListElement>, 'children' | 'type' | 'start'> {
  /** 단계 목록 */
  steps: StepperStep[];
  /** 현재 단계 (0부터). 앞 단계는 완료로 표시한다. steps.length 면 모두 완료 */
  current: number;
  /** horizontal(기본): 가로로 나란히, 이름은 원 아래. vertical: 세로로, 이름은 원 오른쪽(설명이 길 때) */
  orientation?: 'horizontal' | 'vertical';
  /** 목록 이름 (기본 "진행 단계") */
  'aria-label'?: string;
}

/**
 * 여러 단계로 나뉜 흐름(가입·결제·신청)에서 지금 어디쯤인지 보여 주는 표시용 목록.
 * `<ol>` 이라 스크린리더가 "n개 중 m번째" 를 읽고, 현재 단계는 aria-current="step", 완료한 단계는 "(완료)" 를 함께 읽는다.
 * 단계를 눌러 이동하는 기능은 없다 — 이동은 "이전"·"다음" 버튼으로 둔다.
 */
export const Stepper = /* @__PURE__ */ forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, orientation = 'horizontal', 'aria-label': ariaLabel, className, ...rest },
  ref,
) {
  const m = useMessages();
  return (
    <ol
      ref={ref}
      aria-label={ariaLabel ?? m.steps ?? '진행 단계'}
      className={cx(styles.root({ orientation }), className)}
      {...rest}
    >
      {steps.map((step, index) => {
        const status = index < current ? 'complete' : index === current ? 'current' : 'upcoming';
        return (
          <li
            key={index}
            className={styles.step({ orientation })}
            data-status={status}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            <span className={styles.indicator({ status })} aria-hidden>
              {status === 'complete' ? <CheckIcon size={16} strokeWidth={2.5} /> : index + 1}
            </span>
            <span className={styles.text({ orientation })}>
              <span className={styles.label({ status })}>
                {step.label}
                {status === 'complete' && <span className={visuallyHidden}> ({m.stepCompleted ?? '완료'})</span>}
              </span>
              {step.description && <span className={styles.description}>{step.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
});
