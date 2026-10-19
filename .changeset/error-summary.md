---
'@bestow-ui/react': minor
---

폼 오류 처리를 위한 컴포넌트를 추가했어요.

- `ErrorSummary` — 제출에 실패했을 때 고칠 곳을 모아 보여 주고 포커스를 받아요. 링크로 각 칸에 바로 가요(묶음은 선택된·첫 항목).
  `focusKey` 에 제출 횟수를 넘기면 다시 제출해도 오류가 남아 있을 때 다시 포커스해요. react-hook-form 과 함께 쓰는 방법을 문서에 담았어요.
- `focusField(id)` — 칸 id 로 포커스를 옮기는 함수(서버 컴포넌트 파일에서도 import 가능).
- `VisuallyHidden` — 화면에는 안 보이고 스크린리더만 읽는 글자.
- `AgreementGroup` 에 `id` prop 을 추가했어요(ErrorSummary 링크가 가리킬 수 있게).
