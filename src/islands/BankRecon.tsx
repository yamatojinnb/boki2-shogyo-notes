import { useState } from 'preact/hooks';
import { yen } from './format';

// L4:銀行勘定調整表(両者区分調整法)
// 当社帳簿残高98,000 / 銀行残高証明書95,000 → 調整後どちらも100,000で一致
const COMPANY_START = 98_000;
const BANK_START = 95_000;

type Side = 'company' | 'bank';
type Item = { id: string; side: Side; label: string; delta: number; desc: string };

const ITEMS: Item[] = [
  {
    id: 'miwatashi',
    side: 'company',
    label: '未渡小切手',
    delta: 12_000,
    desc: '作成したが仕入先に渡していない小切手。当座預金を減らしすぎていたので戻す',
  },
  {
    id: 'renraku',
    side: 'company',
    label: '連絡未達の引落し',
    delta: -10_000,
    desc: '水道光熱費の自動引落しの連絡が未達で、当社が未記帳',
  },
  {
    id: 'jikangai',
    side: 'bank',
    label: '時間外預入',
    delta: 13_000,
    desc: '営業時間外に預け入れたため、銀行の記帳が翌日になっている',
  },
  {
    id: 'mitoritsuke',
    side: 'bank',
    label: '未取付小切手',
    delta: -8_000,
    desc: '渡した小切手がまだ銀行に持ち込まれて(取り付けられて)いない',
  },
];

export default function BankRecon() {
  const [applied, setApplied] = useState<string[]>([]);

  const sum = (side: Side) =>
    ITEMS.filter((it) => it.side === side && applied.includes(it.id)).reduce((s, it) => s + it.delta, 0);
  const company = COMPANY_START + sum('company');
  const bank = BANK_START + sum('bank');
  const matched = applied.length === ITEMS.length && company === bank;

  const panel = (side: Side, title: string, start: number, balance: number) => (
    <div class={`bank-panel${matched ? ' matched match-flash' : ''}`}>
      <h4>{title}</h4>
      <div class="bank-line">
        <span>調整前残高</span>
        <span class="amt">{yen(start)}</span>
      </div>
      {ITEMS.filter((it) => it.side === side && applied.includes(it.id)).map((it) => (
        <div class="bank-line" key={it.id}>
          <span>{it.label}</span>
          <span class="amt">{it.delta > 0 ? '+' : '−'}{yen(Math.abs(it.delta))}</span>
        </div>
      ))}
      <div class="bank-balance">
        <span>調整後残高</span>
        <span class="amt">{yen(balance)}</span>
      </div>
    </div>
  );

  return (
    <section class="island" aria-label="銀行勘定調整表のシミュレーション">
      <h3 class="island-title">調整項目を1つずつ反映して一致させる</h3>
      <div class="bank-panels" aria-live="polite">
        {panel('company', '当社の帳簿(当座預金勘定)', COMPANY_START, company)}
        {panel('bank', '銀行残高証明書', BANK_START, bank)}
      </div>
      <div class="adj-list">
        {ITEMS.map((it) => (
          <button
            key={it.id}
            class="adj-item"
            onClick={() => setApplied((a) => [...a, it.id])}
            disabled={applied.includes(it.id)}
          >
            <span>
              <span class={`adj-side ${it.side}`}>{it.side === 'company' ? '当社側' : '銀行側'}</span>{' '}
              <strong>{it.label}</strong>
              <span class="amt"> {it.delta > 0 ? '+' : '−'}{yen(Math.abs(it.delta))}円</span>
              <br />
              <span class="adj-desc">{it.desc}</span>
            </span>
            <span class="adj-state">{applied.includes(it.id) ? '反映済' : '反映する'}</span>
          </button>
        ))}
      </div>
      <div class="btn-row">
        <button class="btn ghost" onClick={() => setApplied([])} disabled={applied.length === 0}>
          リセット
        </button>
      </div>
      <div aria-live="assertive">
        {matched && (
          <p class="result-banner">
            🎉 両者一致!調整後残高はどちらも <span class="num">{yen(company)}</span>円 —
            これが貸借対照表に載る「当座預金」の金額
          </p>
        )}
      </div>
    </section>
  );
}
