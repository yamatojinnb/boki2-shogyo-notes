import { useState } from 'preact/hooks';
import { yen } from './format';
import { JournalView } from './JournalView';

// L3：貸倒引当金（差額補充法）。スライダー3本で仕訳をリアルタイム生成
export default function AllowanceCalc() {
  const [debt, setDebt] = useState(400_000); // 債権残高
  const [rate, setRate] = useState(2); // 実績率（%）
  const [pre, setPre] = useState(5_000); // 整理前の貸倒引当金残高

  const estimate = Math.round((debt * rate) / 100); // 見積額
  const diff = estimate - pre; // 差額

  const slider = (
    label: string,
    value: number,
    display: string,
    min: number,
    max: number,
    step: number,
    onInput: (v: number) => void
  ) => (
    <label class="slider-row">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(e) => onInput(Number((e.target as HTMLInputElement).value))}
      />
      <span class="slider-val amt">{display}</span>
    </label>
  );

  return (
    <section class="island" aria-label="貸倒引当金のシミュレーション">
      <h3 class="island-title">スライダーで差額補充法を体感する</h3>
      {slider('売掛金などの債権残高', debt, `${yen(debt)}円`, 100_000, 800_000, 10_000, setDebt)}
      {slider('貸倒実績率', rate, `${rate.toFixed(1)}％`, 1, 5, 0.5, setRate)}
      {slider('整理前の貸倒引当金残高', pre, `${yen(pre)}円`, 0, 20_000, 1_000, setPre)}

      <div aria-live="polite">
        <p class="allow-calc">
          見積額 ＝ {yen(debt)}円 × {rate.toFixed(1)}％ ＝ <strong class="amt">{yen(estimate)}円</strong>
          ／ 整理前残高 <span class="amt">{yen(pre)}円</span> との差額{' '}
          <strong class="amt">{diff > 0 ? '＋' : diff < 0 ? '−' : ''}{yen(Math.abs(diff))}円</strong>
        </p>
        {diff > 0 && (
          <JournalView
            caption="差額がプラス → 不足分を繰り入れる"
            debit={[{ account: '貸倒引当金繰入', amount: diff }]}
            credit={[{ account: '貸倒引当金', amount: diff }]}
            note="不足している分だけを費用計上する（差額補充法）。"
          />
        )}
        {diff < 0 && (
          <JournalView
            caption="差額がマイナス → 多すぎる分を戻し入れる"
            debit={[{ account: '貸倒引当金', amount: -diff }]}
            credit={[{ account: '貸倒引当金戻入', amount: -diff }]}
            note="設定しすぎていた分を収益（戻入）として取り崩す。"
          />
        )}
        {diff === 0 && (
          <figure class="journal">
            <figcaption class="journal-caption">差額がゼロ</figcaption>
            <p class="journal-none">仕訳不要 — 見積額と残高が一致しているため何もしない</p>
          </figure>
        )}
      </div>
    </section>
  );
}
