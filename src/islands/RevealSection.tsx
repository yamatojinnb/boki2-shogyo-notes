import { useState } from 'preact/hooks';

// 「解答/解説を表示」ボタン。押すと同じ id を持つ静的コンテンツ（MDX側に記述）をスライドダウンで開く。
// 一度開いたら閉じる操作は用意しない（仕様どおり）。ページ再読込でリセットされてよい。
type Props = {
  label: string;
  targetId: string;
};

export default function RevealSection({ label, targetId }: Props) {
  const [open, setOpen] = useState(false);

  const reveal = () => {
    setOpen(true);
    const el = document.getElementById(targetId);
    if (el) el.classList.add('is-open');
  };

  if (open) return null;

  return (
    <button type="button" class="reveal-btn" onClick={reveal}>
      {label}
    </button>
  );
}
