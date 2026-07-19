import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// レッスンは src/content/lessons/*.mdx を追加するだけで一覧・前後ナビに自動反映される
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    kana: z.string(),
    category: z.string(),
    order: z.number(),
    summary: z.string(),
  }),
});

export const collections = { lessons };
