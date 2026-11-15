import type { Page } from '@playwright/test';
import { kitPages } from '../app/components/kit';
import { axeViolations, expect, test } from './fixtures';

const LIST = '/components/';
const pages = kitPages.map(({ slug }) => `${LIST}${slug}/`);

test('컴포넌트 문서: 제목·설명·canonical·미리보기 태그·props·Storybook 링크', async ({ page }) => {
  for (const kit of kitPages) {
    await page.goto(`${LIST}${kit.slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(kit.title);
    await expect(page).toHaveTitle(`${kit.title} — BestOW UI`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', kit.summary);
    const url = `https://bestow-ui.com${LIST}${kit.slug}/`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', url);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://bestow-ui.com/og.png');
    // props 는 빌드 때 소스에서 읽어 온다
    await expect(page.getByRole('region', { name: `${kit.name} props 타입 정의` })).toContainText(
      `export interface ${kit.name}Props`,
    );
    await expect(page.getByRole('link', { name: 'Storybook 에서 조작해 보기' })).toHaveAttribute(
      'href',
      `/storybook/?path=${kit.storybookPath}`,
    );
    if (kit.utilsSlug) {
      await expect(page.getByRole('link', { name: /같은 서식 함수/ })).toHaveAttribute(
        'href',
        `/korean-utils/${kit.utilsSlug}/`,
      );
    }
  }
});

test('PhoneNumberInput 데모: 입력하는 대로 하이픈, 값은 숫자만', async ({ page }) => {
  await page.goto(`${LIST}phone-number-input/`);
  const demo = page.getByRole('region', { name: '직접 입력해 보세요' });
  const input = demo.getByRole('textbox', { name: '휴대폰 번호' });
  await input.pressSequentially('01012345678');
  await expect(input).toHaveValue('010-1234-5678');
  await expect(demo.getByRole('definition')).toHaveText("'01012345678'");
});

/** 쪽의 데모 영역 — 컴포넌트가 넘긴 값은 dd 에 `호출 결과` 모양으로 보인다 */
async function openDemo(page: Page, slug: string) {
  await page.goto(`${LIST}${slug}/`);
  return page.getByRole('region', { name: '직접 입력해 보세요' });
}

test('BusinessNumberInput 데모: 검증 공식에 맞으면 오류 없음, 틀리면 오류 문구', async ({ page }) => {
  const demo = await openDemo(page, 'business-number-input');
  const input = demo.getByRole('textbox', { name: '사업자등록번호' });
  await input.pressSequentially('1248100998');
  await expect(input).toHaveValue('124-81-00998');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await input.fill('');
  await input.pressSequentially('1248100999');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  const message = '올바른 사업자등록번호가 아니에요. 번호를 다시 확인해 주세요.';
  await expect(input).toHaveAccessibleDescription(message);
  // 다 채운 순간의 오류는 입력이 멈춘 뒤 status 영역으로도 알린다
  await expect(demo.getByRole('status')).toHaveText(message);
});

test('VerificationCodeInput 데모: 6자리를 채우면 onComplete', async ({ page }) => {
  const demo = await openDemo(page, 'verification-code-input');
  await demo.getByRole('textbox', { name: '인증번호' }).pressSequentially('123456');
  await expect(demo.getByRole('definition').last()).toHaveText("'123456'");
});

test('AgreementGroup 데모: 전체 동의를 누르면 모든 항목 체크', async ({ page }) => {
  const demo = await openDemo(page, 'agreement-group');
  await demo.getByRole('checkbox', { name: '전체 동의' }).check();
  for (const box of await demo.getByRole('checkbox').all()) await expect(box).toBeChecked();
  await expect(demo.getByRole('definition').last()).toHaveText('true');
});

test('AmountInput 데모: 쉼표와 한글 금액', async ({ page }) => {
  const demo = await openDemo(page, 'amount-input');
  const input = demo.getByRole('textbox', { name: '보낼 금액' });
  await input.pressSequentially('12000');
  await expect(input).toHaveValue('12,000');
  await expect(input).toHaveAccessibleDescription(/1만 2,000원/);
  await expect(demo.getByRole('definition')).toHaveText('12000');
});

test('AddressInput 데모: 가짜 공급자로 주소를 고르면 칸이 채워지고, 카카오 스크립트를 부르지 않는다', async ({
  page,
}) => {
  const kakao: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('kakaocdn.net')) kakao.push(request.url());
  });
  const demo = await openDemo(page, 'address-input');
  await demo.getByRole('button', { name: '주소 검색' }).click();
  const dialog = page.getByRole('dialog', { name: '주소 검색' });
  await dialog.getByRole('button', { name: /테헤란로 152/ }).click();
  await expect(dialog).toBeHidden();
  await expect(demo.getByRole('textbox', { name: '우편번호' })).toHaveValue('06236');
  await expect(demo.getByRole('textbox', { name: '기본 주소' })).toHaveValue(
    '서울 강남구 테헤란로 152 (역삼동, 강남파이낸스센터)',
  );
  await expect(demo.getByRole('textbox', { name: '상세 주소' })).toBeFocused();
  expect(kakao).toEqual([]);
});

