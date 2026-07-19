import { useState } from 'preact/hooks';
import { yen } from './format';
import { JournalView } from './JournalView';

// L1：しーくり・くりしー。在庫チップが「繰越商品」⇔「仕入」を移動する
const KISHU = 20000; // 期首商品
const TOUKI = 180000; // 当期仕入高
const KIMATSU = 30000; // 期末商品

type Chip = { key: string; label: string; amount: number; out?: boolean; from?: string };

export default function InventoryFlow() {
  const [step, setStep] = useState(0);

  const kurikoshi: Chip[] = [];
  const shiire: Chip[] = [{ key: 'touki', label: '当期仕入', amount: TOUKI }];

  if (step === 0) {
    kurikoshi.push({ key: 'kishu-0', label: '期首在庫', amount: KISHU });
  } else {
    // しーくり：期首在庫が仕入へ移動
    shiire.push({ key: `kishu-${step}`, label: '期首在庫（振替）', amount: KISHU, from: '-40px' });
  }
  if (step >= 2) {
    // くりしー：期末在庫が仕入から繰越商品へ移動
    kurikoshi.push({ key: 'kimatsu-2', label: '期末在庫（振替）', amount: KIMATSU, from: '40px' });
    shiire.push({ key: 'kimatsu-out', label: '期末在庫 △', amount: -KIMATSU, out: true });
  }

  const kTotal = kurikoshi.reduce((s, c) => s + c.amount, 0);
  const sTotal = shiire.reduce((s, c) => s + c.amount, 0);

  const renderBox = (title: string, chips: Chip[], total: number, totalLabel: string) => (
    <div class="inv-box">
      <h4>{title}</h4>
      <div class="inv-chips">
        {chips.map((c) => (
          <span
            key={c.key}
            class={`inv-chip chip-enter${c.out ? ' out' : ''}`}
            style={c.from ? `--from:${c.from}` : undefined}
          >
            <span>{c.label}</span>
            <span class="amt">{yen(c.amount)}</span>
          </span>
        ))}
      </div>
      <div class="inv-total">
        <span>{totalLabel}</span>
        <span class="amt">{yen(total)}</span>
      </div>
    </div>
  );

  return (
    <section class="island" aria-label="売上原価のシミュレーション">
      <h3 class="island-title">在庫チップを動かして「しーくり くりしー」</h3>
      <div class="inv-boxes">
        {renderBox('繰越商品', kurikoshi, kTotal, '残高')}
        {renderBox('仕　入', shiire, sTotal, step >= 2 ? '残高＝売上原価' : '残高')}
      </div>
      <div class="btn-row">
        <button class="btn primary" onClick={() => setStep(1)} disabled={step !== 0}>
          ① しーくり（仕入 ／ 繰越商品）
        </button>
        <button class="btn primary" onClick={() => setStep(2)} disabled={step !== 1}>
          ② くりしー（繰越商品 ／ 仕入）
        </button>
        <button class="btn ghost" onClick={() => setStep(0)} disabled={step === 0}>
          リセット
        </button>
      </div>
      <div aria-live="polite">
        {step >= 1 && (
          <JournalView
            caption="① 期首商品を仕入勘定へ振り替える（しーくり）"
            debit={[{ account: '仕入', amount: KISHU }]}
            credit={[{ account: '繰越商品', amount: KISHU }]}
          />
        )}
        {step >= 2 && (
          <JournalView
            caption="② 期末商品を仕入勘定から取り出す（くりしー）"
            debit={[{ account: '繰越商品', amount: KIMATSU }]}
            credit={[{ account: '仕入', amount: KIMATSU }]}
          />
        )}
        {step >= 2 && (
          <p class="result-banner">
            売上原価 ＝ <span class="num">{yen(KISHU)}</span> ＋ <span class="num">{yen(TOUKI)}</span> −{' '}
            <span class="num">{yen(KIMATSU)}</span> ＝ <span class="num">{yen(KISHU + TOUKI - KIMATSU)}</span>円
          </p>
        )}
      </div>
    </section>
  );
}
