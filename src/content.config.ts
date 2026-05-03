import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { CATEGORIES } from './data/categories.ts'

const blog = defineCollection({
	loader: glob({
		base: './src/content/blog',
		pattern: '**/*.{md,mdx}'
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(80),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image(),
			category: z.enum(CATEGORIES),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			relatedPosts: z.boolean().default(true),
			minutesRead: z.string().optional()
		})
})

export const collections = { blog }
