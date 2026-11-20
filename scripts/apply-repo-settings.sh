#!/usr/bin/env bash
# 저장소 병합 설정과 main ruleset(.github/rulesets/main.json)을 GitHub 에 적용한다. 메인테이너가 직접 실행한다(Claude 는 실행하지 않음).
#
#   scripts/apply-repo-settings.sh <release App ID>
#
# App ID 는 GitHub › Settings › Developer settings › GitHub Apps › bestow-ui-release › General 의 "App ID"(숫자).
# 봇(버전 PR·시각 회귀 기준 이미지 커밋)이 main 에 바로 push 하므로 ruleset 우회 목록에 넣어야 한다.
# 필수 검사 이름은 ci.yml·visual.yml 의 job name 이다 — job 이름을 바꾸면 main.json 도 고치고 다시 실행한다.
set -euo pipefail

app_id="${1:?사용법: $0 <release App ID>}"
repo="Dev-BestOW/BestOW-UI"
ruleset_name="main 보호"
root="$(cd "$(dirname "$0")/.." && pwd)"

# squash 만 허용, 제목은 PR 제목(gitmoji 한 줄)·본문은 커밋 메시지(PR 템플릿 체크리스트가 기록에 남지 않게), 머지된 브랜치 자동 삭제, auto-merge 허용
gh api -X PATCH "repos/$repo" \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -f squash_merge_commit_title=PR_TITLE -f squash_merge_commit_message=COMMIT_MESSAGES \
  -F delete_branch_on_merge=true -F allow_auto_merge=true >/dev/null
echo "병합 설정 적용"

body="$(sed "s/\"RELEASE_APP_ID\"/$app_id/" "$root/.github/rulesets/main.json")"
id="$(gh api "repos/$repo/rulesets" --jq ".[] | select(.name == \"$ruleset_name\") | .id")"
if [ -n "$id" ]; then
  echo "$body" | gh api -X PUT "repos/$repo/rulesets/$id" --input - >/dev/null
  echo "ruleset 갱신: https://github.com/$repo/rules/$id"
else
  echo "$body" | gh api -X POST "repos/$repo/rulesets" --input - >/dev/null
  echo "ruleset 생성"
fi
