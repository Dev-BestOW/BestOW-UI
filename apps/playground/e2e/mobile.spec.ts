import { expect, test } from './fixtures';

// 모바일(터치·좁은 화면) 시나리오 — playwright.config.ts 의 `<브라우저>-mobile` 프로젝트(Pixel 7·iPhone 15)에서만 돈다.
// 마우스가 아니라 탭(touch)으로 열고 고르며, 좁은 화면에서 가로 스크롤이 생기지 않는지 본다.
// 가상 키보드가 입력창을 가리는 문제 등 실제 기기에서만 보이는 것은 사람이 따로 확인한다.

for (const path of ['/', '/interactive', '/navigation', '/orders']) {
  test(`${path} — 좁은 화면에서 가로 스크롤이 없다 (리플로)`, async ({ page }) => {
    await page.goto(path);
    // 기기 화면 폭과 비교한다 — 넘치면 모바일 브라우저가 화면 폭(innerWidth)을 넓혀 버려 innerWidth 와 비교하면 잡히지 않는다
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(page.viewportSize()!.width);
  });
}

test('Select: 탭으로 열고 항목을 탭해 고른다', async ({ page }) => {
  await page.goto('/interactive');
  const select = page.getByRole('combobox', { name: '플랜' });
  await select.tap();
  await page.getByRole('option', { name: 'Pro' }).tap();
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(select).toHaveText(/Pro/);
});

test('Combobox: 입력창을 탭해 글자를 넣고 결과를 탭해 고른다', async ({ page }) => {
  await page.goto('/interactive');
  const input = page.getByRole('combobox', { name: '배송 도시' });
  await input.tap();
  await input.fill('부');
  await page.getByRole('option', { name: '부산' }).tap();
  await expect(input).toHaveValue('부산');
});

test('DatePicker: 달력 버튼을 탭해 날짜를 탭하면 입력창에 들어간다', async ({ page }) => {
  await page.goto('/interactive');
  await page.getByRole('button', { name: '달력 열기' }).tap();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /^15,/ }).tap();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('textbox', { name: '정산 희망일' })).toHaveValue(/-15$/);
});

test('Modal: 탭으로 열고 닫기 버튼을 탭해 닫는다', async ({ page }) => {
  await page.goto('/interactive');
  await page.getByRole('button', { name: '삭제', exact: true }).tap();
  const dialog = page.getByRole('dialog', { name: '프로젝트 삭제' });
  await expect(dialog).toBeVisible();
  // 좁은 화면에서도 대화상자가 화면 안에 들어온다
  const box = (await dialog.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await dialog.getByRole('button', { name: '닫기' }).tap();
  await expect(dialog).toBeHidden();
});

test('DropdownMenu: 탭으로 열고 항목을 탭하면 실행된다', async ({ page }) => {
  await page.goto('/navigation');
  await page.getByRole('button', { name: '문서 메뉴' }).tap();
  await page.getByRole('menuitem', { name: '복제' }).tap();
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(page.getByText('복제했어요').first()).toBeVisible();
});

test('Drawer: 탭으로 열면 화면 안에 들어오고, 닫기를 탭해 닫는다', async ({ page }) => {
  await page.goto('/navigation');
  await page.getByRole('button', { name: '필터' }).tap();
  const drawer = page.getByRole('dialog', { name: '필터' });
  await expect(drawer).toBeVisible();
  const box = (await drawer.boundingBox())!;
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  await drawer.getByRole('checkbox', { name: '예약 중' }).tap();
  await expect(drawer.getByRole('checkbox', { name: '예약 중' })).toBeChecked();
  await drawer.getByRole('button', { name: '닫기' }).first().tap();
  await expect(drawer).toBeHidden();
});
