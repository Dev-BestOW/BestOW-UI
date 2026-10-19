// jsdom 에 없는 브라우저 API (Radix 의 위치 계산, Select 포인터 처리에 필요)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverMock as unknown as typeof ResizeObserver;

// `// @vitest-environment node` 테스트(ssr.test.tsx)에는 DOM 이 없다
if (typeof Element !== 'undefined') {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
}
