// AI 코딩 도구(LLM)가 읽을 llms-full.txt 를 만든다 — Storybook 문서는 JS 로 그려져 도구가 읽기 어렵다.
// README + 컴포넌트마다 props 정의(JSDoc 포함, 소스에서 그대로) + "언제 무엇을 쓰나" + 키보드·스크린리더 메모.
// 소스에서 매번 만들어 코드와 어긋나지 않게 한다. Storybook 빌드 전에 실행(apps/storybook 의 build), 결과는 커밋하지 않는다.
//   node scripts/generate-llms.mjs [출력 폴더 = apps/storybook/public]
import { readdirSync, readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(process.argv[2] ?? join(root, 'apps/storybook/public'));
const raw = (path) => `https://raw.githubusercontent.com/Dev-BestOW/BestOW-UI/main/${path}`;
const read = (path) => readFileSync(join(root, path), 'utf8');

// 배지·이미지 줄은 텍스트 도구에 쓸모가 없어 뺀다. 맨 위 제목(# 패키지 이름)은 섹션 제목이 대신하고, 나머지 제목은 한 단계 내린다
const readme = (path) =>
  read(path)
    .split('\n')
    .filter((line) => !/^\s*!?\[!\[|^!\[/.test(line) && !/^# /.test(line))
    .map((line) => line.replace(/^(#{2,5}) /, '#$1 '))
    .join('\n')
    .trim();

/** `export interface X {` ~ 줄 맨 앞의 `}` 까지와, 바로 위 JSDoc. 한 줄 `export type` 도 */
function publicTypes(code) {
  const blocks = [];
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isInterface = /^export interface \w+/.test(line);
    const isType = /^export type \w+/.test(line);
    if (!isInterface && !isType) continue;
    let start = i;
    // 바로 위의 /** … */ 를 함께
    if (lines[i - 1]?.trim().endsWith('*/')) {
      start = i - 1;
      while (start > 0 && !lines[start].trim().startsWith('/**')) start--;
    }
    let end = i;
    if (isInterface && !line.trim().endsWith('}')) while (end < lines.length && lines[end] !== '}') end++;
    if (isType) while (end < lines.length && !lines[end].trimEnd().endsWith(';')) end++;
    blocks.push(lines.slice(start, end + 1).join('\n'));
    i = end;
  }
  return blocks.join('\n\n');
}

/** export 한 컴포넌트·함수 바로 위의 JSDoc 설명 (있으면) */
function componentDocs(code) {
  const docs = [];
  for (const [, doc, name] of code.matchAll(/\/\*\*\n((?: \*.*\n)+?) \*\/\nexport (?:const|function) (\w+)/g)) {
    docs.push(`${name}: ${doc.replace(/^ \* ?/gm, '').trim()}`);
  }
  return docs.join('\n');
}

const reactPkg = JSON.parse(read('packages/react/package.json'));
const { choosing } = await import(join(root, 'apps/storybook/stories/guides/choosing.ts'));
const { componentA11y } = await import(join(root, 'apps/storybook/stories/accessibility/componentA11y.ts'));

const out = [];
out.push(`# BestOW UI — 전체 문서 (LLM 용)

> 한국 서비스를 만들 때 바로 쓰는, 접근성이 검증된 React 디자인 시스템. npm \`@bestow-ui/react\`.
> 저장소 main 의 소스(@bestow-ui/react ${reactPkg.version} 기준)에서 자동으로 만든 파일이에요 — npm 최신 버전보다 앞선 내용이 있을 수 있어요.

사용 규칙 요약:
- 앱 진입점에서 \`import '@bestow-ui/react/styles.css'\` 를 한 번, 최상위를 \`<ThemeProvider theme="light">\` 로 감싼다(Toast 를 쓰면 \`<ToastProvider>\` 도).
- Next.js App Router: Provider 는 'use client' 파일로. Card·Typography·Stack 같은 표시용 컴포넌트와 서식 함수는 서버 컴포넌트에서도 쓴다.
- 폼 컴포넌트는 \`label\`·\`helperText\`·\`error\`·\`required\` 로 접근성 연결이 자동이다. 값을 고르는 컴포넌트는 \`value\`/\`onValueChange\`.
- 한국 서비스 입력(전화번호·사업자번호·금액 등)은 숫자만 든 문자열·number 를 값으로 주고받는다(하이픈·쉼표는 화면 표시용).
- 색·간격은 하드코딩하지 말고 테마(\`createTheme\`·\`createIntentColors\`·\`vars\`)로.`);

out.push(`## README — @bestow-ui/react\n\n${readme('packages/react/README.md')}`);
out.push(`## README — @bestow-ui/korean-utils\n\n${readme('packages/korean-utils/README.md')}`);

out.push(
  `## 언제 무엇을 쓰나\n\n` +
    choosing
      .map(
        (group) =>
          `### ${group.group}\n${group.rule}\n` +
          group.items
            .map((item) => `- ${item.name}: ${item.when}${item.avoid ? ` 피할 때: ${item.avoid}` : ''}`)
            .join('\n'),
      )
      .join('\n\n'),
);

out.push(
  `## 키보드·스크린리더 동작\n\n` +
    componentA11y
      .flatMap((group) => group.items)
      .map(
        (item) =>
          `- ${item.name} — 키보드: ${item.keyboard || 'Tab 으로 포커스만(또는 포커스 없음)'} / 스크린리더: ${item.screenReader}` +
          (item.yours ? ` / 사용하는 쪽: ${item.yours}` : ''),
      )
      .join('\n'),
);

const componentsDir = 'packages/react/src/components';
const sections = [];
for (const name of readdirSync(join(root, componentsDir)).sort()) {
  const files = readdirSync(join(root, componentsDir, name)).filter(
    (file) => /\.tsx?$/.test(file) && !/\.(test|stories|css)\.tsx?$/.test(file) && file !== 'index.ts',
  );
  const parts = [];
  for (const file of files) {
    const code = read(join(componentsDir, name, file));
    const docs = componentDocs(code);
    const types = publicTypes(code);
    if (docs || types) {
      parts.push(
        [`소스: ${raw(`${componentsDir}/${name}/${file}`)}`, docs, types && `\`\`\`ts\n${types}\n\`\`\``]
          .filter(Boolean)
          .join('\n'),
      );
    }
  }
  if (parts.length) sections.push(`### ${name}\n\n${parts.join('\n\n')}`);
}
out.push(`## 컴포넌트 API (props 정의 — 소스 그대로)\n\n${sections.join('\n\n')}`);

const themeFiles = [
  'src/theme/createTheme.ts',
  'src/theme/color.ts',
  'src/theme/ThemeProvider.tsx',
  'src/i18n/LocaleProvider.tsx',
];
const theme = themeFiles
  .map((file) => `packages/react/${file}`)
  .filter((path) => existsSync(join(root, path)))
  .map((path) => {
    const code = read(path);
    return [`소스: ${raw(path)}`, componentDocs(code), `\`\`\`ts\n${publicTypes(code)}\n\`\`\``]
      .filter(Boolean)
      .join('\n');
  });
out.push(`## 테마·문구 API\n\n${theme.join('\n\n')}`);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'llms-full.txt'), out.join('\n\n') + '\n');
console.log(`llms-full.txt (${Math.round(out.join('\n\n').length / 1024)} KB) → ${outDir}`);
