'use client';

import { PhoneNumberInput } from '@bestow-ui/react';
import { useState, type ReactNode } from 'react';

/** 컴포넌트가 넘긴 값 — korean-utils 쪽 Try 와 같은 모양(dl) */
function Received({ label, value }: { label: string; value: string }) {
  return (
    <dl className="try-results">
      <div className="try-result">
        <dt>
          <code>{label}</code>
        </dt>
        <dd>
          <code>{`'${value}'`}</code>
        </dd>
      </div>
    </dl>
  );
}

function PhoneNumber() {
  const [value, setValue] = useState('');
  return (
    <>
      <PhoneNumberInput
        value={value}
        onValueChange={setValue}
        helperText="가운데 숫자를 고치거나, 하이픈 뒤에서 지우거나, +82 10-1234-5678 을 붙여 넣어 보세요"
        fullWidth
      />
      <Received label="onValueChange 로 받은 값" value={value} />
    </>
  );
}

const demos: Record<string, () => ReactNode> = {
  'phone-number-input': PhoneNumber,
};

/** 컴포넌트 문서 쪽의 "직접 입력해 보세요" — slug 로 고른다(korean-utils Try 와 같은 방식) */
export function Demo({ slug }: { slug: string }) {
  const Component = demos[slug];
  if (!Component) return null;
  return (
    <div className="try">
      <Component />
    </div>
  );
}
