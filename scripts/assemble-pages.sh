#!/usr/bin/env bash
# GitHub Pages 에 올릴 폴더를 만든다 (.github/workflows/storybook.yml). 먼저 build-storybook·build-site·build-playground 가 필요하다.
#   /                → apps/site/out (소개 사이트 — 옛 Storybook 주소 ?path=… 는 /storybook/ 으로 넘겨준다)
#   /storybook/      → apps/storybook/storybook-static
#   /playground/     → apps/playground/out
#   /llms.txt·llms-full.txt → Storybook public 에서 루트로도 (README·npm·AI 도구가 이 주소를 쓴다)
#   /ai/bestow-ui.md·.mdc  → AI 코딩 도구 규칙 파일 (원본 docs/ai/bestow-ui.md, generate-llms.mjs 가 만든다)
#   /.well-known/security.txt → 보안 연락처 (원본 apps/site/public). 숨김 폴더라 storybook.yml 의 include-hidden-files 가 필요하다
set -euo pipefail
out="${1:?usage: assemble-pages.sh <out-dir>}"
rm -rf "$out"
cp -R apps/site/out "$out"
cp -R apps/storybook/storybook-static "$out/storybook"
cp -R apps/playground/out "$out/playground"
cp apps/storybook/storybook-static/llms.txt apps/storybook/storybook-static/llms-full.txt "$out/"
cp -R apps/storybook/storybook-static/ai "$out/ai"
# 루트에 있어야 할 파일이 빠지면 배포하지 않는다
for file in index.html og.png sitemap.xml robots.txt iframe.html .well-known/security.txt llms.txt llms-full.txt ai/bestow-ui.md ai/bestow-ui.mdc storybook/index.html storybook/iframe.html playground/index.html; do
  test -f "$out/$file" || { echo "::error::$file 이 없습니다"; exit 1; }
done
# Storybook 템플릿의 파비콘은 상대 경로(./favicon.svg)라 절대 주소로 바꾼다 — 네이버 웹마스터 가이드 "파비콘": href 절대 경로.
# 링크를 하나 더 다는 대신 바꾸는 이유: 같은 rel 의 파비콘이 둘이면 반영되지 않을 수 있다. 주소는 manager-head.html 과 같은 배포 주소.
sb_favicon='https://bestow-ui.com/storybook/favicon.svg'
perl -pi -e "s#href=\"\\./favicon\\.svg\"#href=\"$sb_favicon\"#" "$out/storybook/index.html"
grep -q "rel=\"icon\"[^>]*href=\"$sb_favicon\"" "$out/storybook/index.html" || { echo "::error::Storybook 파비콘을 절대 주소로 바꾸지 못했습니다(템플릿이 바뀌었는지 확인)"; exit 1; }
# include-hidden-files 로 숨김 파일도 올라가므로 .well-known 말고는 없어야 한다 (.DS_Store·.env 같은 것이 섞여 배포되지 않게)
hidden=$(cd "$out" && find . -name '.*' ! -path './.well-known' ! -path './.well-known/*' ! -name '.' | sort)
if [ -n "$hidden" ]; then
  echo "::error::배포 폴더에 숨김 파일이 있습니다: $hidden"
  exit 1
fi
echo "assembled $out"
