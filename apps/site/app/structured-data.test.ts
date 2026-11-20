import { describe, expect, test } from 'vitest';
import { breadcrumbItems, docArticle, serializeJsonLd, softwareSourceCode } from './structured-data';

describe('serializeJsonLd', () => {
  test('`<` 를 \\u003c 로 바꿔 </script> 로 스크립트가 끊기지 않는다', () => {
    const data = { name: '</script><script>alert(1)</script> a<b' };
    const text = serializeJsonLd(data);
    expect(text).not.toContain('<');
    expect(JSON.parse(text)).toEqual(data);
  });
});

describe('softwareSourceCode', () => {
  test('첫 화면 — 저장소·라이선스·주소', () => {
    expect(softwareSourceCode()).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: 'BestOW UI',
      codeRepository: 'https://github.com/Dev-BestOW/BestOW-UI',
      programmingLanguage: 'TypeScript',
      license: 'https://opensource.org/licenses/MIT',
      url: 'https://bestow-ui.com/',
    });
  });
});

describe('docArticle', () => {
  const [article, breadcrumb] = docArticle({
    path: '/components/phone-number-input/',
    title: '전화번호 입력',
    description: '설명',
    crumbs: [
      { name: 'BestOW UI', path: '/' },
      { name: '한국 입력 컴포넌트', path: '/components/' },
      { name: 'PhoneNumberInput', path: '/components/phone-number-input/' },
    ],
    dates: { published: '2026-11-15', modified: '2026-11-17' },
  });

  test('TechArticle — 제목·설명·절대 주소·한국어', () => {
    expect(article).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: '전화번호 입력',
      description: '설명',
      url: 'https://bestow-ui.com/components/phone-number-input/',
      inLanguage: 'ko',
    });
  });

  test('Google Article 권장 속성 — 이미지·글쓴이·한국 시간 날짜', () => {
    expect(article).toMatchObject({
      image: 'https://bestow-ui.com/og.png',
      author: { '@type': 'Organization', name: 'Dev-BestOW', url: 'https://github.com/Dev-BestOW' },
      datePublished: '2026-11-15T00:00:00+09:00',
      dateModified: '2026-11-17T00:00:00+09:00',
    });
  });

  test('BreadcrumbList — position 은 1부터 이어지고 item 은 절대 주소', () => {
    expect(breadcrumb).toMatchObject({ '@context': 'https://schema.org', '@type': 'BreadcrumbList' });
    expect(breadcrumb.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'BestOW UI', item: 'https://bestow-ui.com/' },
      { '@type': 'ListItem', position: 2, name: '한국 입력 컴포넌트', item: 'https://bestow-ui.com/components/' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'PhoneNumberInput',
        item: 'https://bestow-ui.com/components/phone-number-input/',
      },
    ]);
  });
});

describe('breadcrumbItems', () => {
  test('화면의 이동 경로 — 마지막(지금 쪽)만 링크가 아니다', () => {
    expect(
      breadcrumbItems([
        { name: 'BestOW UI', path: '/' },
        { name: '서식·검증 함수', path: '/korean-utils/' },
        { name: '전화번호', path: '/korean-utils/phone-number/' },
      ]),
    ).toEqual([
      { label: 'BestOW UI', href: '/' },
      { label: '서식·검증 함수', href: '/korean-utils/' },
      { label: '전화번호' },
    ]);
  });
});
