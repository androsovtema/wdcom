import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    period: z.string(),
    team: z.string(),
    cover: z.string(),
    tags: z.array(z.string()),
    stats: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).default([]),
    gallery: z.array(z.string()).default([])
  })
});

export const collections = { projects };
