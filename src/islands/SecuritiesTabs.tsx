import { useRef, useState } from 'preact/hooks';
import { JournalView, type JLine } from './JournalView';

// L5:有価証券の4分類。タブUI(role/aria-selected/矢印キー対応)
type Tab = {
  id: string;
  name: string;
  badge: string;
  desc: string;
  journal?: { caption: string; debit: JLine[]; credit: JLine[]; note?: string };
  noJournal?: string;
};

const TABS: Tab[] = [
  {
    id: 'trading',
    name: '売買目的有価証券',
    badge: '時価評価・評価差額はP/L',
    desc: '時価の変動で利益を得る目的で保有する株式・債券。期末に時価評価し、評価差額は「有価証券評価損益」として当期の損益(P/L)に計上する。',
    journal: {
      caption: '例:帳簿価額100,000円 → 期末時価110,000円',
      debit: [{ account: '売買目的有価証券', amount: 10_000 }],
      credit: [{ account: '有価証券評価益', amount: 10_000 }],
      note: '時価が下がった場合は逆に「有価証券評価損/売買目的有価証券」。',
    },
  },
  {
    id: 'maturity',
    name: '満期保有目的債券',
    badge: '償却原価法(定額法)',
    desc: '満期まで保有する目的の社債など。時価評価はせず、額面と取得価額の差額(金利調整差額)を償還期間にわたり毎期均等に帳簿価額へ加減する。',
    journal: {
      caption: '例:額面100,000円の社債を95,000円で取得(償還まで5年)',
      debit: [{ account: '満期保有目的債券', amount: 1_000 }],
      credit: [{ account: '有価証券利息', amount: 1_000 }],
      note: '差額5,000円 ÷ 5年 ＝ 毎期1,000円ずつ帳簿価額を額面に近づける。',
    },
  },
  {
    id: 'subsidiary',
    name: '子会社株式・関連会社株式',
    badge: '取得原価のまま',
    desc: '支配や影響力の行使を目的に保有する株式。売却を予定しないため、期末も取得原価のまま据え置く(時価評価しない)。',
    noJournal: '期末の評価替えなし — 決算整理仕訳は不要。',
  },
  {
    id: 'other',
    name: 'その他有価証券',
    badge: '時価評価・全部純資産直入法',
    desc: '上記のどれにも当てはまらない有価証券(持ち合い株式など)。期末に時価評価するが、評価差額は損益にせず「その他有価証券評価差額金」として純資産に直接計上する(全部純資産直入法)。翌期首に振り戻す洗替方式。',
    journal: {
      caption: '例:取得原価100,000円 → 期末時価108,000円',
      debit: [{ account: 'その他有価証券', amount: 8_000 }],
      credit: [{ account: 'その他有価証券評価差額金', amount: 8_000 }],
      note: '翌期首に逆仕訳で振り戻す(洗替方式)。差額はP/Lを通らない点が売買目的との違い。',
    },
  },
];

export default function SecuritiesTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (i: number) => {
    const n = (i + TABS.length) % TABS.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight') focusTab(i + 1);
    else if (e.key === 'ArrowLeft') focusTab(i - 1);
    else if (e.key === 'Home') focusTab(0);
    else if (e.key === 'End') focusTab(TABS.length - 1);
    else return;
    e.preventDefault();
  };

  const tab = TABS[active]!;

  return (
    <section class="island" aria-label="有価証券の4分類">
      <h3 class="island-title">4分類カードを切り替えて評価方法を確認</h3>
      <div class="sec-tabs" role="tablist" aria-label="有価証券の分類">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => (refs.current[i] = el)}
            id={`tab-${t.id}`}
            class="sec-tab"
            role="tab"
            aria-selected={active === i}
            aria-controls={`panel-${t.id}`}
            tabindex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div
        class="sec-panel"
        role="tabpanel"
        id={`panel-${tab.id}`}
        aria-labelledby={`tab-${tab.id}`}
        aria-live="polite"
      >
        <span class="sec-badge">{tab.badge}</span>
        <p>{tab.desc}</p>
        {tab.journal && <JournalView {...tab.journal} />}
        {tab.noJournal && (
          <figure class="journal">
            <figcaption class="journal-caption">決算整理仕訳</figcaption>
            <p class="journal-none">{tab.noJournal}</p>
          </figure>
        )}
      </div>
    </section>
  );
}
