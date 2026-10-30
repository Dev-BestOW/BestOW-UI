---
'@bestow-ui/react': patch
---

폼 컴포넌트가 `form.reset()` 에 네이티브 입력처럼 반응해요. 전화번호·사업자번호·금액·숫자·주민번호·인증번호·날짜·기간·주소 입력, Combobox, RadioGroup, CheckboxGroup, AgreementGroup, SegmentedControl, Slider, FileUpload, Textarea 글자 수가 처음 값으로 돌아가요. 제어 모드는 값을 바꾸지 않으며, Switch 도 제어 모드에서는 더 이상 `onCheckedChange` 를 부르지 않아요(react-hook-form `reset()` 의 새 값을 덮어쓰던 문제).
