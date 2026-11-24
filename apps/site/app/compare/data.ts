// 다른 라이브러리와 비교(/compare/) — 루트 README "다른 선택지와 비교" 표와 같은 내용. 한쪽을 고치면 다른 쪽도 고친다.
// 다른 라이브러리 칸은 그 라이브러리의 공식 문서·README·npm 에서 확인한 것만 적고, 근거 링크를 단다.
// 찾지 못한 것은 "없다" 가 아니라 "찾지 못함" 으로 적는다. 값을 다시 확인하면 checkedAt 도 바꾼다.
import { links, storybookHref } from '../links';

/** 마지막으로 각 공식 문서를 다시 확인한 날 */
export const checkedAt = '2026-11-17';

/** /compare/ 의 게시·마지막 수정 날짜 — 쪽 머리·JSON-LD·sitemap lastmod 가 함께 쓴다 */
export const compareDates = { published: '2026-11-17', modified: checkedAt };

export const rows = [
  { key: 'audience', label: '누구를 위해' },
  { key: 'distribution', label: '쓰는 방식' },
  { key: 'stack', label: '기반·스타일' },
  { key: 'koreanInputs', label: '한국 서비스 입력' },
  { key: 'messages', label: '기본 문구' },
  { key: 'a11y', label: '접근성 근거' },
  { key: 'contrast', label: '브랜드색을 넣었을 때 대비' },
] as const;

export type RowKey = (typeof rows)[number]['key'];

export interface Cell {
  text: string;
  /** 근거 — 링크 글자는 짧게(어떤 문서인지) */
  source?: { label: string; href: string };
}

export interface ComparedLibrary {
  name: string;
  href: string;
  cells: Record<RowKey, Cell>;
}

const vaporPrinciples = 'https://vapor-ui.goorm.io/docs/getting-started/principles';
const vaporNpm = 'https://www.npmjs.com/package/@vapor-ui/core';
const hanuiReadme = 'https://github.com/oddodd-io/hanui';
const shadcnDocs = 'https://ui.shadcn.com/docs';

export const comparedLibraries: ComparedLibrary[] = [
  {
    name: 'BestOW UI',
    href: links.github,
    cells: {
      audience: { text: '한국 민간 서비스 — 대표색 하나로 내 브랜드' },
      distribution: { text: 'npm 패키지', source: { label: 'npm', href: links.npm } },
      stack: { text: 'Radix + vanilla-extract, CSS 파일 하나' },
      koreanInputs: { text: '기본 제공(13종)', source: { label: '컴포넌트 문서', href: links.components } },
      messages: { text: '한국어(영어 묶음 en 포함)' },
      a11y: {
        text: 'KWCAG 2.2 33개 항목별 대응 문서, 모든 스토리 axe CI(3개 브라우저·라이트·다크), 스크린리더 점검 기록',
        source: { label: 'KWCAG 대응 문서', href: links.kwcag },
      },
      contrast: {
        text: '글자 4.5:1 자동 보장·테스트',
        source: { label: '테마 빌더', href: storybookHref('/story/foundations-theme-builder--builder') },
      },
    },
  },
  {
    name: 'Vapor UI',
    href: vaporPrinciples,
    cells: {
      audience: { text: '구름 서비스의 디자인 시스템' },
      distribution: { text: 'npm 패키지', source: { label: 'npm', href: vaporNpm } },
      stack: { text: 'Base UI + vanilla-extract', source: { label: '원칙 문서·npm', href: vaporPrinciples } },
      koreanInputs: { text: '찾지 못함' },
      messages: { text: '찾지 못함' },
      a11y: { text: 'WCAG 2.2 AA 준수', source: { label: '원칙 문서', href: vaporPrinciples } },
      contrast: {
        text: '대비를 맞춘 팔레트 생성(Color Generator)',
        source: { label: '원칙 문서', href: vaporPrinciples },
      },
    },
  },
  {
    name: 'HANUI',
    href: hanuiReadme,
    cells: {
      audience: { text: '공공 웹사이트(정부 디자인 시스템 KRDS)', source: { label: 'README', href: hanuiReadme } },
      distribution: {
        text: '코드 복사(CLI) 또는 npm(0.x)',
        source: { label: 'npm', href: 'https://www.npmjs.com/package/@hanui/react' },
      },
      stack: { text: 'Radix + Tailwind', source: { label: 'README', href: hanuiReadme } },
      koreanInputs: { text: '찾지 못함' },
      messages: { text: '찾지 못함' },
      a11y: { text: 'KWCAG 2.2 / WCAG 2.1 AA', source: { label: 'README', href: hanuiReadme } },
      contrast: { text: '찾지 못함' },
    },
  },
  {
    name: 'shadcn/ui',
    href: shadcnDocs,
    cells: {
      audience: { text: '범용' },
      distribution: { text: '코드 복사(CLI)', source: { label: '소개 문서', href: shadcnDocs } },
      stack: {
        text: 'Tailwind 필요',
        source: { label: '설치 문서', href: 'https://ui.shadcn.com/docs/installation/manual' },
      },
      koreanInputs: {
        text: '직접 구현',
        source: { label: '컴포넌트 목록', href: 'https://ui.shadcn.com/docs/components' },
      },
      messages: { text: '복사한 코드에서 직접 수정' },
      a11y: { text: '찾지 못함' },
      contrast: { text: '직접 확인' },
    },
  },
  {
    name: 'MUI',
    href: 'https://mui.com/material-ui/',
    cells: {
      audience: { text: '범용(Material Design)' },
      distribution: {
        text: 'npm 패키지',
        source: { label: 'npm', href: 'https://www.npmjs.com/package/@mui/material' },
      },
      stack: {
        text: 'Emotion(기본)',
        source: { label: '설치 문서', href: 'https://mui.com/material-ui/getting-started/installation/' },
      },
      koreanInputs: {
        text: '직접 구현',
        source: { label: '컴포넌트 목록', href: 'https://mui.com/material-ui/all-components/' },
      },
      messages: {
        text: '영어, 한국어 로캘 koKR 제공',
        source: { label: '다국어 문서', href: 'https://mui.com/material-ui/guides/localization/' },
      },
      a11y: {
        text: 'WCAG 2.2 A·AA 대응 보고서(초안, 일부 컴포넌트, 자체 평가)',
        source: { label: '접근성 문서', href: 'https://mui.com/material-ui/getting-started/accessibility/' },
      },
      contrast: {
        text: '글자색 자동 선택(기본 3:1, contrastThreshold 로 4.5:1)',
        source: { label: '색 문서', href: 'https://mui.com/material-ui/customization/palette/' },
      },
    },
  },
];
