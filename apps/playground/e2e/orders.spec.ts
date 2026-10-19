import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// 파일럿 화면(주문 관리)의 실제 사용 흐름 — 여러 컴포넌트를 함께 쓸 때의 문제를 잡는다
test.beforeEach(async ({ page }) => {
  await page.goto('/orders');
});

const table = (page: Page) => page.getByRole('table', { name: '주문 목록' });

test('검색 결과가 없으면 안내와 초기화 버튼, 초기화하면 다시 목록', async ({ page }) => {
  await page.getByRole('textbox', { name: '검색' }).fill('없는주문');
  await expect(page.getByText('조건에 맞는 주문이 없어요.')).toBeVisible();
  await page.getByRole('button', { name: '검색·필터 초기화' }).click();
  await expect(table(page).getByRole('row')).toHaveCount(11); // 머리 행 + 10건
});

test('상태 필터와 금액 정렬(aria-sort)', async ({ page }) => {
  await page.getByRole('combobox', { name: '상태' }).click();
  await page.getByRole('option', { name: '배송 중' }).click();
  const badges = table(page)
    .getByRole('cell')
    .filter({ hasText: /^(결제 완료|배송 중|배송 완료|취소)$/ });
  await expect(badges.first()).toHaveText('배송 중');
  expect(new Set(await badges.allTextContents())).toEqual(new Set(['배송 중']));

  const amountHeader = table(page).getByRole('columnheader', { name: /금액/ });
  await amountHeader.getByRole('button').click();
  await expect(amountHeader).toHaveAttribute('aria-sort', 'descending');
  await amountHeader.getByRole('button').click();
  await expect(amountHeader).toHaveAttribute('aria-sort', 'ascending');
});

test('여러 건을 골라 한 번에 취소하면 상태가 바뀌고 선택이 풀린다', async ({ page }) => {
  const rows = table(page).getByRole('row');
  const firstId = (await rows.nth(1).getByRole('cell').nth(1).textContent())!;
  await page.getByRole('checkbox', { name: `${firstId} 선택` }).check();
  await page
    .getByRole('checkbox', { name: /ORD-\d+ 선택/ })
    .nth(1)
    .check();
  await expect(page.getByText('2건 선택됨')).toBeVisible();
  await page.getByRole('button', { name: '선택한 주문 취소' }).click();
  await expect(page.getByText('주문 2건을 취소했어요').first()).toBeVisible();
  await expect(page.getByText('2건 선택됨')).toBeHidden();
  await expect(rows.nth(1).getByRole('cell').nth(4)).toHaveText('취소');
});

test('"이 페이지 모두 선택" 은 일부만 고르면 혼합 상태', async ({ page }) => {
  const all = page.getByRole('checkbox', { name: '이 페이지 모두 선택' });
  await page
    .getByRole('checkbox', { name: /ORD-\d+ 선택/ })
    .first()
    .check();
  await expect(all).toHaveJSProperty('indeterminate', true);
  await all.check();
  await expect(page.getByText('10건 선택됨')).toBeVisible();
});

test('행 메뉴 → 상세 보기는 Drawer 로 열리고, 닫으면 메뉴 버튼으로 돌아간다', async ({ page }) => {
  const menuButton = page.getByRole('button', { name: /ORD-\d+ 작업/ }).first();
  const id = (await menuButton.getAttribute('aria-label'))!.replace(' 작업', '');
  await menuButton.click();
  await page.getByRole('menuitem', { name: '상세 보기' }).click();
  const drawer = page.getByRole('dialog', { name: `주문 ${id}` });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText('연락처')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(menuButton).toBeFocused();
});

test('등록 폼: 빈 채로 제출하면 오류 요약에 포커스, 링크로 해당 칸에 가고, 고치면 등록된다', async ({ page }) => {
  await page.getByRole('button', { name: '주문 등록' }).click();
  const dialog = page.getByRole('dialog', { name: '주문 등록' });
  await dialog.getByRole('button', { name: '등록' }).click();

  // 오류 요약은 role="alert" 대신 포커스를 옮겨 읽게 한다(둘 다 쓰면 두 번 읽힌다)
  const summary = dialog.locator('[tabindex="-1"]').filter({ hasText: '고칠 곳이 4개' });
  await expect(summary).toBeFocused();
  await expect(dialog.getByRole('textbox', { name: '고객 이름' })).toHaveAttribute('aria-invalid', 'true');

  await summary.getByRole('link', { name: '연락처를 끝까지 입력해 주세요.' }).click();
  await expect(dialog.getByRole('textbox', { name: '연락처' })).toBeFocused();

  await dialog.getByRole('textbox', { name: '고객 이름' }).fill('테스트');
  await dialog.getByRole('textbox', { name: '연락처' }).fill('01098765432');
  await dialog.getByRole('combobox', { name: '상품' }).click();
  await page.getByRole('option', { name: '보조 배터리' }).click();
  await dialog.getByRole('textbox', { name: '결제 금액' }).fill('35000');
  await dialog.getByRole('button', { name: '등록' }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText(/주문 ORD-\d+을 등록했어요/).first()).toBeVisible();
  await expect(table(page).getByRole('cell', { name: '테스트' })).toBeVisible();
});
