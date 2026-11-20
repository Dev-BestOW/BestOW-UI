<!--
PR 제목이 그대로 main 의 커밋 제목이 돼요(squash merge). gitmoji + 한국어 한 줄로 써 주세요.
예: ✨ AmountInput 에 빠른 금액 버튼 추가 · 🐛 Calendar 토요일 대비 수정 · 📝 CONTRIBUTING 브랜치 흐름 정리
-->

## 무엇을 바꿨나요?

<!-- 바꾼 내용과 이유. 관련 이슈가 있으면 "Closes #번호" -->

## 확인한 것

- [ ] `pnpm lint && pnpm format:check && pnpm build && pnpm typecheck && pnpm test` 통과
- [ ] 컴포넌트를 바꿨다면 스토리 라이트·다크와 키보드 동작을 확인
- [ ] 화면이 바뀌면 전·후 스크린샷을 붙였어요

<!-- 아래는 몰라도 괜찮아요 — 메인테이너가 확인해요. 해당 없는 줄은 지워도 돼요. -->

### 메인테이너 확인

- [ ] changeset — 공개 API·화면·`packages/*/package.json` 의 dependencies 가 바뀌면 추가 ([작성법](https://github.com/Dev-BestOW/BestOW-UI/blob/main/CONTRIBUTING.md#changeset-작성법))
- [ ] 시각 회귀 — 새 스토리만(머지 뒤 봇이 기준 이미지 추가) / 기존 화면 바뀜(Visual regression 을 이 브랜치로 update 실행)
- [ ] 접근성 — 동작이 바뀌면 `apps/storybook/stories/accessibility/` 의 `componentA11y.ts`·`kwcag.ts`
- [ ] 공개 이름 — 바꾸거나 더했으면 `docs/ai/bestow-ui.md`·`context7.json`·README 컴포넌트 표, 이름 변경은 deprecated 절차
- [ ] 한국 키트·korean-utils — 사이트 문서(`apps/site` 의 `components/kit.ts`·`korean-utils/guides.ts`)와 글 수정일
- [ ] 사이트 쪽·메타 — 제목 40자·설명 80자, canonical·사이트맵(네이버 웹마스터 가이드)
