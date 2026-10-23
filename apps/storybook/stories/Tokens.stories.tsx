import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  breakpoint,
  darkColors,
  darkShadow,
  duration,
  fontFamily,
  fontSize,
  fontWeight,
  lightColors,
  lineHeight,
  palette,
  radius,
  shadow,
  space,
  zIndex,
  type SemanticColors,
} from '@bestow-ui/tokens';
import { media, Stack, ThemeProvider, Typography, vars, type ThemeName } from '@bestow-ui/react';

// 모든 값은 @bestow-ui/tokens 에서 읽는다. 토큰을 추가·변경하면 이 페이지도 자동으로 바뀐다.
// 미리보기 도형은 vars(CSS 변수)로 그려서 브랜드 테마(overrides)를 적용했을 때의 모습과 같다.

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const cssVar = (...path: string[]) => `--bestow-${path.map(kebab).join('-')}`;

const mono: CSSProperties = { fontFamily: vars.font.family.mono, fontSize: vars.font.size.xs };
const swatchBorder = `1px solid ${vars.color.border.default}`;

function Section({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <Stack as="section" gap={3}>
      <Stack gap={1}>
        <Typography variant="h3">{title}</Typography>
        {description && (
          <Typography variant="body-sm" color="muted">
            {description}
          </Typography>
        )}
      </Stack>
      {children}
    </Stack>
  );
}

