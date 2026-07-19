# 商業簿記ノート

日商簿記2級・商業簿記の学習サイト。総勘定元帳をモチーフにした和のデザインで、
仕訳・T字勘定の図解と「触って学べる」インタラクティブ教材をまとめています。

- 借方＝藍（#1E5AA8）／貸方＝朱（#C0392B）の色分けを全コンポーネントで統一
- 完全静的ビルド（SSR不要）。`dist/` をそのまま静的ホスティングに配置可能

## 技術スタック

| 項目 | 採用 |
| --- | --- |
| フレームワーク | Astro（静的ビルド） + MDX + TypeScript |
| スタイリング | CSSカスタムプロパティ + 素のCSS（`src/styles/global.css` でデザイントークンを一元管理） |
| インタラクティブ | Astro アイランド（Preact） |
| コンテンツ管理 | Content Collections（`src/content/lessons/*.mdx`） |

### なぜ Preact か（Svelte との比較）

- ランタイムが約4KB（gzip後 約3KB）と十分軽量で、アイランドが5個程度なら Svelte のコンパイル済み出力との差は実質誤差
- `.tsx` + hooks でそのまま TypeScript の型検査が効き、専用言語（`.svelte`）の学習・ツール設定が不要
- 仕訳表示など「Astro コンポーネントと同じCSSクラスを共有するJSX」を書きやすい

## セットアップ

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に静的ファイルを出力
npm run preview  # ビルド結果をローカル確認
```

## ディレクトリ構成

```
src/
├── content/lessons/   # レッスン本文（MDX）
├── content.config.ts  # コレクション定義（frontmatterスキーマ）
├── components/        # Journal / TAccount / Point / Header / Footer
├── islands/           # インタラクティブ教材（Preact）
├── layouts/           # BaseLayout / LessonLayout
├── pages/             # index.astro, lessons/[slug].astro
└── styles/global.css  # デザイントークン＋全スタイル
```

## レッスンの追加手順

1. `src/content/lessons/` に `新しいスラッグ.mdx` を作成（ファイル名がURLになる）
2. frontmatter に必須5項目を書く

   ```yaml
   ---
   title: レッスンのタイトル
   kana: ふりがな
   category: カテゴリ名（一覧カードのタブに表示）
   order: 6            # 表示順。前後ナビもこの順
   summary: 一覧カードと導入文に使う要約
   ---
   ```

3. 本文で共通コンポーネントを import して使う

   ```mdx
   import Journal from '../../components/Journal.astro';
   import TAccount from '../../components/TAccount.astro';
   import Point from '../../components/Point.astro';

   <Journal
     caption="仕訳の説明"
     debit={[{ account: '仕入', amount: 20000 }]}
     credit={[{ account: '繰越商品', amount: 20000 }]}
   />
   ```

4. インタラクティブ教材が必要なら `src/islands/` に Preact コンポーネントを追加し、
   MDX から `<MyIsland client:visible />` で読み込む

ファイルを置くだけで、トップの一覧・前後ナビに自動反映されます（`order` 順）。

## デプロイ（Cloudflare Pages 想定）

1. リポジトリを GitHub に push
2. Cloudflare ダッシュボード →「Workers & Pages」→「Pages」→「Connect to Git」
3. ビルド設定
   - Build command: `npm run build`
   - Build output directory: `dist`
4. デプロイ完了。以後は push のたびに自動ビルド

Netlify の場合も同じ設定（Build command `npm run build` / Publish directory `dist`）で動きます。

## アクセシビリティ / 品質

- キーボード操作対応（タブUIは矢印キー・Home/End、`role`/`aria-selected` 付き）
- 動的更新領域に `aria-live`、フォーカスは `:focus-visible` で明示
- `prefers-reduced-motion: reduce` で全アニメーション無効化
- レスポンシブ対応（モバイルではインタラクティブ要素が縦積みになる）
