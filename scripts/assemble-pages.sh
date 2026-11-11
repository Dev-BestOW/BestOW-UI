#!/usr/bin/env bash
# GitHub Pages 에 올릴 폴더를 만든다 (.github/workflows/storybook.yml). 먼저 build-storybook·build-site·build-playground 가 필요하다.
#   /                → apps/site/out (소개 사이트 — 옛 Storybook 주소 ?path=… 는 /storybook/ 으로 넘겨준다)
#   /storybook/      → apps/storybook/storybook-static
#   /playground/     → apps/playground/out
#   /llms.txt·llms-full.txt → Storybook public 에서 루트로도 (README·npm·AI 도구가 이 주소를 쓴다)
set -euo pipefail
out="${1:?usage: assemble-pages.sh <out-dir>}"
rm -rf "$out"
cp -R apps/site/out "$out"
cp -R apps/storybook/storybook-static "$out/storybook"
cp -R apps/playground/out "$out/playground"
cp apps/storybook/storybook-static/llms.txt apps/storybook/storybook-static/llms-full.txt "$out/"
# 루트에 있어야 할 파일이 빠지면 배포하지 않는다
for file in index.html og.png sitemap.xml iframe.html llms.txt llms-full.txt storybook/index.html storybook/iframe.html playground/index.html; do
  test -f "$out/$file" || { echo "::error::$file 이 없습니다"; exit 1; }
done
echo "assembled $out"
