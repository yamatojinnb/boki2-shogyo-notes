import { useState } from 'preact/hooks';
import { yen } from './format';
import { JournalView } from './JournalView';

// L2：定額法 vs 200%定率法
// 設例：備品 取得原価1,000,000円・耐用年数5年・残存価額ゼロ・間接法
const COST = 1_000_000;

type MethodId = 'teigaku' | 'teiritsu';

const METHODS: Record<
  MethodId,
  { name: string; dep: number[]; note: string }
> = {
  teigaku: {
    name: '定額法',
    dep: [200_000, 200_000, 200_000, 200_000, 200_000],
    note: '毎期 1,000,000円 ÷ 5年 ＝ 200,000円の均等額。',
  },
  teiritsu: {
    name: '200%定率法',
    dep: [400_000, 240_000, 144_000, 108_000, 107_999],
    note:
      '償却率0.400（＝1/5×200%）。4年目は「期首帳簿価額216,000×0.400＝86,400」が償却保証額108,000円（＝1,000,000×保証率0.10800）を下回るため、改定取得価額216,000×改定償却率0.500＝108,000円へ切替。5年目は備忘価額1円を残して107,999円。',
  },
};

const MAX = 400_000; // グラフの縦軸スケール

export default function DepreciationChart() {
  const [method, setMethod] = useState<MethodId>('teigaku');
  const m = METHODS[method];

  // 期末帳簿価額を累積計算
  let bv = COST;
  const rows = m.dep.map((d, i) => {
    const begin = bv;
    bv -= d;
    return { year: i + 1, begin, dep: d, end: bv };
  });

  return (
    <section class="island" aria-label="減価償却方法の比較シミュレーション">
      <h3 class="island-title">定額法と200%定率法を切り替えて比較</h3>
      <div class="toggle-group" role="group" aria-label="償却方法の選択">
        {(Object.keys(METHODS) as MethodId[]).map((id) => (
          <button
            key={id}
            aria-pressed={method === id}
            onClick={() => setMethod(id)}
          >
            {METHODS[id].name}
          </button>
        ))}
      </div>

      <div class="dep-chart" role="img" aria-label={`${m.name}の各年の減価償却費の棒グラフ`}>
        {m.dep.map((d, i) => (
          <div class="dep-bar-wrap" key={i}>
            <span class="dep-amt amt">{yen(d)}</span>
            <div class="dep-bar" style={`height:${(d / MAX) * 100}%`} />
          </div>
        ))}
      </div>
      <div class="dep-years" aria-hidden="true">
        {m.dep.map((_, i) => (
          <span key={i}>{i + 1}年目</span>
        ))}
      </div>

      <div aria-live="polite">
        <table class="calc-table">
          <caption class="visually-hidden">{m.name}の計算表</caption>
          <thead>
            <tr>
              <th scope="col">年度</th>
              <th scope="col">期首帳簿価額</th>
              <th scope="col">減価償却費</th>
              <th scope="col">期末帳簿価額</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year}>
                <td>{r.year}年目</td>
                <td class="amt">{yen(r.begin)}</td>
                <td class="amt">{yen(r.dep)}</td>
                <td class="amt">{yen(r.end)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p class="dep-note">{m.note}</p>

        <JournalView
          caption={`1年目の決算整理仕訳（${m.name}・間接法）`}
          debit={[{ account: '減価償却費', amount: m.dep[0]! }]}
          credit={[{ account: '備品減価償却累計額', amount: m.dep[0]! }]}
          note="間接法：備品の取得原価はそのまま残し、累計額勘定に償却額を積んでいく。"
        />
      </div>
    </section>
  );
}
