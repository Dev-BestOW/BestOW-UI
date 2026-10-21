import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { darkColors, lightColors, palette } from '@bestow-ui/tokens';
import { expect, within } from 'storybook/test';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { TextField } from '../components/Input';
import { RadioGroup } from '../components/RadioGroup';
import { Select } from '../components/Select';
import { Stack } from '../components/Stack';
import { Stepper } from '../components/Stepper';
import { Switch } from '../components/Switch';
import { Textarea } from '../components/Textarea';
import { Typography } from '../components/Typography';
import { VerificationCodeInput } from '../components/VerificationCodeInput';
import { createIntentColors } from './color';
import { vars } from './contract.css';
import { createTheme } from './createTheme';
import { strongInputBorders } from './presets';
import { ThemeProvider } from './ThemeProvider';

interface ThemingArgs {
  primary: string;
  danger: string;
  radius: string;
  fontFamily: string;
}

function Preview({ primary, danger, radius, fontFamily }: ThemingArgs) {
  const brand = useMemo(
    () =>
      createTheme(createIntentColors('primary', primary), createIntentColors('danger', danger), {
        common: { radius: { md: radius }, font: { family: { sans: fontFamily } } },
      }),
    [primary, danger, radius, fontFamily],
  );

  return (
    // theme 을 생략하면 툴바의 라이트/다크 모드를 그대로 이어받는다
    <ThemeProvider overrides={brand} style={{ padding: 24, borderRadius: 12 }}>
      <Stack gap={4}>
        <Typography variant="h3">브랜드 테마 미리보기</Typography>
        <Stack direction="row" gap={2} wrap>
          <Button>solid</Button>
          <Button variant="soft">soft</Button>
          <Button variant="outline">outline</Button>
          <Button variant="ghost">ghost</Button>
          <Button color="danger">삭제</Button>
          <Button color="danger" variant="soft">
            삭제
          </Button>
        </Stack>
        <Stack direction="row" gap={4} align="end" wrap>
          <TextField label="이메일" placeholder="name@example.com" />
          <Select
            label="플랜"
            placeholder="선택하세요"
            options={[
              { value: 'free', label: 'Free' },
              { value: 'pro', label: 'Pro' },
            ]}
          />
        </Stack>
        <Checkbox label="이용약관에 동의합니다" defaultChecked />
        <Typography color="primary">primary 글자색 (배경 대비 4.5:1 이상으로 자동 계산)</Typography>
      </Stack>
    </ThemeProvider>
  );
}

const meta = {
  title: 'Foundations/Theming',
  component: Preview,
  args: {
    primary: '#7c3aed',
    danger: '#e11d48',
    radius: '8px',
    fontFamily: 'system-ui, sans-serif',
  },
  argTypes: {
    primary: { control: 'color' },
    danger: { control: 'color' },
    radius: { control: 'inline-radio', options: ['0px', '4px', '8px', '12px', '9999px'] },
    fontFamily: {
      control: 'select',
      options: ['system-ui, sans-serif', 'Georgia, serif', '"JetBrains Mono", monospace'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
\`createTheme\` 으로 브랜드 테마를 만들고 \`ThemeProvider\` 의 \`overrides\` 로 넘겨요. 라이트/다크 모드(\`theme\`)와 따로 동작해서 모드를 바꿔도 브랜드는 유지돼요.

\`\`\`tsx
import { ThemeProvider, createTheme, createIntentColors } from '@bestow-ui/react';

const brand = createTheme(
  createIntentColors('primary', '#7c3aed'),          // 대표색 하나로 라이트·다크 색 세트 자동 생성
  {
    common: { radius: { md: '6px' } },                // 라이트·다크 공통
    dark: { color: { bg: { default: '#0b0b10' } } },  // 모드별 값
  },
);

<ThemeProvider theme={mode} overrides={brand}>…</ThemeProvider>
\`\`\`

ThemeProvider 없이 CSS 로 직접 바꿀 수도 있어요: \`:root { --bestow-color-primary-solid: #7c3aed; }\` (변수 목록은 아래 "CSS 변수" 스토리).
`,
      },
    },
  },
} satisfies Meta<typeof Preview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const YellowBrand: Story = {
  name: '밝은 브랜드색 (자동 대비)',
  args: { primary: '#facc15' },
};

type Tree = { [key: string]: string | Tree };

// 기본값이 없는 선택 토큰 — 지정하지 않으면 쓰는 곳에서 기존 토큰을 따른다 (contract.css.ts 의 optionalTokens)
const OPTIONAL_TOKENS = new Set(['color.border.input', 'color.border.inputHover', 'color.border.control']);

function collect(tree: Tree, path: string[] = [], out: Array<[string, string]> = []) {
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === 'string') out.push([[...path, key].join('.'), value.replace(/^var\((.*)\)$/, '$1')]);
    else collect(value, [...path, key], out);
  }
  return out;
}

