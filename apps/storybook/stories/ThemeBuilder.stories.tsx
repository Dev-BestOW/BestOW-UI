import { useMemo, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { darkColors, lightColors, type SemanticColors } from '@bestow-ui/tokens';
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  contrastRatio,
  createIntentColors,
  createTheme,
  Link,
  Progress,
  Select,
  Slider,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  vars,
  type BestowTheme,
  type ThemeInput,
  type ThemeName,
} from '@bestow-ui/react';

// 대표색을 넣으면 createIntentColors 로 라이트·다크 색을 만들고, 실제 컴포넌트 미리보기·대비 리포트·코드를 보여 준다.
// 라이브러리의 공개 API(createIntentColors, createTheme, contrastRatio)만 써서, 사용자가 같은 코드를 그대로 가져갈 수 있다.

type Intent = 'primary' | 'danger' | 'success' | 'warning';
const INTENTS: Intent[] = ['primary', 'danger', 'success', 'warning'];
const INTENT_LABEL: Record<Intent, string> = {
  primary: 'primary (대표색)',
  danger: 'danger (오류·삭제)',
  success: 'success (완료)',
  warning: 'warning (주의)',
};

/** "#abc", "abc", "#aabbcc" → "#aabbcc". 올바르지 않으면 null */
function normalizeHex(input: string): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
  if (!m) return null;
  const h = m[1]!.length === 3 ? m[1]!.replace(/./g, (c) => c + c) : m[1]!;
  return `#${h.toLowerCase()}`;
}

/** rgba(...) 를 배경 위에 겹친 hex. 다크의 subtle 처럼 반투명 색의 실제 대비를 재기 위해 쓴다 */
function flatten(color: string, background: string): string {
  const rgba = /rgba?\(([^)]+)\)/.exec(color);
  if (!rgba) return color;
  const [r, g, b, a = 1] = rgba[1]!.split(',').map((v) => Number(v.trim()));
  const bg = background.match(/[0-9a-f]{2}/gi)!.map((v) => parseInt(v, 16));
  const mix = [r!, g!, b!].map((v, i) => Math.round(v * a + bg[i]! * (1 - a)));
  return `#${mix.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

interface BuilderState {
  colors: Record<Intent, string>; // 빈 문자열 = 기본 토큰 사용 (primary 는 항상 값이 있다)
  radius: string;
  font: string;
}

const DEFAULT_RADIUS = '8px';
const DEFAULT_FONT = 'default';
const FONTS: Record<string, string> = {
  default: '기본 (Pretendard)',
  'system-ui, sans-serif': '시스템 글꼴',
  '"Noto Sans KR", sans-serif': 'Noto Sans KR',
  'Georgia, serif': 'Georgia (serif)',
};

function buildInputs(state: BuilderState): ThemeInput[] {
  const inputs: ThemeInput[] = [];
  for (const intent of INTENTS) {
    const hex = normalizeHex(state.colors[intent]);
    if (hex) inputs.push(createIntentColors(intent, hex));
  }
  const common: ThemeInput['common'] = {};
  if (state.radius !== DEFAULT_RADIUS) common.radius = { md: state.radius };
  if (state.font !== DEFAULT_FONT) common.font = { family: { sans: state.font } };
  if (Object.keys(common).length) inputs.push({ common });
  return inputs;
}

function buildCode(state: BuilderState): string {
  const lines: string[] = [];
  for (const intent of INTENTS) {
    const hex = normalizeHex(state.colors[intent]);
    if (hex) lines.push(`  createIntentColors('${intent}', '${hex}'),`);
  }
  const common: string[] = [];
  if (state.radius !== DEFAULT_RADIUS) common.push(`radius: { md: '${state.radius}' }`);
  if (state.font !== DEFAULT_FONT) common.push(`font: { family: { sans: '${state.font.replace(/'/g, "\\'")}' } }`);
  if (common.length) lines.push(`  { common: { ${common.join(', ')} } },`);
  return [
    `import { ThemeProvider, createTheme, createIntentColors } from '@bestow-ui/react';`,
    '',
    'export const brand = createTheme(',
    ...lines,
    ');',
    '',
    '// <ThemeProvider theme={mode} overrides={brand}>…</ThemeProvider>',
  ].join('\n');
}

/** 기본 토큰 위에 테마의 색 오버라이드를 얹은 최종 색 */
function resolveColors(theme: BestowTheme, mode: ThemeName): SemanticColors {
  const base = mode === 'light' ? lightColors : darkColors;
  const over = (theme[mode].color ?? {}) as Partial<Record<keyof SemanticColors, Record<string, string>>>;
  const out = { ...base } as SemanticColors;
  for (const key of Object.keys(base) as Array<keyof SemanticColors>) {
    out[key] = { ...base[key], ...over[key] } as never;
  }
  return out;
}

interface Check {
  label: string;
  min: number;
  ratio: number;
}

