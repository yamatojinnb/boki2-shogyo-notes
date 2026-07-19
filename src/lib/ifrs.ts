// IFRSアップデート記事共通のフォーマット・マッピング関数
export const STATUS_LABEL: Record<string, string> = {
  effective: '適用済み',
  upcoming: '未発効',
  'exposure-draft': '公開草案',
};

// 色は借方＝藍・貸方＝朱の配色ルールとは独立した「基準ステータス」の意味づけ
export const STATUS_COLOR_VAR: Record<string, string> = {
  effective: 'var(--ledger)',
  upcoming: 'var(--debit)',
  'exposure-draft': 'var(--gold)',
};

// "IFRS18" → "IFRS 18" のように基準名バッジ用に整形する
export function formatStandardBadge(standard: string): string {
  return standard.replace(/^IFRS/, 'IFRS ');
}

// "2027年1月1日" や "未定（2028年以降の見込み）" から年を抽出する（タイムライン配置用）
export function extractYear(text: string): number | null {
  const m = text.match(/(\d{4})/);
  return m ? Number(m[1]) : null;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}
