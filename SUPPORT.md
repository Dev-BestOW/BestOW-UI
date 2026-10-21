# 지원 정책

BestOW UI(`@bestow-ui/react` · `@bestow-ui/tokens` · `@bestow-ui/icons`)를 어디까지 지원하고, 어떻게 바뀌는지 정리한 문서예요.

## 지원 범위

| 대상 | 지원 | 확인 방법 (CI) |
|---|---|---|
| 브라우저 | Chrome·Edge·Firefox·Safari 의 **최근 2개 메이저 버전**, iOS Safari·Android Chrome | 모든 스토리(렌더링 + axe 접근성)와 예제 앱 E2E 를 Chromium·WebKit·Firefox 에서 실행, 모바일(iPhone·Pixel) 에뮬레이션 E2E |
| React | **18.x · 19.x** | 단위 테스트·타입 검사·서버 렌더링(SSR) 테스트를 React 18 과 19 로 각각 실행 |
| Next.js | App Router(서버 컴포넌트 포함) | 예제 앱(Next.js 16)을 실제 설치와 같은 조건으로 빌드·E2E (Pages Router 는 테스트하지 않음) |
| TypeScript | 5.x | 타입 선언(`.d.ts`·`.d.cts`) 포함 |
| 접근성 | WCAG 2.2 AA 자동 검사 범위, KWCAG 2.2 대응 근거 문서 | 라이트·다크 테마 axe 검사, 고대비(강제 색상)·320px 리플로·글자 간격·기본 글꼴 2배 E2E |

- 위 범위 밖의 버전(예: 오래된 Safari, React 17)은 동작할 수 있지만 테스트하지 않아요. 문제가 있으면 이슈로 알려 주세요.
- 접근성은 **자동 검사로 확인할 수 있는 범위**까지 보장해요. 스크린리더 수동 점검 결과는 Storybook 의 Accessibility 문서에 따로 기록해요.
  서비스 전체의 접근성 인증은 서비스에서 심사를 받아야 해요(컴포넌트만으로는 인증되지 않아요).

## 버전 정책 (semver)

| 바뀌는 것 | 버전 |
|---|---|
| 공개 이름·타입·CSS 변수(`--bestow-*`)를 바꾸거나 지움 | **major** |
| 새 컴포넌트·기능·prop | minor |
| 버그 수정·내부 변경 | patch |

- 이름을 바꿀 때는 옛 이름을 바로 지우지 않아요. 새 이름을 추가하고 옛 이름은 `@deprecated` 표시와 **개발 모드 경고**를 낸 뒤,
  **다음 major 에서 제거**해요. 바뀌는 내용은 마이그레이션 가이드(`docs/MIGRATION-<major>.md`)에 표로 정리해요.
- 컴포넌트가 그리는 HTML 구조·클래스 이름은 공개 API 가 아니에요. 테스트에서는 역할·이름(`getByRole`)·상태(`toBeChecked` 등)로 찾는 것을 권해요.
  구조가 바뀌어 영향이 있을 수 있으면 릴리스 노트에 적어요.
- `@bestow-ui/icons` 는 아직 0.x 라 minor 에서도 바뀔 수 있어요.

## 배포 주기

- 변경은 [changesets](https://github.com/changesets/changesets) 로 기록하고, **준비되면 배포**해요(정해진 요일 없음).
  main 에 모인 변경은 버전 PR 하나로 묶여, 머지하면 npm 에 나가요 — 한 번에 여러 변경이 함께 나갈 수 있어요.
- 보안 문제나 서비스를 막는 심각한 버그는 기다리지 않고 바로 patch 로 배포해요.
- 버전마다 GitHub Release 와 `CHANGELOG.md` 에 변경 내역이 남아요.

## 이전 major 지원

- 최신 major 에 기능과 버그 수정을 넣어요.
- 새 major 가 나오면 **이전 major 는 6개월 동안 보안·심각한 버그 수정**(patch)만 해요.

## 문의

- 버그·기능 요청: [GitHub Issues](https://github.com/Dev-BestOW/BestOW-UI/issues)
- 보안 문제: 공개 이슈 대신 [SECURITY.md](SECURITY.md) 의 방법으로 알려 주세요.