function checksFor(colors: SemanticColors, intent: Intent): Check[] {
  const c = colors[intent];
  const bg = colors.bg.default;
  const checks: Check[] = [
    { label: 'solid 버튼 글자', min: 4.5, ratio: contrastRatio(c.contrast, c.solid) },
    { label: 'solid 버튼 hover 글자', min: 4.5, ratio: contrastRatio(c.contrast, c.solidHover) },
    { label: '강조 글자 (배경 위)', min: 4.5, ratio: contrastRatio(c.text, bg) },
    { label: '연한 배경(subtle) 위 글자', min: 4.5, ratio: contrastRatio(c.text, flatten(c.subtle, bg)) },
    { label: '막대·테두리 (트랙 대비)', min: 3, ratio: contrastRatio(c.text, colors.bg.muted) },
  ];
  if (intent === 'primary') {
    checks.push({ label: '포커스 링 (배경 대비)', min: 3, ratio: contrastRatio(colors.border.focus, bg) });
  }
  return checks;
}

function ColorField({
  intent,
  value,
  onChange,
  required,
}: {
  intent: Intent;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const hex = normalizeHex(value);
  const fallback = lightColors[intent].solid;
  const invalid = value.trim() !== '' && !hex;
  const swatch: CSSProperties = {
    width: 40,
    height: 40,
    flexShrink: 0,
    padding: 0,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    background: 'none',
    cursor: 'pointer',
  };
  return (
    <Stack direction="row" gap={2} align="end">
      <input
        type="color"
        aria-label={`${INTENT_LABEL[intent]} 색 고르기`}
        value={hex ?? fallback}
        onChange={(e) => onChange(e.target.value)}
        style={swatch}
      />
      <TextField
        label={INTENT_LABEL[intent]}
        value={value}
        placeholder={required ? '#7c3aed' : `비우면 기본값 (${fallback})`}
        onChange={(e) => onChange(e.target.value)}
        error={invalid}
        helperText={invalid ? 'hex 색으로 적어 주세요 (예: #7c3aed)' : undefined}
        fullWidth
      />
    </Stack>
  );
}

function Preview({ mode, theme }: { mode: ThemeName; theme: BestowTheme }) {
  return (
    <ThemeProvider
      theme={mode}
      overrides={theme}
      style={{ flex: '1 1 340px', padding: 20, borderRadius: 12, border: `1px solid ${vars.color.border.default}` }}
    >
      <Stack gap={4}>
        <Typography variant="h4" as="h3">
          {mode === 'light' ? '라이트' : '다크'}
        </Typography>
        <Stack direction="row" gap={2} wrap>
          <Button>저장</Button>
          <Button variant="soft">soft</Button>
          <Button variant="outline">outline</Button>
          <Button color="danger">삭제</Button>
        </Stack>
        <Stack direction="row" gap={2} wrap>
          <Badge color="primary">primary</Badge>
          <Badge color="success">완료</Badge>
          <Badge color="warning">주의</Badge>
          <Badge color="danger" variant="solid">
            오류
          </Badge>
        </Stack>
        <Alert title="새 버전이 나왔어요">
          변경 내역을 <Link href="#">확인</Link>해 주세요.
        </Alert>
        <TextField label="이메일" placeholder="name@example.com" fullWidth />
        <Stack direction="row" gap={4} align="center" wrap>
          <Checkbox label="약관 동의" defaultChecked />
          <Switch label="알림" defaultChecked />
        </Stack>
        <Slider label="음량" defaultValue={[60]} />
        <Progress label="업로드" value={45} showValue />
      </Stack>
    </ThemeProvider>
  );
}

function Report({ theme }: { theme: BestowTheme }) {
  const light = resolveColors(theme, 'light');
  const dark = resolveColors(theme, 'dark');
  const cell = (check: Check) => {
    const pass = check.ratio >= check.min;
    return (
      <Stack direction="row" gap={2} align="center" justify="end">
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{check.ratio.toFixed(2)}:1</span>
        <Badge color={pass ? 'success' : 'danger'} size="sm">
          {pass ? '통과' : '미달'}
        </Badge>
      </Stack>
    );
  };
  return (
    <Table caption="대비 리포트 (WCAG — 글자 4.5:1, 그래픽 3:1)" size="sm">
      <TableHeader>
        <TableRow>
          <TableHead>의미 색</TableHead>
          <TableHead>검사</TableHead>
          <TableHead align="right">기준</TableHead>
          <TableHead align="right">라이트</TableHead>
          <TableHead align="right">다크</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INTENTS.flatMap((intent) => {
          const lightChecks = checksFor(light, intent);
          const darkChecks = checksFor(dark, intent);
          return lightChecks.map((check, i) => (
            <TableRow key={`${intent}-${check.label}`}>
              {i === 0 && (
                <TableHead rowSpan={lightChecks.length} style={{ verticalAlign: 'top' }}>
                  {intent}
                </TableHead>
              )}
              <TableCell>{check.label}</TableCell>
              <TableCell align="right">{check.min}:1</TableCell>
              <TableCell align="right">{cell(check)}</TableCell>
              <TableCell align="right">{cell(darkChecks[i]!)}</TableCell>
            </TableRow>
          ));
        })}
      </TableBody>
    </Table>
  );
}

