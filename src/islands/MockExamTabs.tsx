import { useState } from 'preact/hooks';

// 大問タブ切替。パネル本体はMDX側に静的HTMLとして書かれており、このアイランドは
// 表示/非表示（hidden属性）の切替だけを担当する。
type Tab = { id: string; label: string; points: number };
type Props = { tabs: Tab[] };

export default function MockExamTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');

  const select = (id: string) => {
    setActive(id);
    tabs.forEach((t) => {
      const el = document.getElementById(`mock-panel-${t.id}`);
      if (el) el.hidden = t.id !== id;
    });
  };

  return (
    <div class="mock-tabs" role="tablist" aria-label="大問切替">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          aria-controls={`mock-panel-${t.id}`}
          class="mock-tab"
          onClick={() => select(t.id)}
        >
          <span class="mock-tab-label">{t.label}</span>
          <span class="mock-tab-points">{t.points}点</span>
        </button>
      ))}
    </div>
  );
}
