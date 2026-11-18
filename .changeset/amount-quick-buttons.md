---
"@bestow-ui/react": minor
---

AmountInput 에 빠른 금액 버튼을 추가했어요 — `quickAmounts={[10000, 50000]}` 는 누를 때마다 더하는 "+1만"·"+5만" 버튼, `showMaxButton` 은 max 로 채우는 "전액" 버튼이에요. 누른 뒤 합계를 스크린리더에 알려요. 문구는 `quickAmountsLabel`·`maxButtonText` prop 이나 LocaleProvider 의 `quickAmounts`·`maxAmount` 로 바꿔요.
