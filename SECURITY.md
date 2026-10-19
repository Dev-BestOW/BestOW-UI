# 보안 정책

## 지원하는 버전

| 패키지 | 보안 수정 |
|---|---|
| `@bestow-ui/react`, `@bestow-ui/tokens` | 최신 major. 이전 major 는 새 major 출시 후 6개월 |
| `@bestow-ui/icons` | 최신 0.x |

자세한 정책은 [SUPPORT.md](SUPPORT.md) 를 보세요.

## 보안 문제 알리기

보안 문제는 **공개 이슈로 올리지 말아 주세요.** 저장소의 **Security → Report a vulnerability**
(GitHub 비공개 취약점 신고)로 알려 주세요. 신고 내용은 관리자에게만 보여요.

알려 주실 때 다음이 있으면 빨리 확인할 수 있어요.

- 영향을 받는 패키지와 버전
- 재현 방법(가능하면 최소 예제)
- 예상되는 영향(예: 사용자 입력이 HTML 로 렌더링됨)

## 처리 과정

1. 3영업일 안에 받았다고 답해요.
2. 문제를 확인하면 수정 버전을 준비하고, 배포 일정을 신고하신 분과 맞춰요.
3. 수정 버전을 배포한 뒤 GitHub Security Advisory 로 공개해요. 원하시면 신고하신 분을 감사 명단에 적어요.

## 이 라이브러리의 보안 범위

- 컴포넌트는 `dangerouslySetInnerHTML` 을 쓰지 않고, 전달받은 값은 React 가 이스케이프해 그려요.
- 외부 서비스(예: 카카오 우편번호)는 사용자가 넘기는 공급자(provider)로만 불러요. `kakaoPostcodeProvider` 를 쓰면
  `https://t1.kakaocdn.net` 의 스크립트를 불러오니, 서비스의 CSP(콘텐츠 보안 정책) `script-src` 에 이 주소를 허용해야 해요.
- 업로드(FileUpload)는 파일을 고르기만 하고 서버로 보내지 않아요. 형식·크기 검사는 사용 편의를 위한 것이라 **서버에서 다시 검사해야 해요.**
