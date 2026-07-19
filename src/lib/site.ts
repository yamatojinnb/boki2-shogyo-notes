// GitHub Pages 等のサブパス配信に対応するためのベースURLヘルパー
// astro.config.mjs の `base` 設定と連動する。BASE_URL は末尾スラッシュが付かない場合があるため正規化する
export const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
