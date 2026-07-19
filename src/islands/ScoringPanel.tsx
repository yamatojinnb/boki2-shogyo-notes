import { useState } from 'preact/hooks';

// 自己採点パネル。チェックした項目の配点を合計する。ページ再読込でリセットされてよい。
type Item = { id: string; label: string; points: number };
type Props = { items: Item[] };

export default function ScoringPanel({ items }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const total = items.reduce((s, i) => s + i.points, 0);
  const score = items.reduce((s, i) => s + (checked[i.id] ? i.points : 0), 0);

  const toggle = (id: string, value: boolean) => {
    setChecked((c) => ({ ...c, [id]: value }));
  };

  return (
    <div class="scoring-panel">
      <h2 class="scoring-title">自己採点</h2>
      <p class="scoring-hint">解答・解説を確認したら、正解できた問題にチェックを入れてください。</p>
      <ul class="scoring-list">
        {items.map((i) => (
          <li key={i.id}>
            <label>
              <input
                type="checkbox"
                checked={!!checked[i.id]}
                onChange={(e) => toggle(i.id, (e.target as HTMLInputElement).checked)}
              />
              <span class="scoring-label">{i.label}</span>
              <span class="scoring-pts">{i.points}点</span>
            </label>
          </li>
        ))}
      </ul>
      <div class="scoring-total" aria-live="polite">
        合計 <strong class="amt">{score}</strong> / {total}点
      </div>
    </div>
  );
}
