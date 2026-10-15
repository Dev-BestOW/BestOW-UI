import { keyframes } from '@vanilla-extract/css';

export const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
export const fadeOut = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

export const scaleIn = keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});
export const scaleOut = keyframes({
  from: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  to: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
});

export const popIn = keyframes({
  from: { opacity: 0, transform: 'scale(0.96)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

export const slideInRight = keyframes({
  from: { transform: 'translateX(calc(100% + 24px))' },
  to: { transform: 'translateX(0)' },
});

export const reducedMotion = '(prefers-reduced-motion: reduce)';

export const spin = keyframes({ from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } });

export const shimmer = keyframes({
  from: { backgroundPosition: '100% 0' },
  to: { backgroundPosition: '-100% 0' },
});

// Radix Accordion/Collapsible 이 콘텐츠 높이를 CSS 변수로 넘겨준다
export const accordionDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});
export const accordionUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

// Progress(값을 모를 때): 막대 조각이 트랙을 왼쪽에서 오른쪽으로 지나간다
export const indeterminate = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(250%)' },
});
