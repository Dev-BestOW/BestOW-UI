import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Badge, Card, CardBody, Drawer, Grid, IconButton, Link, SkipLink, Stack, Typography } from '@bestow-ui/react';
import { BellIcon, FileTextIcon, HouseIcon, MenuIcon, SettingsIcon, UsersIcon } from '@bestow-ui/icons';

/**
 * Guides "화면 패턴 › 앱 뼈대" 의 예시. 넓으면 왼쪽 사이드바, 좁으면 머리글의 메뉴 버튼(Drawer) + 아래 탭바.
 * 스토리는 창 크기와 상관없이 휴대폰 폭을 보여 주려고 컨테이너 쿼리(@container)를 쓴다 —
 * 실제 페이지에서는 같은 규칙을 `media.md` 미디어쿼리로 쓴다(Patterns.mdx 의 코드).
 */
const css = `
.shell { container-type: inline-size; border: 1px solid var(--bestow-color-border-default); border-radius: 12px; overflow: hidden;
  background: var(--bestow-color-bg-default); color: var(--bestow-color-fg-default); }
.shell-frame { display: flex; flex-direction: column; min-height: 560px; }
.shell-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--bestow-color-border-default); }
.shell-header .spacer { flex: 1; }
.shell-body { display: flex; flex: 1; min-height: 0; }
.shell-sidebar { display: none; width: 220px; flex-shrink: 0; padding: 12px; border-right: 1px solid var(--bestow-color-border-default); }
.shell-main { flex: 1; min-width: 0; padding: 24px 16px; }
.shell-main:focus { outline: none; }
.nav-list { display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 0; list-style: none; }
.nav-link { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 0 12px; border-radius: 8px;
  color: var(--bestow-color-fg-default); text-decoration: none; }
.nav-link:hover { background: var(--bestow-color-bg-muted); }
.nav-link:focus-visible { outline: 2px solid var(--bestow-color-border-focus); outline-offset: 2px; }
.nav-link[aria-current='page'] { background: var(--bestow-color-primary-subtle); color: var(--bestow-color-primary-text); font-weight: 600; }
.shell-tabbar { position: sticky; bottom: 0; border-top: 1px solid var(--bestow-color-border-default); background: var(--bestow-color-bg-default);
  padding-bottom: env(safe-area-inset-bottom, 0px); }
.tab-list { display: grid; grid-template-columns: repeat(4, 1fr); margin: 0; padding: 0; list-style: none; }
.tab-link { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-height: 56px;
  color: var(--bestow-color-fg-muted); font-size: var(--bestow-font-size-xs); text-decoration: none; }
.tab-link:focus-visible { outline: 2px solid var(--bestow-color-border-focus); outline-offset: -2px; }
.tab-link[aria-current='page'] { color: var(--bestow-color-primary-text); font-weight: 600; }
@container (min-width: 48em) {
  .shell-sidebar { display: block; }
  .shell-menu-button, .shell-tabbar { display: none; }
  .shell-main { padding: 24px; }
}
@media (forced-colors: active) {
  .nav-link[aria-current='page'] { forced-color-adjust: none; background: Highlight; color: HighlightText; }
  .tab-link[aria-current='page'] { text-decoration: underline; }
}
`;

const MENU = [
  { href: '#home', label: '홈', icon: <HouseIcon size={20} /> },
  { href: '#orders', label: '주문', icon: <FileTextIcon size={20} /> },
  { href: '#customers', label: '고객', icon: <UsersIcon size={20} /> },
  { href: '#settings', label: '설정', icon: <SettingsIcon size={20} /> },
];