/** 토큰 이름 · CSS 변수 · 값 을 한 줄로 보여 주는 표 */
function TokenTable({
  rows,
  variableLabel = 'CSS 변수',
}: {
  rows: Array<{ name: string; variable: string; value: string; preview?: ReactNode }>;
  /** 두 번째 열 머리글 (breakpoint 는 CSS 변수가 아니라 미디어쿼리) */
  variableLabel?: string;
}) {
  const hasPreview = rows.some((row) => row.preview);
  const cell: CSSProperties = { padding: '8px 12px', borderBottom: swatchBorder, verticalAlign: 'middle' };
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: vars.font.size.sm }}>
      <thead>
        <tr>
          {['이름', variableLabel, '값', ...(hasPreview ? ['미리보기'] : [])].map((h) => (
            <th key={h} style={{ ...cell, textAlign: 'left', fontWeight: vars.font.weight.semibold }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.variable}>
            <td style={{ ...cell, ...mono }}>{row.name}</td>
            <td style={{ ...cell, ...mono, color: vars.color.fg.muted }}>{row.variable}</td>
            <td style={{ ...cell, ...mono }}>{row.value}</td>
            {hasPreview && <td style={cell}>{row.preview}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------------------------------- Colors --------------------------------- */

function Swatch({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: vars.radius.sm,
        background: color,
        border: swatchBorder,
      }}
    />
  );
}

function SemanticColumn({ theme, colors }: { theme: ThemeName; colors: SemanticColors }) {
  return (
    <ThemeProvider theme={theme} style={{ flex: '1 1 320px', padding: 16, borderRadius: 12, border: swatchBorder }}>
      <Stack gap={4}>
        <Typography variant="h4">{theme === 'light' ? 'Light' : 'Dark'}</Typography>
        {Object.entries(colors).map(([group, tokens]) => (
          <Stack key={group} gap={2}>
            <Typography variant="body-sm" weight="semibold">
              {group}
            </Typography>
            {Object.entries(tokens as Record<string, string>).map(([key, value]) => (
              <Stack key={key} direction="row" gap={3} align="center">
                {/* 이 열의 테마 값 그대로 그린다 (vars 가 아닌 원시 값) */}
                <Swatch color={value} />
                <Stack gap={0}>
                  <span style={mono}>
                    {group}.{key}
                  </span>
                  <span style={{ ...mono, color: vars.color.fg.muted }}>{value}</span>
                </Stack>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    </ThemeProvider>
  );
}

function SemanticColors() {
  return (
    <Section
      title="의미 색상 (Semantic colors)"
      description={
        <>
          컴포넌트는 이 색만 써요. 라이트·다크가 같은 키를 가지고, CSS 변수는{' '}
          <code>{cssVar('color', 'primary', 'solid')}</code> 형식이에요. solid 배경 위 글자는 같은 그룹의{' '}
          <code>contrast</code> 를 써요.
        </>
      }
    >
      <Stack direction="row" gap={4} align="start" wrap>
        <SemanticColumn theme="light" colors={lightColors} />
        <SemanticColumn theme="dark" colors={darkColors} />
      </Stack>
    </Section>
  );
}

function Palette() {
  const scales = Object.entries(palette).flatMap(([name, value]) =>
    typeof value === 'object' ? [[name, value as Record<string, string>] as const] : [],
  );
  return (
    <Section
      title="팔레트 (Palette)"
      description="의미 색상을 만드는 원시 색이에요. CSS 변수로는 노출되지 않으니 컴포넌트에서는 의미 색상을 쓰세요."
    >
      <Stack direction="row" gap={6} wrap>
        {(['white', 'black'] as const).map((name) => (
          <Stack key={name} direction="row" gap={2} align="center">
            <Swatch color={palette[name]} />
            <Stack gap={0}>
              <span style={mono}>{name}</span>
              <span style={{ ...mono, color: vars.color.fg.muted }}>{palette[name]}</span>
            </Stack>
          </Stack>
        ))}
      </Stack>
      {scales.map(([name, scale]) => (
        <Stack key={name} gap={2}>
          <Typography variant="body-sm" weight="semibold">
            {name}
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 8 }}>
            {Object.entries(scale).map(([step, value]) => (
              <Stack key={step} gap={1}>
                <span style={{ height: 48, borderRadius: vars.radius.md, background: value, border: swatchBorder }} />
                <span style={mono}>{step}</span>
                <span style={{ ...mono, color: vars.color.fg.muted }}>{value}</span>
              </Stack>
            ))}
          </div>
        </Stack>
      ))}
    </Section>
  );
}

/* -------------------------------- Typography ------------------------------- */

const sample = '디자인 시스템 Design System 0123';

function TypographyTokens() {
  return (
    <Stack gap={8}>
      <Section title="글꼴 (font.family)">
        <TokenTable
          rows={Object.entries(fontFamily).map(([key, value]) => ({
            name: `font.family.${key}`,
            variable: cssVar('font', 'family', key),
            value: value.split(',')[0] ?? value,
            preview: (
              <span style={{ fontFamily: vars.font.family[key as keyof typeof fontFamily], fontSize: 18 }}>
                {sample}
              </span>
            ),
          }))}
        />
      </Section>
      <Section title="크기 (font.size)">
        <TokenTable
          rows={Object.entries(fontSize).map(([key, value]) => ({
            name: `font.size.${key}`,
            variable: cssVar('font', 'size', key),
            value,
            preview: (
              <span style={{ fontSize: vars.font.size[key as keyof typeof fontSize], whiteSpace: 'nowrap' }}>
                {sample}
              </span>
            ),
          }))}
        />
      </Section>
      <Section title="굵기 (font.weight)">
        <TokenTable
          rows={Object.entries(fontWeight).map(([key, value]) => ({
            name: `font.weight.${key}`,
            variable: cssVar('font', 'weight', key),
            value,
            preview: (
              <span style={{ fontWeight: vars.font.weight[key as keyof typeof fontWeight], fontSize: 18 }}>
                {sample}
              </span>
            ),
          }))}
        />
      </Section>
      <Section title="줄 간격 (font.lineHeight)">
        <TokenTable
          rows={Object.entries(lineHeight).map(([key, value]) => ({
            name: `font.lineHeight.${key}`,
            variable: cssVar('font', 'lineHeight', key),
            value,
            preview: (
              <p
                style={{
                  margin: 0,
                  maxWidth: 280,
                  lineHeight: vars.font.lineHeight[key as keyof typeof lineHeight],
                  wordBreak: 'keep-all',
                  background: vars.color.bg.muted,
                }}
              >
                여러 줄로 이어지는 문단에서 줄 사이 간격이 어떻게 보이는지 확인해요.
              </p>
            ),
          }))}
        />
      </Section>
      <Section
        title="Typography variant"
        description={
          <>
            위 토큰을 조합한 <code>&lt;Typography variant&gt;</code> 스케일이에요.
          </>
        }
      >
        <Stack gap={3}>
          {(['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'caption'] as const).map((variant) => (
            <Stack key={variant} direction="row" gap={4} align="baseline">
              <span style={{ ...mono, width: 72, flexShrink: 0, color: vars.color.fg.muted }}>{variant}</span>
              {/* 제목 요소가 페이지에 여러 개 생기지 않도록 모두 span 으로 그린다 */}
              <Typography variant={variant} as="span">
                {sample}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Section>
    </Stack>
  );
}

/* --------------------------- Spacing · Radius · Shadow ---------------------- */

function SpacingTokens() {
  return (
    <Section title="간격 (space)" description="padding·margin·gap 에 써요. Stack 의 gap prop 도 이 키를 받아요.">
      <TokenTable
        rows={Object.entries(space).map(([key, value]) => ({
          name: `space.${key}`,
          variable: cssVar('space', key),
          value,
          preview: (
            <span
              style={{
                display: 'block',
                width: vars.space[key as unknown as keyof typeof space],
                height: 16,
                background: vars.color.primary.solid,
                borderRadius: 2,
              }}
            />
          ),
        }))}
      />
    </Section>
  );
}

function RadiusTokens() {
  return (
    <Section title="모서리 (radius)">
      <TokenTable
        rows={Object.entries(radius).map(([key, value]) => ({
          name: `radius.${key}`,
          variable: cssVar('radius', key),
          value,
          preview: (
            <span
              style={{
                display: 'block',
                width: 64,
                height: 40,
                borderRadius: vars.radius[key as keyof typeof radius],
                background: vars.color.primary.subtle,
                border: `2px solid ${vars.color.primary.solid}`,
              }}
            />
          ),
        }))}
      />
    </Section>
  );
}

function ShadowColumn({ theme, values }: { theme: ThemeName; values: Record<string, string> }) {
  return (
    <ThemeProvider theme={theme} style={{ flex: '1 1 320px', padding: 24, borderRadius: 12, border: swatchBorder }}>
      <Stack gap={4}>
        <Typography variant="h4">{theme === 'light' ? 'Light' : 'Dark'}</Typography>
        <Stack direction="row" gap={6} wrap>
          {Object.entries(values).map(([key, value]) => (
            <Stack key={key} gap={3} style={{ width: 160 }}>
              <span
                style={{
                  display: 'block',
                  height: 80,
                  borderRadius: vars.radius.lg,
                  background: vars.color.bg.default,
                  boxShadow: vars.shadow[key as keyof typeof shadow],
                }}
              />
              <Stack gap={0}>
                <span style={mono}>shadow.{key}</span>
                <span style={{ ...mono, color: vars.color.fg.muted, overflowWrap: 'anywhere' }}>{value}</span>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}

function ShadowTokens() {
  return (
    <Section
      title="그림자 (shadow)"
      description={
        <>
          CSS 변수(<code>{cssVar('shadow', 'md')}</code> …)는 같고 값만 모드마다 달라요. 다크는 더 진하게 하고, 떠 있는
          면(md·lg)은 가장자리를 구분하는 옅은 밝은 테두리를 함께 둬요.
        </>
      }
    >
      <Stack direction="row" gap={4} align="start" wrap>
        <ShadowColumn theme="light" values={shadow} />
        <ShadowColumn theme="dark" values={darkShadow} />
      </Stack>
    </Section>
  );
}

function OtherTokens() {
  return (
    <Stack gap={8}>
      <Section
        title="시간 (duration)"
        description="전환·애니메이션 길이예요. reduced motion 환경에서는 컴포넌트가 애니메이션을 꺼요."
      >
        <TokenTable
          rows={Object.entries(duration).map(([key, value]) => ({
            name: `duration.${key}`,
            variable: cssVar('duration', key),
            value,
          }))}
        />
      </Section>
      <Section
        title="반응형 구간 (breakpoint)"
        description={
          <>
            화면이 이 폭 이상이면 그 구간이에요(모바일 우선). CSS 변수로는 미디어쿼리를 쓸 수 없어서 대신{' '}
            <code>media</code> (em 단위 — 브라우저 기본 글꼴 크기를 따라요)를 vanilla-extract 의 <code>@media</code> 에
            넣어요. Stack·Grid 의 구간별 값(<code>{'{ base, md }'}</code>)도 이 구간을 써요.
          </>
        }
      >
        <TokenTable
          variableLabel="미디어쿼리 (media)"
          rows={Object.entries(breakpoint).map(([key, value]) => ({
            name: `breakpoint.${key}`,
            variable: media[key as keyof typeof media],
            value,
          }))}
        />
      </Section>
      <Section
        title="쌓임 순서 (zIndex)"
        description="portal 로 띄우는 요소의 z-index 예요. 위로 갈수록 아래에 깔려요."
      >
        <TokenTable
          rows={Object.entries(zIndex).map(([key, value]) => ({
            name: `zIndex.${key}`,
            variable: cssVar('zIndex', key),
            value,
          }))}
        />
      </Section>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Design Tokens',
  parameters: {
    docs: {
      description: {
        component:
          '`@bestow-ui/tokens` 의 값을 읽어 그린 페이지예요. 컴포넌트와 사용자 스타일은 `vars`(또는 `--bestow-*` CSS 변수)로 이 토큰을 참조해요.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => (
    <Stack gap={8}>
      <SemanticColors />
      <Palette />
    </Stack>
  ),
};

export const TypographyScale: Story = {
  name: 'Typography',
  render: () => <TypographyTokens />,
};

export const Spacing: Story = {
  render: () => <SpacingTokens />,
};

export const Radius: Story = {
  render: () => <RadiusTokens />,
};

export const Shadow: Story = {
  render: () => <ShadowTokens />,
};

export const DurationAndZIndex: Story = {
  name: 'Duration · Breakpoint · zIndex',
  render: () => <OtherTokens />,
};
