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

// IFRSアップデート記事は src/content/ifrs/*.mdx を追加するだけで一覧・タイムライン・ナビに自動反映される
const ifrs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ifrs' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    standard: z.string(),
    status: z.enum(['effective', 'upcoming', 'exposure-draft']),
    effectiveDate: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    order: z.number(),
  }),
});

// 模擬試験は src/content/mock-exams/*.mdx を追加するだけで一覧・ナビに自動反映される
const mockExams = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/mock-exams' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    difficulty: z.string(),
    topics: z.array(z.string()),
  }),
});

export const collections = { lessons, ifrs, mockExams };
