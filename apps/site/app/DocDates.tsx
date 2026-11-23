// 문서 쪽 머리의 게시·수정 날짜. 구글 "Influence your byline dates": 사용자에게 보이는 날짜를 두고
// 구조화 데이터(datePublished·dateModified)와 같게 한다 — 그래서 docArticle 에 넘기는 같은 DocDates 를 받는다.
import { Typography } from '@bestow-ui/react';
import type { DocDates as Dates } from './structured-data';

/** 'YYYY-MM-DD' → '2026년 11월 5일' */
export function koreanDateLabel(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

export function DocDates({ dates }: { dates: Dates }) {
  return (
    <Typography variant="body-sm" color="muted" className="doc-dates">
      게시 <time dateTime={dates.published}>{koreanDateLabel(dates.published)}</time>
      {dates.modified !== dates.published && (
        <>
          {' · '}마지막 수정 <time dateTime={dates.modified}>{koreanDateLabel(dates.modified)}</time>
        </>
      )}
    </Typography>
  );
}
