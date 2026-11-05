import { style } from '@vanilla-extract/css';

/** 브라우저 기본 지우기(×)·돋보기를 숨긴다 — 직접 그린 지우기 버튼과 겹치지 않게 */
export const input = style({
  selectors: {
    '&::-webkit-search-cancel-button': { appearance: 'none', display: 'none' },
    '&::-webkit-search-decoration': { appearance: 'none' },
  },
});
