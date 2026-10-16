import { expect, test } from './fixtures';

test('DropdownMenu: Enter 로 열고 화살표로 이동(비활성 항목 건너뜀), Esc 로 닫으면 트리거로 포커스 복귀', async ({
  page,
}) => {
  await page.goto('/navigation');
  const trigger = page.getByRole('button', { name: '문서 메뉴' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: '편집' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: '복제' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: '삭제' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Modal: 포커스가 대화상자 안에서만 돌고, Esc 로 닫으면 트리거로 돌아간다', async ({ page }) => {
  await page.goto('/interactive');
  const trigger = page.getByRole('button', { name: '삭제', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '프로젝트 삭제' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Combobox: 입력으로 거르고 Enter 로 고르면 값이 바뀌고 토스트가 뜬다', async ({ page }) => {
  await page.goto('/interactive');
  const input = page.getByRole('combobox', { name: '배송 도시' });
  await input.fill('부');
  await expect(page.getByRole('option', { name: '부산' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('부산');
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(page.getByText('busan 를 골랐어요', { exact: true })).toBeVisible();
});

test('Select: 키보드로 열고 글자 입력으로 찾아 고른다', async ({ page }) => {
  await page.goto('/interactive');
  const select = page.getByRole('combobox', { name: '플랜' });
  await select.focus();
  await page.keyboard.press('Enter');
  // 목록이 열리고 포커스가 첫 항목으로 옮겨 간 뒤에 입력해야 한다 (그 전에 누른 키는 트리거가 받는다)
  await expect(page.getByRole('option', { name: 'Free' })).toBeFocused();
  await page.keyboard.type('Te');
  await expect(page.getByRole('option', { name: 'Team' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(select).toHaveText(/Team/);
  await expect(select).toBeFocused();
});

test('서식 입력: 숫자만 입력하면 하이픈·쉼표가 붙는다 (DatePicker·전화번호·금액)', async ({ page }) => {
  await page.goto('/interactive');
  const date = page.getByRole('textbox', { name: '정산 희망일' });
  await date.pressSequentially('20261016');
  await expect(date).toHaveValue('2026-10-16');
  const phone = page.getByRole('textbox', { name: '휴대폰 번호' });
  await phone.pressSequentially('01012345678');
  await expect(phone).toHaveValue('010-1234-5678');
  const amount = page.getByRole('textbox', { name: '정산 금액' });
  await amount.pressSequentially('1250000');
  await expect(amount).toHaveValue('1,250,000');
});

test('Tabs: 화살표로 탭을 옮기면 패널이 바뀐다', async ({ page }) => {
  await page.goto('/navigation');
  const tablist = page.getByRole('tablist', { name: '계정 설정' });
  await tablist.getByRole('tab', { name: '계정' }).click();
  await page.keyboard.press('ArrowRight');
  await expect(tablist.getByRole('tab', { name: '비밀번호' })).toBeFocused();
  await expect(tablist.getByRole('tab', { name: '비밀번호' })).toHaveAttribute('aria-selected', 'true');
});
