// CHANGELOG 항목(마크다운 조각)을 HTML 로 — 쓰는 문법만: 문단, 들여쓴 목록, `코드`, **굵게**, [글자](주소), 맨 주소.
// 라이브러리를 들이지 않으려고 직접 그린다. 모르는 문법은 글자 그대로 보인다(빠지지 않는다).
import type { ReactNode } from 'react';

// 굵게는 앞뒤가 별표가 아닌 ** 쌍만 — 주민번호 가림 예시(900101-1******)의 별표를 굵게로 잘못 읽지 않게
const inline =
  /(`[^`]+`)|(?<!\*)\*\*([^*\s](?:[^*]*[^*\s])?)\*\*(?!\*)|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s)`]+)/g;

export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(inline)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1])
      parts.push(
        <code key={key} className="doc-inline-code">
          {m[1].slice(1, -1)}
        </code>,
      );
    else if (m[2])
      parts.push(
        <strong key={key}>
          <Inline text={m[2]} />
        </strong>,
      );
    else if (m[3])
      parts.push(
        <a key={key} href={m[4]}>
          <Inline text={m[3]} />
        </a>,
      );
    else if (m[5])
      parts.push(
        <a key={key} href={m[5]}>
          {m[5]}
        </a>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const indentOf = (line: string) => line.length - line.trimStart().length;

/** 줄 묶음 → 문단과 목록. 목록 항목 아래 더 들여쓴 줄은 그 항목의 내용(하위 목록·이어지는 줄) */
export function Block({ lines }: { lines: string[] }) {
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.trim() === '') {
      i++;
      continue;
    }
    if (/^- /.test(line)) {
      const items: string[][] = [];
      while (i < lines.length && (/^- /.test(lines[i]!) || lines[i]!.trim() === '' || indentOf(lines[i]!) > 0)) {
        const current = lines[i]!;
        if (/^- /.test(current)) items.push([current.slice(2)]);
        else if (items.length) items.at(-1)!.push(current.slice(2));
        i++;
      }
      nodes.push(
        <ul key={i} className="changelog-list">
          {items.map((item, index) => (
            <li key={index}>
              <Block lines={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    const paragraph: string[] = [];
    while (i < lines.length && lines[i]!.trim() !== '' && !/^- /.test(lines[i]!)) paragraph.push(lines[i++]!.trim());
    nodes.push(
      <p key={i} className="changelog-text">
        <Inline text={paragraph.join(' ')} />
      </p>,
    );
  }
  return <>{nodes}</>;
}