function InputSamples({ label }: { label: string }) {
  return (
    <Stack gap={4} style={{ maxWidth: 360 }}>
      <TextField label={`${label} · 이름`} fullWidth />
      <Select
        label={`${label} · 플랜`}
        placeholder="선택하세요"
        fullWidth
        options={[
          { value: 'free', label: 'Free' },
          { value: 'team', label: 'Team' },
        ]}
      />
      <Textarea aria-label={`${label} · 메모`} placeholder="메모" />
      <VerificationCodeInput label={`${label} · 인증번호`} length={4} />
      <Checkbox label={`${label} · 동의`} />
      <RadioGroup
        label={`${label} · 배송`}
        options={[
          { value: 'normal', label: `${label} 일반` },
          { value: 'fast', label: `${label} 빠른` },
        ]}
      />
      <Switch label={`${label} · 알림`} />
      <Stepper aria-label={`${label} · 단계`} steps={[{ label: '정보' }, { label: '확인' }]} current={0} />
    </Stack>
  );
}

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};

/**
 * 기본 입력 테두리(border.default)는 흰 배경과 1.3:1 이라 칸의 경계가 잘 보이지 않아요(WCAG 1.4.11 비텍스트 대비 3:1 미만).
 * Checkbox·Radio 테두리와 꺼진 Switch·Stepper 예정 단계(border.strong)도 라이트에서 2.07:1 이에요.
 * `strongInputBorders` 를 테마에 더하면 입력 칸(Input·Select·Combobox·DatePicker·서식 입력·Textarea·인증번호 칸)과 체크 컨트롤의 테두리가 3:1 이상으로 진해져요.
 * 2.0 에서 기본값이 될 예정이에요. 값만 바꾸려면 `color.border.input`·`inputHover`·`control` 토큰을 직접 지정해요(CSS: `--bestow-color-border-input` 등).
 *
 * ```tsx
 * <ThemeProvider overrides={createTheme(strongInputBorders)}>…</ThemeProvider>
 * createTheme(createIntentColors('primary', '#7c3aed'), strongInputBorders) // 브랜드 테마와 함께
 * ```
 */
export const StrongInputBorders: Story = {
  name: '진한 입력 테두리 (strongInputBorders)',
  render: () => {
    const theme = createTheme(strongInputBorders);
    return (
      <Stack direction="row" gap={8} wrap>
        <InputSamples label="기본" />
        <ThemeProvider overrides={theme}>
          <InputSamples label="진하게" />
        </ThemeProvider>
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dark = canvasElement.querySelector('[data-theme]')?.getAttribute('data-theme') === 'dark';
    const colors = dark ? darkColors : lightColors;
    const expected = {
      기본: { input: colors.border.default, control: colors.border.strong },
      진하게: dark
        ? { input: palette.gray[500], control: palette.gray[500] }
        : { input: palette.gray[600], control: palette.gray[600] },
    };
    for (const [label, { input: color, control }] of Object.entries(expected)) {
      const field = canvas.getByRole('textbox', { name: `${label} · 이름` }).parentElement!;
      const select = canvas.getByRole('combobox', { name: `${label} · 플랜` });
      const textarea = canvas.getByRole('textbox', { name: `${label} · 메모` });
      const code = canvas.getByRole('textbox', { name: new RegExp(`^${label} · 인증번호`) });
      const slot = code.parentElement!.querySelector('[aria-hidden]')!;
      for (const element of [field, select, textarea, slot]) {
        await expect(getComputedStyle(element).borderTopColor).toBe(rgb(color));
      }
      // 체크 컨트롤: Checkbox·Radio 테두리, 꺼진 Switch 트랙(배경), Stepper 예정 단계의 원 테두리
      const checkbox = canvas.getByRole('checkbox', { name: `${label} · 동의` });
      const radio = canvas.getByRole('radio', { name: `${label} 일반` });
      const track = canvas.getByRole('switch', { name: `${label} · 알림` });
      const upcoming = canvas.getByRole('list', { name: `${label} · 단계` }).querySelectorAll('[aria-hidden]')[1]!;
      for (const element of [checkbox, radio, upcoming]) {
        await expect(getComputedStyle(element).borderTopColor).toBe(rgb(control));
      }
      await expect(getComputedStyle(track).backgroundColor).toBe(rgb(control));
    }
  },
};

export const CssVariables: Story = {
  name: 'CSS 변수',
  render: () => {
    const rows = collect(vars as unknown as Tree);
    return (
      <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%' }}>
        <thead>
          <tr>
            {['토큰 경로 (vars.…)', 'CSS 변수', '미리보기 · 사용 예'].map((h) => (
              <th
                key={h}
                style={{ textAlign: 'left', padding: 8, borderBottom: `1px solid ${vars.color.border.default}` }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([path, cssVar]) => (
            <tr key={cssVar}>
              <td style={{ padding: '4px 8px', fontFamily: vars.font.family.mono }}>
                {path}
                {/* 경로 옆에 붙이면 첫 열이 넓어져 다른 행이 줄바꿈된다 — 아래 줄에 작게 */}
                {OPTIONAL_TOKENS.has(path) && (
                  <div style={{ fontFamily: vars.font.family.sans, fontSize: 11, color: vars.color.fg.muted }}>
                    선택 · 기본값 없음
                  </div>
                )}
              </td>
              <td style={{ padding: '4px 8px', fontFamily: vars.font.family.mono }}>{cssVar}</td>
              <td style={{ padding: '4px 8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {path.startsWith('color.') && (
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        background: `var(${cssVar})`,
                        border: `1px solid ${vars.color.border.default}`,
                      }}
                    />
                  )}
                  <code>{`var(${cssVar})`}</code>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
