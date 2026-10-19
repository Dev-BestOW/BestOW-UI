import { expect, test } from './fixtures';

// react-hook-form 예제(/signup) — 오류 요약 포커스, 링크 이동, 모두 채워 제출
test('빈 제출 → 오류 요약 포커스 → 링크로 칸 이동 → 채워서 가입', async ({ page }) => {
  await page.goto('/signup');
  await page.getByRole('button', { name: '가입' }).click();
  const summary = page.locator('[tabindex="-1"]').filter({ hasText: '고칠 곳이 6개' });
  await expect(summary).toBeFocused();
  await summary.getByRole('link', { name: '결제 주기를 골라 주세요.' }).click();
  await expect(page.getByRole('radio', { name: '월간' })).toBeFocused();
  await summary.getByRole('link', { name: '서류를 첨부해 주세요.' }).click();
  await expect(page.getByRole('button', { name: '파일 선택' })).toBeFocused();

  await page.getByRole('textbox', { name: '이메일' }).fill('me@bestow.dev');
  await page.getByRole('textbox', { name: '휴대폰 번호' }).fill('01012345678');
  await page.getByRole('combobox', { name: '플랜' }).click();
  await page.getByRole('option', { name: '프로' }).click();
  await page.getByRole('radio', { name: '연간' }).check();
  await page.getByRole('checkbox', { name: '전체 동의' }).check();
  await page
    .getByRole('group', { name: '재직 증명서' })
    .locator('input[type="file"]')
    .setInputFiles({ name: '재직증명서.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
  await page.getByRole('button', { name: '가입' }).click();
  await expect(page.getByRole('status').filter({ hasText: '가입했어요' })).toBeVisible();
  await expect(page.getByText('me@bestow.dev · 좌석 1개 · 서류 1개')).toBeVisible();
});
