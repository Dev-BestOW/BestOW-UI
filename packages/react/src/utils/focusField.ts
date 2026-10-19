const FOCUSABLE =
  'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/** 화면에 보이고 보조기술에서 숨기지 않은, Tab 으로 갈 수 있는 요소 */
function isUsable(element: Element): element is HTMLElement {
  return (
    element instanceof HTMLElement &&
    element.matches(FOCUSABLE) &&
    element.tabIndex >= 0 &&
    !element.closest('[aria-hidden="true"], [inert], [hidden]')
  );
}

function firstUsableIn(container: Element | null): HTMLElement | null {
  if (!container) return null;
  // 라디오·세그먼트처럼 하나를 고르는 묶음은 지금 선택된 항목으로 간다
  const checked = Array.from(container.querySelectorAll(':checked, [aria-checked="true"]')).find(isUsable);
  return checked ?? Array.from(container.querySelectorAll(FOCUSABLE)).find(isUsable) ?? null;
}

/**
 * 폼 칸으로 포커스를 옮긴다(오류 요약의 링크, 제출 실패 뒤 등). `target` 은 칸의 id 나 요소.
 * id 가 포커스할 수 없는 요소를 가리켜도 알맞은 곳을 찾는다 — RadioGroup·AgreementGroup 처럼 묶음이면 선택된(없으면 첫) 항목,
 * FileUpload 처럼 숨긴 input 이면 같은 묶음(role="group")의 버튼. 옮겼으면 true.
 */
export function focusField(target: string | HTMLElement | null | undefined): boolean {
  const element = typeof target === 'string' ? document.getElementById(target) : (target ?? null);
  if (!element) return false;
  const destination =
    (isUsable(element) ? element : null) ??
    firstUsableIn(element) ??
    firstUsableIn(element.closest('[role="group"], [role="radiogroup"], fieldset'));
  if (!destination) return false;
  destination.focus();
  return document.activeElement === destination;
}
