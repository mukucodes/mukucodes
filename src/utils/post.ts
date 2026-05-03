import { getCollection } from 'astro:content'
import { CATEGORIES } from '../data/categories.ts'

console.log('[posts.ts] module loaded')
const log = (fn: string, msg: string, data?: any) => {
	console.log(`   [${fn}] ${msg}`, data !== undefined ? data : '')
}

export const getCategories = async () => {
	const posts = await getCollection('blog')
	log('getCategories', 'raw collection size:', posts.length)
	// const categories = new Set(
	// 	posts.filter((post) => !post.data.draft).map((post) => post.data.category)
	// )
	// return Array.from(categories).sort((a, b) =>
	// 	CATEGORIES.indexOf(a) < CATEGORIES.indexOf(b) ? -1 : 1
	// )
	// That throws ReferenceError at build time → zero pages generated.
	if (posts.length === 0) {
		log(
			'getCategories',
			'getCollection("blog") returned EMPTY ARRAY — check src/content/config.ts and that .md files exist in src/content/blog/'
		)
	}

	const drafts = posts.filter((p) => p.data.draft)
	const published = posts.filter((p) => !p.data.draft)
	log('getCategories', `drafts: ${drafts.length} | published: ${published.length}`)

	if (drafts.length > 0) {
		log(
			'getCategories',
			'draft slugs:',
			drafts.map((p) => p.id)
		)
	}

	const rawCategories = published.map((p) => p.data.category)
	log('getCategories', 'raw category values (before dedup):', rawCategories)

	const unknownCategories = rawCategories.filter((c) => !CATEGORIES.includes(c))
	if (unknownCategories.length > 0) {
		log('getCategories', 'categories NOT found in CATEGORIES list:', unknownCategories)
		log('getCategories', 'CATEGORIES list is:', CATEGORIES)
	}

	const categories = new Set(rawCategories)
	const sorted = Array.from(categories).sort((a, b) =>
		CATEGORIES.indexOf(a) < CATEGORIES.indexOf(b) ? -1 : 1
	)

	log('getCategories', 'final sorted categories:', sorted)
	return sorted
}

export const getPosts = async (max?: number) => {
	// return (await getCollection('blog'))
	// 	.filter((post) => !post.data.draft)
	// 	.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
	// 	.slice(0, max)
	log('getPosts', '─── called, max:', max ?? 'none (all posts)')

	const all = await getCollection('blog')
	log('getPosts', `raw collection size: ${all.length}`)

	if (all.length === 0) {
		log('getPosts', 'getCollection("blog") returned EMPTY ARRAY')
		log(
			'getPosts',
			'Checklist:\n  1. Does src/content/blog/ exist?\n  2. Does src/content/config.ts define a "blog" collection?\n  3. Are your .md/.mdx files inside that folder (not nested deeper)?\n  4. Run `astro sync` if using Astro v4+ Content Layer'
		)
		return []
	}

	const drafts = all.filter((p) => p.data.draft)
	const published = all.filter((p) => !p.data.draft)
	log('getPosts', `drafts: ${drafts.length} | published: ${published.length}`)

	if (drafts.length > 0) {
		log(
			'getPosts',
			'draft ids (excluded):',
			drafts.map((p) => p.id)
		)
	}

	if (published.length === 0) {
		log('getPosts', 'ALL posts are marked draft:true — nothing to build!')
	}

	const sorted = published.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

	// Check for missing/invalid pubDate
	const badDates = sorted.filter((p) => isNaN(p.data.pubDate?.valueOf()))
	if (badDates.length > 0) {
		log(
			'getPosts',
			'posts with invalid pubDate (sort will break):',
			badDates.map((p) => p.id)
		)
	}

	const sliced = sorted.slice(0, max)
	log(
		'getPosts',
		`returning ${sliced.length} post(s)`,
		sliced.map((p) => ({
			id: p.id,
			title: p.data.title,
			pubDate: p.data.pubDate,
			category: p.data.category
		}))
	)

	return sliced
}

export const getTags = async () => {
	const posts = await getCollection('blog')
	// const tags = new Set()
	// posts
	// 	.filter((post) => !post.data.draft)
	// 	.forEach((post) => {
	// 		post.data.tags.forEach((tag) => {
	// 			if (tag != '') {
	// 				tags.add(tag.toLowerCase())
	// 			}
	// 		})
	// 	})

	// return Array.from(tags)
	log('getTags', `raw collection size: ${posts.length}`)

	const tags = new Set<string>()
	const postsWithEmptyTags: string[] = []

	posts
		.filter((post) => !post.data.draft)
		.forEach((post) => {
			if (!post.data.tags || post.data.tags.length === 0) {
				postsWithEmptyTags.push(post.id)
				return
			}
			post.data.tags.forEach((tag: string) => {
				if (tag !== '') {
					tags.add(tag.toLowerCase())
				}
			})
		})

	if (postsWithEmptyTags.length > 0) {
		log('getTags', 'posts with no tags:', postsWithEmptyTags)
	}

	const result = Array.from(tags)
	log('getTags', `found ${result.length} unique tag(s):`, result)
	return result
}

export const getPostByTag = async (tag: string) => {
	const posts = await getPosts()
	const lowercaseTag = tag.toLowerCase()
	// return posts
	// 	.filter((post) => !post.data.draft)
	// 	.filter((post) => {
	// 		return post.data.tags.some((postTag) => postTag.toLowerCase() === lowercaseTag)
	// 	})

	const filtered = posts.filter((post) =>
		post.data.tags.some((postTag: string) => postTag.toLowerCase() === lowercaseTag)
	)

	log(
		'getPostByTag',
		`tag="${tag}" → ${filtered.length} matching post(s):`,
		filtered.map((p) => p.id)
	)

	if (filtered.length === 0) {
		log(
			'getPostByTag',
			`no posts found for tag "${tag}" — verify tag spelling and that posts are not all drafts`
		)
	}

	return filtered
}

export const filterPostsByCategory = async (category: string) => {
	const posts = await getPosts()
	// return posts
	// 	.filter((post) => !post.data.draft)
	// 	.filter((post) => post.data.category.toLowerCase() === category)
	log('filterPostsByCategory', `total published posts to filter: ${posts.length}`)

	// Warn about case sensitivity: category param is lowercased but post.data.category may not be
	const allCategories = posts.map((p) => p.data.category)
	log('filterPostsByCategory', 'distinct categories in published posts:', [
		...new Set(allCategories)
	])

	const filtered = posts.filter(
		(post) => post.data.category.toLowerCase() === category.toLowerCase() // safer: normalize both sides
	)

	log(
		'filterPostsByCategory',
		`category="${category}" → ${filtered.length} matching post(s):`,
		filtered.map((p) => p.id)
	)

	if (filtered.length === 0) {
		log('filterPostsByCategory', `no posts found for category "${category}"`)
		log(
			'filterPostsByCategory',
			'check that category string matches exactly (case-insensitive comparison added above)'
		)
	}

	return filtered
}
