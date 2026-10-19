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
  await expect(page.getByRole('menuitem', { name: '이동' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: '삭제' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('DropdownMenu 하위 메뉴: → 로 열어 첫 항목, ← 로 닫고 돌아오고, Enter 로 고르면 메뉴가 모두 닫힌다', async ({
  page,
}) => {
  await page.goto('/navigation');
  const trigger = page.getByRole('button', { name: '문서 메뉴' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const sub = page.getByRole('menuitem', { name: '이동' });
  await sub.focus();
  await expect(sub).toHaveAttribute('aria-haspopup', 'menu');
  await page.keyboard.press('ArrowRight');
  await expect(sub).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitem', { name: '받은 문서함' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menuitem', { name: '받은 문서함' })).toBeHidden();
  await expect(sub).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: '보관함' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByText('보관함으로 옮겼어요').first()).toBeVisible();
  await expect(trigger).toBeFocused();
});

test('DropdownMenu 체크·라디오: Space 로 체크를 바꿔도 열려 있고, 라디오를 고르면 닫히며 값이 바뀐다', async ({
  page,
}) => {
  await page.goto('/navigation');
  const trigger = page.getByRole('button', { name: '보기 옵션' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const hidden = page.getByRole('menuitemcheckbox', { name: '숨긴 파일 표시' });
  await expect(hidden).toBeFocused();
  await expect(hidden).toHaveAttribute('aria-checked', 'false');
  await page.keyboard.press('Space');
  await expect(hidden).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('menu')).toBeVisible();

  await page.keyboard.press('End');
  const compact = page.getByRole('menuitemradio', { name: '좁게' });
  await expect(compact).toBeFocused();
  await expect(compact).toHaveAttribute('aria-checked', 'false');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(page.getByText('보기: 숨긴 파일 표시 · 크기 열 표시 · 간격 좁게')).toBeVisible();
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

test('Tabs 세로: ↑/↓ 로 옮기면 패널이 바뀌고 ←/→ 는 무시한다', async ({ page }) => {
  await page.goto('/navigation');
  const tablist = page.getByRole('tablist', { name: '설정 메뉴' });
  await expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
  await tablist.getByRole('tab', { name: '프로필' }).click();
  await page.keyboard.press('ArrowRight');
  await expect(tablist.getByRole('tab', { name: '프로필' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(tablist.getByRole('tab', { name: '알림' })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: '알림' })).toHaveText('알림 설정');
  // 목록이 내용의 왼쪽에 있다 (세로 레이아웃)
  const listBox = (await tablist.boundingBox())!;
  const panelBox = (await page.getByRole('tabpanel', { name: '알림' }).boundingBox())!;
  expect(panelBox.x).toBeGreaterThan(listBox.x + listBox.width - 1);
  expect(Math.abs(panelBox.y - listBox.y)).toBeLessThan(listBox.height);
});

test('SkipLink: 첫 Tab 에 "본문 바로가기" 가 화면에 나타나고, Enter 로 머리글을 건너뛰어 본문으로 간다', async ({
  page,
}) => {
  await page.goto('/interactive');
  const skip = page.getByRole('link', { name: '본문 바로가기' });
  await expect(skip).not.toBeInViewport();
  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  // 다음 Tab 은 머리글 링크가 아니라 본문 안의 요소로 간다
  await page.keyboard.press('Tab');
  expect(await page.getByRole('main').evaluate((main) => main.contains(document.activeElement))).toBe(true);
});

test('SegmentedControl: Tab 으로 선택된 칸에 들어가고, 화살표로 옮기면 바로 선택된다(끝에서 처음으로)', async ({
  page,
}) => {
  await page.goto('/navigation');
  const group = page.getByRole('radiogroup', { name: '정렬' });
  await group.getByRole('radio', { name: '최신순' }).click();
  await page.keyboard.press('ArrowRight');
  await expect(group.getByRole('radio', { name: '인기순' })).toBeFocused();
  await expect(group.getByRole('radio', { name: '인기순' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByText('정렬: popular')).toBeVisible();
  // 지연 없이 연달아 눌러도 매번 선택돼야 한다 — Radix RadioGroup 을 썼을 때 여기서 약 20% 실패해 직접 구현으로 바꿨다
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(group.getByRole('radio', { name: '최신순' })).toHaveAttribute('aria-checked', 'true');
  await expect(group.getByRole('radio', { name: '최신순' })).toBeFocused();
  await expect(page.getByText('정렬: latest')).toBeVisible();
});
