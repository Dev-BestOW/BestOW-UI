// 소스에서 공개 타입 정의(interface·type)를 JSDoc 째 뽑는다 — llms-full.txt(generate-llms.mjs)와
// 소개 사이트 컴포넌트 문서(apps/site/app/components/source.ts)가 함께 쓴다.

/** `export interface X {` ~ 줄 맨 앞의 `}` 까지와, 바로 위 JSDoc. 한 줄 `export type` 도 */
export function publicTypes(code) {
  const blocks = [];
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isInterface = /^export interface \w+/.test(line);
    const isType = /^export type \w+/.test(line);
    if (!isInterface && !isType) continue;
    let start = i;
    // 바로 위의 /** … */ 를 함께
    if (lines[i - 1]?.trim().endsWith('*/')) {
      start = i - 1;
      while (start > 0 && !lines[start].trim().startsWith('/**')) start--;
    }
    let end = i;
    if (isInterface && !line.trim().endsWith('}')) while (end < lines.length && lines[end] !== '}') end++;
    if (isType) while (end < lines.length && !lines[end].trimEnd().endsWith(';')) end++;
    blocks.push(lines.slice(start, end + 1).join('\n'));
    i = end;
  }
  return blocks.join('\n\n');
}
