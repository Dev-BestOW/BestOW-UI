import { beforeEach } from 'vitest';

// 스토리 테스트는 테스트 러너 페이지 안의 iframe 에서 돈다. Firefox 는 iframe 창에 포커스가 없으면 안쪽 요소의 focus()·클릭 포커스가
// 반영되지 않아, CI Firefox 에서 포커스에 기대는 play(Combobox 열기·NumberInput 키보드·SkipLink)가 가끔 실패했다.
// 매 테스트 전에 이 창(iframe)에 포커스를 준다 — Chromium·WebKit 에서는 영향 없음.
beforeEach(() => {
  window.focus();
});
