import { describe, expect, it } from 'vitest';
import { findKitPage } from '../components/kit';
import { guides } from './guides';

describe('guides 의 React 컴포넌트 연결', () => {
  // slug 를 잘못 적으면 함수 쪽의 "문서 보기" 링크가 없는 쪽(404)으로 간다
  it.each(guides.filter((guide) => guide.component).map((guide) => [guide.slug, guide.component!] as const))(
    '%s → 같은 이름의 컴포넌트 문서 쪽',
    (_, component) => {
      expect(findKitPage(component.slug)?.name).toBe(component.name);
    },
  );
});
