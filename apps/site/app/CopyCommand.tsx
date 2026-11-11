'use client';

import { Button, VisuallyHidden } from '@bestow-ui/react';
import { useEffect, useState } from 'react';

/**
 * 설치 명령과 복사 버튼. 복사하면 버튼 글자가 "복사했어요" 로 바뀌고, 스크린리더에는 항상 있는 status 영역으로 알린다
 * (나중에 생긴 live region 은 읽히지 않을 수 있음). 접근 가능한 이름은 화면 글자로 시작한다(label-content-name-mismatch).
 */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="command">
      <code>{command}</code>
      <Button
        size="sm"
        variant="ghost"
        color="neutral"
        aria-label={`${copied ? '복사했어요' : '복사'}, ${command}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
          } catch {
            // 권한이 없으면 아무것도 하지 않는다 — 명령은 화면에서 직접 고를 수 있다
          }
        }}
      >
        {copied ? '복사했어요' : '복사'}
      </Button>
      <VisuallyHidden role="status">{copied ? '복사했어요' : ''}</VisuallyHidden>
    </div>
  );
}
