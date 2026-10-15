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
