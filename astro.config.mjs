// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';

// 完全静的ビルド（SSR不要）。Cloudflare Pages / Netlify に dist/ をそのまま配置できる
export default defineConfig({
  integrations: [preact(), mdx()],
});
