// 사용자 유치 기준값 — 세션 시작 때 돌려 ROADMAP "진행 기록" 에 한 줄로 남긴다(29번).
//   node scripts/stats.mjs            (네트워크 필요, 인증 없음)
//   GITHUB_TOKEN=… node scripts/stats.mjs   (있으면 Discussions 글 수도 — GraphQL 은 인증이 필요하다)
// npm 다운로드는 배포일·다음날(CI·미러가 받아 부풀어짐)과 주말을 빼고 최근 28일 평일 중앙값을 낸다.
const REPO = 'Dev-BestOW/BestOW-UI';
const PACKAGES = ['@bestow-ui/react', '@bestow-ui/korean-utils', '@bestow-ui/tokens', '@bestow-ui/icons'];
const DAYS = 28;

const getJson = async (url, init) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
};
const isoDate = (d) => d.toISOString().slice(0, 10);
const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
};

async function github() {
  const repo = await getJson(`https://api.github.com/repos/${REPO}`);
  // 열린 이슈 수에는 PR 이 섞여 있어 검색 API 로 따로 센다. 봇·메인테이너 글도 포함(외부 이슈 판단은 사람이)
  const issues = await getJson(`https://api.github.com/search/issues?q=repo:${REPO}+type:issue+state:open`);
  const closed = await getJson(`https://api.github.com/search/issues?q=repo:${REPO}+type:issue+state:closed`);
  let discussions = null;
  if (process.env.GITHUB_TOKEN) {
    const [owner, name] = REPO.split('/');
    const data = await getJson('https://api.github.com/graphql', {
      method: 'POST',
      headers: { authorization: `bearer ${process.env.GITHUB_TOKEN}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        query: `{ repository(owner:"${owner}", name:"${name}") { discussions { totalCount } } }`,
      }),
    });
    discussions = data.data?.repository?.discussions?.totalCount ?? null;
  }
  return {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: issues.total_count,
    closedIssues: closed.total_count,
    discussions,
  };
}

async function npm(pkg) {
  const encoded = pkg.replace('/', '%2f');
  const end = new Date(Date.now() - 86_400_000); // 오늘 값은 아직 집계 중
  const start = new Date(end.getTime() - (DAYS - 1) * 86_400_000);
  const [range, meta] = await Promise.all([
    getJson(`https://api.npmjs.org/downloads/range/${isoDate(start)}:${isoDate(end)}/${pkg}`),
    getJson(`https://registry.npmjs.org/${encoded}`),
  ]);
  const releaseDays = new Set();
  for (const [version, time] of Object.entries(meta.time ?? {})) {
    if (version === 'created' || version === 'modified') continue;
    const day = new Date(time);
    releaseDays.add(isoDate(day));
    releaseDays.add(isoDate(new Date(day.getTime() + 86_400_000)));
  }
  const weekdays = range.downloads.filter(({ day }) => {
    const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
    return weekday !== 0 && weekday !== 6 && !releaseDays.has(day);
  });
  return {
    pkg,
    latest: meta['dist-tags']?.latest,
    total: range.downloads.reduce((sum, d) => sum + d.downloads, 0),
    weekdayMedian: median(weekdays.map((d) => d.downloads)),
    countedDays: weekdays.length,
  };
}

const [gh, ...packages] = await Promise.all([github(), ...PACKAGES.map(npm)]);
const today = isoDate(new Date());
const npmText = packages
  .map((p) => `${p.pkg.replace('@bestow-ui/', '')} ${p.weekdayMedian ?? '–'}/일(${p.countedDays}일)`)
  .join(' · ');
console.log(
  `| ${today} | 기준값: 스타 ${gh.stars} · 포크 ${gh.forks} · 이슈 열림 ${gh.openIssues}/닫힘 ${gh.closedIssues}` +
    ` · Discussions ${gh.discussions ?? '?(GITHUB_TOKEN 없음)'} · npm 평일 중앙값(최근 ${DAYS}일, 배포일·다음날 제외) ${npmText} |`,
);
if (process.argv.includes('--json')) console.log(JSON.stringify({ date: today, github: gh, npm: packages }, null, 2));