function ThemeBuilder({ initialPrimary = '#7c3aed' }: { initialPrimary?: string }) {
  const [state, setState] = useState<BuilderState>({
    colors: { primary: initialPrimary, danger: '', success: '', warning: '' },
    radius: DEFAULT_RADIUS,
    font: DEFAULT_FONT,
  });
  const [copied, setCopied] = useState('');
  const theme = useMemo(() => createTheme(...buildInputs(state)), [state]);
  const code = useMemo(() => buildCode(state), [state]);
  const setColor = (intent: Intent, value: string) =>
    setState((prev) => ({ ...prev, colors: { ...prev.colors, [intent]: value } }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied('코드를 복사했어요.');
    } catch {
      setCopied('복사하지 못했어요. 코드를 직접 선택해 복사해 주세요.');
    }
  };

  return (
    <Stack gap={8}>
      <Stack gap={2}>
        <Typography variant="h2" as="h1">
          테마 빌더
        </Typography>
        <Typography color="muted">
          대표색을 고르면 라이트·다크 색 세트를 만들고, 글자 대비 4.5:1(그래픽 3:1)을 지키는지 바로 보여 줘요. 마음에
          들면 아래 코드를 복사해 쓰세요.
        </Typography>
      </Stack>

      <Stack as="section" gap={4} aria-label="입력">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {INTENTS.map((intent) => (
            <ColorField
              key={intent}
              intent={intent}
              value={state.colors[intent]}
              onChange={(value) => setColor(intent, value)}
              required={intent === 'primary'}
            />
          ))}
          <Select
            label="모서리 (radius.md)"
            value={state.radius}
            onValueChange={(radius) => setState((prev) => ({ ...prev, radius }))}
            options={['0px', '4px', '6px', '8px', '12px', '16px'].map((v) => ({
              value: v,
              label: v === DEFAULT_RADIUS ? `${v} (기본)` : v,
            }))}
            fullWidth
          />
          <Select
            label="글꼴"
            value={state.font}
            onValueChange={(font) => setState((prev) => ({ ...prev, font }))}
            options={Object.entries(FONTS).map(([value, label]) => ({ value, label }))}
            fullWidth
          />
        </div>
      </Stack>

      <Stack as="section" gap={3} aria-label="미리보기">
        <Typography variant="h3" as="h2">
          미리보기
        </Typography>
        <Stack direction="row" gap={4} align="start" wrap>
          <Preview mode="light" theme={theme} />
          <Preview mode="dark" theme={theme} />
        </Stack>
      </Stack>

      <Stack as="section" gap={3} aria-label="대비 리포트">
        <Typography variant="h3" as="h2">
          대비 리포트
        </Typography>
        <Report theme={theme} />
      </Stack>

      <Stack as="section" gap={3} aria-label="코드">
        <Stack direction="row" gap={3} align="center" justify="between" wrap>
          <Typography variant="h3" as="h2">
            코드
          </Typography>
          <Stack direction="row" gap={3} align="center">
            <span role="status" style={{ fontSize: 13, color: vars.color.fg.muted }}>
              {copied}
            </span>
            <Button variant="outline" color="neutral" onClick={copy}>
              코드 복사
            </Button>
          </Stack>
        </Stack>
        <pre
          style={{
            margin: 0,
            padding: 16,
            overflowX: 'auto',
            borderRadius: 8,
            background: vars.color.bg.subtle,
            border: `1px solid ${vars.color.border.default}`,
            fontFamily: vars.font.family.mono,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <code>{code}</code>
        </pre>
      </Stack>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Theme Builder',
  component: ThemeBuilder,
  parameters: {
    docs: {
      description: {
        component:
          '대표색 하나로 브랜드 테마를 만들고 접근성 대비를 확인하는 도구예요. `createIntentColors`·`createTheme`·`contrastRatio` 공개 API 만 사용해요.',
      },
    },
  },
} satisfies Meta<typeof ThemeBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Builder: Story = {
  name: '테마 빌더',
  // 대표색을 바꾸면 코드가 갱신되고, 생성된 색은 모든 대비 검사를 통과한다
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primary = canvas.getByRole('textbox', { name: 'primary (대표색)' });
    await userEvent.clear(primary);
    await userEvent.type(primary, '#0ea5e9');
    await expect(canvas.getByText(/createIntentColors\('primary', '#0ea5e9'\)/)).toBeInTheDocument();
    await expect(canvas.queryAllByText('미달')).toHaveLength(0);
  },
};

/** 아주 밝은 노랑도 글자는 어두운 색, 막대는 진한 색으로 자동 조정된다 */
export const BrightBrand: Story = {
  name: '밝은 대표색 (노랑)',
  args: { initialPrimary: '#facc15' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText('통과').length).toBeGreaterThan(0);
    await expect(canvas.queryAllByText('미달')).toHaveLength(0);
  },
};
