import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { TextField } from '../components/Input';
import { Select } from '../components/Select';
import { Stack } from '../components/Stack';
import { Typography } from '../components/Typography';
import { createIntentColors } from './color';
import { vars } from './contract.css';
import { createTheme } from './createTheme';
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

function collect(tree: Tree, path: string[] = [], out: Array<[string, string]> = []) {
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === 'string') out.push([[...path, key].join('.'), value.replace(/^var\((.*)\)$/, '$1')]);
    else collect(value, [...path, key], out);
  }
  return out;
}

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
              <td style={{ padding: '4px 8px', fontFamily: vars.font.family.mono }}>{path}</td>
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