function NavLinks({ current, className, onNavigate }: { current: string; className: string; onNavigate?: () => void }) {
  return (
    <ul className={className === 'tab-link' ? 'tab-list' : 'nav-list'}>
      {MENU.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={className}
            underline="hover"
            color="inherit"
            aria-current={item.href === current ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault();
              onNavigate?.();
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AppShell({ width, mainId, children }: { width?: number; mainId: string; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const current = '#orders';
  return (
    <div className="shell" style={{ width, maxWidth: '100%' }}>
      <div className="shell-frame">
        <SkipLink href={`#${mainId}`} />
        <header className="shell-header">
          <span className="shell-menu-button">
            <Drawer
              side="left"
              size="sm"
              title="전체 메뉴"
              open={menuOpen}
              onOpenChange={setMenuOpen}
              trigger={
                <IconButton aria-label="메뉴 열기" variant="ghost" color="neutral">
                  <MenuIcon size={20} />
                </IconButton>
              }
            >
              <nav aria-label="전체 메뉴">
                <NavLinks current={current} className="nav-link" onNavigate={() => setMenuOpen(false)} />
              </nav>
            </Drawer>
          </span>
          <Typography variant="h4" as="span">
            BestOW 관리
          </Typography>
          <span className="spacer" />
          <IconButton aria-label="알림 3건" variant="ghost" color="neutral">
            <BellIcon size={20} />
          </IconButton>
        </header>
        <div className="shell-body">
          <nav aria-label="주요 메뉴" className="shell-sidebar">
            <NavLinks current={current} className="nav-link" />
          </nav>
          <main id={mainId} tabIndex={-1} className="shell-main">
            {children}
          </main>
        </div>
        <nav aria-label="주요 메뉴" className="shell-tabbar">
          <NavLinks current={current} className="tab-link" />
        </nav>
      </div>
    </div>
  );
}

function Page() {
  return (
    <Stack gap={4}>
      <Stack direction="row" align="center" justify="between" gap={3} wrap>
        <Typography variant="h2" as="h1">
          주문
        </Typography>
        <Badge color="info">오늘 12건</Badge>
      </Stack>
      <Grid minItemWidth="10rem" gap={3}>
        {[
          ['결제 완료', '8건'],
          ['배송 중', '3건'],
          ['취소', '1건'],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardBody>
              <Typography variant="body-sm" color="muted">
                {label}
              </Typography>
              <Typography variant="h3" as="p">
                {value}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}

const meta = {
  title: 'Guides/앱 뼈대',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '머리글 · 사이드바 · 본문 · 모바일 하단 탭바를 기존 컴포넌트로 짠 예시예요. 넓으면 왼쪽 사이드바, 좁으면 머리글의 메뉴 버튼(Drawer)과 아래 탭바로 바뀌어요. 설명과 실제 페이지용 코드는 [화면 패턴 › 앱 뼈대](?path=/docs/guides-화면-패턴--docs) 에 있어요.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 한 스토리에 뼈대 하나 — 둘을 그리면 main·banner·"주요 메뉴" 랜드마크가 겹친다
export const Wide: Story = {
  name: '넓은 화면',
  render: () => (
    <>
      <style>{css}</style>
      <AppShell mainId="shell-main-wide" width={900}>
        <Page />
      </AppShell>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 넓으면 사이드바만 "주요 메뉴" 이고, 메뉴 버튼·아래 탭바는 사라진다(접근성 트리에서도)
    const navs = canvas.getAllByRole('navigation', { name: '주요 메뉴' });
    await expect(navs).toHaveLength(1);
    await expect(navs[0]!.classList.contains('shell-sidebar')).toBe(true);
    await expect(canvas.queryByRole('button', { name: '메뉴 열기' })).toBeNull();
  },
};

export const Narrow: Story = {
  name: '휴대폰 폭',
  render: () => (
    <>
      <style>{css}</style>
      <AppShell mainId="shell-main-narrow" width={375}>
        <Page />
      </AppShell>
    </>
  ),
};

/** 좁은 화면에서 메뉴 버튼으로 Drawer 를 연 상태 — 열린 상태도 axe 로 검사한다 */
export const NarrowMenuOpen: Story = {
  name: '휴대폰 폭 — 메뉴 열기',
  tags: ['!visual'],
  render: () => (
    <>
      <style>{css}</style>
      <AppShell mainId="shell-main-menu" width={375}>
        <Page />
      </AppShell>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 좁은 폭에서는 사이드바가 사라지고(접근성 트리에서도) 아래 탭바만 "주요 메뉴" 다
    await expect(canvas.getAllByRole('navigation', { name: '주요 메뉴' })).toHaveLength(1);
    await expect(canvas.getByRole('link', { name: '주문' }).getAttribute('aria-current')).toBe('page');
    await userEvent.click(canvas.getByRole('button', { name: '메뉴 열기' }));
    const dialog = await within(document.body).findByRole('dialog', { name: '전체 메뉴' });
    await expect(within(dialog).getByRole('navigation', { name: '전체 메뉴' })).toBeInTheDocument();
  },
};
