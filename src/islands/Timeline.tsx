// IFRS一覧ページ用の適用タイムライン。年度範囲は items の year から自動計算する
type Status = 'effective' | 'upcoming' | 'exposure-draft';

type Item = {
  id: string;
  year: number;
  standardBadge: string;
  title: string;
  status: Status;
  effectiveDate: string;
  href: string;
};

const STATUS_COLOR: Record<Status, string> = {
  effective: 'var(--ledger)',
  upcoming: 'var(--debit)',
  'exposure-draft': 'var(--gold)',
};

const STATUS_LABEL: Record<Status, string> = {
  effective: '適用済み',
  upcoming: '未発効',
  'exposure-draft': '公開草案',
};

type Props = { items: Item[] };

export default function Timeline({ items }: Props) {
  if (items.length === 0) return null;

  const years = items.map((it) => it.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const span = Math.max(maxYear - minYear, 1);
  const yearList = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const pos = (year: number) => `${((year - minYear) / span) * 100}%`;

  // 同じ年に複数件ある場合はドットが重なって押せなくなるため、縦方向にずらして積む
  const STACK_GAP = 34;
  const countsByYear = new Map<number, number>();
  const stacked = items.map((it) => {
    const index = countsByYear.get(it.year) ?? 0;
    countsByYear.set(it.year, index + 1);
    return { ...it, stackIndex: index };
  });
  const maxStack = Math.max(...Array.from(countsByYear.values()));
  const offsetY = (stackIndex: number, total: number) => (stackIndex - (total - 1) / 2) * STACK_GAP;
  const trackHeight = Math.max(74, maxStack * STACK_GAP + 56);

  return (
    <div class="timeline">
      <ul class="timeline-legend" aria-hidden="true">
        {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
          <li key={s}>
            <span class="timeline-legend-dot" style={`background:${STATUS_COLOR[s]}`} />
            {STATUS_LABEL[s]}
          </li>
        ))}
      </ul>
      <div class="timeline-track" style={`height:${trackHeight}px`}>
        <div class="timeline-line" />
        {stacked.map((it) => (
          <a
            key={it.id}
            href={it.href}
            class="timeline-dot"
            style={`left:${pos(it.year)}; top:calc(50% + ${offsetY(it.stackIndex, countsByYear.get(it.year) ?? 1)}px); --dot-color:${STATUS_COLOR[it.status]}`}
            aria-label={`${it.standardBadge}｜${it.title}｜適用開始 ${it.effectiveDate}`}
          >
            <span class="timeline-dot-mark" />
            <span class="timeline-dot-label">
              <strong>{it.standardBadge}</strong>
              <span>{it.effectiveDate}</span>
            </span>
          </a>
        ))}
      </div>
      <div class="timeline-years">
        {yearList.map((y) => (
          <span key={y} style={`left:${pos(y)}`}>
            {y}年
          </span>
        ))}
      </div>
    </div>
  );
}
