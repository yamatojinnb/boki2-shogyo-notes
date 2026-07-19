// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';

// 完全静的ビルド（SSR不要）。Cloudflare Pages / Netlify に dist/ をそのまま配置できる
// GitHub Pages（プロジェクトサイト）はサブパス配信になるため site/base を設定
export default defineConfig({
  site: 'https://yamatojinnb.github.io',
  base: '/boki2-shogyo-notes',
  integrations: [preact(), mdx()],
});