test('ResidentNumberInput 데모: 13자리를 앞칸에 붙여 넣으면 두 칸에 나뉜다', async ({ page }) => {
  const demo = await openDemo(page, 'resident-number-input');
  const front = demo.getByRole('textbox', { name: '앞 6자리' });
  await front.focus();
  await page.evaluate(() => {
    const data = new DataTransfer();
    data.setData('text/plain', '900101-1234567');
    document.activeElement?.dispatchEvent(
      new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }),
    );
  });
  await expect(front).toHaveValue('900101');
  await expect(demo.getByLabel('뒤 7자리')).toHaveValue('1234567');
  await expect(demo.getByRole('definition').last()).toHaveText('true');
});

for (const [slug, name, typed, shown] of [
  ['card-number-input', '카드번호', '4111111111111111', '4111-1111-1111-1111'],
  ['corporate-number-input', '법인등록번호', '1301110006246', '130111-0006246'],
  ['account-number-input', '계좌번호', '110-123-456789', '110123456789'],
] as const) {
  test(`${name} 데모: 입력하면 서식이 맞춰지고 검증을 통과한다`, async ({ page }) => {
    const demo = await openDemo(page, slug);
    const input = demo.getByRole('textbox', { name });
    await input.pressSequentially(typed);
    await expect(input).toHaveValue(shown);
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(demo.getByRole('definition').last()).toHaveText('true');
  });
}

test('DatePicker 데모: 달력에서 날짜를 고르면 값이 들어간다(오늘 2026-11-14 고정)', async ({ page }) => {
  const demo = await openDemo(page, 'date-picker');
  await demo.getByRole('button', { name: '달력 열기' }).click();
  const grid = page.getByRole('grid', { name: '2026년 11월' });
  await grid.getByRole('button', { name: /^20, 2026년 11월/ }).click();
  await expect(demo.getByRole('textbox', { name: '방문 예정일' })).toHaveValue('2026-11-20');
  await expect(demo.getByRole('definition')).toHaveText("'2026-11-20'");
});

test('DateRangePicker 데모: 빠른 선택 1주일', async ({ page }) => {
  const demo = await openDemo(page, 'date-range-picker');
  const week = demo.getByRole('button', { name: '1주일' });
  await week.click();
  await expect(demo.getByRole('textbox', { name: '시작일' })).toHaveValue('2026-11-07');
  await expect(demo.getByRole('textbox', { name: '종료일' })).toHaveValue('2026-11-14');
  await expect(week).toHaveAttribute('aria-pressed', 'true');
});

test('Calendar 데모: 날짜를 고르면 onValueChange', async ({ page }) => {
  const demo = await openDemo(page, 'calendar');
  await demo
    .getByRole('grid', { name: '2026년 11월' })
    .getByRole('button', { name: /^20, 2026년 11월/ })
    .click();
  await expect(demo.getByRole('definition')).toHaveText("'2026-11-20'");
});

for (const mode of ['light', 'dark'] as const) {
  test(`axe 위반 0 — ${mode}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: mode });
    for (const path of pages) {
      await page.goto(path);
      expect(await axeViolations(page), path).toEqual([]);
    }
  });
}

// KWCAG 1.4.10 리플로 — props·코드는 pre 안에서만 스크롤된다
for (const width of [320, 390]) {
  test(`${width}px 에서 가로 스크롤 없음`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const path of pages) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBeLessThanOrEqual(width);
    }
  });
}
